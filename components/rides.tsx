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

export default function Rides() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('rides')
        .select('id, title, tags, short_description, primary_picture, final_price, type')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)

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
    <section className="pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-[200px]" style={{ backgroundColor: '#272727' }}>
      <div className="max-w-7xl mx-auto px-[30px]">
        <h2 
          className="text-white text-center mb-12 sm:mb-16 mx-auto"
          style={{
            fontFamily: 'Rubik One, sans-serif',
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 400,
            width: '100%',
            maxWidth: '726px',
            lineHeight: '1.2'
          }}
        >
          CHOOSE YOUR RIDES
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">Memuat data rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">Belum ada rides tersedia</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-8 sm:mb-12">
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
                      {ride.tags && ride.tags.map((cat, idx) => (
                        <span 
                          key={idx} 
                          style={{
                            fontFamily: 'Rubik One, sans-serif',
                            backgroundColor: '#EE6A28',
                            color: '#ffffff'
                          }}
                          className="px-3 py-1 text-xs uppercase"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    {/* 3. Judul */}
                    <h3 className="text-white font-bold text-lg mb-2">{ride.title}</h3>
                    {/* 4. Harga */}
                    <p className="text-gray-400 mb-4">{formatPrice(ride.final_price, ride.type)}</p>
                    {/* 5. Short description */}
                    <p className="text-slate-200 text-sm mb-3">{ride.short_description || ''}</p>
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

            <div className="text-center">
              <a 
                href="/rides"
                className="flex items-stretch mx-auto overflow-hidden rounded-none font-bold transition hover:opacity-90 scale-80 sm:scale-100"
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
          </>
        )}
      </div>
    </section>
  )
}
