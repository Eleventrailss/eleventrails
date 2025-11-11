"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { Star } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  avatar_url: string | null
  display_order: number
  is_active: boolean
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, content, rating, avatar_url, display_order, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      setTestimonials(data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

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
    <section ref={sectionRef} className="pt-[50px] pb-[50px] sm:pb-16 lg:pb-20 overflow-hidden" style={{ backgroundColor: '#272727' }}>
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
      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/80">Memuat testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/80">Belum ada testimonials</p>
        </div>
      ) : (
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
                className="w-[352px] flex-shrink-0 flex flex-col items-center overflow-hidden shadow-md border border-white/10"
                style={{ backgroundColor: '#081E4C' }}
              >
                <div className="w-full" style={{height:'auto',aspectRatio:'352/265',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <img
                    src={testimonial.avatar_url || "/extreme-bike-riding.jpg"}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    style={{aspectRatio:'352/265',borderRadius:'0'}}
                    onError={(e) => {
                      e.currentTarget.src = "/extreme-bike-riding.jpg"
                    }}
                  />
                </div>
                <div className="w-full flex-1 flex flex-col justify-start items-center p-4 sm:p-8 pt-6 sm:pt-8" style={{minHeight:'300px',borderRadius:'0',position:'relative', backgroundColor:'#081E4C'}}>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-white mb-6 leading-relaxed text-center">{testimonial.content}</p>
                  <div className="w-full sm:w-[192px] h-[47px] bg-[#EE6A28] flex flex-row items-center justify-center px-4 gap-2" style={{position:'absolute',left:'0',bottom:'0'}}>
                    <span className="font-bold text-white text-sm sm:text-base">{testimonial.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
