"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { supabase } from "@/lib/supabase"
import { Edit, Trash2, Eye, Power, Copy, Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Ride {
  id: string
  title: string
  tags: string[]
  final_price: number
  original_price: number
  type: 'group' | 'personal'
  difficulty_level: string | null
  location: string | null
  is_active: boolean
  created_at: string
}

export default function AdminRidesPage() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Duplicate state
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [selectedRides, setSelectedRides] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setRides(data || [])
    } catch (err: any) {
      console.error('Error fetching rides:', err)
      setError(err.message || 'Gagal memuat data rides')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('rides')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      // Refresh data
      fetchRides()
    } catch (err: any) {
      console.error('Error updating ride:', err)
      alert('Gagal mengupdate status ride: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ride ini?')) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('rides')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Refresh data
      fetchRides()
    } catch (err: any) {
      console.error('Error deleting ride:', err)
      alert('Gagal menghapus ride: ' + err.message)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleToggleDuplicateMode = () => {
    setIsDuplicateMode(!isDuplicateMode)
    setSelectedRides(new Set())
  }

  const handleToggleSelectRide = (rideId: string) => {
    const newSelected = new Set(selectedRides)
    if (newSelected.has(rideId)) {
      newSelected.delete(rideId)
    } else {
      newSelected.add(rideId)
    }
    setSelectedRides(newSelected)
  }

  const handleDuplicateSelected = async () => {
    if (selectedRides.size === 0) {
      alert('Pilih setidaknya satu ride untuk diduplikasi')
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menduplikasi ${selectedRides.size} ride?`)) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const ridesToDuplicate = rides.filter(r => selectedRides.has(r.id))
      
      for (const ride of ridesToDuplicate) {
        // Fetch all ride data including related tables
        const { data: fullRideData, error: fetchError } = await supabase
          .from('rides')
          .select('*')
          .eq('id', ride.id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        // Insert new ride with modified title
        const { data: newRide, error: insertError } = await supabase
          .from('rides')
          .insert({
            title: `${fullRideData.title} (Copy)`,
            tags: fullRideData.tags || null,
            short_description: fullRideData.short_description || null,
            description: fullRideData.description || null,
            primary_picture: fullRideData.primary_picture || null,
            secondary_picture: fullRideData.secondary_picture || null,
            original_price: fullRideData.original_price,
            final_price: fullRideData.final_price,
            type: fullRideData.type,
            duration: fullRideData.duration || null,
            location: fullRideData.location || null,
            meeting_point: fullRideData.meeting_point || null,
            difficulty_level: fullRideData.difficulty_level || null,
            whatsapp_message: fullRideData.whatsapp_message || null,
            is_active: fullRideData.is_active
          })
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        // Duplicate ride_infos
        const { data: rideInfos, error: infosError } = await supabase
          .from('ride_infos')
          .select('*')
          .eq('ride_id', ride.id)
          .order('display_order', { ascending: true })

        if (infosError) {
          throw infosError
        }

        if (rideInfos && rideInfos.length > 0) {
          const newInfos = rideInfos.map(info => ({
            ride_id: newRide.id,
            icon: info.icon,
            question: info.question,
            answer: info.answer,
            display_order: info.display_order
          }))

          const { error: insertInfosError } = await supabase
            .from('ride_infos')
            .insert(newInfos)

          if (insertInfosError) {
            throw insertInfosError
          }
        }

        // Duplicate ride_gallery_photos
        const { data: galleryPhotos, error: galleryError } = await supabase
          .from('ride_gallery_photos')
          .select('*')
          .eq('ride_id', ride.id)
          .order('display_order', { ascending: true })

        if (galleryError) {
          throw galleryError
        }

        if (galleryPhotos && galleryPhotos.length > 0) {
          const newPhotos = galleryPhotos.map(photo => ({
            ride_id: newRide.id,
            photo_url: photo.photo_url,
            alt_text: photo.alt_text,
            display_order: photo.display_order
          }))

          const { error: insertPhotosError } = await supabase
            .from('ride_gallery_photos')
            .insert(newPhotos)

          if (insertPhotosError) {
            throw insertPhotosError
          }
        }
      }

      // Refresh data
      fetchRides()
      setIsDuplicateMode(false)
      setSelectedRides(new Set())
      alert(`${ridesToDuplicate.length} ride berhasil diduplikasi`)
    } catch (err: any) {
      console.error('Error duplicating rides:', err)
      alert('Gagal menduplikasi ride: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <AdminAuthCheck>
      <div className="bg-slate-950 min-h-screen">
        <AdminSidebar />
        <div className="lg:ml-64">
          <AdminNavbar />
          <main className="p-6 lg:p-8 px-[30px]" style={{ paddingTop: '100px' }}>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-white text-2xl sm:text-3xl font-bold">Rides</h1>
              <div className="flex flex-wrap gap-2">
                {isDuplicateMode && (
                  <>
                    <button
                      onClick={handleDuplicateSelected}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                    >
                      <Check size={16} />
                      <span className="hidden sm:inline">Duplikasi ({selectedRides.size})</span>
                      <span className="sm:hidden">({selectedRides.size})</span>
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
              <a
                href="/admin/add-rides"
                className="bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
              >
                <span className="text-lg sm:text-base">+</span>
                <span className="hidden sm:inline">Tambah Ride</span>
                <span className="sm:hidden">Tambah</span>
              </a>
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
            ) : rides.length === 0 ? (
              <div className="bg-slate-900 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Rides</h3>
                  <p className="text-gray-400 mb-6">
                    Database rides masih kosong. Tambahkan ride pertama Anda untuk memulai!
                  </p>
                  <a
                    href="/admin/add-rides"
                    className="inline-block bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-3 px-6 rounded transition-colors"
                  >
                    + Tambah Ride Pertama
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
                              checked={selectedRides.size === rides.length && rides.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedRides(new Set(rides.map(r => r.id)))
                                } else {
                                  setSelectedRides(new Set())
                                }
                              }}
                            />
                          </th>
                        )}
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white">Title</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden lg:table-cell">Tags</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white">Price</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden md:table-cell">Type</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden xl:table-cell">Difficulty</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden xl:table-cell">Location</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden md:table-cell">Created</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {rides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-slate-800/50 transition-colors">
                          {isDuplicateMode && (
                            <td className="px-2 sm:px-4 py-3 text-center">
                              <Checkbox
                                checked={selectedRides.has(ride.id)}
                                onCheckedChange={() => handleToggleSelectRide(ride.id)}
                              />
                            </td>
                          )}
                          <td className="px-2 sm:px-4 py-3 text-sm text-white font-medium">
                            {ride.title}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {ride.tags && ride.tags.length > 0 ? (
                                ride.tags.slice(0, 3).map((tag, idx) => (
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
                              {ride.tags && ride.tags.length > 3 && (
                                <span className="text-gray-400 text-xs">+{ride.tags.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-white">
                            <div className="flex flex-col">
                              <span className="text-[#EE6A28] font-semibold">
                                {formatPrice(ride.final_price)}
                              </span>
                              {ride.original_price > ride.final_price && (
                                <span className="text-gray-400 text-xs line-through">
                                  {formatPrice(ride.original_price)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm hidden md:table-cell">
                            <span className={`px-2 py-1 text-xs rounded ${
                              ride.type === 'group' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              {ride.type}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-300 hidden xl:table-cell">
                            {ride.difficulty_level || '-'}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-300 hidden xl:table-cell">
                            {ride.location || '-'}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-400 hidden md:table-cell">
                            {formatDate(ride.created_at)}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => handleToggleActive(ride.id, ride.is_active)}
                                className={`p-1 sm:p-1.5 rounded transition-colors ${
                                  ride.is_active
                                    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/20'
                                }`}
                                title={ride.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                              >
                                <Power size={16} className={ride.is_active ? '' : 'opacity-50'} />
                              </button>
                              <button
                                onClick={() => window.location.href = `/admin/edit-rides/${ride.id}`}
                                className="p-1 sm:p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(ride.id)}
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
      </div>
    </AdminAuthCheck>
  )
}
