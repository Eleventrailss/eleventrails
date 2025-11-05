"use client"

import { Menu, ExternalLink } from "lucide-react"
import { useSidebar } from "./sidebar-context"
import { useEffect, useRef, useState } from "react"
import { getCookie } from "@/lib/cookies"

export default function AdminNavbar() {
  const { isCollapsed, toggleSidebar, toggleMobileSidebar } = useSidebar()
  const navRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const adminEmail = getCookie('admin_email')
    if (adminEmail) {
      setEmail(adminEmail)
    }
  }, [])

  useEffect(() => {
    const updateNavbarWidth = () => {
      if (navRef.current) {
        // Di mobile, navbar selalu full width karena sidebar adalah overlay
        if (isMobile) {
          navRef.current.style.left = '0'
          navRef.current.style.right = '0'
          navRef.current.style.width = '100vw'
        } else {
          // Desktop: tergantung collapsed state
          if (isCollapsed) {
            const sidebarWidth = 64 // 4rem = 64px ketika collapsed
            navRef.current.style.left = `${sidebarWidth}px`
            navRef.current.style.right = '0'
            navRef.current.style.width = `calc(100vw - ${sidebarWidth}px)`
          } else {
            const sidebarWidth = 256 // 16rem = 256px
            navRef.current.style.left = `${sidebarWidth}px`
            navRef.current.style.right = '0'
            navRef.current.style.width = `calc(100vw - ${sidebarWidth}px)`
          }
        }
      }
    }
    updateNavbarWidth()
    window.addEventListener('resize', updateNavbarWidth)
    return () => window.removeEventListener('resize', updateNavbarWidth)
  }, [isCollapsed, isMobile])

  return (
    <nav 
      ref={navRef}
      className="bg-slate-800 border-b border-slate-700 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 fixed top-0 transition-all duration-300" 
      style={{ 
        zIndex: 49,
        left: isMobile ? '0' : (isCollapsed ? '4rem' : '16rem'),
        right: '0',
        width: isMobile ? '100vw' : (isCollapsed ? 'calc(100vw - 4rem)' : 'calc(100vw - 16rem)'),
        paddingRight: '30px'
      }}
    >
      <div className="flex items-center justify-between h-full w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4">
          <button
            onClick={toggleSidebar}
            className="p-1.5 sm:p-2 hover:bg-slate-700 rounded transition-colors lg:block hidden"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={18} className="sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={toggleMobileSidebar}
            className="p-1.5 sm:p-2 hover:bg-slate-700 rounded transition-colors lg:hidden"
            title="Toggle sidebar"
          >
            <Menu size={18} className="sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4">
          <button
            onClick={() => {
              const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
              window.open(siteUrl, '_blank', 'noopener,noreferrer')
            }}
            className="p-1.5 sm:p-2 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5 sm:gap-2 text-white"
            title="Lihat Web"
          >
            <ExternalLink size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-sm sm:text-base font-medium">Lihat Web</span>
          </button>
          {email && (
            <span className="text-white text-sm sm:text-base font-medium truncate max-w-[200px] sm:max-w-none">
              {email}
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}
