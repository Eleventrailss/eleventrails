"use client"

import { useState, useEffect, useRef } from "react"

export default function TrailsAbout() {
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
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div ref={containerRef} className="relative z-10 grid md:grid-cols-2 gap-4 sm:gap-[10px] items-start mb-12 sm:mb-16">
        <div className="w-full max-w-full px-4 md:px-0" style={{ paddingLeft: '0' }}>
            <h2 className="font-rubik-one text-4xl md:text-[52px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[583px]">
              <span className="block">ABOUT US</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Discover breathtaking landscapes and challenging trails that will test your skills and push your limits.
              Our carefully curated routes take you through the most scenic and thrilling terrain.
            </p>
            <h2 className="font-rubik-one text-4xl md:text-[52px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[583px]">
              <span className="block text-black-500">OUR TRAILS</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Discover breathtaking landscapes and challenging trails that will test your skills and push your limits.
              Our carefully curated routes take you through the most scenic and thrilling terrain.Discover breathtaking landscapes and challenging trails that will test your skills and push your limits.
              Our carefully Lorem Ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. urated routes take you through the most scenic and thrilling terrain.
            </p>
            <div>
                <img 
                  data-trails-about-img
                  src="/dirt-bike-trail-landscape.jpg" 
                  alt="Trail 1" 
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
                  src="/dirt-bike-trail-landscape.jpg" 
                  alt="Trail 1" 
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
                  src="/off-road-motorcycle.jpg" 
                  alt="Trail 3" 
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
                  src="/extreme-bike-riding.jpg" 
                  alt="Trail 4" 
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
                  src="/dirt-bike-trail-landscape.jpg" 
                  alt="Trail 1" 
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
