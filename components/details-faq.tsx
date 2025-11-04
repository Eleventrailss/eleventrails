"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface FAQ {
  id: string
  question: string
  answer: string
  display_order: number
  is_active: boolean
}

export default function DetailsFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setFaqs(data || [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No FAQs available at the moment.</p>
            </div>
          ) : (
            <div className="w-full space-y-4 mb-6">
              {faqs.map((faq, index) => (
                <div key={faq.id}>
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
          )}
        </div>
      </div>
    </section>
  )
}

