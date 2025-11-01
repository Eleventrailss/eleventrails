export default function HeroStories() {
  return (
    <section className="relative -mt-[180px] pt-[600px] sm:pt-[180px] pb-5 sm:pb-0 min-h-[400px] sm:min-h-[400px] lg:min-h-[668px] w-full max-w-[1452px] mx-auto bg-slate-950 overflow-visible">
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
        <div className="absolute inset-0 bg-[#171717DE]"></div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, calc(-50% + 100px))', width: '100%', height: '100%', padding: '20px', boxSizing: 'border-box'}}>
        <h1 
          className="font-rubik-one text-white text-center px-4 whitespace-nowrap"
          style={{
            fontFamily: 'Rubik One, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(32px, 8vw, 64px)',
            maxWidth: '354px',
            minHeight: '79px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '0'
          }}
        >
          STORIES
        </h1>
      </div>
    </section>
  )
}

