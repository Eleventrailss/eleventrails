"use client"

import { useState, useEffect, useRef } from "react"
import { getGeneralSettings, getGeneralSetting } from "@/lib/general-settings"
import { getSupabaseImageUrl } from "@/lib/supabase-storage"

export default function Explore() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [images, setImages] = useState({
    home_explore_pic_1: "/dirt-bike-trail-landscape.jpg",
    home_explore_pic_2: "/off-road-motorcycle.jpg",
    home_explore_pic_3: "/extreme-bike-riding.jpg"
  })
  const [textParagraph, setTextParagraph] = useState("")

  useEffect(() => {
    fetchImages()
    fetchTextParagraph()
  }, [])

  const fetchTextParagraph = async () => {
    const text = await getGeneralSetting('home_explore_text_paragraph')
    if (text) {
      setTextParagraph(text)
    }
  }

  const fetchImages = async () => {
    const settings = await getGeneralSettings([
      'home_explore_pic_1',
      'home_explore_pic_2',
      'home_explore_pic_3'
    ])
    
    setImages(prev => ({
      home_explore_pic_1: getSupabaseImageUrl(settings.home_explore_pic_1) || prev.home_explore_pic_1,
      home_explore_pic_2: getSupabaseImageUrl(settings.home_explore_pic_2) || prev.home_explore_pic_2,
      home_explore_pic_3: getSupabaseImageUrl(settings.home_explore_pic_3) || prev.home_explore_pic_3
    }))
  }

  useEffect(() => {
    if (hasAnimated || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            // Trigger animation for images with staggered delay
            const images = entry.target.querySelectorAll('[data-explore-img]')
            images.forEach((img, index) => {
              setTimeout(() => {
                (img as HTMLElement).style.transform = 'scale(1)'
                ;(img as HTMLElement).style.opacity = '1'
              }, index * 150)
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    observerRef.current = observer

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [hasAnimated])

  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 -mb-[-20px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" className="w-full h-auto object-cover" />
        </div>
        <div ref={containerRef} className="relative z-10 grid md:grid-cols-2 gap-4 sm:gap-[10px] items-start mb-8 sm:mb-12 md:mb-16">
        <div className="w-full max-w-full md:scale-100 origin-center">
            {/* Mobile: Layout sama seperti desktop - 1 gambar lebar di atas, 2 gambar kecil di bawah */}
            <div className="grid grid-rows-2 gap-2 md:hidden" style={{ maxWidth: '100%' }}>
              <div className="w-full">
              <img 
                data-explore-img
                src={images.home_explore_pic_1} 
                alt="/placeholder.svg" 
                  className="w-full h-auto object-cover" 
                style={{
                  width: '100%',
                    maxWidth: '100%',
                    height:'auto',
                    aspectRatio:'501/249',
                  borderRadius:'0',
                    transform: hasAnimated ? 'scale(1)' : 'scale(1)',
                    opacity: '1',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                    display: 'block'
                  }} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/off-road-motorcycle.jpg";
                }} 
              />
              </div>
              <div className="flex flex-row gap-2 justify-center" style={{ width: '100%', maxWidth: '100%' }}>
              <img 
                data-explore-img
                src={images.home_explore_pic_2} 
                alt="/placeholder.svg" 
                  className="h-auto object-cover" 
                style={{
                    width: 'calc(50% - 4px)',
                    maxWidth: 'calc(50% - 4px)',
                    height:'auto',
                    aspectRatio:'241/249',
                  borderRadius:'0',
                    transform: hasAnimated ? 'scale(1)' : 'scale(1)',
                    opacity: '1',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                    display: 'block'
                  }} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/off-road-motorcycle.jpg";
                }} 
              />
              <img 
                data-explore-img
                src={images.home_explore_pic_3} 
                alt="/placeholder.svg" 
                  className="h-auto object-cover" 
                style={{
                    width: 'calc(50% - 4px)',
                    maxWidth: 'calc(50% - 4px)',
                    height:'auto',
                    aspectRatio:'241/249',
                  borderRadius:'0',
                    transform: hasAnimated ? 'scale(1)' : 'scale(1)',
                    opacity: '1',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                    display: 'block'
                  }} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/off-road-motorcycle.jpg";
                }} 
              />
              </div>
            </div>
            {/* Desktop: Layout asli dengan 2 rows */}
            <div className="hidden md:grid grid-rows-2 gap-4">
              <div>
                <img 
                  data-explore-img
                  src={images.home_explore_pic_1} 
                  alt="/placeholder.svg" 
                  className="w-full h-auto object-cover" 
                  style={{
                    width: '100%',
                    maxWidth:'501px',
                    height:'auto',
                    aspectRatio:'501/249',
                    borderRadius:'0',
                    transform: 'scale(0.8)',
                    opacity: '0',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
                  }} 
                />
              </div>
              <div className="flex flex-row gap-[19px]">
                <img 
                  data-explore-img
                  src={images.home_explore_pic_2} 
                  alt="/placeholder.svg" 
                  className="w-full h-auto object-cover" 
                  style={{
                    width: '100%',
                    maxWidth:'241px',
                    height:'auto',
                    aspectRatio:'241/249',
                    borderRadius:'0',
                    transform: 'scale(0.8)',
                    opacity: '0',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                    flex: '1 1 0%'
                  }} 
                />
                <img 
                  data-explore-img
                  src={images.home_explore_pic_3} 
                  alt="/placeholder.svg" 
                  className="w-full h-auto object-cover" 
                  style={{
                    width: '100%',
                    maxWidth:'241px',
                    height:'auto',
                    aspectRatio:'241/249',
                    borderRadius:'0',
                    transform: 'scale(0.8)',
                    opacity: '0',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                    flex: '1 1 0%'
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="w-full max-w-full md:-ml-4">
            <h2 className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[415px]">
              <span className="block">EXPLORE</span>
              <span className="block">THE EARTH</span>
              <span className="block text-orange-500">EDGE</span>
            </h2>
            {textParagraph ? (
              <div className="text-gray-600 text-lg mb-6" dangerouslySetInnerHTML={{ __html: textParagraph }} />
            ) : (
              <>
            <p className="text-gray-600 text-lg mb-6">
              Discover breathtaking landscapes and challenging trails that will test your skills and push your limits.
              Our carefully curated routes take you through the most scenic and thrilling terrain.
            </p>
            <p className="text-gray-600 text-lg mb-6">
              Whether you're seeking adrenaline-pumping adventures or peaceful rides through nature, our diverse trail network
              offers something for every rider. Join us as we explore hidden gems and conquer challenging paths together.
            </p>
              </>
            )}
            <a 
              href="/rides"
              className="flex items-stretch overflow-hidden rounded-none font-bold transition hover:opacity-90 scale-80 sm:scale-100"
              style={{
                width: '234px',
                height: '58px',
                textDecoration: 'none'
              }}
            >
              <span 
                className="flex-shrink-0" 
                style={{ 
                  width: '15%',
                  backgroundColor: '#0A88B7'
                }}
              />
              <span 
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center" 
                style={{ width: '85%' }}
              >
                EXPLORE RIDES
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
