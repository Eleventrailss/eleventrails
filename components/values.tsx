export default function Values() {
  const values = [
    { title: "Safety", description: "Our top priority is the safety of every rider." },
    { title: "Excellence", description: "We always strive to be the best in service and experience." },
    { title: "Adventure", description: "Unforgettable adventures to boost your adrenaline." },
    { title: "Community", description: "Building a solid and supportive rider community." },
  ]

  return (
    <section className="bg-white -mt-[50px] pt-[100px] pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-[30px]">
        <h2 
          className="text-slate-950 text-center mb-12 sm:mb-16 mx-auto"
          style={{
            fontFamily: 'Rubik One, sans-serif',
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 400
          }}
        >
          RIDES <span className="text-orange-500">CORE</span> VALUE
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-center">
          {values.map((value, index) => (
            <div
              key={index}
              className="values-card-container relative w-full max-w-[256px] mx-auto"
              style={{
                height:'auto', 
                aspectRatio:'256/359'
              }}
            >
              <div className="values-card relative w-full h-full cursor-pointer">
                {/* Front Side (Image with Title) */}
                <div className="values-card-front absolute w-full h-full">
                  <img
                    src="/off-road-motorcycle.jpg"
                    alt={value.title}
                    className="object-cover w-full h-full"
                    style={{filter: 'blur(1px)', borderRadius: '0'}}
                  />
                  <div className="absolute inset-0 bg-black" style={{opacity: 0.2}}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl text-center z-10" style={{fontFamily:'Rubik One, sans-serif', fontWeight: 400}}>{value.title}</h3>
                  </div>
                </div>

                {/* Back Side (Description) */}
                <div className="values-card-back absolute w-full h-full flex items-center justify-center p-6" style={{backgroundColor: '#EE6A28'}}>
                  <p className="text-white text-center leading-relaxed" style={{fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:'16px', fontWeight:500}}>
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
