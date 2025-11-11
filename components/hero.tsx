export default function Hero() {
  return (
    <section className="relative -mt-[180px] pt-[180px] pb-5 sm:pb-12 lg:pb-20 min-h-[600px] sm:h-[700px] lg:h-[968px] w-full max-w-[1452px] mx-auto bg-slate-950 overflow-hidden" style={{ paddingBottom: '220px' }}>
      <div className="absolute inset-0">
        <img 
          src="/hero-bg.png" 
          alt="Hero background" 
          className="w-full h-full opacity-60" 
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%'
          }}
        />
        <div className="absolute inset-0 bg-[#1717179E]"></div>
      </div>

      <div className="relative h-full flex items-center py-12 sm:py-16 lg:py-0" style={{paddingTop: '80px', marginTop: '60px'}}>
        <div className="max-w-7xl mx-auto px-[30px] w-full" style={{ paddingLeft: '30px' }}>
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8">
            <div className="max-w-2xl text-center lg:text-left w-full">
            <div className="inline-flex items-center justify-center mb-4 w-[132px] h-[30px] rounded-[24px] bg-orange-500/15">
              <span className="text-orange-400 text-[12px] font-semibold tracking-wider uppercase">ElevenTrails</span>
            </div>
            <h1 className="font-rubik-one text-4xl sm:text-5xl lg:text-[64px] font-bold text-white mb-6 leading-tight w-full max-w-full lg:w-[519px]">
              UNLEASH THE
              <br />
              THRILL OF THE
              <br />
              <span className="text-orange-500">OPEN ROAD</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Experience the ultimate dirt bike adventure across stunning trails and challenging terrain.
            </p>
            <div className="flex justify-center lg:justify-start">
              <a 
                href="/rides"
                className="flex items-stretch overflow-hidden rounded-none font-bold transition hover:opacity-90 scale-80 sm:scale-100"
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
                  backgroundColor: '#081E4C'
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
            </div>
            <div className="shrink-0 hidden lg:block -ml-[100px]" style={{ marginTop: '80px' }}>
              <img src="/hero-pic-obj.png" alt="Hero rider" className="w-[645px] h-[645px] object-contain max-w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
