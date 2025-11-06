"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ArrowUp } from "lucide-react"
import { getGeneralSetting } from "@/lib/general-settings"

export default function PlanYourRideButton() {
  const pathname = usePathname()
  const [whatsappMessage, setWhatsappMessage] = useState("Plan your ride with ElevenTrails!")
  const [whatsappNumber, setWhatsappNumber] = useState("6282266007272")
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin')

  const fetchWhatsappSettings = async () => {
    try {
      const [message, number] = await Promise.all([
        getGeneralSetting('plan_your_ride_whatsapp_message'),
        getGeneralSetting('whatsapp_number')
      ])

      if (message) {
        setWhatsappMessage(message)
      }

      if (number) {
        setWhatsappNumber(number)
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error)
    }
  }

  useEffect(() => {
    // Only show on client pages
    if (isAdminPage) {
      setIsVisible(false)
      setShowScrollTop(false)
      return
    }

    fetchWhatsappSettings()
    
    // Show button after component mounts
    setIsVisible(true)

    // Handle scroll to show/hide scroll to top button
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setShowScrollTop(scrollTop > 300) // Show button after scrolling 300px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname, isAdminPage])

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Don't render on admin pages
  if (isAdminPage || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[9999] flex flex-row gap-2 items-start">
      {/* Plan Your Ride Button */}
      <button
        onClick={handleClick}
        className="bg-[#EE6A28] hover:bg-[#d85a20] active:bg-[#c54a10] text-white font-bold transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-black"
        style={{
          width: '190px',
          height: '35px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '14px',
          cursor: 'pointer',
          borderRadius: '0'
        }}
        aria-label="Plan Your Ride"
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path 
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" 
            fill="white"
          />
        </svg>
        Plan Your Ride
      </button>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="bg-white hover:bg-gray-100 active:bg-gray-200 transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center border border-black"
          style={{
            width: '35px',
            height: '35px',
            cursor: 'pointer',
            borderRadius: '0'
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="text-[#EE6A28]" />
        </button>
      )}
    </div>
  )
}

