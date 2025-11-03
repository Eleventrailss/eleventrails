"use client"

import { useState } from "react"
import { Clock, MapPin, Navigation, TrendingUp, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

export default function GalleryRidesDetail({ title, description }: { title: string; description?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6282266007272"

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-0" style={{ marginBottom: 0, paddingBottom: '50px' }}>
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10">
          <h2 
            className="text-slate-950 text-left mb-4 whitespace-nowrap"
            style={{
              fontFamily: 'Rubik One, sans-serif',
              fontSize: 'clamp(32px, 6vw, 64px)',
              fontWeight: 400,
              width: '100%',
              maxWidth: '100%',
              lineHeight: '1.2'
            }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 text-lg text-left mb-6 sm:mb-8 max-w-3xl px-4">
              {description}
            </p>
          )}
          <div className="w-full mb-6 sm:mb-8">
            <img 
              src="/group-trail-riding.jpg" 
              alt={title}
              className="w-full h-auto object-cover"
              style={{
                width: '1120px',
                height: '371px',
                maxWidth: '100%',
                borderRadius: '0'
              }}
            />
          </div>
          <div className="flex gap-4 items-start mb-6 sm:mb-8" style={{ flexWrap: 'wrap' }}>
            <div style={{ width: '668px', maxWidth: '100%' }}>
              <img 
                src="/extreme-bike-riding.jpg" 
                alt={title}
                className="h-auto object-cover"
                style={{
                  width: '668px',
                  height: '188px',
                  maxWidth: '100%',
                  borderRadius: '0',
                  display: 'block',
                  marginBottom: '0'
                }}
              />
              <div 
                style={{
                  width: '668px',
                  maxWidth: '100%',
                  borderRadius: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  padding: '16px',
                  boxSizing: 'border-box',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <p 
                  style={{
                    fontFamily: 'Rubik One, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(20px, 4vw, 36px)',
                    fontStyle: 'normal',
                    color: '#EE6A28',
                    margin: 0
                  }}
                >
                  FROM
                </p>
                <p 
                  className="text-slate-950"
                  style={{
                    fontFamily: 'Rubik One, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 2.5vw, 24px)',
                    fontStyle: 'normal',
                    margin: 0,
                    textDecoration: 'line-through',
                    opacity: 0.6
                  }}
                >
                  IDR 1.200.000
                </p>
              </div>
              <p 
                className="text-slate-950"
                style={{
                  fontFamily: 'Rubik One, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontStyle: 'normal',
                  margin: 0
                }}
              >
                IDR 1.000.000 / <span style={{ fontSize: 'clamp(14px, 3vw, 24px)' }}>Person</span>
              </p>
            </div>
            <div className="flex gap-4 items-center" style={{ marginTop: '12px' }}>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book via WhatsApp"
                title="Book via WhatsApp"
                className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 scale-80 sm:scale-100"
                style={{
                  width: '182px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'stretch',
                  padding: '0',
                  border: 'none',
                  borderRadius: '0',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '30%',
                    background: '#0A88B7',
                    flexShrink: 0
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '70%',
                    background: '#EE6A28',
                    flex: 1
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#ffffff' }}>Book Now</span>
                </div>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%20have%20a%20question%20about%20${encodeURIComponent(title || 'this ride')}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 scale-80 sm:scale-100"
                style={{
                  width: '182px',
                  height: '46px',
                  background: '#0A88B7',
                  color: '#ffffff',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  fontStyle: 'normal',
                  border: 'none',
                  borderRadius: '0',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Ask Question
              </a>
            </div>
          </div>
          </div>
            <div 
              style={{
                width: '435px',
                height: '447px',
                maxWidth: '100%',
                backgroundColor: '#EE6A28',
                borderRadius: '0',
                flexShrink: 0,
                padding: '30px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={60} color="#ffffff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '20px' }}>
                  <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: '24px', color: '#ffffff', margin: 0 }}>
                    Duration
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: '18px', color: '#ffffff', margin: 0 }}>
                    7 Hours
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={60} color="#ffffff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '20px' }}>
                  <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: '24px', color: '#ffffff', margin: 0 }}>
                    Location
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: '18px', color: '#ffffff', margin: 0 }}>
                    Kuta Lombok
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Navigation size={60} color="#ffffff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '20px' }}>
                  <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: '24px', color: '#ffffff', margin: 0 }}>
                    Meeting Point
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: '18px', color: '#ffffff', margin: 0 }}>
                    Kuta Lombok
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={60} color="#ffffff" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '20px' }}>
                  <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: '24px', color: '#ffffff', margin: 0 }}>
                    Difficulty Level
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: '18px', color: '#ffffff', margin: 0 }}>
                    Easy-Medium
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 mb-6">
            <h3 
              className="text-slate-950 text-center"
              style={{
                fontFamily: 'Rubik One, sans-serif',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 400,
                lineHeight: '1.2'
              }}
            >
              ALL THE <span style={{ color: '#EE6A28' }}>IMPORTANT</span> INFO
            </h3>
          </div>

          <div className="w-full space-y-4 mb-0">
            <div>
              <button
                type="button"
                onClick={() => toggleItem(0)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors scale-90 sm:scale-100"
                style={{
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <HelpCircle size={60} color="#0A88B7" />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: 'Rubik One, sans-serif',
                      fontWeight: 400,
                      fontSize: '32px',
                      color: '#1f2937',
                      margin: 0
                    }}
                  >
                    Pertanyaan
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {openIndex === 0 ? (
                    <ChevronUp size={24} color="#1f2937" />
                  ) : (
                    <ChevronDown size={24} color="#1f2937" />
                  )}
                </div>
              </button>
              {openIndex === 0 && (
                <div
                  className="px-4 pb-4"
                  style={{
                    paddingLeft: 'calc(60px + 16px + 16px)',
                    paddingTop: '0'
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Rubik One, sans-serif',
                      fontWeight: 400,
                      fontSize: '24px',
                      color: '#4b5563',
                      margin: 0
                    }}
                  >
                    Jawaban
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleItem(1)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors scale-90 sm:scale-100"
                style={{
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MapPin size={60} color="#0A88B7" />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: 'Rubik One, sans-serif',
                      fontWeight: 400,
                      fontSize: '32px',
                      color: '#1f2937',
                      margin: 0
                    }}
                  >
                    Iternary
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {openIndex === 1 ? (
                    <ChevronUp size={24} color="#1f2937" />
                  ) : (
                    <ChevronDown size={24} color="#1f2937" />
                  )}
                </div>
              </button>
              {openIndex === 1 && (
                <div
                  className="px-4 pb-4"
                  style={{
                    paddingLeft: 'calc(60px + 16px + 16px)',
                    paddingTop: '0'
                  }}
                >
                  <div
                    style={{
                      background: '#f3f4f6',
                      padding: '16px',
                      borderRadius: '8px',
                      maxWidth: '600px'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Rubik One, sans-serif',
                        fontWeight: 400,
                        fontSize: '24px',
                        color: '#1f2937',
                        margin: 0,
                        lineHeight: '1.5'
                      }}
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery layout kosong - siap untuk konten */}
        </div>
      </div>
    </section>
  )
}

