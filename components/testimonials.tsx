"use client"

import { useState, useEffect, useRef } from "react"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      text: "Wow, this was insane in the best way possible! I've done a lot of dirt biking back home, but Lombok's trails are something else. Our guide was super patient when I wiped out on the first hill 😅, but by the end, I was keeping up with the group. The sunset view from the peak was worth every single bump!",
      author: "John Smith",
      country: "USA",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      text: "Honestly didn't know what to expect, but ElevenTrails blew me away. The gear was actually clean and well-maintained (shocker for rental equipment!), and the guides were locals who knew every shortcut and secret spot. We stopped at this hidden waterfall that wasn't even on the map. Booked another ride before we even got back!",
      author: "Sarah Johnson",
      country: "UK",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      text: "First time on a dirt bike and I was terrified. The team made me feel safe enough to actually enjoy it though. By the end, I was having too much fun to be scared! Already planning to come back next year with my mates.",
      author: "Mike Davis",
      country: "Australia",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      text: "The terrain changes so fast—one minute you're in jungle mud, next you're on rocky paths with ocean views. My GoPro ran out of battery halfway through because I couldn't stop filming. The guides even helped us get the best shots! Worth every rupiah.",
      author: "Emma Wilson",
      country: "Canada",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      text: "Professional but also fun, you know? They weren't overly strict but you could tell they genuinely cared about safety. I've been on tours where guides rush you, but here they let us take breaks, ask questions, and actually enjoy the experience. The lunch stop was authentic local food—amazing!",
      author: "David Lee",
      country: "Singapore",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 6,
      text: "Been riding for 15 years, and this is hands down the best trail experience I've had in Asia. The guides read the group perfectly—pushed us when we could handle it, backed off when needed. The intermediate trail we did had everything: technical sections, wide open areas, and those narrow mountain passes that get your heart racing. Absolutely coming back!",
      author: "Lisa Andersen",
      country: "Denmark",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 7,
      text: "I was worried about the language barrier, but the team speaks good English and they're so friendly. Even when I crashed and they had to check my bike, they were calm and reassuring. Plus they have backup bikes ready—impressive organization. The whole day felt like riding with friends, not a tour group.",
      author: "Carlos Rodriguez",
      country: "Spain",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 8,
      text: "My husband booked this as a surprise and I was skeptical (I'm more of a beach person). But honestly? Best day of our trip. The beginner trail was perfect—challenging enough to feel accomplished, not scary. The guides even taught us some basics before we started. Now I'm the one planning our next adventure here!",
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
