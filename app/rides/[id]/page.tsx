"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Testimonials from "@/components/testimonials"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { Clock, MapPin, Navigation, TrendingUp, HelpCircle, ChevronDown, ChevronUp, Users, Calendar, DollarSign, Shield, Zap, Mountain, Route, Activity, Target, Award, AlertCircle, CheckCircle, Info, Star, Heart, Camera, Video, Phone, Mail, MessageSquare, Bell, Settings, BarChart, Flame, Droplet, Sun, Moon, Wind, Cloud, Umbrella, Eye, EyeOff, Lock, Unlock, Gift, ShoppingBag, Package, Truck, Car, Bike, Train, Plane, Ship, Home, Building, Map, Compass, Flag, Sparkles, ArrowRight } from "lucide-react"

interface Ride {
  id: string
  title: string
  tags: string[]
  description: string | null
  primary_picture: string | null
  secondary_picture: string | null
  original_price: number
  final_price: number
  type: 'group' | 'personal'
  duration: string | null
  location: string | null
  meeting_point: string | null
  difficulty_level: string | null
  whatsapp_message: string | null
}

interface RideInfo {
  id: string
  icon: string
  question: string
  answer: string
  display_order: number
}

interface GalleryPhoto {
  id: string
  photo_url: string
  alt_text: string | null
  display_order: number
}

interface RelatedRide {
  id: string
  title: string
  tags: string[]
  short_description: string | null
  primary_picture: string | null
  final_price: number
  type: 'group' | 'personal'
}

// Icon mapping
const iconMap: Record<string, any> = {
  Clock,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Mountain,
  Route,
  Navigation,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Heart,
  Camera,
  Video,
  Phone,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  BarChart,
  TrendingUp,
  Flame,
  Droplet,
  Sun,
  Moon,
  Wind,
  Cloud,
  Umbrella,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Gift,
  ShoppingBag,
  Package,
  Truck,
  Car,
  Bike,
  Train,
  Plane,
  Ship,
  Home,
  Building,
  Map,
  Compass,
  Flag,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp
}

