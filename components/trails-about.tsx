export default function TrailsAbout() {
  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 -mb-[-20px]">
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-4 sm:gap-[10px] items-start mb-12 sm:mb-16">
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
                <img src="/dirt-bike-trail-landscape.jpg" alt="Trail 1" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'501px',height:'auto',aspectRatio:'501/249',borderRadius:'0'}} />
              </div>
          </div>
          <div className="w-full max-w-full scale-[0.85] md:scale-100 origin-center">
            <div className="grid grid-rows-2 gap-4">
              <div>
                <img src="/dirt-bike-trail-landscape.jpg" alt="Trail 1" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'501px',height:'auto',aspectRatio:'501/249',borderRadius:'0'}} />
              </div>
              <div className="flex flex-row gap-[19px]">
                <img src="/off-road-motorcycle.jpg" alt="Trail 3" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'241px',height:'auto',aspectRatio:'241/249',borderRadius:'0'}} />
                <img src="/extreme-bike-riding.jpg" alt="Trail 4" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'241px',height:'auto',aspectRatio:'241/249',borderRadius:'0'}} />
              </div>
              <div>
                <img src="/dirt-bike-trail-landscape.jpg" alt="Trail 1" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'501px',height:'auto',aspectRatio:'501/249',borderRadius:'0'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
