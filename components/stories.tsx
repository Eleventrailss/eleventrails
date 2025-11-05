"use client"

import { useState, useEffect, useRef } from "react"
import { getGeneralSetting, getGeneralSettings } from "@/lib/general-settings"
import { getSupabaseImageUrl } from "@/lib/supabase-storage"

export default function Stories() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null)
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [textParagraph, setTextParagraph] = useState("")

  useEffect(() => {
    fetchVideoAndThumbnail()
    fetchTextParagraph()
  }, [])

  const fetchTextParagraph = async () => {
    const text = await getGeneralSetting('home_tales_text_paragraph')
    if (text) {
      setTextParagraph(text)
    }
  }

  const fetchVideoAndThumbnail = async () => {
    try {
      setIsLoading(true)
      const [video, thumbnail] = await Promise.all([
        getGeneralSetting('home_stories_vid'),
        getGeneralSetting('home_stories_thumbnail')
      ])
      
      console.log('Fetched video from settings:', video)
      console.log('Fetched thumbnail from settings:', thumbnail)
      
      if (video && video.trim()) {
        const trimmedVideo = video.trim()
        console.log('Setting video source to:', trimmedVideo)
        setVideoSrc(getSupabaseImageUrl(trimmedVideo) || trimmedVideo)
        setVideoError(false)
      } else {
        console.warn('No video found in general settings with key home_stories_vid')
        setVideoSrc(null)
        setVideoError(true)
      }

      if (thumbnail && thumbnail.trim()) {
        setThumbnailSrc(getSupabaseImageUrl(thumbnail.trim()) || thumbnail.trim())
      } else {
        console.warn('No thumbnail found in general settings with key home_stories_thumbnail')
        setThumbnailSrc(null)
      }
    } catch (error) {
      console.error('Error fetching video and thumbnail:', error)
      setVideoSrc(null)
      setThumbnailSrc(null)
      setVideoError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Reload video saat videoSrc berubah
    if (videoRef.current && videoSrc) {
      console.log('Reloading video with src:', videoSrc)
      setVideoLoaded(false)
      videoRef.current.load()
    }
  }, [videoSrc])

  useEffect(() => {
    if (hasAnimated || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            // Trigger animation for video
            const video = entry.target.querySelector('[data-stories-video]')
            if (video) {
              setTimeout(() => {
                (video as HTMLElement).style.transform = 'scale(1)'
                ;(video as HTMLElement).style.opacity = '1'
              }, 0)
            }
          }
        })
      },
      { threshold: 0.2 }
    )

    observerRef.current = observer

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [hasAnimated])

  return (
    <section className="relative bg-cyan-600 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="w-full max-w-full">
            <h2 
              className="text-white mb-6 w-full max-w-full"
              style={{
                fontFamily: 'Rubik One, sans-serif',
                fontSize: 'clamp(28px, 6vw, 64px)',
                fontWeight: 400,
                maxWidth: '100%',
                width: '100%',
                height: 'auto',
                lineHeight: '1.2'
              }}
            >
              <span className="block">TALES FROM</span>
              <span className="block"><span className="text-orange-500">LOMBOK</span> TRAILS</span>
            </h2>
            {textParagraph ? (
              <div className="text-white text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: textParagraph }} />
            ) : (
              <>
            <p className="text-white text-lg leading-relaxed mb-6">
              Experience the legendary trails of Lombok, where adventure meets natural beauty. Our riders have conquered
              some of the most challenging and scenic routes in the region, creating stories that will inspire your next
              adventure.
            </p>
            <p className="text-white text-lg leading-relaxed mb-6">
              From conquering steep mountain passes to navigating through dense jungles, these stories showcase the spirit
              of exploration and the beauty of Lombok's untamed wilderness. Let their experiences guide your journey.
            </p>
              </>
            )}
          </div>
          <div ref={containerRef} className="flex items-start gap-[30px] relative w-full max-w-full overflow-visible">
            {isLoading ? (
              <div 
                data-stories-video
                className="w-full h-auto bg-slate-800 flex items-center justify-center"
                style={{
                  height:'auto',
                  minHeight:'240px',
                  aspectRatio:'16/9',
                  transform: 'scale(0.8)',
                  opacity: '0',
                  transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
                }}
              >
                <p className="text-white text-center p-4">Memuat video...</p>
              </div>
            ) : videoSrc && !videoError ? (
              <div className="relative w-full" style={{ display: 'contents' }}>
                {!videoLoaded && (
                  <div 
                    className="absolute inset-0 bg-slate-800 flex items-center justify-center z-10 pointer-events-none"
                    style={{
                      backgroundImage: thumbnailSrc ? `url(${thumbnailSrc})` : 'url(/placeholder.svg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '120%',
                      height: 'auto',
                      minHeight: '240px',
                      aspectRatio: '16/9',
                      opacity: videoLoaded ? 0 : 1,
                      transition: 'opacity 0.3s ease-out'
                    }}
                  >
                    {!thumbnailSrc && (
                      <p className="text-white text-center p-4">Memuat video...</p>
                    )}
                  </div>
                )}
                <video 
                  key={videoSrc}
                  ref={videoRef}
                  data-stories-video
                  src={videoSrc}
                  className="h-auto" 
                  style={{
                    width:'120%',
                    height:'auto',
                    minHeight:'240px',
                    aspectRatio:'16/9',
                    objectFit:'cover',
                    background:'#333',
                    transform: 'scale(0.8)',
                    opacity: videoLoaded ? '1' : '0',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
                  }} 
                  controls
                  autoPlay={false}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={thumbnailSrc || "/placeholder.svg?height=300&width=300"}
                  tabIndex={-1}
                  onClick={(e) => {
                    const video = e.currentTarget
                    if (video.paused) {
                      video.play().catch(err => console.error('Error playing video:', err))
                    } else {
                      video.pause()
                    }
                  }}
                  onLoadedData={(e) => {
                    console.log('Video loaded successfully:', videoSrc)
                    setVideoLoaded(true)
                    setVideoError(false)
                  }}
                  onLoadedMetadata={(e) => {
                    console.log('Video metadata loaded:', videoSrc)
                    setVideoLoaded(true)
                  }}
                  onCanPlay={(e) => {
                    console.log('Video can play:', videoSrc)
                    setVideoLoaded(true)
                  }}
                  onCanPlayThrough={(e) => {
                    console.log('Video can play through:', videoSrc)
                    setVideoLoaded(true)
                  }}
                  onError={(e) => {
                    console.error('Video error:', e)
                    console.error('Video source:', videoSrc)
                    const videoElement = e.currentTarget
                    console.error('Video error code:', videoElement.error?.code)
                    console.error('Video error message:', videoElement.error?.message)
                    setVideoError(true)
                    setVideoLoaded(false)
                  }}
                  onLoadStart={() => {
                    console.log('Video load started:', videoSrc)
                    setVideoLoaded(false)
                  }}
                >
                  <source src={videoSrc} type="video/mp4" />
                  <source src={videoSrc} type="video/webm" />
                  <source src={videoSrc} type="video/ogg" />
                  Maaf, browser Anda tidak mendukung pemutaran video.
                </video>
              </div>
            ) : (
              <div 
                data-stories-video
                className="w-full h-auto bg-slate-800 flex items-center justify-center"
                style={{
                  height:'auto',
                  minHeight:'240px',
                  aspectRatio:'16/9',
                  backgroundImage: 'url(/placeholder.svg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scale(0.8)',
                  opacity: '0',
                  transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
                }}
              >
                <p className="text-white text-center p-4 bg-black/50 rounded">
                  {videoError ? 'Video tidak dapat dimuat' : 'Video belum diatur'}
                </p>
              </div>
            )}
            <div className="hidden md:block" style={{position:'absolute',right:'-45px',top:'50%',transform:'translateY(-50%)',width:'30px',height:'368px',backgroundColor:'#EE6A28'}}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
