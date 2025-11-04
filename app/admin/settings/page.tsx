"use client"

import { useState, useEffect, useMemo } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { SidebarProvider, useSidebar } from "@/components/admin/sidebar-context"
import { supabase } from "@/lib/supabase"
import { Edit, Save, X, Plus, Upload, Image as ImageIcon, Type, Copy, Check, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Pagination from "@/components/admin/pagination"
import RichTextEditor from "@/components/admin/rich-text-editor"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface GeneralSetting {
  id: string
  key: string
  value: string
  description: string | null
  updated_at: string
}

function AdminSettingsContent() {
  const [settings, setSettings] = useState<GeneralSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isCollapsed } = useSidebar()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  
  // Duplicate state
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [selectedSettings, setSelectedSettings] = useState<Set<string>>(new Set())
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editKey, setEditKey] = useState("")
  const [editValue, setEditValue] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editIsImageMode, setEditIsImageMode] = useState(false)
  const [editImage, setEditImage] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string>("")
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editUploadProgress, setEditUploadProgress] = useState(0)
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newIsImageMode, setNewIsImageMode] = useState(false)
  const [newImage, setNewImage] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string>("")
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [newUploadProgress, setNewUploadProgress] = useState(0)

  useEffect(() => {
    fetchSettings()
  }, [])

  // Strip HTML tags for searching in value
  const stripHtml = (html: string) => {
    if (!html) return ""
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
  }

  // Filter settings based on search query
  const filteredSettings = useMemo(() => {
    console.log('Filtering settings, searchQuery:', `"${searchQuery}"`, 'searchQuery type:', typeof searchQuery, 'searchQuery length:', searchQuery?.length, 'settings count:', settings.length)
    
    if (!searchQuery || searchQuery.trim() === '') {
      console.log('No search query, returning all settings')
      return settings
    }
    
    const query = searchQuery.toLowerCase().trim()
    console.log('Search query:', query)
    
    const filtered = settings.filter((setting) => {
      // Search in key
      const keyMatch = setting.key?.toLowerCase().includes(query) || false
      
      // Search in value (only if not a URL/path)
      let valueMatch = false
      if (setting.value) {
        // Skip if value is a URL or file path
        const isUrlOrPath = setting.value.startsWith('http://') || 
                           setting.value.startsWith('https://') || 
                           setting.value.startsWith('/') ||
                           setting.value.startsWith('./') ||
                           setting.value.includes('://') ||
                           setting.value.match(/^[a-zA-Z]:\\/) // Windows path
        
        if (!isUrlOrPath) {
          // Only search in non-URL/path values
          const valueLower = setting.value.toLowerCase()
          const valueStripped = stripHtml(setting.value).toLowerCase()
          valueMatch = valueLower.includes(query) || valueStripped.includes(query)
        }
      }
      
      // Search in description
      const descriptionMatch = setting.description?.toLowerCase().includes(query) || false
      
      const matches = keyMatch || valueMatch || descriptionMatch
      if (matches) {
        console.log('Match found:', setting.key, 'keyMatch:', keyMatch, 'valueMatch:', valueMatch, 'descMatch:', descriptionMatch)
      }
      
      return matches
    })
    
    console.log('Filtered results:', filtered.length, 'from', settings.length)
    return filtered
  }, [settings, searchQuery])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('general_settings')
        .select('*')
        .order('key', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      setSettings(data || [])
    } catch (err: any) {
      console.error('Error fetching settings:', err)
      setError(err.message || 'Gagal memuat data settings')
    } finally {
      setLoading(false)
    }
  }

  const uploadImageToPublic = async (
    file: File, 
    settingId: string, 
    key: string, 
    onProgress?: (progress: number) => void
  ): Promise<string | null> => {
    try {
      // Validasi ukuran file maksimal 50MB
      const maxSize = 50 * 1024 * 1024 // 50MB dalam bytes
      if (file.size > maxSize) {
        throw new Error('Ukuran file maksimal 50MB')
      }

      // Get index based on existing files with same id_key pattern
      const { data: existingSettings } = await supabase
        .from('general_settings')
        .select('value')
        .eq('key', key)
      
      // Extract index from existing files with pattern id_key_*
      const pattern = new RegExp(`^${settingId}_${key}_(\\d+)\\.`)
      let maxIndex = 0
      
      if (existingSettings) {
        for (const setting of existingSettings) {
          if (setting.value && (setting.value.startsWith('http') || setting.value.startsWith('/'))) {
            const fileName = setting.value.split('/').pop() || ''
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
      // Format: id_key_index.ext
      const fileName = `${settingId}_${key}_${index}.${fileExt}`

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'general_setting')
      formData.append('subfolder', '')
      formData.append('customFileName', `${settingId}_${key}_${index}`)

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        // Track upload progress
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

  const handleStartEdit = (setting: GeneralSetting) => {
    setEditingId(setting.id)
    setEditKey(setting.key)
    setEditValue(setting.value)
    setEditDescription(setting.description || "")
    setEditIsImageMode(false)
    setEditImage(null)
    setEditImagePreview("")
    setEditError(null)
    // Check if value is an image URL
    if (setting.value && (setting.value.startsWith('http') || setting.value.startsWith('/'))) {
      setEditIsImageMode(true)
      setEditImagePreview(setting.value)
    }
    setIsEditModalOpen(true)
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi ukuran file maksimal 50MB
      const maxSize = 50 * 1024 * 1024 // 50MB
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

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validasi ukuran file maksimal 50MB
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        setAddError(`Ukuran file maksimal 50MB. File Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        return
      }

      setNewImage(file)
      setNewUploadProgress(0)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      setEditLoading(true)
      setEditError(null)

      let finalValue = editValue

      // If image mode and image uploaded
      if (editIsImageMode && editImage) {
        try {
          const uploadedUrl = await uploadImageToPublic(
            editImage, 
            editingId, 
            editKey,
            (progress) => setEditUploadProgress(progress)
          )
          if (uploadedUrl) {
            finalValue = uploadedUrl
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
        .from('general_settings')
        .update({
          key: editKey,
          value: finalValue,
          description: editDescription || null
        })
        .eq('id', editingId)

      if (updateError) {
        throw updateError
      }

      // Refresh data
      await fetchSettings()
      setIsEditModalOpen(false)
      setEditingId(null)
      setEditKey("")
      setEditValue("")
      setEditDescription("")
      setEditIsImageMode(false)
      setEditImage(null)
      setEditImagePreview("")
    } catch (err: any) {
      console.error('Error updating setting:', err)
      setEditError(err.message || 'Gagal mengupdate setting')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus setting ini?')) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('general_settings')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Refresh data
      fetchSettings()
    } catch (err: any) {
      console.error('Error deleting setting:', err)
      alert('Gagal menghapus setting: ' + err.message)
    }
  }

  const handleAddSetting = async () => {
    if (!newKey.trim()) {
      setAddError("Key wajib diisi")
      return
    }

    try {
      setAddLoading(true)
      setAddError(null)

      // Insert record first to get the ID
      const { data: insertedData, error: insertError } = await supabase
        .from('general_settings')
        .insert({
          key: newKey.trim(),
          value: newIsImageMode ? "" : newValue || "",
          description: newDescription || null
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // If image mode and image uploaded, upload with correct ID (format: id_key_timestamp)
      if (newIsImageMode && newImage && insertedData) {
        try {
          const uploadedUrl = await uploadImageToPublic(
            newImage, 
            insertedData.id, 
            newKey.trim(),
            (progress) => setNewUploadProgress(progress)
          )
          if (uploadedUrl) {
            await supabase
              .from('general_settings')
              .update({ value: uploadedUrl })
              .eq('id', insertedData.id)
          } else {
            // If upload failed, delete the inserted record
            await supabase
              .from('general_settings')
              .delete()
              .eq('id', insertedData.id)
            setAddError('Gagal mengupload file. Silakan coba lagi.')
            setAddLoading(false)
            return
          }
        } catch (err: any) {
          // If upload failed, delete the inserted record
          await supabase
            .from('general_settings')
            .delete()
            .eq('id', insertedData.id)
          setAddError(err.message || 'Gagal mengupload file. Silakan coba lagi.')
          setAddLoading(false)
          return
        }
      }

      // Refresh data
      await fetchSettings()
      setIsAddModalOpen(false)
      setNewKey("")
      setNewValue("")
      setNewDescription("")
      setNewIsImageMode(false)
      setNewImage(null)
      setNewImagePreview("")
    } catch (err: any) {
      console.error('Error adding setting:', err)
      setAddError(err.message || 'Gagal menambahkan setting')
    } finally {
      setAddLoading(false)
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

  const handleToggleDuplicateMode = () => {
    setIsDuplicateMode(!isDuplicateMode)
    setSelectedSettings(new Set())
  }

  const handleToggleSelectSetting = (settingId: string) => {
    const newSelected = new Set(selectedSettings)
    if (newSelected.has(settingId)) {
      newSelected.delete(settingId)
    } else {
      newSelected.add(settingId)
    }
    setSelectedSettings(newSelected)
  }

  const handleDuplicateSelected = async () => {
    if (selectedSettings.size === 0) {
      alert('Pilih setidaknya satu setting untuk diduplikasi')
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menduplikasi ${selectedSettings.size} setting?`)) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const settingsToDuplicate = settings.filter(s => selectedSettings.has(s.id))
      
      for (const setting of settingsToDuplicate) {
        const { error: insertError } = await supabase
          .from('general_settings')
          .insert({
            key: `${setting.key}_copy`,
            value: setting.value,
            description: setting.description
          })

        if (insertError) {
          throw insertError
        }
      }

      // Refresh data
      await fetchSettings()
      setIsDuplicateMode(false)
      setSelectedSettings(new Set())
      alert(`${settingsToDuplicate.length} setting berhasil diduplikasi`)
    } catch (err: any) {
      console.error('Error duplicating settings:', err)
      alert('Gagal menduplikasi setting: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        <AdminNavbar />
        <main className="p-4 sm:p-6 lg:p-8 px-4 sm:px-[30px] pt-14 lg:pt-24" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-white text-2xl sm:text-3xl font-bold">General Settings</h1>
              <div className="flex flex-wrap gap-2 items-center">
                {/* Search Input */}
                <div className="relative flex-1 sm:flex-initial min-w-[200px] max-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const newValue = e.target.value
                      console.log('Search input changed:', newValue, 'Current searchQuery:', searchQuery)
                      setSearchQuery(newValue)
                      setCurrentPage(1) // Reset to first page immediately
                    }}
                    onInput={(e) => {
                      const newValue = (e.target as HTMLInputElement).value
                      console.log('Search input onInput:', newValue)
                    }}
                    placeholder="Cari key, value, atau deskripsi..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#EE6A28] text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      title="Hapus pencarian"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {isDuplicateMode && (
                  <>
                    <button
                      onClick={handleDuplicateSelected}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                    >
                      <Check size={16} />
                      <span className="hidden sm:inline">Duplikasi ({selectedSettings.size})</span>
                      <span className="sm:hidden">({selectedSettings.size})</span>
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
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Tambah Setting</span>
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
            ) : filteredSettings.length === 0 && searchQuery ? (
              <div className="bg-slate-900 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Hasil</h3>
                  <p className="text-gray-400 mb-6">
                    Tidak ada setting yang cocok dengan pencarian "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-block bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-3 px-6 rounded transition-colors"
                  >
                    Hapus Pencarian
                  </button>
                </div>
              </div>
            ) : settings.length === 0 ? (
              <div className="bg-slate-900 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Settings</h3>
                  <p className="text-gray-400 mb-6">
                    Database settings masih kosong. Tambahkan setting pertama Anda untuk memulai!
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-block bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-3 px-6 rounded transition-colors"
                  >
                    + Tambah Setting Pertama
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <Table key={`settings-table-${searchQuery}-${filteredSettings.length}`}>
                  <TableHeader>
                    <TableRow className="bg-slate-800 hover:bg-slate-800">
                      {isDuplicateMode && (
                        <TableHead className="text-white text-center w-16">
                          <Checkbox
                            checked={selectedSettings.size === filteredSettings.length && filteredSettings.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSettings(new Set(filteredSettings.map(s => s.id)))
                              } else {
                                setSelectedSettings(new Set())
                              }
                            }}
                          />
                        </TableHead>
                      )}
                      <TableHead className="text-white">Key</TableHead>
                      <TableHead className="text-white">Value</TableHead>
                      <TableHead className="text-white hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-white hidden lg:table-cell">Updated</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody key={`table-body-${searchQuery}-${filteredSettings.length}`}>
                    {(() => {
                      const paginatedSettings = filteredSettings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      console.log('Rendering table with', paginatedSettings.length, 'items, searchQuery:', searchQuery, 'total filtered:', filteredSettings.length)
                      return paginatedSettings.map((setting) => (
                        <TableRow key={setting.id} className="hover:bg-slate-800/50">
                        {isDuplicateMode && (
                          <TableCell className="text-center">
                            <Checkbox
                              checked={selectedSettings.has(setting.id)}
                              onCheckedChange={() => handleToggleSelectSetting(setting.id)}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium text-white">
                          {setting.key}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {setting.value && (setting.value.startsWith('http') || setting.value.startsWith('/')) ? (
                            setting.value.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) ? (
                              <video
                                src={setting.value}
                                controls
                                className="w-32 h-20 object-cover rounded border border-slate-700"
                                onError={(e) => {
                                  const parent = e.currentTarget.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<div class="max-w-xs truncate text-gray-300" title="${setting.value}">${setting.value || '-'}</div>`
                                  }
                                }}
                              />
                            ) : (
                              <img
                                src={setting.value}
                                alt={setting.key}
                                className="w-16 h-16 object-cover rounded border border-slate-700"
                                onError={(e) => {
                                  const parent = e.currentTarget.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<div class="max-w-xs truncate text-gray-300" title="${setting.value}">${setting.value || '-'}</div>`
                                  }
                                }}
                              />
                            )
                          ) : (
                            <div className="max-w-xs truncate" title={setting.value}>
                              {setting.value || '-'}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-400 hidden md:table-cell">
                          <div className="max-w-xs truncate" title={setting.description || ''}>
                            {setting.description || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 hidden lg:table-cell text-sm">
                          {formatDate(setting.updated_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(setting)}
                              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(setting.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                              title="Delete"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </TableCell>
                        </TableRow>
                      ))
                    })()}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredSettings.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredSettings.length}
                />
              </div>
            )}
        </main>

         {/* Add Setting Modal */}
         <Dialog open={isAddModalOpen} onOpenChange={(open) => {
           if (!open) {
             setIsAddModalOpen(false)
             setNewKey("")
             setNewValue("")
            setNewDescription("")
            setNewIsImageMode(false)
            setNewImage(null)
            setNewImagePreview("")
            setAddError(null)
            setNewUploadProgress(0)
           }
         }}>
           <DialogContent className="max-w-2xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Tambah Setting Baru</DialogTitle>
            </DialogHeader>
            
            {addError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {addError}
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
              {/* Key */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Key *</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="site_name"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">Key unik untuk setting (contoh: site_name, contact_email)</p>
              </div>

              {/* Value */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Value</label>
                <p className="text-gray-400 text-xs mb-2">Dapat menggunakan HTML: &lt;p&gt;, &lt;h1&gt;, &lt;h2&gt;, &lt;span&gt;, &lt;div&gt;, dll</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewIsImageMode(false)
                        setNewImage(null)
                        setNewImagePreview("")
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors flex-1 ${
                        !newIsImageMode 
                          ? 'bg-[#EE6A28] text-white' 
                          : 'bg-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Type size={16} />
                      Teks
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewIsImageMode(true)
                        setNewValue("")
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors flex-1 ${
                        newIsImageMode 
                          ? 'bg-[#EE6A28] text-white' 
                          : 'bg-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <ImageIcon size={16} />
                      Foto/Video
                    </button>
                  </div>
                  {newIsImageMode ? (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleNewImageChange}
                        className="hidden"
                        id="new-image-input"
                      />
                      <label
                        htmlFor="new-image-input"
                        className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                      >
                        <Upload size={18} />
                        {newImage ? 'Ganti Foto/Video' : 'Upload Foto/Video'}
                      </label>
                      {newImagePreview && (
                        <div className="mt-2">
                          {newImage?.type.startsWith('video/') ? (
                            <video
                              src={newImagePreview}
                              controls
                              className="w-full max-h-96 rounded border border-slate-700"
                            >
                              Browser Anda tidak mendukung video tag.
                            </video>
                          ) : (
                            <img
                              src={newImagePreview}
                              alt="Preview"
                              className="w-full max-h-96 object-contain rounded border border-slate-700"
                            />
                          )}
                        </div>
                      )}
                      {newImage && (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs text-gray-400">
                            Format nama file: id_{newKey.trim() || 'key'}_index
                          </p>
                          <p className="text-xs text-gray-400">
                            Ukuran: {(newImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {addLoading && newUploadProgress > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Uploading...</span>
                                <span>{newUploadProgress}%</span>
                              </div>
                              <Progress value={newUploadProgress} className="h-2" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <RichTextEditor
                      value={newValue || ""}
                      onChange={(value) => setNewValue(value)}
                      placeholder="Ketik teks di sini... Gunakan toolbar untuk memformat teks (bold, italic, dll)"
                      className="w-full"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={3}
                  placeholder="Deskripsi setting"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setNewKey("")
                  setNewValue("")
                  setNewDescription("")
                  setAddError(null)
                }}
                disabled={addLoading}
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleAddSetting}
                disabled={addLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {addLoading ? 'Menyimpan...' : 'Simpan Setting'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Setting Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsEditModalOpen(false)
            setEditingId(null)
            setEditKey("")
            setEditValue("")
            setEditDescription("")
            setEditIsImageMode(false)
            setEditImage(null)
            setEditImagePreview("")
            setEditError(null)
            setEditUploadProgress(0)
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Edit Setting</DialogTitle>
            </DialogHeader>
            
            {editError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {editError}
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
              {/* Key */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Key *</label>
                <input
                  type="text"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="site_name"
                  required
                />
                <p className="text-gray-400 text-xs mt-1">Key unik untuk setting (contoh: site_name, contact_email)</p>
              </div>

              {/* Value */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Value</label>
                <p className="text-gray-400 text-xs mb-2">Dapat menggunakan HTML: &lt;p&gt;, &lt;h1&gt;, &lt;h2&gt;, &lt;span&gt;, &lt;div&gt;, dll</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditIsImageMode(false)
                        setEditImage(null)
                        setEditImagePreview("")
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors flex-1 ${
                        !editIsImageMode 
                          ? 'bg-[#EE6A28] text-white' 
                          : 'bg-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Type size={16} />
                      Teks
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditIsImageMode(true)
                        setEditValue("")
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors flex-1 ${
                        editIsImageMode 
                          ? 'bg-[#EE6A28] text-white' 
                          : 'bg-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <ImageIcon size={16} />
                      Foto/Video
                    </button>
                  </div>
                  {editIsImageMode ? (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                        id="edit-image-input"
                      />
                      <label
                        htmlFor="edit-image-input"
                        className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white hover:bg-slate-700 transition-colors"
                      >
                        <Upload size={18} />
                        {editImage ? 'Ganti Foto/Video' : 'Upload Foto/Video'}
                      </label>
                      {editImagePreview && (
                        <div className="mt-2">
                          {editImage?.type.startsWith('video/') ? (
                            <video
                              src={editImagePreview}
                              controls
                              className="w-full max-h-96 rounded border border-slate-700"
                            >
                              Browser Anda tidak mendukung video tag.
                            </video>
                          ) : (
                            <img
                              src={editImagePreview}
                              alt="Preview"
                              className="w-full max-h-96 object-contain rounded border border-slate-700"
                            />
                          )}
                        </div>
                      )}
                      {editImage && (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs text-gray-400">
                            Format nama file: {editingId}_{editKey}_index
                          </p>
                          <p className="text-xs text-gray-400">
                            Ukuran: {(editImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {editLoading && editUploadProgress > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Uploading...</span>
                                <span>{editUploadProgress}%</span>
                              </div>
                              <Progress value={editUploadProgress} className="h-2" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <RichTextEditor
                      value={editValue || ""}
                      onChange={(value) => setEditValue(value)}
                      placeholder="Ketik teks di sini... Gunakan toolbar untuk memformat teks (bold, italic, dll)"
                      className="w-full"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={3}
                  placeholder="Deskripsi setting"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingId(null)
                  setEditKey("")
                  setEditValue("")
                  setEditDescription("")
                  setEditIsImageMode(false)
                  setEditImage(null)
                  setEditImagePreview("")
                  setEditError(null)
                }}
                disabled={editLoading}
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <AdminAuthCheck>
      <SidebarProvider>
        <AdminSettingsContent />
      </SidebarProvider>
    </AdminAuthCheck>
  )
}

