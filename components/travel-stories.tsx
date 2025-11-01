"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Story {
  id: string
  title: string
  stories_detail: string | null
  pic: string | null
}

export default function TravelStories() {
  const [blogPosts, setBlogPosts] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, stories_detail, pic')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching stories:', error)
      } else {
        setBlogPosts(data || [])
      }
    } catch (err) {
      console.error('Error fetching stories:', err)
    } finally {
      setLoading(false)
    }
  }

  const truncateDescription = (text: string | null, maxLength: number = 150) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <section className="relative bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 -mb-[-20px]">
      <div className="max-w-7xl mx-auto px-[30px] relative">
        <div className="absolute left-0 right-0 -top-[50px] -translate-y-1/2 z-0 pointer-events-none">
          <img src="/explore-top.png" alt="Explore separator" className="w-full h-auto object-cover" />
        </div>
        <div className="relative z-10 mb-12 sm:mb-16">
          <h2 className="font-rubik-one text-4xl md:text-[64px] font-bold text-slate-950 mb-6 leading-tight w-full text-center">
            <span className="block">TRAVEL TO LOMBOK VIA OUR</span>
            <span className="block">STORIES FROM THE TRIALS</span>
          </h2>
        </div>
        {loading ? (
          <div className="relative z-10 space-y-8 md:space-y-12">
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Memuat stories...</p>
            </div>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="relative z-10 space-y-8 md:space-y-12">
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Belum ada stories tersedia</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-8 md:space-y-12">
            {blogPosts.map((post, index) => (
              <article key={post.id} className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div className="w-full">
                  <img 
                    src={post.pic || "/placeholder.svg"} 
                    alt={post.title} 
                    className="w-full h-auto object-cover" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '515/420',
                      borderRadius: '0'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                </div>
                <div className="w-full">
                  <h2 className="font-rubik-one text-3xl md:text-[32px] font-bold text-slate-950 mb-4 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {truncateDescription(post.stories_detail)}
                  </p>
                  <a 
                    href={`/stories/${post.id}`}
                    className="flex items-stretch overflow-hidden rounded-none font-bold transition hover:opacity-90 scale-80 sm:scale-100"
                    style={{
                      width: '234px',
                      height: '58px',
                      textDecoration: 'none'
                    }}
                  >
                    <span 
                      className="flex-shrink-0" 
                      style={{ 
                        width: '15%',
                        backgroundColor: '#0A88B7'
                      }}
                    />
                    <span 
                      className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center" 
                      style={{ width: '85%' }}
                    >
                      EXPLORE RIDES
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
