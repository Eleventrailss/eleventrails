import { uploadToSupabaseStorage } from './supabase-storage'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * Migrate file from public folder to Supabase Storage (Server-side version)
 * This version reads file directly from filesystem instead of fetching via HTTP
 */
export async function migratePublicFileToStorageServer(
  publicPath: string,
  storagePath: string,
  publicDir: string
): Promise<{ url: string | null; error?: string }> {
  try {
    // Construct full file path
    const filePath = path.join(publicDir, publicPath.startsWith('/') ? publicPath.slice(1) : publicPath)
    
    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return { url: null, error: `File not found: ${filePath}` }
    }

    // Read file as buffer
    const fileBuffer = await fs.readFile(filePath)
    
    // Get file extension and MIME type
    const fileName = publicPath.split('/').pop() || 'file'
    const ext = path.extname(fileName).toLowerCase()
    
    // Determine MIME type
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
    }
    
    const mimeType = mimeTypes[ext] || 'application/octet-stream'
    
    // For server-side, we need to use FormData or direct buffer upload
    // Supabase Storage accepts ArrayBuffer, so we can use the buffer directly
    const { supabaseAdmin } = await import('./supabase')
    const BUCKET_NAME = 'uploads'

    // Check if SERVICE_ROLE_KEY is available
    if (!process.env.SERVICE_ROLE_KEY) {
      return { url: null, error: 'SERVICE_ROLE_KEY is not set in environment variables' }
    }

    console.log(`Uploading ${publicPath} to ${storagePath} (${fileBuffer.length} bytes, type: ${mimeType})`)

    // Upload file buffer directly to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: true // Replace if exists
      })

    if (error) {
      console.error(`Supabase Storage upload error for ${publicPath}:`, error)
      const errorMsg = error.message || JSON.stringify(error)
      return { url: null, error: `Upload failed: ${errorMsg}` }
    }

    if (!data) {
      return { url: null, error: 'No data returned from upload' }
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    if (!urlData || !urlData.publicUrl) {
      return { url: null, error: 'Failed to get public URL' }
    }

    console.log(`✓ Successfully uploaded ${publicPath} -> ${urlData.publicUrl}`)
    return { url: urlData.publicUrl }
  } catch (error: any) {
    console.error(`Error migrating file ${publicPath}:`, error.message)
    return { url: null, error: error.message || 'Unknown error' }
  }
}

/**
 * Bulk migrate multiple files from public folder to Supabase Storage (Server-side)
 */
export async function migratePublicFilesToStorage(
  files: Array<{ publicPath: string; storagePath: string }>,
  baseUrl?: string
): Promise<Array<{ publicPath: string; storagePath: string; url: string | null; error?: string }>> {
  const results: Array<{ publicPath: string; storagePath: string; url: string | null; error?: string }> = []
  const publicDir = path.join(process.cwd(), 'public')

  for (const file of files) {
    console.log(`Migrating ${file.publicPath}...`)
    const result = await migratePublicFileToStorageServer(file.publicPath, file.storagePath, publicDir)
    results.push({
      ...file,
      url: result.url,
      error: result.error
    })
  }

  return results
}
