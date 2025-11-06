"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { SidebarProvider, useSidebar } from "@/components/admin/sidebar-context"
import { supabase } from "@/lib/supabase"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Pagination from "@/components/admin/pagination"

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  information_from: string | null
  created_at: string
  updated_at: string
}

function AdminCustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isCollapsed } = useSidebar()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('customer')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setCustomers(data || [])
    } catch (err: any) {
      console.error('Error fetching customers:', err)
      setError(err.message || 'Gagal memuat data customer')
    } finally {
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

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return '-'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer)
    setIsViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewingCustomer(null)
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        <AdminNavbar />
        <main className="p-6 lg:p-8 px-[30px] pt-24 lg:pt-8" style={{ paddingTop: '100px' }}>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-white text-2xl sm:text-3xl font-bold">Prospect Customer</h1>
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
          ) : customers.length === 0 ? (
            <div className="bg-slate-900 rounded-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Prospect Customer</h3>
                <p className="text-gray-400">
                  Belum ada customer yang mengisi form kontak.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden md:table-cell">Email</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden lg:table-cell">Phone</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden xl:table-cell">Message</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden md:table-cell">Information From</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white hidden lg:table-cell">Created At</th>
                        <th className="px-2 sm:px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-2 sm:px-4 py-3 text-sm text-white font-medium">
                            {customer.name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-300 hidden md:table-cell">
                            {customer.email}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-300 hidden lg:table-cell">
                            {customer.phone || '-'}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-300 max-w-xs hidden xl:table-cell">
                            {truncateText(customer.message)}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm hidden md:table-cell">
                            {customer.information_from ? (
                              <span className="px-2 py-1 text-xs rounded bg-[#EE6A28]/20 text-[#EE6A28]">
                                {customer.information_from}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">
                            {formatDate(customer.created_at)}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => handleViewCustomer(customer)}
                                className="p-1 sm:p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(customers.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={customers.length}
                />
              </div>
            </div>
          )}
        </main>

        {/* View Customer Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={(open) => {
          if (!open) {
            handleCloseViewModal()
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Customer Details</DialogTitle>
            </DialogHeader>
            
            {viewingCustomer && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Name</label>
                  <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white">
                    {viewingCustomer.name}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Email</label>
                  <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white">
                    {viewingCustomer.email}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Phone Number</label>
                  <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white">
                    {viewingCustomer.phone || '-'}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">How did you hear about us?</label>
                  <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white">
                    {viewingCustomer.information_from || '-'}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Message</label>
                  <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white min-h-[100px] whitespace-pre-wrap">
                    {viewingCustomer.message || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Created At</label>
                    <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm">
                      {formatDate(viewingCustomer.created_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Updated At</label>
                    <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm">
                      {formatDate(viewingCustomer.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function AdminCustomersPage() {
  return (
    <AdminAuthCheck>
      <SidebarProvider>
        <AdminCustomersContent />
      </SidebarProvider>
    </AdminAuthCheck>
  )
}

