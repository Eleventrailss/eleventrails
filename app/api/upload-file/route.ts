import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const BUCKET_NAME = 'uploads'

export const runtime = 'nodejs'
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '60mb',
    },
  },
}
export const maxDuration = 60

/**
 * API Route untuk upload file ke Supabase Storage
 * Menggunakan service role key untuk bypass RLS
 * 
 * POST /api/upload-file
 * FormData: { file: File, path: string }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const path = formData.get('path') as string

    if (!file || !path) {
      return NextResponse.json(
        { error: 'File and path are required' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined
      })

    if (error) {
      console.error('Supabase Storage upload error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to upload file' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No data returned from upload' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    if (!urlData || !urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