export default function RidesDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rideId = params?.id as string
  
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6282266007272"
  
  const [loading, setLoading] = useState(true)
  const [ride, setRide] = useState<Ride | null>(null)
  const [rideInfos, setRideInfos] = useState<RideInfo[]>([])
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([])
  const [relatedRides, setRelatedRides] = useState<RelatedRide[]>([])
  const [openIndex, setOpenIndex] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (rideId) {
      fetchRideData()
    }
  }, [rideId])

  const fetchRideData = async () => {
    try {
      setLoading(true)

      // Fetch ride data
      const { data: rideData, error: rideError } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .eq('is_active', true)
        .single()

      if (rideError || !rideData) {
        throw new Error('Ride not found')
      }

      setRide(rideData)

      // Fetch ride_infos
      const { data: infosData, error: infosError } = await supabase
        .from('ride_infos')
        .select('*')
        .eq('ride_id', rideId)
        .order('display_order', { ascending: true })

      if (infosError) {
        console.error('Error fetching ride infos:', infosError)
      } else {
        setRideInfos(infosData || [])
      }

      // Fetch gallery photos
      const { data: galleryData, error: galleryError } = await supabase
        .from('ride_gallery_photos')
        .select('*')
        .eq('ride_id', rideId)
        .order('display_order', { ascending: true })

      if (galleryError) {
        console.error('Error fetching gallery photos:', galleryError)
        setGalleryPhotos([])
      } else {
        const photos = galleryData || []
        setGalleryPhotos(photos)
        console.log('Gallery photos fetched:', photos.length)
      }

      // Fetch related rides (excluding current ride)
      const { data: relatedData, error: relatedError } = await supabase
        .from('rides')
        .select('id, title, tags, short_description, primary_picture, final_price, type')
        .eq('is_active', true)
        .neq('id', rideId)
        .order('created_at', { ascending: false })
        .limit(3)

      if (relatedError) {
        console.error('Error fetching related rides:', relatedError)
      } else {
        setRelatedRides(relatedData || [])
      }
    } catch (error: any) {
      console.error('Error fetching ride:', error)
      router.push('/rides')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, type?: 'group' | 'personal') => {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
    
    if (type) {
      const typeLabel = type === 'personal' ? 'Person' : 'Group'
      return `${formattedPrice} / ${typeLabel}`
    }
    
    return formattedPrice
  }

  const getTypeLabel = (type: 'group' | 'personal') => {
    return type === 'personal' ? 'Person' : 'Group'
  }

  const toggleItem = (index: number) => {
    setOpenIndex(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <main className="bg-[#272727] w-full overflow-x-hidden max-w-full">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p 
            className="text-white"
            style={{
              fontFamily: 'Rubik One, sans-serif',
              fontWeight: 400,
              fontSize: '24px'
            }}
          >
            Get Ready...
          </p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!ride) {
    return null
  }

  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      
      {/* Hero Section */}
      <section className="relative -mt-[180px] pt-[600px] sm:pt-[180px] pb-5 sm:pb-0 min-h-[400px] sm:min-h-[400px] lg:min-h-[668px] w-full max-w-[1452px] mx-auto bg-slate-950 overflow-visible">
        <div className="absolute inset-0">
          <img 
            src={ride.primary_picture || "/hero-bg.png"} 
            alt="Hero background" 
            className="w-full h-full opacity-60" 
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%'
            }}
            onError={(e) => {
              e.currentTarget.src = '/hero-bg.png'
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
            RIDES DETAIL
          </h1>
        </div>
      </section>

      {/* Detail Section */}
      <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-0" style={{ marginBottom: 0, paddingBottom: '50px' }}>
        <div className="max-w-7xl mx-auto px-[30px] relative">
          <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
            <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
          </div>
          <div className="relative z-10">
            <h2 
              className="text-slate-950 text-left mb-4 break-words"
              style={{
                fontFamily: 'Rubik One, sans-serif',
                fontSize: 'clamp(32px, 6vw, 64px)',
                fontWeight: 400,
                width: '100%',
                maxWidth: '100%',
                lineHeight: '1.2',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {ride.title.toUpperCase()}
            </h2>
            {ride.description && (
              <p className="text-gray-600 text-lg text-left mb-6 sm:mb-8 max-w-3xl px-4">
                {ride.description}
              </p>
            )}
            <div className="w-full mb-6 sm:mb-8">
              <img 
                src={ride.primary_picture || "/placeholder.svg"} 
                alt={ride.title}
                className="w-full h-auto object-cover"
                style={{
                  width: '1120px',
                  height: '371px',
                  maxWidth: '100%',
                  borderRadius: '0'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg'
                }}
              />
            </div>
            <div className="flex gap-4 items-start mb-6 sm:mb-8" style={{ flexWrap: 'wrap' }}>
              <div style={{ width: '668px', maxWidth: '100%' }}>
                <img 
                  src={ride.secondary_picture || "/placeholder.svg"} 
                  alt={ride.title}
                  className="h-auto object-cover"
                  style={{
                    width: '668px',
                    height: '188px',
                    maxWidth: '100%',
                    borderRadius: '0',
                    display: 'block',
                    marginBottom: '0'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
                <div 
                  style={{
                    width: '668px',
                    maxWidth: '100%',
                    borderRadius: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    padding: '16px',
                    boxSizing: 'border-box',
                    border: '1px solid #d1d5db',
                    borderTop: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
              <div>
                {ride.original_price > ride.final_price && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <p 
                      style={{
                        fontFamily: 'Rubik One, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(20px, 4vw, 36px)',
                        fontStyle: 'normal',
                        color: '#EE6A28',
                        margin: 0
                      }}
                    >
                      FROM
                    </p>
                    <p 
                      className="text-slate-950"
                      style={{
                        fontFamily: 'Rubik One, sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(14px, 2.5vw, 24px)',
                        fontStyle: 'normal',
                        margin: 0,
                        textDecoration: 'line-through',
                        opacity: 0.6
                      }}
                    >
                      {formatPrice(ride.original_price)}
                    </p>
                  </div>
                )}
                <p 
                  className="text-slate-950"
                  style={{
                    fontFamily: 'Rubik One, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(28px, 5vw, 48px)',
                    fontStyle: 'normal',
                    margin: 0
                  }}
                >
                  {formatPrice(ride.final_price)} / <span style={{ fontSize: 'clamp(14px, 3vw, 24px)' }}>{getTypeLabel(ride.type)}</span>
                </p>
              </div>
              <div className="flex gap-4 items-center" style={{ marginTop: '12px' }}>
                <a
                  href={ride.whatsapp_message || "https://wa.me/6281234567890"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Book via WhatsApp"
                  title="Book via WhatsApp"
                  className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 scale-80 sm:scale-100"
                  style={{
                    width: '182px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'stretch',
                    padding: '0',
                    border: 'none',
                    borderRadius: '0',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: '30%',
                      background: '#0A88B7',
                      flexShrink: 0
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: '70%',
                      background: '#EE6A28',
                      flex: 1
                    }}
                  >
                    <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#ffffff' }}>Book Now</span>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%20have%20a%20question%20about%20${encodeURIComponent(ride?.title || 'this ride')}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 scale-80 sm:scale-100"
                  style={{
                    width: '182px',
                    height: '46px',
                    background: '#0A88B7',
                    color: '#ffffff',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    fontStyle: 'normal',
                    border: 'none',
                    borderRadius: '0',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Ask Question
                </a>
              </div>
            </div>
          </div>
            <div 
              className="w-full sm:w-[435px]"
              style={{
                minHeight: 'auto',
                height: 'auto',
                backgroundColor: '#EE6A28',
                borderRadius: '0',
                flexShrink: 0,
                padding: 'clamp(16px, 4vw, 30px)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'clamp(16px, 4vw, 24px)'
              }}
            >
              {ride.duration && (
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock color="#ffffff" style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'clamp(8px, 2vw, 20px)', flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: 'clamp(14px, 3vw, 24px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      Duration
                    </p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 2.5vw, 18px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {ride.duration}
                    </p>
                  </div>
                </div>
              )}
              {ride.location && (
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin color="#ffffff" style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'clamp(8px, 2vw, 20px)', flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: 'clamp(14px, 3vw, 24px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      Location
                    </p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 2.5vw, 18px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {ride.location}
                    </p>
                  </div>
                </div>
              )}
              {ride.meeting_point && (
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Navigation color="#ffffff" style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'clamp(8px, 2vw, 20px)', flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: 'clamp(14px, 3vw, 24px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      Meeting Point
                    </p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 2.5vw, 18px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {ride.meeting_point}
                    </p>
                  </div>
                </div>
              )}
              {ride.difficulty_level && (
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp color="#ffffff" style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'clamp(8px, 2vw, 20px)', flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Rubik One, sans-serif', fontWeight: 400, fontSize: 'clamp(14px, 3vw, 24px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      Difficulty Level
                    </p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: 'clamp(12px, 2.5vw, 18px)', color: '#ffffff', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {ride.difficulty_level}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {rideInfos.length > 0 && (
            <>
              <div className="mt-12 mb-6">
                <h3 
                  className="text-slate-950 text-center"
                  style={{
                    fontFamily: 'Rubik One, sans-serif',
                    fontSize: 'clamp(28px, 5vw, 48px)',
                    fontWeight: 400,
                    lineHeight: '1.2'
                  }}
                >
                  ALL THE <span style={{ color: '#EE6A28' }}>IMPORTANT</span> INFO
                </h3>
              </div>

              <div className="w-full space-y-4 mb-0">
                {rideInfos.map((info, index) => {
                  const IconComponent = iconMap[info.icon] || HelpCircle
                  return (
                    <div key={info.id}>
                      <button
                        type="button"
                        onClick={() => toggleItem(index)}
                        className="w-full flex items-center gap-2 sm:gap-4 p-2 sm:p-4 hover:bg-gray-50 transition-colors"
                        style={{
                          textAlign: 'left',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          style={{
                            width: 'clamp(40px, 8vw, 60px)',
                            height: 'clamp(40px, 8vw, 60px)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <IconComponent style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)', color: '#0A88B7' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: 'Rubik One, sans-serif',
                              fontWeight: 400,
                              fontSize: 'clamp(16px, 3vw, 32px)',
                              color: '#1f2937',
                              margin: 0,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {info.question}
                          </p>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          {openIndex.has(index) ? (
                            <ChevronUp size={20} color="#1f2937" style={{ width: 'clamp(20px, 4vw, 24px)', height: 'clamp(20px, 4vw, 24px)' }} />
                          ) : (
                            <ChevronDown size={20} color="#1f2937" style={{ width: 'clamp(20px, 4vw, 24px)', height: 'clamp(20px, 4vw, 24px)' }} />
                          )}
                        </div>
                      </button>
                      {openIndex.has(index) && (
                        <div
                          className="pb-4 pl-14 sm:pl-20 md:pl-24"
                          style={{
                            paddingTop: '0',
                            paddingRight: 'clamp(8px, 2vw, 16px)',
                            width: '100%',
                            boxSizing: 'border-box',
                            maxWidth: '100%'
                          }}
                        >
                          <div
                            className="rich-text-content"
                            dangerouslySetInnerHTML={{ __html: info.answer }}
                            style={{
                              fontFamily: 'Plus Jakarta Sans, sans-serif',
                              fontWeight: 400,
                              fontSize: 'clamp(14px, 2.5vw, 18px)',
                              color: '#4b5563',
                              margin: 0,
                              lineHeight: '1.6',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              maxWidth: '100%'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>

      {/* Gallery Section */}
      {galleryPhotos.length > 0 && (
        <section className="relative -mt-0 pt-0 -mb-0" style={{ backgroundColor: '#272727', paddingBottom: '50px', marginTop: 0, paddingTop: '50px', marginBottom: 0 }}>
          <div className="max-w-7xl mx-auto px-[30px] relative" style={{ paddingTop: 0, marginTop: 0 }}>
            <div className="relative z-10">
              <div className="flex gap-6 items-start mb-6 sm:mb-8" style={{ flexWrap: 'wrap' }}>
                <div className="flex gap-6 items-start" style={{ flexWrap: 'wrap', width: '100%' }}>
                  {galleryPhotos.length > 0 && (
                    <div style={{ width: '576px', maxWidth: '100%' }}>
                      <img 
                        src={galleryPhotos[0].photo_url} 
                        alt={galleryPhotos[0].alt_text || 'Gallery photo'}
                        className="h-auto object-cover"
                        style={{
                          width: '576px',
                          height: '371px',
                          maxWidth: '100%',
                          borderRadius: '0'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <h2 
                      className="mb-4"
                      style={{
                        fontFamily: 'Rubik One, sans-serif',
                        fontSize: 'clamp(28px, 4vw, 48px)',
                        fontWeight: 400,
                        color: '#ffffff',
                        lineHeight: '1.2'
                      }}
                    >
                      OUR GALLERY
                    </h2>
                    <p 
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '16px',
                        color: '#ffffff',
                        lineHeight: '1.6',
                        margin: 0
                      }}
                    >
                      {ride.description || 'Explore our gallery of amazing ride experiences and breathtaking trails.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {galleryPhotos.length > 1 && (
                <>
                  {galleryPhotos.slice(1, 4).length > 0 && (
                    <div className="flex gap-6 items-start mb-6 sm:mb-8" style={{ flexWrap: 'wrap' }}>
                      {galleryPhotos.slice(1, 4).map((photo, idx) => (
                        <div key={photo.id} style={{ width: '362px', maxWidth: '100%' }}>
                          <img 
                            src={photo.photo_url} 
                            alt={photo.alt_text || 'Gallery photo'}
                            className="h-auto object-cover"
                            style={{
                              width: '362px',
                              height: '286px',
                              maxWidth: '100%',
                              borderRadius: '0'
                            }}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {galleryPhotos.length > 4 && (
                    <div className="flex gap-6 items-start mb-0" style={{ flexWrap: 'wrap' }}>
                      {galleryPhotos.slice(4, 6).length === 2 ? (
                        <>
                          <div style={{ width: '362px', maxWidth: '100%' }}>
                            <img 
                              src={galleryPhotos[4].photo_url} 
                              alt={galleryPhotos[4].alt_text || 'Gallery photo'}
                              className="h-auto object-cover"
                              style={{
                                width: '362px',
                                height: '286px',
                                maxWidth: '100%',
                                borderRadius: '0'
                              }}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg'
                              }}
                            />
                          </div>
                          <div style={{ width: '741px', maxWidth: '100%' }}>
                            <img 
                              src={galleryPhotos[5]?.photo_url || '/placeholder.svg'} 
                              alt={galleryPhotos[5]?.alt_text || 'Gallery photo'}
                              className="h-auto object-cover"
                              style={{
                                width: '741px',
                                height: '286px',
                                maxWidth: '100%',
                                borderRadius: '0'
                              }}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg'
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        galleryPhotos.slice(4).map((photo, idx) => (
                          <div key={photo.id} style={{ width: '362px', maxWidth: '100%' }}>
                            <img 
                              src={photo.photo_url} 
                              alt={photo.alt_text || 'Gallery photo'}
                              className="h-auto object-cover"
                              style={{
                                width: '362px',
                                height: '286px',
                                maxWidth: '100%',
                                borderRadius: '0'
                              }}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg'
                              }}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* You May Also Like Section */}
      {relatedRides.length > 0 && (
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
              {relatedRides.map((relatedRide) => (
                <div
                  key={relatedRide.id}
                  className="overflow-hidden md:hover:transform md:hover:scale-105 transition w-full max-w-[352px]"
                >
                  {/* 1. Gambar */}
                  <img 
                    src={relatedRide.primary_picture || "/placeholder.svg"} 
                    alt={relatedRide.title} 
                    className="w-full h-auto object-cover" 
                    style={{aspectRatio:'352/265', borderRadius:'0'}} 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  <div className="w-full">
                    {/* 2. Category - background oranye, text putih, font Rubik One */}
                    <div className="flex gap-2 mt-4 mb-2">
                      {relatedRide.tags && relatedRide.tags.map((cat, idx) => (
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
                    <h3 className="text-slate-950 font-bold text-lg mb-2">{relatedRide.title}</h3>
                    {/* 4. Harga */}
                    <p className="text-gray-600 mb-4">{formatPrice(relatedRide.final_price, relatedRide.type)}</p>
                    {/* 5. Short description */}
                    <p className="text-gray-600 text-sm mb-3">{relatedRide.short_description || ''}</p>
                    {/* 6. Readmore - label biru, panah oranye dengan background lingkaran transparan */}
                    <a 
                      href={`/rides/${relatedRide.id}`} 
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
      )}

      <Testimonials />
      <Values />
      <CTA />
      <Footer />
      
      <style jsx global>{`
        .rich-text-content {
          color: #4b5563;
        }
        .rich-text-content p {
          margin: 0.5em 0;
          color: #4b5563;
        }
        .rich-text-content p:first-child {
          margin-top: 0;
        }
        .rich-text-content p:last-child {
          margin-bottom: 0;
        }
        .rich-text-content strong {
          font-weight: 600;
          color: #4b5563;
        }
        .rich-text-content em {
          font-style: italic;
          color: #4b5563;
        }
        .rich-text-content u {
          text-decoration: underline;
          color: #4b5563;
        }
        .rich-text-content ul,
        .rich-text-content ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
          color: #4b5563;
        }
        .rich-text-content li {
          margin: 0.25em 0;
          color: #4b5563;
        }
        .rich-text-content h1 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.75em 0 0.5em 0;
          color: #4b5563;
        }
        .rich-text-content h2 {
          font-size: 1.3em;
          font-weight: 600;
          margin: 0.75em 0 0.5em 0;
          color: #4b5563;
        }
        .rich-text-content h3 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 0.75em 0 0.5em 0;
          color: #4b5563;
        }
        .rich-text-content h1:first-child,
        .rich-text-content h2:first-child,
        .rich-text-content h3:first-child {
          margin-top: 0;
        }
      `}</style>
    </main>
  )
}

