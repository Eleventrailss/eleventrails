"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function DetailsFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "Bagaimana cara melakukan booking?",
      answer: "Anda dapat melakukan booking melalui WhatsApp atau mengisi formulir di website kami. Tim kami akan menghubungi Anda untuk konfirmasi dan detail lebih lanjut."
    },
    {
      question: "Apa yang perlu dibawa saat melakukan trail riding?",
      answer: "Kami menyediakan semua peralatan safety termasuk helm, sepatu boots, dan protective gear. Anda cukup membawa pakaian yang nyaman dan air minum. Kamera untuk dokumentasi juga direkomendasikan."
    },
    {
      question: "Berapa lama durasi perjalanan trail riding?",
      answer: "Durasi trail riding bervariasi tergantung paket yang dipilih, mulai dari 3 jam hingga 7 jam. Paket full day biasanya dimulai pagi hari dan selesai di sore hari."
    },
    {
      question: "Apakah tersedia untuk pemula?",
      answer: "Ya, kami memiliki paket khusus untuk pemula dengan jalur yang lebih mudah dan instruktur berpengalaman yang akan membantu Anda belajar teknik dasar trail riding dengan aman."
    },
    {
      question: "Bagaimana kebijakan pembatalan dan refund?",
      answer: "Pembatalan 48 jam sebelum jadwal akan mendapatkan refund penuh. Pembatalan kurang dari 48 jam akan dikenakan biaya 50%. Pembatalan di hari H tidak dapat di-refund."
    },
    {
      question: "Apa saja level kesulitan trail yang tersedia?",
      answer: "Kami menyediakan 3 level kesulitan: Easy (untuk pemula), Medium (untuk rider berpengalaman), dan Hard (untuk expert rider yang mencari tantangan ekstrem)."
    }
  ]

  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 -mb-[-20px]">
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[100px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10">
          <div className="mt-12 mb-6" style={{ paddingBottom: '50px' }}>
            <h3 
              className="text-slate-950 text-center"
              style={{
                fontFamily: 'Rubik One, sans-serif',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 400,
                lineHeight: '1.2'
              }}
            >
              <span style={{ color: '#EE6A28' }}>FAQs</span>
            </h3>
          </div>

          <div className="w-full space-y-4 mb-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors scale-90 sm:scale-100"
                  style={{
                    textAlign: 'left',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: 'Rubik One, sans-serif',
                        fontWeight: 400,
                        fontSize: '32px',
                        color: '#1f2937',
                        margin: 0
                      }}
                    >
                      {faq.question}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {openIndex === index ? (
                      <ChevronUp size={24} color="#1f2937" />
                    ) : (
                      <ChevronDown size={24} color="#1f2937" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div
                    className="px-4 pb-4"
                    style={{
                      paddingLeft: '16px',
                      paddingTop: '0'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        color: '#4b5563',
                        margin: 0,
                        lineHeight: '1.6'
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

