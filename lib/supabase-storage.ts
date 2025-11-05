import { supabase, supabaseAdmin } from './supabase'

const BUCKET_NAME = 'uploads'

/**
 * Get public URL for an image from Supabase Storage
 * @param path - Path to the image in storage (e.g., "general_setting/apps_logo.png")
 * @returns Public URL or null if not found
 */
export function getSupabaseImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  
  // If already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If it's a local path starting with /, return as is (for backward compatibility)
  if (path.startsWith('/')) {
    return path
  }
  
  // Get Supabase URL from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
    return path
  }
  
  // Construct Supabase Storage public URL
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${path}`
}

/**
 * Upload file to Supabase Storage
 * @param file - File to upload
 * @param path - Path in storage (e.g., "general_setting/apps_logo.png")
 * @param onProgress - Optional progress callback
 * @param useAdmin - Use admin client (for server-side operations)
 * @returns Public URL of uploaded file
 */
export async function uploadToSupabaseStorage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
  useAdmin: boolean = false
): Promise<string> {
  try {
    // Always use admin client for server-side operations to bypass RLS
    // For client-side, use regular client but ensure proper authentication
    const client = useAdmin && typeof window === 'undefined' ? supabaseAdmin : supabase

    // Simulate progress for better UX (Supabase Storage doesn't support progress tracking directly)
    if (onProgress) {
      onProgress(10)
    }

    // Upload file to Supabase Storage
    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true, // Replace if exists
        contentType: file.type || undefined
      })

    if (error) {
      console.error('Supabase Storage upload error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw new Error(error.message || 'Failed to upload file')
    }

    if (!data) {
      throw new Error('No data returned from upload')
    }

    if (onProgress) {
      onProgress(100)
    }

    // Get public URL
    const { data: urlData } = client.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    return urlData.publicUrl
  } catch (error: any) {
    console.error('Error uploading to Supabase Storage:', error)
    throw new Error(error.message || 'Gagal mengupload file ke Supabase Storage')
  }
}

/**
 * Delete file from Supabase Storage
 * @param path - Path to file in storage
 * @param useAdmin - Use admin client (for server-side operations)
 */
export async function deleteFromSupabaseStorage(path: string, useAdmin: boolean = false): Promise<void> {
  try {
    const client = useAdmin ? supabaseAdmin : supabase
    const { error } = await client.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      throw error
    }
  } catch (error: any) {
    console.error('Error deleting from Supabase Storage:', error)
    throw new Error(error.message || 'Gagal menghapus file dari Supabase Storage')
  }
}

