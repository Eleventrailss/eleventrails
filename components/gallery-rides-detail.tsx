"use client"

export default function GalleryRidesDetail() {
  return (
    <section className="relative -mt-0 pt-0 -mb-0" style={{ backgroundColor: '#272727', paddingBottom: '50px', marginTop: 0, paddingTop: '50px', marginBottom: 0 }}>
      <div className="max-w-7xl mx-auto px-[30px] relative" style={{ paddingTop: 0, marginTop: 0 }}>

        <div className="relative z-10">
          <div className="flex gap-6 items-start mb-6 sm:mb-8" style={{ flexWrap: 'wrap' }}>
            <div className="flex gap-6 items-start" style={{ flexWrap: 'wrap', width: '100%' }}>
              <div style={{ width: '576px', maxWidth: '100%' }}>
                <img 
                  src="/mountain-bike-rider.jpg" 
                  alt="Mountain bike rider"
                  className="h-auto object-cover"
                  style={{
                    width: '576px',
                    height: '371px',
                    maxWidth: '100%',
                    borderRadius: '0'
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h2 
                  className="mb-4"
                  style={{
                    fontFamily: 'Rubik One, sans-serif',
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    fontWeight: 400,
                    color: '#ffffff',
                    lineHeight: '1.2'
                  }}
                >
                  OUR GALLERY
                </h2>
                <p 
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px',
                    color: '#ffffff',
                    lineHeight: '1.6',
                    margin: 0
                  }}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>
          </div>
          
          {/* Grup 3 foto off-road-motorcycle */}
          <div className="flex gap-6 items-start mb-6 sm:mb-8" style={{ flexWrap: 'wrap' }}>
            <div style={{ width: '362px', maxWidth: '100%' }}>
              <img 
                src="/off-road-motorcycle.jpg" 
                alt="Off-road motorcycle"
                className="h-auto object-cover"
                style={{
                  width: '362px',
                  height: '286px',
                  maxWidth: '100%',
                  borderRadius: '0'
                }}
              />
            </div>
            <div style={{ width: '362px', maxWidth: '100%' }}>
              <img 
                src="/off-road-motorcycle.jpg" 
                alt="Off-road motorcycle"
                className="h-auto object-cover"
                style={{
                  width: '362px',
                  height: '286px',
                  maxWidth: '100%',
                  borderRadius: '0'
                }}
              />
            </div>
            <div style={{ width: '362px', maxWidth: '100%' }}>
              <img 
                src="/off-road-motorcycle.jpg" 
                alt="Off-road motorcycle"
                className="h-auto object-cover"
                style={{
                  width: '362px',
                  height: '286px',
                  maxWidth: '100%',
                  borderRadius: '0'
                }}
              />
            </div>
          </div>
          
          {/* Grup 2 foto - dirt-bike-rider dan dirt-bike-protective-suit */}
          <div className="flex gap-6 items-start mb-0" style={{ flexWrap: 'wrap' }}>
            <div style={{ width: '362px', maxWidth: '100%' }}>
              <img 
                src="/dirt-bike-rider-on-mountain-trail.jpg" 
                alt="Dirt bike rider on mountain trail"
                className="h-auto object-cover"
                style={{
                  width: '362px',
                  height: '286px',
                  maxWidth: '100%',
                  borderRadius: '0'
                }}
              />
            </div>
            <div style={{ width: '741px', maxWidth: '100%' }}>
              <img 
                src="/dirt-bike-protective-suit.jpg" 
                alt="Dirt bike protective suit"
                className="h-auto object-cover"
                style={{
                  width: '741px',
                  height: '286px',
                  maxWidth: '100%',
                  borderRadius: '0'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

