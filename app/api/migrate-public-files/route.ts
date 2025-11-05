import { NextRequest, NextResponse } from 'next/server'
import { migratePublicFilesToStorage } from '@/lib/migrate-public-files'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * Scan semua file di public folder secara recursive
 * Termasuk folder general_setting karena akan bisa di add/edit/delete
 * Hanya scan file foto/video (image dan video files)
 */
async function scanPublicFolder(): Promise<Array<{ publicPath: string; storagePath: string }>> {
  const publicDir = path.join(process.cwd(), 'public')
  const files: Array<{ publicPath: string; storagePath: string }> = []
  
  // Extension yang akan di-scan (foto dan video)
  const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico', // Images
    '.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v' // Videos
  ]

  async function scanDirectory(dir: string, relativePath: string = ''): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      console.log(`Scanning directory: ${dir} (${entries.length} entries)`)

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativeFilePath = relativePath ? `${relativePath}/${entry.name}` : entry.name

        if (entry.isDirectory()) {
          // Skip hanya folder hidden (dimulai dengan .)
          // general_setting sekarang juga di-scan karena akan bisa di add/edit/delete
          if (entry.name.startsWith('.')) {
            console.log(`Skipping hidden directory: ${entry.name}`)
            continue
          }
          // Rekursif scan subfolder
          console.log(`Entering subdirectory: ${relativeFilePath}`)
          await scanDirectory(fullPath, relativeFilePath)
        } else if (entry.isFile()) {
          // Skip file tertentu
          if (entry.name === '.gitkeep' || entry.name === '.DS_Store' || entry.name.startsWith('.')) {
            continue
          }
          
          // Hanya scan file foto/video
          const ext = path.extname(entry.name).toLowerCase()
          if (!allowedExtensions.includes(ext)) {
            console.log(`Skipping non-image/video file: ${entry.name} (extension: ${ext || 'none'})`)
            continue
          }
          
          // Generate storage path
          // Jika file di root public, simpan di static/
          // Jika file di subfolder (general_setting/, rides/, stories/, dll), simpan dengan struktur yang sama
          const storagePath = relativePath 
            ? `${relativePath}/${entry.name}` 
            : `static/${entry.name}`
          
          files.push({
            publicPath: `/${relativeFilePath}`,
            storagePath: storagePath
          })
          
          console.log(`✓ Found file: ${relativeFilePath} -> ${storagePath}`)
        } else {
          // Handle symlinks or other file types
          const entryType = entry.isSymbolicLink?.() ? 'symlink' : 
                           entry.isBlockDevice?.() ? 'block device' :
                           entry.isCharacterDevice?.() ? 'character device' :
                           entry.isFIFO?.() ? 'FIFO' :
                           entry.isSocket?.() ? 'socket' : 'unknown'
          console.log(`Skipping non-file entry: ${entry.name} (type: ${entryType})`)
        }
      }
    } catch (error: any) {
      console.error(`Error scanning directory ${dir}:`, error.message)
      // Continue scanning other directories even if one fails
    }
  }

  console.log(`Starting scan from: ${publicDir}`)
  await scanDirectory(publicDir)
  console.log(`Scan completed. Total files found: ${files.length}`)
  
  return files
}

/**
 * API Route untuk migrasi file dari public folder ke Supabase Storage
 * 
 * POST /api/migrate-public-files
 * Body: { 
 *   files?: Array<{ publicPath: string, storagePath: string }>, // Optional: manual list
 *   scanAll?: boolean, // Jika true, scan semua file di public folder
 *   baseUrl?: string 
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { files: manualFiles, scanAll, baseUrl } = body

    let filesToMigrate: Array<{ publicPath: string; storagePath: string }> = []

    if (scanAll) {
      // Scan semua file di public folder (hanya scan, tidak migrate)
      console.log('Scanning public folder...')
      try {
        filesToMigrate = await scanPublicFolder()
        console.log(`Found ${filesToMigrate.length} files to migrate`)
        
        // Return list file yang ditemukan tanpa melakukan migrasi
        // Calculate breakdown per folder
        const folderBreakdown: Record<string, number> = {}
        filesToMigrate.forEach(file => {
          const folder = file.publicPath.split('/').slice(0, -1).join('/') || '/'
          folderBreakdown[folder] = (folderBreakdown[folder] || 0) + 1
        })

        return NextResponse.json({
          success: true,
          results: filesToMigrate, // List file yang ditemukan
          filesScanned: filesToMigrate.length,
          message: `Scan completed. Found ${filesToMigrate.length} image/video files ready to migrate.`,
          breakdown: {
            total: filesToMigrate.length,
            root: filesToMigrate.filter(f => f.publicPath.split('/').length === 2).length,
            subfolders: filesToMigrate.filter(f => f.publicPath.split('/').length > 2).length,
            perFolder: folderBreakdown
          }
        })
      } catch (error: any) {
        console.error('Error scanning public folder:', error)
        return NextResponse.json(
          { error: `Failed to scan public folder: ${error.message}` },
          { status: 500 }
        )
      }
    } else if (manualFiles && Array.isArray(manualFiles) && manualFiles.length > 0) {
      // Use manual file list
      filesToMigrate = manualFiles
    } else {
      return NextResponse.json(
        { error: 'Either provide files array or set scanAll=true' },
        { status: 400 }
      )
    }

    if (filesToMigrate.length === 0) {
      return NextResponse.json(
        { error: 'No files to migrate' },
        { status: 400 }
      )
    }

    console.log(`Starting migration of ${filesToMigrate.length} files...`)
    
    const results = await migratePublicFilesToStorage(filesToMigrate, baseUrl)

    const successCount = results.filter(r => r.url).length
    const failCount = results.filter(r => !r.url).length

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: filesToMigrate.length,
        success: successCount,
        failed: failCount
      },
      filesScanned: scanAll ? filesToMigrate.length : 0
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: error.message || 'Migration failed' },
      { status: 500 }
    )
  }
}
