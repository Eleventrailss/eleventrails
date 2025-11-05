"use client"

import { useState, useEffect, useRef } from "react"
import { getGeneralSettings, getGeneralSetting } from "@/lib/general-settings"

export default function TrailsAbout() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [images, setImages] = useState({
    about_pic_1: "/dirt-bike-trail-landscape.jpg",
    about_pic_2: "/dirt-bike-trail-landscape.jpg",
    about_pic_3: "/off-road-motorcycle.jpg",
    about_pic_4: "/extreme-bike-riding.jpg",
    about_pic_5: "/dirt-bike-trail-landscape.jpg"
  })
  const [aboutText, setAboutText] = useState("")
  const [ourTrailsText, setOurTrailsText] = useState("")

  useEffect(() => {
    fetchImages()
    fetchTextParagraphs()
  }, [])

  const fetchTextParagraphs = async () => {
    const [about, ourTrails] = await Promise.all([
      getGeneralSetting('about_text_paragraph'),
      getGeneralSetting('about_our_trails_text_paragraph')
    ])
    if (about) {
      setAboutText(about)
    }
    if (ourTrails) {
      setOurTrailsText(ourTrails)
    }
  }

  const fetchImages = async () => {
    const settings = await getGeneralSettings([
      'about_pic_1',
      'about_pic_2',
      'about_pic_3',
      'about_pic_4',
      'about_pic_5'
    ])
    
    setImages(prev => ({
      about_pic_1: settings.about_pic_1 || prev.about_pic_1,
      about_pic_2: settings.about_pic_2 || prev.about_pic_2,
      about_pic_3: settings.about_pic_3 || prev.about_pic_3,
      about_pic_4: settings.about_pic_4 || prev.about_pic_4,
      about_pic_5: settings.about_pic_5 || prev.about_pic_5
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
            const images = entry.target.querySelectorAll('[data-trails-about-img]')
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
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" className="w-full h-auto object-cover" />
        </div>
        <div ref={containerRef} className="relative z-10 grid md:grid-cols-2 gap-4 sm:gap-[10px] items-start mb-12 sm:mb-16">
        <div className="w-full max-w-full px-4 md:px-0" style={{ paddingLeft: '0' }}>
            <h2 className="font-rubik-one text-4xl md:text-[52px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[583px]">
              <span className="block">ABOUT US</span>
            </h2>
            {aboutText ? (
              <div className="text-gray-600 text-lg mb-6" dangerouslySetInnerHTML={{ __html: aboutText }} />
            ) : (
            <p className="text-gray-600 text-lg mb-6">
              ElevenTrails is a premier destination for dirt bike enthusiasts and adventure seekers. We offer carefully curated trails that showcase the stunning natural beauty of Lombok while providing an exhilarating riding experience for all skill levels.
            </p>
            )}
            <h2 className="font-rubik-one text-4xl md:text-[52px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[583px]">
              <span className="block text-black-500">OUR TRAILS</span>
            </h2>
            {ourTrailsText ? (
              <div className="text-gray-600 text-lg mb-6" dangerouslySetInnerHTML={{ __html: ourTrailsText }} />
            ) : (
            <p className="text-gray-600 text-lg mb-6">
              Discover breathtaking landscapes and challenging trails that will test your skills and push your limits. Our carefully curated routes take you through the most scenic and thrilling terrain, from lush jungle paths to rugged mountain ridges. Each trail is designed to provide an unforgettable adventure while maintaining the highest safety standards. Whether you're a beginner looking for your first off-road experience or an experienced rider seeking new challenges, our diverse trail network offers something for everyone.
            </p>
            )}
            <div>
                <img 
                  data-trails-about-img
                  src={images.about_pic_1} 
                  alt="/placeholder.svg" 
                  className="w-full max-w-full h-auto object-cover" 
                  style={{
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
          </div>
          <div className="w-full max-w-full scale-[0.85] md:scale-100 origin-center">
            <div className="grid grid-rows-2 gap-4">
              <div>
                <img 
                  data-trails-about-img
                  src={images.about_pic_2} 
                  alt="/placeholder.svg" 
                  className="w-full max-w-full h-auto object-cover" 
                  style={{
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
                  data-trails-about-img
                  src={images.about_pic_3} 
                  alt="/placeholder.svg" 
                  className="w-full max-w-full h-auto object-cover" 
                  style={{
                    maxWidth:'241px',
                    height:'auto',
                    aspectRatio:'241/249',
                    borderRadius:'0',
                    transform: 'scale(0.8)',
                    opacity: '0',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
                  }} 
                />
                <img 
                  data-trails-about-img
                  src={images.about_pic_4} 
                  alt="/placeholder.svg" 
                  className="w-full max-w-full h-auto object-cover" 
                  style={{
                    maxWidth:'241px',
                    height:'auto',
                    aspectRatio:'241/249',
                    borderRadius:'0',
                    transform: 'scale(0.8)',
                    opacity: '0',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
                  }} 
                />
              </div>
              <div>
                <img 
                  data-trails-about-img
                  src={images.about_pic_5} 
                  alt="/placeholder.svg" 
                  className="w-full max-w-full h-auto object-cover" 
                  style={{
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
