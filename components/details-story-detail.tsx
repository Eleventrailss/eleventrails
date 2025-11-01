export default function DetailsStoryDetail() {
  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 -mb-[-20px]">
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10">
          <h2 
            className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-6 leading-tight text-left"
            style={{
              fontFamily: 'Rubik One, sans-serif',
              fontWeight: 400
            }}
          >
            STORIES
          </h2>
          
          <div className="mb-6" style={{ paddingBottom: '100px' }}>
            <img 
              src="/off-road-motorcycle.jpg" 
              alt="Off-road motorcycle" 
              className="w-full max-w-full h-auto object-cover" 
              style={{
                width: '1120px',
                height: '591px',
                maxWidth: '100%',
                borderRadius: '0'
              }} 
            />
          </div>
          
          <div className="space-y-4">
            <p 
              className="text-gray-600 leading-relaxed"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize: '18px'
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris.
            </p>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize: '18px'
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris.
            </p>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize: '18px'
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

