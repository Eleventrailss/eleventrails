"use client"

import { useEffect } from "react"
import { getGeneralSetting } from "@/lib/general-settings"

export default function FaviconUpdater() {
  useEffect(() => {
    const updateFavicon = async () => {
      const logoUrl = await getGeneralSetting('apps_logo')
      if (logoUrl) {
        // Remove existing favicons
        const existingLinks = document.querySelectorAll("link[rel*='icon']")
        existingLinks.forEach(link => link.remove())

        // Create new favicon link
        const link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/png'
        link.href = logoUrl
        document.head.appendChild(link)

        // Also add apple-touch-icon
        const appleLink = document.createElement('link')
        appleLink.rel = 'apple-touch-icon'
        appleLink.href = logoUrl
        document.head.appendChild(appleLink)
      }
    }

    updateFavicon()
  }, [])

  return null
}

