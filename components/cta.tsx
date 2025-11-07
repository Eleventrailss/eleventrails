"use client"

import { useState, useEffect } from "react"
import { getGeneralSetting } from "@/lib/general-settings"

export default function CTA() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6282266007272"
  const [whatsappMessage, setWhatsappMessage] = useState("Hi%2C%20I%20would%20like%20to%20plan%20my%20ride%20with%20ElevenTrails%21")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
  
  useEffect(() => {
    fetchWhatsappMessage()
  }, [])

  const fetchWhatsappMessage = async () => {
    const message = await getGeneralSetting('whatsapp_message_contact_us')
    if (message) {
      setWhatsappMessage(encodeURIComponent(message))
    }
  }

  return (
    <section className="bg-orange-500 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 
            className="text-white text-center lg:text-left"
            style={{
              fontFamily: 'Rubik One, sans-serif',
              fontSize: 'clamp(32px, 6vw, 64px)',
              fontWeight: 400
            }}
          >
            PLAN YOUR <span className="text-slate-950">RIDE</span>
          </h2>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-100 text-orange-500 px-6 sm:px-8 py-2 sm:py-3 rounded-none font-bold text-base sm:text-lg transition w-full sm:w-auto scale-80 sm:scale-100"
            style={{ textDecoration: 'none' }}
          >
            CONTACT US
          </a>
        </div>
      </div>
    </section>
  )
}
