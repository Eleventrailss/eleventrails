export default function Explore() {
  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 -mb-[-20px]">
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-4 sm:gap-[10px] items-start mb-12 sm:mb-16">
        <div className="w-full max-w-full scale-[0.85] md:scale-100 origin-center">
            <div className="grid grid-rows-2 gap-4">
              <div>
                <img src="/dirt-bike-trail-landscape.jpg" alt="Trail 1" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'501px',height:'auto',aspectRatio:'501/249',borderRadius:'0'}} />
              </div>
              <div className="flex flex-row gap-[19px]">
                <img src="/off-road-motorcycle.jpg" alt="Trail 3" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'241px',height:'auto',aspectRatio:'241/249',borderRadius:'0'}} />
                <img src="/extreme-bike-riding.jpg" alt="Trail 4" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'241px',height:'auto',aspectRatio:'241/249',borderRadius:'0'}} />
              </div>
            </div>
          </div>
          <div className="w-full max-w-full md:-ml-4">
            <h2 className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[415px]">
              <span className="block">EXPLORE</span>
              <span className="block">THE EARTH</span>
              <span className="block text-orange-500">EDGE</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Discover breathtaking landscapes and challenging trails that will test your skills and push your limits.
              Our carefully curated routes take you through the most scenic and thrilling terrain.
            </p>
            <p className="text-gray-600 text-lg mb-6">
              Whether you're seeking adrenaline-pumping adventures or peaceful rides through nature, our diverse trail network
              offers something for every rider. Join us as we explore hidden gems and conquer challenging paths together.
            </p>
            <button 
              type="button"
              className="flex items-stretch overflow-hidden rounded-none font-bold transition hover:opacity-90 scale-80 sm:scale-100"
              style={{
                width: '234px',
                height: '58px'
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
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
