"use client"

import AdminProfile from "./admin-profile"

export default function AdminNavbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-4 fixed top-0 right-0 left-0 lg:left-64" style={{ zIndex: 45 }}>
      <div className="flex items-center justify-end lg:justify-between">
        <div className="hidden lg:block">
          <h2 className="text-white text-lg font-semibold">Dashboard</h2>
          <p className="text-gray-400 text-sm">Selamat datang kembali</p>
        </div>
        <AdminProfile />
      </div>
    </nav>
  )
}

