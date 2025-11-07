"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"

interface Story {
  id: string
  title: string
  author: string | null
  stories_detail: string | null
  pic: string | null
  tags: string[] | null
  is_active: boolean
  created_at: string
}

export default function StoriesDetailPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params?.id as string
  
  const [loading, setLoading] = useState(true)
  const [story, setStory] = useState<Story | null>(null)

  useEffect(() => {
    if (storyId) {
      fetchStoryData()
    }
  }, [storyId])

  const fetchStoryData = async () => {
    try {
      setLoading(true)

      // Fetch story data
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .eq('is_active', true)
        .single()

      if (storyError || !storyData) {
        throw new Error('Story not found')
      }

      setStory(storyData)
    } catch (error: any) {
      console.error('Error fetching story:', error)
      router.push('/stories')
    } finally {
      setLoading(false)
    }
  }

  // Split story detail into paragraphs for better display
  const splitIntoParagraphs = (text: string | null) => {
    if (!text) return []
    return text.split('\n\n').filter(p => p.trim().length > 0)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  if (!story) {
    return null
  }

  const paragraphs = splitIntoParagraphs(story.stories_detail)

  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      
      {/* Hero Section */}
      <section className="relative -mt-[180px] pt-[600px] sm:pt-[180px] pb-5 sm:pb-0 min-h-[400px] sm:min-h-[400px] lg:min-h-[668px] w-full max-w-[1452px] mx-auto bg-slate-950 overflow-visible">
        <div className="absolute inset-0">
          <img 
            src={story.pic || "/hero-bg.png"} 
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
            STORIES DETAIL
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
              className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-4 leading-tight text-left"
              style={{
                fontFamily: 'Rubik One, sans-serif',
                fontWeight: 400
              }}
            >
              {story.title}
            </h2>
            
            {/* Tags and Author */}
            <div className="mb-6 space-y-2">
              {story.tags && story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {story.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 text-sm rounded text-white uppercase"
                      style={{
                        fontFamily: 'Rubik One, sans-serif',
                        backgroundColor: '#EE6A28'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {(story.author || story.created_at) && (
                <div className="flex flex-wrap items-center gap-2">
                  {story.author && (
                    <p 
                      className="text-gray-600"
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px'
                      }}
                    >
                      By {story.author}
                    </p>
                  )}
                  {story.created_at && (
                    <>
                      {story.author && <span className="text-gray-400">•</span>}
                      <p 
                        className="text-gray-600"
                        style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontWeight: 400,
                          fontSize: '16px'
                        }}
                      >
                        {formatDate(story.created_at)}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-6" style={{ paddingBottom: '100px' }}>
              <img 
                src={story.pic || "/placeholder.svg"} 
                alt={story.title}
                className="w-full max-w-full h-auto object-cover" 
                style={{
                  width: '1120px',
                  height: '591px',
                  maxWidth: '100%',
                  borderRadius: '0'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg'
                }}
              />
            </div>
            
            {paragraphs.length > 0 && (
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p 
                    key={index}
                    className="text-gray-600 leading-relaxed"
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 400,
                      fontSize: '18px'
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            
            {!paragraphs.length && story.stories_detail && (
              <div className="space-y-4">
                <p 
                  className="text-gray-600 leading-relaxed"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: '18px'
                  }}
                >
                  {story.stories_detail}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Values />
      <CTA />
      <Footer />
    </main>
  )
}

