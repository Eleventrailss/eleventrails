"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { getGeneralSettings } from "@/lib/general-settings"
import { getSupabaseImageUrl } from "@/lib/supabase-storage"

export default function Footer() {
  const [socialUrls, setSocialUrls] = useState({
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "#",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#"
  })
  const [footerDescription, setFooterDescription] = useState("")
  const [address, setAddress] = useState("Central Lombok")
  const [email, setEmail] = useState("eleventrailss@gmail.com")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const settings = await getGeneralSettings([
      'social_facebook_url',
      'social_instagram_url',
      'social_tiktok_url',
      'social_youtube_url',
      'social_email',
      'footer_description',
      'address',
      'apps_logo'
    ])
    
    setSocialUrls(prev => ({
      facebook: settings.social_facebook_url || prev.facebook,
      instagram: settings.social_instagram_url || prev.instagram,
      tiktok: settings.social_tiktok_url || prev.tiktok,
      youtube: settings.social_youtube_url || prev.youtube
    }))
    
    if (settings.social_email) {
      setEmail(settings.social_email)
    }
    if (settings.footer_description) {
      setFooterDescription(settings.footer_description)
    }
    if (settings.address) {
      setAddress(settings.address)
    }
    if (settings.apps_logo) {
      setLogoUrl(getSupabaseImageUrl(settings.apps_logo))
    }
  }
  return (
    <footer className="border-t border-slate-800 py-12 sm:py-16" style={{ backgroundColor: '#373737' }}>
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              {logoUrl && !logoError ? (
                <img 
                  src={logoUrl} 
                  alt="ElevenTrails Logo" 
                  className="h-8 w-auto object-contain"
                  style={{ maxHeight: '32px' }}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              )}
              <span className="text-white font-bold">ElevenTrails</span>
            </a>
            {footerDescription ? (
              <p className="text-gray-400 text-sm mb-4" dangerouslySetInnerHTML={{ __html: footerDescription }} />
            ) : (
            <p className="text-gray-400 text-sm mb-4">
              Your ultimate adventure destination for dirt bike trails and extreme sports.
            </p>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-white" style={{width:'24px', height:'24px', flexShrink: 0}}>
                  <MapPin size={14} style={{ color: '#EE6A28' }} />
                </div>
                <span className="text-gray-400 text-sm">{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-white" style={{width:'24px', height:'24px', flexShrink: 0}}>
                  <Phone size={14} style={{ color: '#EE6A28' }} />
                </div>
                <span className="text-gray-400 text-sm">+62 822-6600-7272</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-white" style={{width:'24px', height:'24px', flexShrink: 0}}>
                  <Mail size={14} style={{ color: '#EE6A28' }} />
                </div>
                <span className="text-gray-400 text-sm">{email}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Quick Link</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="/rides" className="text-gray-400 hover:text-white transition">
                  Rides
                </a>
              </li>
              <li>
                <a href="/stories" className="text-gray-400 hover:text-white transition">
                  Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Get In Touch</h4>
            <div className="flex gap-4 mb-4">
              <a href={socialUrls.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Facebook">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href={socialUrls.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href={socialUrls.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="TikTok">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.831a8.127 8.127 0 0 0 4.77 1.52v-3.665a4.794 4.794 0 0 1-1.003-.1z"/>
                </svg>
              </a>
              <a href={socialUrls.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="YouTube">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white text-gray-900 placeholder-gray-500 rounded-none border-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-none transition flex items-center justify-center">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 ElevenTrails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
