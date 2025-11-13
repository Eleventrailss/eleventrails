"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getSupabaseImageUrl } from "@/lib/supabase-storage"

interface Ride {
  id: string
  title: string
  tags: string[]
  short_description: string | null
  primary_picture: string | null
  final_price: number
  type: "group" | "personal"
}

export default function Rides() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [isMarqueeActive, setIsMarqueeActive] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    fetchRides()

    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMarqueeActive(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observerRef.current = observer

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  const fetchRides = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("rides")
        .select(
          "id, title, tags, short_description, primary_picture, final_price, type"
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error

      const processedRides = (data || []).map((ride) => {
        let imageUrl: string | null = null

        // Jika base64, gunakan langsung
        if (ride.primary_picture?.startsWith("data:image")) {
          imageUrl = ride.primary_picture
        } else if (ride.primary_picture) {
          // Jika path storage, ubah jadi URL publik Supabase
          imageUrl = getSupabaseImageUrl(ride.primary_picture)
        }

        return {
          ...ride,
          primary_picture: imageUrl || "/placeholder.svg",
        }
      })

      setRides(processedRides)
    } catch (error) {
      console.error("Error fetching rides:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, type: "group" | "personal") => {
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)

    const typeLabel = type === "personal" ? "Person" : "Group"
    return `${formattedPrice} / ${typeLabel}`
  }

  return (
    <section
      ref={sectionRef}
      className="pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-[200px] overflow-hidden"
      style={{ backgroundColor: "#272727" }}
    >
      <div className="max-w-7xl mx-auto px-[30px]">
        <h2
          className="text-white text-center mb-12 sm:mb-16 mx-auto"
          style={{
            fontFamily: "Rubik One, sans-serif",
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: 400,
            width: "100%",
            maxWidth: "726px",
            lineHeight: "1.2",
          }}
        >
          CHOOSE YOUR RIDES
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">Memuat data rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">Belum ada rides tersedia</p>
          </div>
        ) : (
          <>
            <div className="relative w-full overflow-hidden mb-8 sm:mb-12">
              <div
                className="flex gap-6"
                style={{
                  animation: isMarqueeActive
                    ? "marquee 90s linear infinite"
                    : "none",
                  width: "fit-content",
                }}
              >
                {[...rides, ...rides].map((ride, index) => (
                  <div
                    key={`${ride.id}-${index}`}
                    className="w-[320px] sm:w-[352px] flex-shrink-0 overflow-hidden md:hover:transform md:hover:scale-105 transition origin-center bg-[#1f1f1f]"
                  >
                    <img
                      src={ride.primary_picture || "/placeholder.svg"}
                      alt={ride.title}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: "352/265", borderRadius: "0" }}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="w-full px-4 py-5 sm:px-6 sm:py-6">
                      <div className="flex gap-2 mt-1 mb-3 flex-wrap">
                        {ride.tags &&
                          ride.tags.map((cat, idx) => (
                            <span
                              key={`${cat}-${idx}`}
                              style={{
                                fontFamily: "Rubik One, sans-serif",
                                backgroundColor: "#EE6A28",
                                color: "#ffffff",
                              }}
                              className="px-3 py-1 text-xs uppercase"
                            >
                              {cat}
                            </span>
                          ))}
                      </div>

                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                        {ride.title}
                      </h3>

                      <p className="text-gray-400 mb-3">
                        {formatPrice(ride.final_price, ride.type)}
                      </p>

                      <p className="text-slate-200 text-sm mb-4 line-clamp-3">
                        {ride.short_description || ""}
                      </p>

                      <a
                        href={`/rides/${ride.id}`}
                        className="inline-flex items-center gap-2 no-underline hover:opacity-80 transition"
                        style={{
                          width: "auto",
                          fontFamily: "Plus Jakarta Sans, sans-serif",
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "#3b82f6",
                        }}
                      >
                        Readmore
                        <span
                          className="flex items-center justify-center rounded-full border-2 border-orange-500 flex-shrink-0"
                          style={{
                            width: "24px",
                            height: "24px",
                            minWidth: "24px",
                            minHeight: "24px",
                            borderRadius: "50%",
                            backgroundColor: "transparent",
                            boxSizing: "border-box",
                            aspectRatio: "1 / 1",
                            padding: "0",
                            flexShrink: 0,
                            flexGrow: 0,
                          }}
                        >
                          <ArrowRight
                            size={12}
                            strokeWidth={2.5}
                            style={{ color: "#EE6A28" }}
                          />
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <a
                href="/rides"
                className="flex items-stretch mx-auto overflow-hidden rounded-none font-bold transition hover:opacity-90 scale-80 sm:scale-100"
                style={{
                  width: "234px",
                  height: "58px",
                  textDecoration: "none",
                }}
              >
                <span
                  className="flex-shrink-0"
                  style={{ width: "15%", backgroundColor: "#081E4C" }}
                />
                <span
                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                  style={{ width: "85%" }}
                >
                  EXPLORE RIDES
                </span>
              </a>
            </div>
          </>
        )}
      </div>

      {/* Marquee Animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
