"use client"

import { useState, useEffect, useRef } from "react"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      text: "The best adventure experience I've ever had! The team was professional, the trails were incredible, and I felt safe the entire time.",
      author: "John Smith",
      country: "USA",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      text: "ElevenTrails exceeded all my expectations. The guides were knowledgeable and the scenery was breathtaking. Highly recommended!",
      author: "Sarah Johnson",
      country: "UK",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      text: "An unforgettable experience! The gear was top-notch and the trails were perfectly suited to my skill level. Can't wait to go back!",
      author: "Mike Davis",
      country: "Australia",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      text: "Absolutely amazing! The combination of challenging terrain and stunning views made this the highlight of my trip to Lombok.",
      author: "Emma Wilson",
      country: "Canada",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      text: "Professional service from start to finish. The team made sure everyone was comfortable and challenged at the same time.",
      author: "David Lee",
      country: "Singapore",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 6,
      text: "Best dirt bike adventure in Southeast Asia! The trails were diverse and the guides knew every inch of the terrain.",
      author: "Lisa Andersen",
      country: "Denmark",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 7,
      text: "Incredible experience with ElevenTrails! The safety measures were excellent and the whole team was incredibly supportive.",
      author: "Carlos Rodriguez",
      country: "Spain",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 8,
      text: "A must-do experience for any adventure enthusiast! The guides were experienced and the trails offered perfect challenges.",
      author: "Maria Garcia",
      country: "Mexico",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const [isScrolled, setIsScrolled] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsScrolled(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observerRef.current = observer

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#272727] pt-[50px] pb-[50px] sm:pb-16 lg:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-[30px] mb-12">
        <h2 
          className="text-white text-center mb-12 sm:mb-16 mx-auto"
          style={{
            fontFamily: 'Rubik One, sans-serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          WHAT OUR <span className="text-orange-500">GUESTS</span> SAY?
        </h2>
      </div>

      {/* Animated Running Testimonials */}
      <div className="relative" style={{ width: '100%', overflow: 'hidden' }}>
        <div 
          className="flex gap-6"
          style={{
            animation: isScrolled ? 'marquee 100s linear infinite' : 'none',
            width: 'fit-content'
          }}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div 
              key={`${testimonial.id}-${index}`} 
              className="w-[352px] flex-shrink-0 flex flex-col items-center overflow-hidden shadow-md"
            >
              <div className="w-full" style={{height:'auto',aspectRatio:'352/265',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img
                  src="/extreme-bike-riding.jpg"
                  alt={testimonial.author}
                  className="w-full h-full object-cover"
                  style={{aspectRatio:'352/265',borderRadius:'0'}}
                />
              </div>
              <div className="w-full flex-1 bg-[#155e75] flex flex-col justify-start items-center p-4 sm:p-8 pt-6 sm:pt-8" style={{minHeight:'300px',borderRadius:'0',position:'relative'}}>
                <p className="text-white mb-6 leading-relaxed text-center">{testimonial.text}</p>
                <div className="w-full sm:w-[192px] h-[47px] bg-[#EE6A28] flex flex-row items-center justify-center px-4 gap-2" style={{position:'absolute',left:'0',bottom:'0'}}>
                  <span className="font-bold text-white text-sm sm:text-base">{testimonial.author}</span>
                  <span className="text-white text-sm sm:text-base">|</span>
                  <span className="font-bold text-white text-sm sm:text-base">{testimonial.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
