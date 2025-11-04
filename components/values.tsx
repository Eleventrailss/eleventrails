"use client"

import { useState, useEffect } from "react"
import { getGeneralSettings } from "@/lib/general-settings"

export default function Values() {
  const values = [
    { title: "Safety", description: "Our top priority is the safety of every rider.", key: "core_value_pic_1" },
    { title: "Excellence", description: "We always strive to be the best in service and experience.", key: "core_value_pic_2" },
    { title: "Adventure", description: "Unforgettable adventures to boost your adrenaline.", key: "core_value_pic_3" },
    { title: "Community", description: "Building a solid and supportive rider community.", key: "core_value_pic_4" },
  ]
  
  const [images, setImages] = useState<Record<string, string>>({})
  
  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const settings = await getGeneralSettings([
      'core_value_pic_1',
      'core_value_pic_2',
      'core_value_pic_3',
      'core_value_pic_4'
    ])
    
    setImages(settings)
  }

  return (
    <section className="bg-white -mt-[20px] sm:-mt-[30px] lg:-mt-[50px] pt-12 sm:pt-16 lg:pt-[100px] pb-12 sm:pb-16 lg:pb-20" style={{ position: 'relative', zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[30px]">
        <h2 
          className="text-slate-950 text-center mb-10 sm:mb-12 lg:mb-16 mx-auto"
          style={{
            fontFamily: 'Rubik One, sans-serif',
            fontSize: 'clamp(28px, 5vw, 64px)',
            fontWeight: 400,
            lineHeight: '1.2'
          }}
        >
          RIDES <span className="text-orange-500">CORE</span> VALUE
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="values-card-container relative w-full"
              style={{
                width: '100%'
              }}
            >
              {/* Mobile: Card with description inside image */}
              <div className="values-card-mobile block sm:hidden relative w-full" style={{ aspectRatio: '256/359' }}>
                <img
                  src={images[value.key] || "/off-road-motorcycle.jpg"}
                  alt={value.title}
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: '0',
                    width: '100%',
                    height: '100%',
                    display: 'block'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/off-road-motorcycle.jpg";
                  }}
                />
                <div 
                  className="absolute inset-0" 
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)'
                  }}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                  <h3 
                    className="text-white text-center mb-2" 
                    style={{
                      fontFamily:'Rubik One, sans-serif', 
                      fontWeight: 400,
                      fontSize: 'clamp(16px, 3.5vw, 20px)',
                      position: 'relative',
                      zIndex: 10,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {value.title}
                  </h3>
                  <p 
                    className="text-white text-center leading-relaxed" 
                    style={{
                      fontFamily:'Plus Jakarta Sans, sans-serif', 
                      fontSize:'clamp(12px, 2.5vw, 14px)', 
                      fontWeight:500,
                      position: 'relative',
                      zIndex: 10,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              </div>

              {/* Desktop: Flip card */}
              <div className="values-card hidden sm:block relative w-full h-full cursor-pointer" style={{ aspectRatio: '256/359' }}>
                {/* Front Side (Image with Title) */}
                <div className="values-card-front absolute w-full h-full top-0 left-0">
                  <img
                    src={images[value.key] || "/off-road-motorcycle.jpg"}
                    alt={value.title}
                    className="w-full h-full object-cover"
                    style={{
                      borderRadius: '0',
                      width: '100%',
                      height: '100%',
                      display: 'block'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/off-road-motorcycle.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black" style={{opacity: 0.2}}></div>
                  <div className="absolute inset-0 flex items-center justify-center px-2">
                    <h3 
                      className="text-white text-center" 
                      style={{
                        fontFamily:'Rubik One, sans-serif', 
                        fontWeight: 400,
                        fontSize: 'clamp(20px, 2vw, 24px)',
                        position: 'relative',
                        zIndex: 10
                      }}
                    >
                      {value.title}
                    </h3>
                  </div>
                </div>

                {/* Back Side (Description) */}
                <div className="values-card-back absolute w-full h-full top-0 left-0 flex items-center justify-center p-5 sm:p-6" style={{backgroundColor: '#EE6A28'}}>
                  <p 
                    className="text-white text-center leading-relaxed" 
                    style={{
                      fontFamily:'Plus Jakarta Sans, sans-serif', 
                      fontSize:'clamp(14px, 1.5vw, 16px)', 
                      fontWeight:500
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
