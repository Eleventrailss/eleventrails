import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string // 'rides' or 'stories'
    const subfolder = formData.get('subfolder') as string // 'primary', 'secondary', 'gallery'
    const customFileName = formData.get('customFileName') as string | null // Custom filename untuk rename

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!folder || (folder !== 'rides' && folder !== 'stories' && folder !== 'general_setting' && folder !== 'testimonials')) {
      return NextResponse.json({ error: 'Invalid folder. Must be "rides", "stories", "general_setting", or "testimonials"' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use custom filename if provided, otherwise use timestamp
    const fileExt = file.name.split('.').pop()
    const fileName = customFileName 
      ? `${customFileName}.${fileExt}`
      : `${Date.now()}.${fileExt}`
    
    // Create path: public/{folder}/{subfolder}/{filename}
    const uploadPath = join(process.cwd(), 'public', folder, subfolder || '')
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    // Write file
    const filePath = join(uploadPath, fileName)
    await writeFile(filePath, buffer)

    // Return public URL path
    const publicUrl = subfolder 
      ? `/${folder}/${subfolder}/${fileName}`
      : `/${folder}/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName 
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}

