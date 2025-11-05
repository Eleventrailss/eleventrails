"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { SidebarProvider, useSidebar } from "@/components/admin/sidebar-context"
import { supabase } from "@/lib/supabase"
import { Edit, X, Plus, Copy, Check, ArrowUp, ArrowDown, Power } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Pagination from "@/components/admin/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

function AdminFAQContent() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isCollapsed } = useSidebar()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Duplicate state
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [selectedFaqs, setSelectedFaqs] = useState<Set<string>>(new Set())
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuestion, setEditQuestion] = useState("")
  const [editAnswer, setEditAnswer] = useState("")
  const [editDisplayOrder, setEditDisplayOrder] = useState(0)
  const [editIsActive, setEditIsActive] = useState(true)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [newDisplayOrder, setNewDisplayOrder] = useState(0)
  const [newIsActive, setNewIsActive] = useState(true)
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      setFaqs(data || [])
    } catch (err: any) {
      console.error('Error fetching FAQs:', err)
      setError(err.message || 'Failed to load FAQ data')
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = (faq: FAQ) => {
    setEditingId(faq.id)
    setEditQuestion(faq.question)
    setEditAnswer(faq.answer)
    setEditDisplayOrder(faq.display_order)
    setEditIsActive(faq.is_active)
    setEditError(null)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      setEditLoading(true)
      setEditError(null)

      if (!editQuestion.trim()) {
        setEditError("Question is required")
        setEditLoading(false)
        return
      }

      if (!editAnswer.trim()) {
        setEditError("Answer is required")
        setEditLoading(false)
        return
      }

      const { error: updateError } = await supabase
        .from('faqs')
        .update({
          question: editQuestion.trim(),
          answer: editAnswer.trim(),
          display_order: editDisplayOrder,
          is_active: editIsActive
        })
        .eq('id', editingId)

      if (updateError) {
        throw updateError
      }

      // Refresh data
      await fetchFAQs()
      setIsEditModalOpen(false)
      setEditingId(null)
      setEditQuestion("")
      setEditAnswer("")
      setEditDisplayOrder(0)
      setEditIsActive(true)
    } catch (err: any) {
      console.error('Error updating FAQ:', err)
      setEditError(err.message || 'Failed to update FAQ')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Refresh data
      fetchFAQs()
    } catch (err: any) {
      console.error('Error deleting FAQ:', err)
      alert('Failed to delete FAQ: ' + err.message)
    }
  }

  const handleAddFAQ = async () => {
    if (!newQuestion.trim()) {
      setAddError("Question is required")
      return
    }

    if (!newAnswer.trim()) {
      setAddError("Answer is required")
      return
    }

    try {
      setAddLoading(true)
      setAddError(null)

      const { error: insertError } = await supabase
        .from('faqs')
        .insert({
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
          display_order: newDisplayOrder || 0,
          is_active: newIsActive
        })

      if (insertError) {
        throw insertError
      }

      // Refresh data
      await fetchFAQs()
      setIsAddModalOpen(false)
      setNewQuestion("")
      setNewAnswer("")
      setNewDisplayOrder(0)
      setNewIsActive(true)
    } catch (err: any) {
      console.error('Error adding FAQ:', err)
      setAddError(err.message || 'Failed to add FAQ')
    } finally {
      setAddLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('faqs')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      // Refresh data
      fetchFAQs()
    } catch (err: any) {
      console.error('Error updating FAQ status:', err)
      alert('Failed to update FAQ status: ' + err.message)
    }
  }

  const handleMoveOrder = async (id: string, direction: 'up' | 'down') => {
    const currentFAQ = faqs.find(f => f.id === id)
    if (!currentFAQ) return

    const sortedFAQs = [...faqs].sort((a, b) => a.display_order - b.display_order)
    const currentIndex = sortedFAQs.findIndex(f => f.id === id)
    
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === sortedFAQs.length - 1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const targetFAQ = sortedFAQs[targetIndex]

    // Swap display orders
    try {
      await supabase
        .from('faqs')
        .update({ display_order: targetFAQ.display_order })
        .eq('id', currentFAQ.id)
      
      await supabase
        .from('faqs')
        .update({ display_order: currentFAQ.display_order })
        .eq('id', targetFAQ.id)

      // Refresh data
      fetchFAQs()
    } catch (err: any) {
      console.error('Error moving FAQ order:', err)
      alert('Failed to move FAQ order: ' + err.message)
    }
  }

  const handleToggleDuplicateMode = () => {
    setIsDuplicateMode(!isDuplicateMode)
    setSelectedFaqs(new Set())
  }

  const handleToggleSelectFAQ = (faqId: string) => {
    const newSelected = new Set(selectedFaqs)
    if (newSelected.has(faqId)) {
      newSelected.delete(faqId)
    } else {
      newSelected.add(faqId)
    }
    setSelectedFaqs(newSelected)
  }

  const handleDuplicateSelected = async () => {
    if (selectedFaqs.size === 0) {
      alert('Please select at least one FAQ to duplicate')
      return
    }

    if (!confirm(`Are you sure you want to duplicate ${selectedFaqs.size} FAQ(s)?`)) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const faqsToDuplicate = faqs.filter(f => selectedFaqs.has(f.id))
      
      for (const faq of faqsToDuplicate) {
        const { error: insertError } = await supabase
          .from('faqs')
          .insert({
            question: `${faq.question} (Copy)`,
            answer: faq.answer,
            display_order: faq.display_order,
            is_active: faq.is_active
          })

        if (insertError) {
          throw insertError
        }
      }

      // Refresh data
      await fetchFAQs()
      setIsDuplicateMode(false)
      setSelectedFaqs(new Set())
      alert(`${faqsToDuplicate.length} FAQ(s) successfully duplicated`)
    } catch (err: any) {
      console.error('Error duplicating FAQs:', err)
      alert('Failed to duplicate FAQs: ' + err.message)
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  return (
    <div className="bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        <AdminNavbar />
        <main className="p-6 lg:p-8 px-[30px]" style={{ paddingTop: '100px' }}>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-white text-2xl sm:text-3xl font-bold">FAQ Management</h1>
            <div className="flex flex-wrap gap-2">
              {isDuplicateMode && (
                <>
                  <button
                    onClick={handleDuplicateSelected}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                  >
                    <Check size={16} />
                    <span className="hidden sm:inline">Duplicate ({selectedFaqs.size})</span>
                    <span className="sm:hidden">({selectedFaqs.size})</span>
                  </button>
                  <button
                    onClick={handleToggleDuplicateMode}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              )}
              {!isDuplicateMode && (
                <button
                  onClick={handleToggleDuplicateMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                >
                  <Copy size={16} />
                  <span className="hidden sm:inline">Duplicate</span>
                </button>
              )}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-2 px-2 sm:px-4 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add FAQ</span>
                <span className="sm:hidden">Add</span>
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
              <p className="text-gray-400">Loading data...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-slate-900 rounded-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No FAQs Yet</h3>
                <p className="text-gray-400 mb-6">
                  The FAQ database is empty. Add your first FAQ to get started!
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-block bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-3 px-6 rounded transition-colors"
                >
                  + Add First FAQ
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
                            checked={selectedFaqs.size === faqs.length && faqs.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFaqs(new Set(faqs.map(f => f.id)))
                              } else {
                                setSelectedFaqs(new Set())
                              }
                            }}
                          />
                        </TableHead>
                      )}
                      <TableHead className="text-white w-16">Order</TableHead>
                      <TableHead className="text-white">Question</TableHead>
                      <TableHead className="text-white hidden md:table-cell">Answer</TableHead>
                      <TableHead className="text-white hidden lg:table-cell">Updated</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((faq, index) => {
                      const sortedFAQs = [...faqs].sort((a, b) => a.display_order - b.display_order)
                      const currentIndex = sortedFAQs.findIndex(f => f.id === faq.id)
                      const canMoveUp = currentIndex > 0
                      const canMoveDown = currentIndex < sortedFAQs.length - 1
                      
                      return (
                        <TableRow key={faq.id} className="hover:bg-slate-800/50">
                          {isDuplicateMode && (
                            <TableCell className="text-center">
                              <Checkbox
                                checked={selectedFaqs.has(faq.id)}
                                onCheckedChange={() => handleToggleSelectFAQ(faq.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell className="text-gray-300">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveOrder(faq.id, 'up')}
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
                              <span className="text-sm font-medium">{faq.display_order}</span>
                              <button
                                onClick={() => handleMoveOrder(faq.id, 'down')}
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
                            <div className="max-w-xs truncate" title={faq.question}>
                              {truncateText(faq.question, 60)}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 hidden md:table-cell">
                            <div className="max-w-md truncate" title={faq.answer}>
                              {truncateText(faq.answer, 100)}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400 hidden lg:table-cell text-sm">
                            {formatDate(faq.updated_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleActive(faq.id, faq.is_active)}
                                className={`p-1 sm:p-1.5 rounded transition-colors ${
                                  faq.is_active
                                    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/20'
                                }`}
                                title={faq.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                              >
                                <Power size={16} className={faq.is_active ? '' : 'opacity-50'} />
                              </button>
                              <button
                                onClick={() => handleStartEdit(faq)}
                                className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(faq.id)}
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
                  totalPages={Math.ceil(faqs.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={faqs.length}
                />
              </div>
            </div>
          )}
        </main>

        {/* Add FAQ Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false)
            setNewQuestion("")
            setNewAnswer("")
            setNewDisplayOrder(0)
            setNewIsActive(true)
            setAddError(null)
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Add New FAQ</DialogTitle>
            </DialogHeader>
            
            {addError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {addError}
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
              {/* Question */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Question *</label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={2}
                  placeholder="Enter the question"
                  required
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Answer *</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={5}
                  placeholder="Enter the answer"
                  required
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Display Order</label>
                <input
                  type="number"
                  value={newDisplayOrder}
                  onChange={(e) => setNewDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  placeholder="0"
                  min="0"
                />
                <p className="text-gray-400 text-xs mt-1">Lower numbers appear first. Leave 0 to add at the end.</p>
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsActive}
                    onChange={(e) => setNewIsActive(e.target.checked)}
                    className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#EE6A28] focus:ring-[#EE6A28]"
                  />
                  <span className="text-white">Active</span>
                </label>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setNewQuestion("")
                  setNewAnswer("")
                  setNewDisplayOrder(0)
                  setNewIsActive(true)
                  setAddError(null)
                }}
                disabled={addLoading}
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddFAQ}
                disabled={addLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {addLoading ? 'Saving...' : 'Save FAQ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit FAQ Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsEditModalOpen(false)
            setEditingId(null)
            setEditQuestion("")
            setEditAnswer("")
            setEditDisplayOrder(0)
            setEditIsActive(true)
            setEditError(null)
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl font-bold">Edit FAQ</DialogTitle>
            </DialogHeader>
            
            {editError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
                {editError}
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
              {/* Question */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Question *</label>
                <textarea
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={2}
                  placeholder="Enter the question"
                  required
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Answer *</label>
                <textarea
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-[#EE6A28]"
                  rows={5}
                  placeholder="Enter the answer"
                  required
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Display Order</label>
                <input
                  type="number"
                  value={editDisplayOrder}
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
            </div>

            <DialogFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingId(null)
                  setEditQuestion("")
                  setEditAnswer("")
                  setEditDisplayOrder(0)
                  setEditIsActive(true)
                  setEditError(null)
                }}
                disabled={editLoading}
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function AdminFAQPage() {
  return (
    <AdminAuthCheck>
      <SidebarProvider>
        <AdminFAQContent />
      </SidebarProvider>
    </AdminAuthCheck>
  )
}

