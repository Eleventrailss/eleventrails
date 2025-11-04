"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { SidebarProvider, useSidebar } from "@/components/admin/sidebar-context"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, X, Upload, Star } from "lucide-react"

function AddTestimonialsContent() {
  const router = useRouter()
  const { isCollapsed } = useSidebar()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(5)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadImageToPublic = async (
    file: File, 
    testimonialId: string,
    testimonialName: string,
    onProgress?: (progress: number) => void
  ): Promise<string | null> => {
    try {
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Ukuran file maksimal 50MB')
      }

      const sanitizedName = testimonialName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/-+/g, '_')
        .substring(0, 50)

      const { data: allTestimonials } = await supabase
        .from('testimonials')
        .select('avatar_url')
      
      const pattern = new RegExp(`^${testimonialId}_${sanitizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_(\\d+)\\.`)
      let maxIndex = 0
      
      if (allTestimonials) {
        for (const testimonial of allTestimonials) {
          if (testimonial.avatar_url && (testimonial.avatar_url.startsWith('http') || testimonial.avatar_url.startsWith('/'))) {
            const fileName = testimonial.avatar_url.split('/').pop() || ''
            const match = fileName.match(pattern)
            if (match && match[1]) {
              const fileIndex = parseInt(match[1], 10)
              if (fileIndex > maxIndex) {
                maxIndex = fileIndex
              }
            }
          }
        }
      }
      
      const index = maxIndex + 1
      const fileExt = file.name.split('.').pop()
      const fileName = `${testimonialId}_${sanitizedName}_${index}.${fileExt}`

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'testimonials')
      formData.append('subfolder', '')
      formData.append('customFileName', `${testimonialId}_${sanitizedName}_${index}`)

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100)
            onProgress(progress)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText)
              if (onProgress) onProgress(100)
              resolve(data.url || null)
            } catch (err) {
              reject(new Error('Gagal memparse respons'))
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              reject(new Error(errorData.error || 'Upload gagal'))
            } catch (err) {
              reject(new Error('Upload gagal'))
            }
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload gagal'))
        })

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload dibatalkan'))
        })

        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })
    } catch (err: any) {
      console.error('Error uploading file:', err)
      throw err
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        setError(`Ukuran file maksimal 50MB. File Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        return
      }

      setImage(file)
      setUploadProgress(0)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      if (!name.trim()) {
        setError("Nama wajib diisi")
        setLoading(false)
        return
      }

      if (!content.trim()) {
        setError("Konten testimonial wajib diisi")
        setLoading(false)
        return
      }

      const { data: insertedData, error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: name.trim(),
          content: content.trim(),
          rating: rating,
          avatar_url: "",
          display_order: displayOrder || 0,
          is_active: isActive
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      if (image && insertedData) {
        try {
          const uploadedUrl = await uploadImageToPublic(
            image, 
            insertedData.id,
            name.trim(),
            (progress) => setUploadProgress(progress)
          )
          if (uploadedUrl) {
            await supabase
              .from('testimonials')
              .update({ avatar_url: uploadedUrl })
              .eq('id', insertedData.id)
          } else {
            await supabase
              .from('testimonials')
              .delete()
              .eq('id', insertedData.id)
            setError('Gagal mengupload file. Silakan coba lagi.')
            setLoading(false)
            return
          }
        } catch (err: any) {
          await supabase
            .from('testimonials')
            .delete()
            .eq('id', insertedData.id)
          setError(err.message || 'Gagal mengupload file. Silakan coba lagi.')
          setLoading(false)
          return
        }
      }

      router.push('/admin/testimonials')
    } catch (err: any) {
      console.error('Error submitting testimonial:', err)
      setError(err.message || 'Gagal menyimpan testimonial. Silakan coba lagi.')
      setLoading(false)
    }
  }

  const renderStars = (ratingValue: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={24}
        className={`cursor-pointer transition-colors ${
          i < ratingValue
            ? 'text-yellow-400 fill-yellow-400 hover:text-yellow-300'
            : 'text-gray-400 hover:text-gray-300'
        }`}
        onClick={() => setRating(i + 1)}
      />
    ))
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        <AdminNavbar />
        <main className="p-6 lg:p-8 px-[30px] pt-24 lg:pt-8" style={{ paddingTop: '100px' }}>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.push('/admin/testimonials')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-white text-2xl sm:text-3xl font-bold">Add Testimonial</h1>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-slate-900 rounded-lg p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Nama *
              </label>
              <input
                type="text"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                placeholder="Nama pemberi testimonial"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Konten Testimonial *
              </label>
              <textarea
                value={content || ""}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                rows={6}
                placeholder="Isi testimonial"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                <span className="text-gray-400 ml-2">({rating}/5)</span>
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Avatar</label>
              <div className="mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="avatar-input"
                />
                <label
                  htmlFor="avatar-input"
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                >
                  <Upload size={18} />
                  {imagePreview ? 'Change Avatar' : 'Upload Avatar'}
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border border-slate-700"
                  />
                  {image && (
                    <p className="text-xs text-gray-400 mt-2">
                      File: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {loading && uploadProgress > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-[#EE6A28] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder ?? 0}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                placeholder="0"
                min="0"
              />
              <p className="text-gray-400 text-xs mt-1">Lower numbers appear first. Leave 0 to add at the end.</p>
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Status
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#EE6A28] focus:ring-[#EE6A28]"
                />
                <span className="text-white">Active</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => router.push('/admin/testimonials')}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan Testimonial'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default function AddTestimonialsPage() {
  return (
    <AdminAuthCheck>
      <SidebarProvider>
        <AddTestimonialsContent />
      </SidebarProvider>
    </AdminAuthCheck>
  )
}

