export default function Gear() {
  return (
    <section className="bg-white pt-6 sm:pt-8 pb-12 sm:pb-16 lg:pb-20 -mt-[50px]">
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="w-full max-w-full">
            <h2 className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-6 leading-tight w-full max-w-full md:w-[583px]">
              <span className="block">GEAR UP FOR</span>
              <span className="block">THE <span className="text-orange-500">ADVENTURE</span></span>
            </h2>
            <p className="text-slate-950 text-lg mb-6">
              We provide top-quality protective gear and equipment to ensure your safety and comfort on every ride. From
              helmets to protective suits, we've got everything you need.
            </p>
            <p className="text-slate-950 text-lg mb-6">
              Our gear is regularly maintained and meets international safety standards. We understand that quality equipment
              is essential for an enjoyable and safe adventure, which is why we never compromise on safety.
            </p>
          </div>
          <div className="relative inline-block w-full max-w-full scale-[0.85] md:scale-100 origin-center">
            <img src="/motorcycle-helmet-protective-gear.jpg" alt="Gear 1" className="w-full max-w-full h-auto object-cover" style={{ maxWidth: '469px', height: 'auto', aspectRatio: '469/368', borderRadius: '0' }} />
            <div className="absolute -left-[5px] -bottom-[35px] w-[272px] max-w-[60%] h-auto bg-orange-500 z-0" style={{aspectRatio:'272/174'}}></div>
            <img
              src="/motorcycle-gloves-boots.jpg"
              alt="Gloves and Boots"
              className="absolute -left-[20px] -bottom-[20px] w-[272px] max-w-[60%] h-auto object-cover z-10 shadow-md"
              style={{aspectRatio:'272/174', borderRadius: '0'}}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
