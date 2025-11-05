"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminAuthCheck from "@/components/admin/admin-auth-check"
import { SidebarProvider } from "@/components/admin/sidebar-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

function MigrateContent() {
  const [migrating, setMigrating] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [scannedFiles, setScannedFiles] = useState<Array<{ publicPath: string; storagePath: string }>>([])
  const [scanAll, setScanAll] = useState(true)
  const [filesScanned, setFilesScanned] = useState(0)
  const [scanBreakdown, setScanBreakdown] = useState<any>(null)

  // Default files untuk migrasi manual (jika scanAll = false)
  const defaultFilesToMigrate = [
    { publicPath: '/hero-bg.png', storagePath: 'static/hero-bg.png' },
    { publicPath: '/hero-bg-tr.png', storagePath: 'static/hero-bg-tr.png' },
    { publicPath: '/hero-pic-obj.png', storagePath: 'static/hero-pic-obj.png' },
    { publicPath: '/explore-top.png', storagePath: 'static/explore-top.png' },
    { publicPath: '/placeholder.svg', storagePath: 'static/placeholder.svg' },
    { publicPath: '/placeholder.jpg', storagePath: 'static/placeholder.jpg' },
    { publicPath: '/placeholder-logo.png', storagePath: 'static/placeholder-logo.png' },
    { publicPath: '/placeholder-logo.svg', storagePath: 'static/placeholder-logo.svg' },
    { publicPath: '/placeholder-user.jpg', storagePath: 'static/placeholder-user.jpg' },
  ]

  const handleScan = async () => {
    setScanning(true)
    setScannedFiles([])
    setFilesScanned(0)

    try {
      const response = await fetch('/api/migrate-public-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanAll: true,
          baseUrl: window.location.origin
        })
      })

      const data = await response.json()

      if (data.success) {
        // Set scanned files untuk preview sebelum migrate
        const fileList = data.results || []
        setScannedFiles(fileList)
        setFilesScanned(data.filesScanned || fileList.length)
        setScanBreakdown(data.breakdown || null)
        
        const breakdownMsg = data.breakdown 
          ? ` (Root: ${data.breakdown.root}, Subfolders: ${data.breakdown.subfolders})`
          : ''
        alert(`Scan completed! Found ${data.filesScanned || fileList.length} image/video files ready to migrate.${breakdownMsg}`)
      } else {
        alert('Scan failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error: any) {
      alert('Scan error: ' + error.message)
    } finally {
      setScanning(false)
    }
  }

  const handleMigrate = async () => {
    if (!confirm('Apakah Anda yakin ingin melakukan migrasi file? Proses ini akan mengupload file ke Supabase Storage.')) {
      return
    }

    setMigrating(true)
    setResults([])
    setSummary(null)

    try {
      const filesToMigrate = scanAll ? scannedFiles : defaultFilesToMigrate
      
      if (filesToMigrate.length === 0) {
        alert('Tidak ada file untuk di-migrate. Silakan scan file terlebih dahulu jika menggunakan mode scan all.')
        setMigrating(false)
        return
      }

      const response = await fetch('/api/migrate-public-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: filesToMigrate,
          scanAll: false, // Explicitly set false untuk migrate
          baseUrl: window.location.origin
        })
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        setSummary(data.summary)
        alert(`Migration completed! Success: ${data.summary.success}, Failed: ${data.summary.failed}`)
      } else {
        alert('Migration failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error: any) {
      alert('Migration error: ' + error.message)
    } finally {
      setMigrating(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Migrate Public Files to Supabase Storage</h1>
              <p className="text-gray-400 text-sm">
                Migrate semua file dari public folder ke Supabase Storage bucket untuk memudahkan update file di masa depan
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Migration Mode</h2>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="scanAll" 
                  checked={scanAll}
                  onCheckedChange={(checked) => setScanAll(checked as boolean)}
                />
                <label htmlFor="scanAll" className="text-white text-sm cursor-pointer">
                  Scan semua file di public folder (Recommended)
                </label>
              </div>

              {scanAll ? (
                <div className="mb-4">
                  <div className="flex gap-2 mb-4">
                    <Button 
                      onClick={handleScan}
                      disabled={scanning}
                      variant="outline"
                      className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                    >
                      {scanning ? 'Scanning...' : 'Scan Files'}
                    </Button>
                  </div>
                  
                  {filesScanned > 0 && (
                    <div className="mb-4 p-3 bg-slate-700 rounded">
                      <p className="text-white text-sm mb-2">
                        ✅ Found <span className="font-bold">{filesScanned}</span> image/video files to migrate
                      </p>
                      {scanBreakdown && (
                        <div className="text-xs text-gray-300 mt-2 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>• Root folder: {scanBreakdown.root} files</div>
                            <div>• Subfolders: {scanBreakdown.subfolders} files</div>
                          </div>
                          
                          {scanBreakdown.perFolder && Object.keys(scanBreakdown.perFolder).length > 0 && (
                            <div className="mt-3 pt-2 border-t border-slate-600">
                              <p className="text-gray-400 mb-2 font-semibold">Ringkasan per folder:</p>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {Object.entries(scanBreakdown.perFolder)
                                  .sort(([a], [b]) => {
                                    // Sort: root first, then alphabetically
                                    if (a === '/' && b !== '/') return -1
                                    if (a !== '/' && b === '/') return 1
                                    return a.localeCompare(b)
                                  })
                                  .map(([folder, count]) => (
                                    <div key={folder} className="flex justify-between items-center">
                                      <span className="text-gray-300">
                                        {folder === '/' ? '📁 Root (/)' : `📁 ${folder}`}
                                      </span>
                                      <span className="text-orange-400 font-semibold">{count as number} file</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-gray-400 mt-2 text-xs pt-2 border-t border-slate-600">
                            Note: Hanya file foto/video yang di-scan. Folder general_setting/ juga di-migrate karena akan bisa di add/edit/delete.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {scannedFiles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">
                        Files akan di-migrate ({scannedFiles.length} files):
                      </p>
                      <div className="max-h-60 overflow-y-auto border border-slate-700 rounded p-3">
                        <ul className="space-y-1 text-sm text-gray-300">
                          {scannedFiles.map((file, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{file.publicPath}</span>
                              <span className="text-gray-500">→</span>
                              <span className="text-gray-400">{file.storagePath}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">
                    Files akan di-migrate ({defaultFilesToMigrate.length} files):
                  </p>
                  <div className="max-h-60 overflow-y-auto border border-slate-700 rounded p-3">
                    <ul className="space-y-1 text-sm text-gray-300">
                      {defaultFilesToMigrate.map((file, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{file.publicPath}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-gray-400">{file.storagePath}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleMigrate} 
                disabled={migrating || (scanAll && scannedFiles.length === 0)}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {migrating ? 'Migrating...' : 'Start Migration'}
              </Button>

              {scanAll && scannedFiles.length === 0 && !scanning && (
                <p className="text-yellow-400 text-sm mt-2">
                  ⚠️ Silakan scan file terlebih dahulu sebelum melakukan migrasi
                </p>
              )}
            </div>

            {summary && (
              <div className="bg-slate-800 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Migration Summary</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{summary.total}</div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{summary.success}</div>
                    <div className="text-sm text-gray-400">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{summary.failed}</div>
                    <div className="text-sm text-gray-400">Failed</div>
                  </div>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Migration Results</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded border ${
                        result.url 
                          ? 'bg-green-900/20 border-green-700' 
                          : 'bg-red-900/20 border-red-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{result.url ? '✅' : '❌'}</span>
                        <span className="text-white font-medium">{result.publicPath}</span>
                      </div>
                      {result.url ? (
                        <div className="text-xs text-gray-400 mt-1 break-all pl-7">
                          {result.url}
                        </div>
                      ) : (
                        <div className="text-xs text-red-400 mt-1 break-all pl-7">
                          Error: {result.error || 'Unknown error'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function MigratePage() {
  return (
    <AdminAuthCheck>
      <SidebarProvider>
        <MigrateContent />
      </SidebarProvider>
    </AdminAuthCheck>
  )
}



