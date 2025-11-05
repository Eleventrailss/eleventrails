"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { SidebarProvider, useSidebar } from "@/components/admin/sidebar-context"
import { supabase } from "@/lib/supabase"
import { Edit, X, Plus, Copy, Check, ArrowUp, ArrowDown, Power, Upload, Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Pagination from "@/components/admin/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  avatar_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

function AdminTestimonialsContent() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isCollapsed } = useSidebar()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Duplicate state
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [selectedTestimonials, setSelectedTestimonials] = useState<Set<string>>(new Set())
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editRating, setEditRating] = useState(5)
  const [editAvatarUrl, setEditAvatarUrl] = useState("")
  const [editDisplayOrder, setEditDisplayOrder] = useState(0)
  const [editIsActive, setEditIsActive] = useState(true)
  const [editImage, setEditImage] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string>("")
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editUploadProgress, setEditUploadProgress] = useState(0)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      setTestimonials(data || [])
    } catch (err: any) {
      console.error('Error fetching testimonials:', err)
      setError(err.message || 'Gagal memuat data testimonials')
    } finally {
      setLoading(false)
    }
  }

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

      // Sanitize nama untuk digunakan di filename (hapus karakter khusus, spasi diganti underscore)
      const sanitizedName = testimonialName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/-+/g, '_')
        .substring(0, 50) // Limit panjang nama

      // Get index based on existing files with same id_nama pattern
      const { data: existingTestimonials } = await supabase
        .from('testimonials')
        .select('avatar_url')
        .eq('id', testimonialId)
      
      // Extract index from existing files with pattern id_nama_*
      const pattern = new RegExp(`^${testimonialId}_${sanitizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_(\\d+)\\.`)
      let maxIndex = 0
      
      if (existingTestimonials && existingTestimonials.length > 0) {
        for (const testimonial of existingTestimonials) {
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

      // Juga cek semua testimonials untuk pattern yang sama
      const { data: allTestimonials } = await supabase
        .from('testimonials')
        .select('avatar_url')
      
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
      // Format: id_nama_index.ext
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

  const handleStartEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setEditName(testimonial.name)
    setEditContent(testimonial.content)
    setEditRating(testimonial.rating)
    setEditAvatarUrl(testimonial.avatar_url || "")
    setEditDisplayOrder(testimonial.display_order)
    setEditIsActive(testimonial.is_active)
    setEditImage(null)
    setEditImagePreview("")
    // Jika ada avatar_url, tampilkan preview
    if (testimonial.avatar_url && (testimonial.avatar_url.startsWith('http') || testimonial.avatar_url.startsWith('/'))) {
      setEditImagePreview(testimonial.avatar_url)
    }
    setEditError(null)
    setEditUploadProgress(0)
    setIsEditModalOpen(true)
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 50 * 1024 * 1024
      if (file.size > maxSize) {
        setEditError(`Ukuran file maksimal 50MB. File Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        return
      }

      setEditImage(file)
      setEditUploadProgress(0)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    try {
      setEditLoading(true)
      setEditError(null)

      if (!editName.trim()) {
        setEditError("Nama wajib diisi")
        setEditLoading(false)
        return
      }

      if (!editContent.trim()) {
        setEditError("Konten testimonial wajib diisi")
        setEditLoading(false)
        return
      }

      let finalAvatarUrl: string | null = editAvatarUrl.trim() || null

      // Jika ada file baru yang dipilih, upload
      if (editImage) {
        try {
          const uploadedUrl = await uploadImageToPublic(
            editImage, 
            editingId,
            editName.trim(),
            (progress) => setEditUploadProgress(progress)
          )
          if (uploadedUrl) {
            finalAvatarUrl = uploadedUrl
          } else {
            setEditError('Gagal mengupload file')
            setEditLoading(false)
            return
          }
        } catch (err: any) {
          setEditError(err.message || 'Gagal mengupload file')
          setEditLoading(false)
          return
        }
      }

      const { error: updateError } = await supabase
        .from('testimonials')
        .update({
          name: editName.trim(),
          content: editContent.trim(),
          rating: editRating,
          avatar_url: finalAvatarUrl || null,
          display_order: editDisplayOrder,
          is_active: editIsActive
        })
        .eq('id', editingId)

      if (updateError) {
        throw updateError
      }

      await fetchTestimonials()
      setIsEditModalOpen(false)
      setEditingId(null)
      setEditName("")
      setEditContent("")
      setEditRating(5)
      setEditAvatarUrl("")
      setEditDisplayOrder(0)
      setEditIsActive(true)
      setEditImage(null)
      setEditImagePreview("")
    } catch (err: any) {
      console.error('Error updating testimonial:', err)
      setEditError(err.message || 'Gagal mengupdate testimonial')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      fetchTestimonials()
    } catch (err: any) {
      console.error('Error deleting testimonial:', err)
      alert('Gagal menghapus testimonial: ' + err.message)
    }
  }


  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('testimonials')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      fetchTestimonials()
    } catch (err: any) {
      console.error('Error updating testimonial status:', err)
      alert('Gagal mengupdate status testimonial: ' + err.message)
    }
  }

  const handleMoveOrder = async (id: string, direction: 'up' | 'down') => {
    const currentTestimonial = testimonials.find(t => t.id === id)
    if (!currentTestimonial) return

    const sortedTestimonials = [...testimonials].sort((a, b) => a.display_order - b.display_order)
    const currentIndex = sortedTestimonials.findIndex(t => t.id === id)
    
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === sortedTestimonials.length - 1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const targetTestimonial = sortedTestimonials[targetIndex]

    try {
      await supabase
        .from('testimonials')
        .update({ display_order: targetTestimonial.display_order })
        .eq('id', currentTestimonial.id)
      
      await supabase
        .from('testimonials')
        .update({ display_order: currentTestimonial.display_order })
        .eq('id', targetTestimonial.id)

      fetchTestimonials()
    } catch (err: any) {
      console.error('Error moving testimonial order:', err)
      alert('Gagal memindahkan urutan testimonial: ' + err.message)
    }
  }

  const handleToggleDuplicateMode = () => {
    setIsDuplicateMode(!isDuplicateMode)
    setSelectedTestimonials(new Set())
  }

  const handleToggleSelectTestimonial = (testimonialId: string) => {
    const newSelected = new Set(selectedTestimonials)
    if (newSelected.has(testimonialId)) {
      newSelected.delete(testimonialId)
    } else {
      newSelected.add(testimonialId)
    }
    setSelectedTestimonials(newSelected)
  }

  const handleDuplicateSelected = async () => {
    if (selectedTestimonials.size === 0) {
      alert('Pilih setidaknya satu testimonial untuk diduplikasi')
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menduplikasi ${selectedTestimonials.size} testimonial?`)) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const testimonialsToDuplicate = testimonials.filter(t => selectedTestimonials.has(t.id))
      
      for (const testimonial of testimonialsToDuplicate) {
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert({
            name: `${testimonial.name} (Copy)`,
            content: testimonial.content,
            rating: testimonial.rating,
            avatar_url: testimonial.avatar_url,
            display_order: testimonial.display_order,
            is_active: testimonial.is_active
          })

        if (insertError) {
          throw insertError
        }
      }

      await fetchTestimonials()
      setIsDuplicateMode(false)
      setSelectedTestimonials(new Set())
      alert(`${testimonialsToDuplicate.length} testimonial berhasil diduplikasi`)
    } catch (err: any) {
      console.error('Error duplicating testimonials:', err)
      alert('Gagal menduplikasi testimonials: ' + err.message)
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
      />
    ))
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        <AdminNavbar />
        <main className="p-6 lg:p-8 px-[30px]" style={{ paddingTop: '100px' }}>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-white text-2xl sm:text-3xl font-bold">Testimonials Management</h1>
            <div className="flex flex-wrap gap-2">
              {isDuplicateMode && (
                <>
                  <button
                    onClick={handleDuplicateSelected}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                  >
                    <Check size={16} />
                    <span className="hidden sm:inline">Duplikasi ({selectedTestimonials.size})</span>
                    <span className="sm:hidden">({selectedTestimonials.size})</span>
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
                onClick={() => router.push('/admin/add-testimonials')}
                className="bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Tambah Testimonial</span>
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
          ) : testimonials.length === 0 ? (
            <div className="bg-slate-900 rounded-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Testimonials</h3>
                <p className="text-gray-400 mb-6">
                  Database testimonials masih kosong. Tambahkan testimonial pertama Anda untuk memulai!
                </p>
                <button
                  onClick={() => router.push('/admin/add-testimonials')}
                  className="inline-block bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-3 px-6 rounded transition-colors"
                >
                  + Tambah Testimonial Pertama
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-800 hover:bg-slate-800">
                      {isDuplicateMode && (
                        <TableHead className="text-white text-center w-16">
                          <Checkbox
                            checked={selectedTestimonials.size === testimonials.length && testimonials.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTestimonials(new Set(testimonials.map(t => t.id)))
                              } else {
                                setSelectedTestimonials(new Set())
                              }
                            }}
                          />
                        </TableHead>
                      )}
                      <TableHead className="text-white w-16">Order</TableHead>
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white hidden md:table-cell">Rating</TableHead>
                      <TableHead className="text-white hidden md:table-cell">Content</TableHead>
                      <TableHead className="text-white hidden lg:table-cell">Avatar</TableHead>
                      <TableHead className="text-white hidden lg:table-cell">Updated</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((testimonial) => {
                      const sortedTestimonials = [...testimonials].sort((a, b) => a.display_order - b.display_order)
                      const currentIndex = sortedTestimonials.findIndex(t => t.id === testimonial.id)
                      const canMoveUp = currentIndex > 0
                      const canMoveDown = currentIndex < sortedTestimonials.length - 1
                      
                      return (
                        <TableRow key={testimonial.id} className="hover:bg-slate-800/50">
                          {isDuplicateMode && (
                            <TableCell className="text-center">
                              <Checkbox
                                checked={selectedTestimonials.has(testimonial.id)}
                                onCheckedChange={() => handleToggleSelectTestimonial(testimonial.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell className="text-gray-300">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveOrder(testimonial.id, 'up')}
                                disabled={!canMoveUp}
                                className={`p-1 rounded transition-colors ${
                                  canMoveUp 
                                    ? 'text-gray-400 hover:text-white hover:bg-slate-700' 
                                    : 'text-gray-600 cursor-not-allowed'
                                }`}
                                title="Move up"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <span className="text-sm font-medium">{testimonial.display_order}</span>
                              <button
                                onClick={() => handleMoveOrder(testimonial.id, 'down')}
                                disabled={!canMoveDown}
                                className={`p-1 rounded transition-colors ${
                                  canMoveDown 
                                    ? 'text-gray-400 hover:text-white hover:bg-slate-700' 
                                    : 'text-gray-600 cursor-not-allowed'
                                }`}
                                title="Move down"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-white">
                            <div className="max-w-xs truncate" title={testimonial.name}>
                              {testimonial.name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              {renderStars(testimonial.rating)}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 hidden md:table-cell">
                            <div className="max-w-md truncate" title={testimonial.content}>
                              {truncateText(testimonial.content, 100)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {testimonial.avatar_url ? (
                              <img
                                src={testimonial.avatar_url}
                                alt={testimonial.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-700"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/placeholder-user.jpg'
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-400 hidden lg:table-cell text-sm">
                            {formatDate(testimonial.updated_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                                className={`p-1 sm:p-1.5 rounded transition-colors ${
                                  testimonial.is_active
                                    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/20'
                                }`}
                                title={testimonial.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                              >
                                <Power size={16} className={testimonial.is_active ? '' : 'opacity-50'} />
                              </button>
                              <button
                                onClick={() => handleStartEdit(testimonial)}
                                className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                                title="Delete"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(testimonials.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={testimonials.length}
                />
              </div>
            </div>
          )}
        </main>

        {/* Edit Testimonial Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsEditModalOpen(false)
            setEditingId(null)
            setEditName("")
            setEditContent("")
            setEditRating(5)
            setEditAvatarUrl("")
            setEditDisplayOrder(0)
            setEditIsActive(true)
            setEditImage(null)
            setEditImagePreview("")
            setEditError(null)
            setEditUploadProgress(0)
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Edit Testimonial</DialogTitle>
            </DialogHeader>
            
            {editError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {editError}
              </div>
            )}

            <form id="edit-form" onSubmit={handleSaveEdit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Nama *</label>
                <input
                  type="text"
                  value={editName || ""}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="Nama pemberi testimonial"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Konten Testimonial *</label>
                <textarea
                  value={editContent || ""}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={5}
                  placeholder="Isi testimonial"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setEditRating(rating)}
                      className={`p-2 rounded transition-colors ${
                        editRating >= rating
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Star size={24} className={editRating >= rating ? 'fill-current' : ''} />
                    </button>
                  ))}
                  <span className="text-gray-400 ml-2">({editRating}/5)</span>
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Avatar</label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="hidden"
                    id="edit-avatar-input"
                  />
                  <label
                    htmlFor="edit-avatar-input"
                    className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                  >
                    <Upload size={18} />
                    {editImagePreview ? 'Change Avatar' : 'Upload Avatar'}
                  </label>
                </div>
                {editImagePreview && (
                  <div className="mt-4">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border border-slate-700"
                    />
                    {editImage && (
                      <p className="text-xs text-gray-400 mt-2">
                        File baru: {editImage.name} ({(editImage.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    {editLoading && editUploadProgress > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Uploading...</span>
                          <span>{editUploadProgress}%</span>
                        </div>
                        <Progress value={editUploadProgress || 0} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Display Order</label>
                <input
                  type="number"
                  value={editDisplayOrder ?? 0}
                  onChange={(e) => setEditDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="0"
                  min="0"
                />
                <p className="text-gray-400 text-xs mt-1">Lower numbers appear first.</p>
              </div>

              {/* Active Status */}
              <div>
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
            </form>

            <DialogFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingId(null)
                  setEditName("")
                  setEditContent("")
                  setEditRating(5)
                  setEditAvatarUrl("")
                  setEditDisplayOrder(0)
                  setEditIsActive(true)
                  setEditImage(null)
                  setEditImagePreview("")
                  setEditError(null)
                }}
                disabled={editLoading}
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-form"
                disabled={editLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editLoading ? 'Menyimpan...' : 'Update Testimonial'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function AdminTestimonialsPage() {
  return (
    <AdminAuthCheck>
      <SidebarProvider>
        <AdminTestimonialsContent />
      </SidebarProvider>
    </AdminAuthCheck>
  )
}

