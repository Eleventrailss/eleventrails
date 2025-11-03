"use client"

import { useState, useEffect, useRef } from "react"

export default function Stories() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (hasAnimated || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            // Trigger animation for video
            const video = entry.target.querySelector('[data-stories-video]')
            if (video) {
              setTimeout(() => {
                (video as HTMLElement).style.transform = 'scale(1)'
                ;(video as HTMLElement).style.opacity = '1'
              }, 0)
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
    <section className="relative bg-cyan-600 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="w-full max-w-full">
            <h2 
              className="text-white mb-6 w-full max-w-full"
              style={{
                fontFamily: 'Rubik One, sans-serif',
                fontSize: 'clamp(28px, 6vw, 64px)',
                fontWeight: 400,
                maxWidth: '100%',
                width: '100%',
                height: 'auto',
                lineHeight: '1.2'
              }}
            >
              <span className="block">TALES FROM</span>
              <span className="block"><span className="text-orange-500">LOMBOK</span> TRAILS</span>
            </h2>
            <p className="text-white text-lg leading-relaxed mb-6">
              Experience the legendary trails of Lombok, where adventure meets natural beauty. Our riders have conquered
              some of the most challenging and scenic routes in the region, creating stories that will inspire your next
              adventure.
            </p>
            <p className="text-white text-lg leading-relaxed mb-6">
              From conquering steep mountain passes to navigating through dense jungles, these stories showcase the spirit
              of exploration and the beauty of Lombok's untamed wilderness. Let their experiences guide your journey.
            </p>
          </div>
          <div ref={containerRef} className="flex items-start gap-[30px] relative w-full max-w-full overflow-hidden">
            <video 
              data-stories-video
              className="w-full h-auto" 
              style={{
                height:'auto',
                minHeight:'240px',
                aspectRatio:'16/9',
                objectFit:'cover',
                background:'#333',
                transform: 'scale(0.8)',
                opacity: '0',
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
              }} 
              controls={false} 
              autoPlay={false} 
              poster="/placeholder.svg?height=300&width=300" 
              tabIndex={-1}
            >
              <source src="/video-placeholder.mp4" type="video/mp4" />
              Maaf, browser Anda tidak mendukung pemutaran video.
            </video>
            <div className="hidden md:block" style={{position:'absolute',right:'-45px',top:'50%',transform:'translateY(-50%)',width:'30px',height:'368px',backgroundColor:'#EE6A28'}}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
