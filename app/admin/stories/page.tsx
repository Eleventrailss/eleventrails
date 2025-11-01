"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { supabase } from "@/lib/supabase"
import { Edit, Trash2, Eye, Upload, X, Plus, Power, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Story {
  id: string
  title: string
  pic: string
  author: string | null
  stories_detail: string | null
  tags: string[]
  is_active: boolean
  created_at: string
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  
  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editModalLoading, setEditModalLoading] = useState(false)
  const [editModalError, setEditModalError] = useState<string | null>(null)
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null)
  
  // Duplicate state
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set())
  
  // Add Form fields
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [storiesDetail, setStoriesDetail] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [picture, setPicture] = useState<File | null>(null)
  const [picturePreview, setPicturePreview] = useState<string>("")
  const [isActive, setIsActive] = useState(true)
  
  // Edit Form fields
  const [editTitle, setEditTitle] = useState("")
  const [editAuthor, setEditAuthor] = useState("")
  const [editStoriesDetail, setEditStoriesDetail] = useState("")
  const [editTags, setEditTags] = useState<string[]>([])
  const [editTagInput, setEditTagInput] = useState("")
  const [editPicture, setEditPicture] = useState<File | null>(null)
  const [editPicturePreview, setEditPicturePreview] = useState<string>("")
  const [editIsActive, setEditIsActive] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setStories(data || [])
    } catch (err: any) {
      console.error('Error fetching stories:', err)
      setError(err.message || 'Gagal memuat data stories')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('stories')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      // Refresh data
      fetchStories()
    } catch (err: any) {
      console.error('Error updating story:', err)
      alert('Gagal mengupdate status story: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus story ini?')) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Refresh data
      fetchStories()
    } catch (err: any) {
      console.error('Error deleting story:', err)
      alert('Gagal menghapus story: ' + err.message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Modal functions
  const handleOpenModal = () => {
    setIsModalOpen(true)
    resetForm()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Don't reset form here, let it reset when modal is reopened
  }

  const resetForm = () => {
    setTitle("")
    setAuthor("")
    setStoriesDetail("")
    setTags([])
    setTagInput("")
    setPicture(null)
    setPicturePreview("")
    setIsActive(true)
    setModalError(null)
  }

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

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setModalLoading(true)
      setModalError(null)

      if (!title.trim()) {
        setModalError("Title wajib diisi")
        setModalLoading(false)
        return
      }

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

      // Refresh data
      await fetchStories()
      handleCloseModal()
    } catch (err: any) {
      console.error('Error submitting story:', err)
      const errorMessage = err.message || err.error?.message || 'Gagal menyimpan story. Silakan coba lagi.'
      setModalError(errorMessage)
    } finally {
      setModalLoading(false)
    }
  }

  const handleToggleDuplicateMode = () => {
    setIsDuplicateMode(!isDuplicateMode)
    setSelectedStories(new Set())
  }

  const handleToggleSelectStory = (storyId: string) => {
    const newSelected = new Set(selectedStories)
    if (newSelected.has(storyId)) {
      newSelected.delete(storyId)
    } else {
      newSelected.add(storyId)
    }
    setSelectedStories(newSelected)
  }

  const handleDuplicateSelected = async () => {
    if (selectedStories.size === 0) {
      alert('Pilih setidaknya satu story untuk diduplikasi')
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menduplikasi ${selectedStories.size} story?`)) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const storiesToDuplicate = stories.filter(s => selectedStories.has(s.id))
      
      for (const story of storiesToDuplicate) {
        const { error: insertError } = await supabase
          .from('stories')
          .insert({
            title: `${story.title} (Copy)`,
            author: story.author,
            stories_detail: story.stories_detail,
            pic: story.pic,
            tags: story.tags || null,
            is_active: story.is_active
          })

        if (insertError) {
          throw insertError
        }
      }

      // Refresh data
      fetchStories()
      setIsDuplicateMode(false)
      setSelectedStories(new Set())
      alert(`${storiesToDuplicate.length} story berhasil diduplikasi`)
    } catch (err: any) {
      console.error('Error duplicating stories:', err)
      alert('Gagal menduplikasi story: ' + err.message)
      setLoading(false)
    }
  }

  // Edit Modal Functions
  const handleOpenEditModal = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId)
    if (!story) return
    
    setEditingStoryId(storyId)
    setEditTitle(story.title || "")
    setEditAuthor(story.author || "")
    setEditStoriesDetail(story.stories_detail || "")
    setEditTags(story.tags || [])
    setEditTagInput("")
    setEditPicture(null)
    setEditPicturePreview(story.pic || "")
    setEditIsActive(story.is_active ?? true)
    setEditModalError(null)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingStoryId(null)
    // Don't reset form here, let it reset when modal is reopened
  }

  const resetEditForm = () => {
    setEditTitle("")
    setEditAuthor("")
    setEditStoriesDetail("")
    setEditTags([])
    setEditTagInput("")
    setEditPicture(null)
    setEditPicturePreview("")
    setEditIsActive(true)
    setEditModalError(null)
  }

  const handleEditAddTag = () => {
    if (editTagInput.trim() && !editTags.includes(editTagInput.trim())) {
      setEditTags([...editTags, editTagInput.trim()])
      setEditTagInput("")
    }
  }

  const handleEditRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove))
  }

  const handleEditPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditPicture(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditPicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingStoryId) return
    
    try {
      setEditModalLoading(true)
      setEditModalError(null)

      if (!editTitle.trim()) {
        setEditModalError("Title wajib diisi")
        setEditModalLoading(false)
        return
      }

      let pictureUrl = editPicturePreview || null

      if (editPicture) {
        const uploadedUrl = await uploadImageToSupabase(editPicture, 'pictures')
        if (uploadedUrl) {
          pictureUrl = uploadedUrl
        } else if (editPicturePreview) {
          pictureUrl = editPicturePreview
          console.warn('Using base64 preview for picture (storage not available)')
        }
      }

      const { error: updateError } = await supabase
        .from('stories')
        .update({
          title: editTitle,
          author: editAuthor || null,
          stories_detail: editStoriesDetail || null,
          pic: pictureUrl || null,
          tags: editTags.length > 0 ? editTags : null,
          is_active: editIsActive
        })
        .eq('id', editingStoryId)

      if (updateError) {
        throw updateError
      }

      // Refresh data
      await fetchStories()
      handleCloseEditModal()
    } catch (err: any) {
      console.error('Error updating story:', err)
      const errorMessage = err.message || err.error?.message || 'Gagal mengupdate story. Silakan coba lagi.'
      setEditModalError(errorMessage)
    } finally {
      setEditModalLoading(false)
    }
  }

  return (
    <AdminAuthCheck>
      <div className="bg-slate-950 min-h-screen">
        <AdminSidebar />
        <div className="lg:ml-64">
          <AdminNavbar />
          <main className="p-6 lg:p-8 px-[30px] pt-24 lg:pt-8" style={{ paddingTop: '100px' }}>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-white text-2xl sm:text-3xl font-bold">Stories</h1>
              <div className="flex flex-wrap gap-2">
                {isDuplicateMode && (
                  <>
                    <button
                      onClick={handleDuplicateSelected}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                    >
                      <Check size={16} />
                      <span className="hidden sm:inline">Duplikasi ({selectedStories.size})</span>
                      <span className="sm:hidden">({selectedStories.size})</span>
                    </button>
                    <button
                      onClick={handleToggleDuplicateMode}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                    >
                      <X size={16} />
                      Batal
                    </button>
                  </>
                )}
                {!isDuplicateMode && (
                  <button
                    onClick={handleToggleDuplicateMode}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline">Duplikasi</span>
                  </button>
                )}
              <button
                onClick={handleOpenModal}
                className="bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Tambah Story</span>
                <span className="sm:hidden">Tambah</span>
              </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="bg-slate-900 rounded-lg p-6 text-center">
                <p className="text-gray-400">Memuat data...</p>
              </div>
            ) : stories.length === 0 ? (
              <div className="bg-slate-900 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Stories</h3>
                  <p className="text-gray-400 mb-6">
                    Database stories masih kosong. Tambahkan story pertama Anda untuk memulai!
                  </p>
                  <a
                    href="/admin/add-stories"
                    className="inline-block bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-3 px-6 rounded transition-colors"
                  >
                    + Tambah Story Pertama
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800">
                      <tr>
                        {isDuplicateMode && (
                          <th className="px-2 sm:px-4 py-3 text-center text-sm font-semibold text-white w-16">
                            <Checkbox
                              checked={selectedStories.size === stories.length && stories.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedStories(new Set(stories.map(s => s.id)))
                                } else {
                                  setSelectedStories(new Set())
                                }
                              }}
                            />
                          </th>
                        )}
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white">Title</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden md:table-cell">Author</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden lg:table-cell">Tags</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden xl:table-cell">Detail</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden lg:table-cell">Picture</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden md:table-cell">Created</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {stories.map((story) => (
                        <tr key={story.id} className="hover:bg-slate-800/50 transition-colors">
                          {isDuplicateMode && (
                            <td className="px-2 sm:px-4 py-3 text-center">
                              <Checkbox
                                checked={selectedStories.has(story.id)}
                                onCheckedChange={() => handleToggleSelectStory(story.id)}
                              />
                            </td>
                          )}
                          <td className="px-2 sm:px-4 py-3 text-sm text-white font-medium">
                            {story.title}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-300 hidden md:table-cell">
                            {story.author || '-'}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {story.tags && story.tags.length > 0 ? (
                                story.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs rounded bg-[#EE6A28]/20 text-[#EE6A28]"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                              {story.tags && story.tags.length > 3 && (
                                <span className="text-gray-400 text-xs">+{story.tags.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-300 max-w-xs hidden xl:table-cell">
                            {truncateText(story.stories_detail)}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm hidden lg:table-cell">
                            {story.pic ? (
                              <img
                                src={story.pic}
                                alt={story.title}
                                className="w-16 h-16 object-cover rounded border border-slate-700"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg?height=64&width=64'
                                }}
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
                            {formatDate(story.created_at)}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => handleToggleActive(story.id, story.is_active)}
                                className={`p-1 sm:p-1.5 rounded transition-colors ${
                                  story.is_active
                                    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/20'
                                }`}
                                title={story.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                              >
                                <Power size={16} className={story.is_active ? '' : 'opacity-50'} />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(story.id)}
                                className="p-1 sm:p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(story.id)}
                                className="p-1 sm:p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Add Story Modal */}
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            handleCloseModal()
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Tambah Story Baru</DialogTitle>
            </DialogHeader>
            
            {modalError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {modalError}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Title *</label>
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
                <label className="block text-white text-sm font-semibold mb-2">Author</label>
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
                <label className="block text-white text-sm font-semibold mb-2">Picture</label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                    className="hidden"
                    id="modal-picture"
                  />
                  <label
                    htmlFor="modal-picture"
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
                <label className="block text-white text-sm font-semibold mb-2">Story Detail</label>
                <textarea
                  value={storiesDetail}
                  onChange={(e) => setStoriesDetail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={4}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
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
                <label className="block text-white text-sm font-semibold mb-2">Status</label>
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

              <DialogFooter className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={modalLoading}
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {modalLoading ? 'Menyimpan...' : 'Simpan Story'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Story Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            handleCloseEditModal()
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Edit Story</DialogTitle>
            </DialogHeader>
            
            {editModalError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {editModalError}
              </div>
            )}

            <form onSubmit={handleEditModalSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="INTO THE JUNGLE LOMBOK DIRT BIKE TOURS"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Author</label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="John Doe"
                />
              </div>

              {/* Picture */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Picture</label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditPictureChange}
                    className="hidden"
                    id="edit-modal-picture"
                  />
                  <label
                    htmlFor="edit-modal-picture"
                    className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                  >
                    <Upload size={18} />
                    {editPicturePreview ? 'Change Picture' : 'Upload Picture'}
                  </label>
                </div>
                {editPicturePreview && (
                  <div className="mt-4">
                    <img
                      src={editPicturePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded border border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Stories Detail */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Story Detail</label>
                <textarea
                  value={editStoriesDetail}
                  onChange={(e) => setEditStoriesDetail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={4}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleEditAddTag())}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                    placeholder="Adventure, Trail Riding, Lombok"
                  />
                  <button
                    type="button"
                    onClick={handleEditAddTag}
                    className="px-4 py-2 bg-[#EE6A28] hover:bg-[#d85a20] text-white rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#EE6A28]/20 text-[#EE6A28] rounded text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleEditRemoveTag(tag)}
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
                <label className="block text-white text-sm font-semibold mb-2">Status</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#EE6A28] focus:ring-[#EE6A28]"
                  />
                  <span className="text-white">Active</span>
                </label>
              </div>

              <DialogFooter className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEditModal}
                  disabled={editModalLoading}
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editModalLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {editModalLoading ? 'Menyimpan...' : 'Update Story'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminAuthCheck>
  )
}

