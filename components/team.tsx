export default function Team() {
  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Team separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-0 md:gap-0 items-start">
          <div className="w-full max-w-full mb-6 md:mb-0 scale-[0.85] md:scale-100 origin-center">
            <div className="mb-6" style={{maxWidth:'501px'}}>
              <img src="/professional-bike-rider.jpg" alt="Team member 1" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'501px',height:'auto',aspectRatio:'501/249',borderRadius:'0'}} />
            </div>
            <div style={{maxWidth:'501px'}}>
              <img src="/adventure-guide.jpg" alt="Team member 2" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'501px',height:'auto',aspectRatio:'501/249',borderRadius:'0'}} />
            </div>
          </div>
          <div className="w-full max-w-full md:-ml-8">
            <h2 className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-4 leading-tight w-full max-w-full md:w-[415px]">
              <span className="block">MEET OUR</span>
              <span className="block text-orange-500">TEAM</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Our team consists of experienced riders and adventure guides with over 50 years of combined experience in
              extreme sports and trail riding. We're passionate about sharing the thrill of off-road adventures while
              ensuring safety and creating unforgettable memories.
            </p>
            <p className="text-gray-600 text-lg mb-6">
              Each team member is certified, trained, and dedicated to providing the best possible experience for our
              guests. We believe in pushing limits responsibly and helping riders of all levels achieve their goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
