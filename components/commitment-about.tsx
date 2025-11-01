export default function CommitmentAbout() {
  return (
    <section className="-mt-[50px] pt-[100px] pb-12 sm:pb-16 lg:pb-20" style={{ backgroundColor: '#272727' }}>
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="grid md:grid-cols-2 gap-0 md:gap-0 items-start">
          <div className="w-full max-w-full mb-6 md:mb-0 scale-[0.85] md:scale-100 origin-center overflow-hidden">
            <img src="/professional-bike-rider.jpg" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'476px',width:'100%',height:'auto',aspectRatio:'476/528',borderRadius:'0'}} />
          </div>
          <div className="w-full max-w-full">
            <h2 className="font-rubik-one text-4xl md:text-[52px] font-bold text-white mb-4 leading-tight w-full max-w-full md:w-[415px]">
              <span className="block">OUR COMMITMENT</span>
              
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Our team consists of experienced riders and adventure guides with over 50 years of combined experience in
              extreme sports and trail riding. We're passionate about sharing the thrill of off-road adventures while
              ensuring safety and creating unforgettable memories.
            </p>
            <br />
            <p className="text-gray-300 text-lg mb-6">
              Each team member is certified, trained, and dedicated to providing the best possible experience for our
              guests. We believe in pushing limits responsibly and helping riders of all levels achieve their goals.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0 md:gap-0 items-start" style={{paddingTop:'50px'}}>
            <div className="w-full md:w-[117%]">
            <h2 className="font-rubik-one text-4xl md:text-[52px] font-bold text-white mb-4 leading-tight">
              <span className="block">READY TO EMBRAK ON THE OFF ROAD ADVENTURE OF A LIFETIME ?</span>
              
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Our team consists of experienced riders and adventure guides with over 50 years of combined experience in
              extreme sports and trail riding. We're passionate about sharing the thrill of off-road adventures while
              ensuring safety and creating unforgettable memories.
            </p>
            <br />
            <p className="text-gray-300 text-lg mb-6">
              Each team member is certified, trained, and dedicated to providing the best possible experience for our
              guests. We believe in pushing limits responsibly and helping riders of all levels achieve their goals.
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book via WhatsApp"
              title="Book via WhatsApp"
              className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
                  background: '#ffffff',
                  flexShrink: 0
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#EE6A28" xmlns="http://www.w3.org/2000/svg">
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
          </div>
          <div className="w-full max-w-full mb-6 md:mb-0 scale-100 origin-center overflow-hidden md:w-[120%] md:ml-[150px]">
            <img src="/professional-bike-rider.jpg" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'395px',width:'100%',height:'auto',aspectRatio:'395/348',borderRadius:'0',marginBottom:'10px'}} />
            <img src="/professional-bike-rider.jpg" className="w-full max-w-full h-auto object-cover" style={{maxWidth:'395px',width:'100%',height:'auto',aspectRatio:'395/348',borderRadius:'0'}} />
          </div>
        </div>
      </div>
    </section>
  )
}
