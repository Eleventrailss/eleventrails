"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Ride {
  id: string
  title: string
  tags: string[]
  short_description: string | null
  primary_picture: string | null
  final_price: number
  type: 'group' | 'personal'
}

export default function ListRides() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('id, title, tags, short_description, primary_picture, final_price, type')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setRides(data || [])
    } catch (error) {
      console.error('Error fetching rides:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, type: 'group' | 'personal') => {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
    
    const typeLabel = type === 'personal' ? 'Person' : 'Group'
    return `${formattedPrice} / ${typeLabel}`
  }

  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 -mb-[-20px]">
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10">
          <h2 
            className="text-slate-950 text-center mb-4 mx-auto whitespace-nowrap"
            style={{
              fontFamily: 'Rubik One, sans-serif',
              fontSize: 'clamp(32px, 6vw, 64px)',
              fontWeight: 400,
              width: '100%',
              maxWidth: '100%',
              lineHeight: '1.2'
            }}
          >
            THE RIDES OF YOUR LIFE
          </h2>
          <p className="text-gray-600 text-lg text-center mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Memuat data rides...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="overflow-hidden md:hover:transform md:hover:scale-105 transition scale-[0.85] md:scale-100 origin-center"
                >
                  {/* 1. Gambar */}
                  <img 
                    src={ride.primary_picture || "/placeholder.svg"} 
                    alt={ride.title} 
                    className="w-full h-auto object-cover" 
                    style={{aspectRatio:'352/265', borderRadius:'0'}} 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  <div className="w-full">
                    {/* 2. Category - background oranye, text putih, font Rubik One */}
                    <div className="flex gap-2 mt-4 mb-2">
                      {ride.tags && ride.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          style={{
                            fontFamily: 'Rubik One, sans-serif',
                            backgroundColor: '#EE6A28',
                            color: '#ffffff'
                          }}
                          className="px-3 py-1 text-xs uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* 3. Judul */}
                    <h3 className="text-slate-950 font-bold text-lg mb-2">{ride.title}</h3>
                    {/* 4. Harga */}
                    <p className="text-gray-600 mb-4">{formatPrice(ride.final_price, ride.type)}</p>
                    {/* 5. Short description */}
                    <p className="text-gray-600 text-sm mb-3">{ride.short_description || ''}</p>
                  {/* 6. Readmore - label biru, panah oranye dengan background lingkaran transparan */}
                  <a 
                    href={`/rides/${ride.id}`} 
                    className="inline-flex items-center gap-2 no-underline hover:opacity-80 transition"
                    style={{
                      width: '93px',
                      height: '30px',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 500,
                      fontSize: '18px',
                      color: '#3b82f6'
                    }}
                  >
                    Readmore
                    <span 
                      className="flex items-center justify-center rounded-full border-2 border-orange-500 flex-shrink-0"
                      style={{
                        width: '24px',
                        height: '24px',
                        minWidth: '24px',
                        minHeight: '24px',
                        maxWidth: '24px',
                        maxHeight: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'transparent',
                        boxSizing: 'border-box',
                        aspectRatio: '1 / 1',
                        padding: '0',
                        flexShrink: 0,
                        flexGrow: 0
                      }}
                    >
                      <ArrowRight size={12} strokeWidth={2.5} style={{ color: '#EE6A28' }} />
                    </span>
                  </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

