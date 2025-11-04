"use client"

import { useState, useEffect, useRef } from "react"
import { getGeneralSettings, getGeneralSetting } from "@/lib/general-settings"

export default function Gear() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [images, setImages] = useState({
    home_gear_pic_1: "/motorcycle-helmet-protective-gear.jpg",
    home_gear_pic_2: "/motorcycle-gloves-boots.jpg"
  })
  const [textParagraph, setTextParagraph] = useState("")

  useEffect(() => {
    fetchImages()
    fetchTextParagraph()
  }, [])

  const fetchTextParagraph = async () => {
    const text = await getGeneralSetting('home_gear_text_paragraph')
    if (text) {
      setTextParagraph(text)
    }
  }

  const fetchImages = async () => {
    const settings = await getGeneralSettings([
      'home_gear_pic_1',
      'home_gear_pic_2'
    ])
    
    setImages(prev => ({
      home_gear_pic_1: settings.home_gear_pic_1 || prev.home_gear_pic_1,
      home_gear_pic_2: settings.home_gear_pic_2 || prev.home_gear_pic_2
    }))
  }

  useEffect(() => {
    if (hasAnimated || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            // Trigger animation for main image
            const mainImage = entry.target.querySelector('[data-gear-main]')
            if (mainImage) {
              setTimeout(() => {
                (mainImage as HTMLElement).style.transform = 'scale(1)'
                ;(mainImage as HTMLElement).style.opacity = '1'
              }, 0)
            }
            
            // Trigger animation for overlay image after delay
            const overlayImage = entry.target.querySelector('[data-gear-overlay]')
            if (overlayImage) {
              setTimeout(() => {
                (overlayImage as HTMLElement).style.transform = 'scale(1)'
                ;(overlayImage as HTMLElement).style.opacity = '1'
              }, 300)
            }
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
    <section className="bg-white pt-6 sm:pt-8 pb-12 sm:pb-16 lg:pb-20 -mt-[50px]">
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full max-w-full">
            <h2 className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[583px]">
              <span className="block">GEAR UP FOR</span>
              <span className="block">THE <span className="text-orange-500">ADVENTURE</span></span>
            </h2>
            {textParagraph ? (
              <div className="text-slate-950 text-lg mb-6" dangerouslySetInnerHTML={{ __html: textParagraph }} />
            ) : (
              <>
                <p className="text-slate-950 text-lg mb-6">
                  We provide top-quality protective gear and equipment to ensure your safety and comfort on every ride. From
                  helmets to protective suits, we've got everything you need.
                </p>
                <p className="text-slate-950 text-lg mb-6">
                  Our gear is regularly maintained and meets international safety standards. We understand that quality equipment
                  is essential for an enjoyable and safe adventure, which is why we never compromise on safety.
                </p>
              </>
            )}
          </div>
          <div ref={containerRef} className="relative inline-block w-full max-w-full scale-[0.85] md:scale-100 origin-center">
            <img 
              data-gear-main
              src={images.home_gear_pic_1} 
              alt="/placeholder.svg" 
              className="w-full max-w-full h-auto object-cover" 
              style={{ 
                maxWidth: '469px', 
                height: 'auto', 
                aspectRatio: '469/368', 
                borderRadius: '0',
                transform: 'scale(0.8)',
                opacity: '0',
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
              }} 
            />
            <div className="absolute -left-[5px] -bottom-[35px] w-[272px] max-w-[60%] h-auto bg-orange-500 z-0" style={{aspectRatio:'272/174'}}></div>
            <img
              data-gear-overlay
              src={images.home_gear_pic_2}
              alt="/placeholder.svg"
              className="absolute -left-[20px] -bottom-[20px] w-[272px] max-w-[60%] h-auto object-cover z-10 shadow-md"
              style={{
                aspectRatio:'272/174', 
                borderRadius: '0',
                transform: 'scale(0.8)',
                opacity: '0',
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
