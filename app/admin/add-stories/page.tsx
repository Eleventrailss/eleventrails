"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, Plus, X, Upload } from "lucide-react"

export default function AddStoriesPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [storiesDetail, setStoriesDetail] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [picture, setPicture] = useState<File | null>(null)
  const [picturePreview, setPicturePreview] = useState<string>("")
  const [isActive, setIsActive] = useState(true)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPicture(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageToSupabase = async (file: File, path: string): Promise<string | null> => {
    try {
      // Check if storage bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError || !buckets?.find(b => b.name === 'stories')) {
        console.warn('Storage bucket "stories" not found. Using base64 preview.')
        return null
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err) {
      console.error('Error uploading image:', err)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      if (!title.trim()) {
        setError("Title wajib diisi")
        setLoading(false)
        return
      }

      // Upload picture (fallback to base64 if storage bucket not available)
      let pictureUrl = picturePreview || null

      if (picture) {
        const uploadedUrl = await uploadImageToSupabase(picture, 'pictures')
        if (uploadedUrl) {
          pictureUrl = uploadedUrl
        } else if (picturePreview) {
          pictureUrl = picturePreview
          console.warn('Using base64 preview for picture (storage not available)')
        }
      }

      // Insert story
      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          title,
          author: author || null,
          stories_detail: storiesDetail || null,
          pic: pictureUrl || null,
          tags: tags.length > 0 ? tags : null,
          is_active: isActive
        })

      if (insertError) {
        throw insertError
      }

      // Redirect to stories list
      router.push('/admin/stories')
    } catch (err: any) {
      console.error('Error submitting story:', err)
      const errorMessage = err.message || err.error?.message || 'Gagal menyimpan story. Silakan coba lagi.'
      setError(errorMessage)
      setLoading(false)
    }
  }


  return (
    <AdminAuthCheck>
      <div className="bg-slate-950 min-h-screen">
        <AdminSidebar />
        <div className="lg:ml-64">
          <AdminNavbar />
          <main className="p-6 lg:p-8 px-[30px] pt-24 lg:pt-8">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => router.push('/admin/stories')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <h1 className="text-white text-2xl sm:text-3xl font-bold">Add Story</h1>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-slate-900 rounded-lg p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="INTO THE JUNGLE LOMBOK DIRT BIKE TOURS"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="John Doe"
                />
              </div>

              {/* Picture */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Picture
                </label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                    className="hidden"
                    id="picture"
                  />
                  <label
                    htmlFor="picture"
                    className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                  >
                    <Upload size={18} />
                    {picturePreview ? 'Change Picture' : 'Upload Picture'}
                  </label>
                </div>
                {picturePreview && (
                  <div className="mt-4">
                    <img
                      src={picturePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded border border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Stories Detail */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Story Detail
                </label>
                <textarea
                  value={storiesDetail}
                  onChange={(e) => setStoriesDetail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={6}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                    placeholder="Adventure, Trail Riding, Lombok"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#EE6A28] hover:bg-[#d85a20] text-white rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#EE6A28]/20 text-[#EE6A28] rounded text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
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
                  onClick={() => router.push('/admin/stories')}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Story'}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </AdminAuthCheck>
  )
}

