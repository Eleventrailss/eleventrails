import { ArrowRight } from "lucide-react"

export default function YouMayAlsoLikeRidesDetail() {
  const rides = [
    {
      id: 2,
      title: "Intermediate Ridge",
      price: "$75/Day",
      image: "/intermediate-mountain-trail.jpg",
      categories: ["Medium", "Adventure", "Fun"],
      description: "Untuk rider berpengalaman, lebih banyak tanjakan dan petualangan menantang."
    },
    {
      id: 3,
      title: "Expert Challenge",
      price: "$100/Day",
      image: "/expert-extreme-bike-trail.jpg",
      categories: ["Hard", "Technical", "Adrenaline"],
      description: "Trek ekstrim untuk ekstremis dengan rintangan teknikal."
    },
    {
      id: 4,
      title: "Dual Package",
      price: "$120/Day",
      image: "/two-riders-adventure.jpg",
      categories: ["Couple", "Teamwork", "Fun"],
      description: "Paket petualangan berdua, nikmati teamwork serta tantangan berpasangan."
    },
  ]

  return (
    <section className="bg-white pb-12 sm:pb-16 lg:pb-20" style={{ paddingTop: '100px' }}>
      <div className="max-w-7xl mx-auto px-[30px]">
        <h2 
          className="text-slate-950 text-center mb-12 sm:mb-16 mx-auto"
          style={{
            fontFamily: 'Rubik One, sans-serif',
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 400,
            width: '100%',
            maxWidth: '726px',
            lineHeight: '1.2'
          }}
        >
          YOU MAY ALSO LIKE
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="overflow-hidden md:hover:transform md:hover:scale-105 transition w-full max-w-[352px]"
            >
              {/* 1. Gambar */}
              <img src={ride.image || "/placeholder.svg"} alt={ride.title} className="w-full h-auto object-cover" style={{aspectRatio:'352/265', borderRadius:'0'}} />
              <div className="w-full">
                {/* 2. Category - background oranye, text putih, font Rubik One */}
                <div className="flex gap-2 mt-4 mb-2">
                  {ride.categories && ride.categories.map((cat, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        fontFamily: 'Rubik One, sans-serif',
                        backgroundColor: '#EE6A28',
                        color: '#ffffff'
                      }}
                      className="px-3 py-1 text-xs uppercase"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                {/* 3. Judul */}
                <h3 className="text-slate-950 font-bold text-lg mb-2">{ride.title}</h3>
                {/* 4. Harga */}
                <p className="text-gray-600 mb-4">{ride.price}</p>
                {/* 5. Short description */}
                <p className="text-gray-600 text-sm mb-3">{ride.description}</p>
                {/* 6. Readmore - label biru, panah oranye dengan background lingkaran transparan */}
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 no-underline hover:opacity-80 transition"
                  style={{
                    width: '93px',
                    height: '30px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    color: '#3b82f6'
                  }}
                >
                  Readmore
                  <span 
                    className="flex items-center justify-center rounded-full border-2 border-orange-500 flex-shrink-0"
                    style={{
                      width: '24px',
                      height: '24px',
                      minWidth: '24px',
                      minHeight: '24px',
                      maxWidth: '24px',
                      maxHeight: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      boxSizing: 'border-box',
                      aspectRatio: '1 / 1',
                      padding: '0',
                      flexShrink: 0,
                      flexGrow: 0
                    }}
                  >
                    <ArrowRight size={12} strokeWidth={2.5} style={{ color: '#EE6A28' }} />
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

