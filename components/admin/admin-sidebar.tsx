"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  PlusCircle, 
  BookOpen, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      href: "/admin/rides",
      label: "Rides",
      icon: LayoutDashboard,
      active: pathname === "/admin/rides"
    },
    {
      href: "/admin/add-rides",
      label: "Add Rides",
      icon: PlusCircle,
      active: pathname === "/admin/add-rides"
    },
    {
      href: "/admin/stories",
      label: "Stories",
      icon: BookOpen,
      active: pathname === "/admin/stories"
    }
  ]

  const handleLogout = () => {
    // Delete cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'admin_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
      document.cookie = 'admin_email=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
    }
    window.location.href = "/admin/login"
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-[#EE6A28] text-white rounded"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2 className="text-white text-lg font-semibold">Dashboard</h2>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 w-64 bg-slate-900 text-white transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          lg:top-0
          lg:bottom-0
          lg:h-full
        `}
        style={{ 
          zIndex: 48,
          top: '72px',
          bottom: 0
        }}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <h1 className="font-bold text-xl" style={{color:'#EE6A28'}}>ElevenTrails</h1>
            <span className="text-xs text-gray-400">Admin</span>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${item.active 
                      ? "bg-[#EE6A28] text-white" 
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed"
          style={{ 
            zIndex: 44,
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        />
      )}
    </>
  )
}

