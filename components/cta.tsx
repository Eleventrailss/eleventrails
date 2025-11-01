export default function CTA() {
  return (
    <section className="bg-orange-500 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 
            className="text-white text-center lg:text-left"
            style={{
              fontFamily: 'Rubik One, sans-serif',
              fontSize: 'clamp(32px, 6vw, 64px)',
              fontWeight: 400
            }}
          >
            PLAN YOUR <span className="text-slate-950">RIDE</span>
          </h2>
          <button className="bg-white hover:bg-gray-100 text-orange-500 px-6 sm:px-8 py-2 sm:py-3 rounded-none font-bold text-base sm:text-lg transition w-full sm:w-auto scale-80 sm:scale-100">
            CONTACT US
          </button>
        </div>
      </div>
    </section>
  )
}
