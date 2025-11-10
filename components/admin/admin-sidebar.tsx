"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings,
  HelpCircle,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Users
} from "lucide-react"
import { useState, useEffect } from "react"
import { useSidebar } from "./sidebar-context"
import { getGeneralSetting } from "@/lib/general-settings"
import { getSupabaseImageUrl } from "@/lib/supabase-storage"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchLogo()
  }, [])

  const fetchLogo = async () => {
    const logo = await getGeneralSetting('apps_logo')
    if (logo) {
      setLogoUrl(getSupabaseImageUrl(logo))
    }
  }

  const menuItems = [
    {
      href: "/admin/rides",
      label: "Rides",
      icon: LayoutDashboard,
      active: pathname === "/admin/rides"
    },
    {
      href: "/admin/stories",
      label: "Stories",
      icon: BookOpen,
      active: pathname === "/admin/stories"
    },
    {
      href: "/admin/customers",
      label: "Prospect Customer",
      icon: Users,
      active: pathname === "/admin/customers"
    },
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      icon: MessageSquare,
      active: pathname === "/admin/testimonials"
    },
    {
      href: "/admin/faq",
      label: "FAQ",
      icon: HelpCircle,
      active: pathname === "/admin/faq"
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/admin/settings"
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
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 bg-slate-900 text-white transform transition-all duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          top-0
          lg:top-0
          bottom-0
          w-64
          ${isCollapsed ? "lg:w-16" : "lg:w-64"}
        `}
        style={{ 
          zIndex: 48,
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        <div className={`p-4 ${isCollapsed ? 'lg:p-2' : 'lg:p-6'} h-full flex flex-col`}>
          <div className={`mb-6 lg:mb-8 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <h1 className="font-bold text-lg lg:text-xl text-white flex items-center gap-2">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="ElevenTrails Logo" 
                  className="h-6 lg:h-7 w-auto object-contain"
                  style={{ width: '120px', height: '55px', objectFit: 'contain' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              )}
              <span className="text-gray-400 text-xs lg:text-sm">Admin</span>
            </h1>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center ${isCollapsed ? 'lg:justify-center' : ''} ${isCollapsed ? 'lg:px-2 lg:gap-0' : 'lg:px-4'} px-3 gap-3 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base
                    ${item.active 
                      ? "bg-[#EE6A28] text-white" 
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={18} className="lg:w-5 lg:h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <button
            onClick={handleLogout}
            className={`mt-4 lg:mt-8 w-full flex items-center ${isCollapsed ? 'lg:justify-center' : ''} ${isCollapsed ? 'lg:px-2 lg:gap-0' : 'lg:px-4'} px-3 gap-3 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors text-sm lg:text-base`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={18} className="lg:w-5 lg:h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm"
          style={{ 
            zIndex: 47,
            top: 0
          }}
        />
      )}
    </>
  )
}

