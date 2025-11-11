import { Suspense } from "react"
import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroStories from "@/components/hero-stories"
import TravelStories from "@/components/travel-stories"
import Values from "@/components/values"
import Cta from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'Adventure Stories & Travel Blog - Real Rider Experiences from Lombok Trails | ElevenTrails',
  description: 'Read real adventure stories and travel tales from ElevenTrails riders! Discover amazing dirt bike tour experiences, enduro adventures, and trail riding stories from Lombok. Get inspired by rider testimonials, travel blogs, and adventure experiences. Categories: Adventure Stories | Travel Tales | Rider Testimonials | Tour Reviews | Enduro Experiences.',
  keywords: [
    // Stories & Blog
    'dirt bike tour stories',
    'adventure travel stories',
    'travel stories',
    'tour stories',
    'travel blog',
    'adventure blog',
    'tour blog',
    'travel tales',
    'adventure tales',
    
    // Experiences
    'trail riding experiences',
    'enduro experiences',
    'off-road experiences',
    'adventure experiences',
    'tour experiences',
    'travel experiences',
    'dirt bike experiences',
    'motorcycle experiences',
    
    // Location Stories
    'travel stories Lombok',
    'adventure stories Lombok',
    'Lombok adventure stories',
    'travel stories Indonesia',
    'adventure stories Indonesia',
    'Indonesia travel stories',
    
    // Testimonials
    'dirt bike tour testimonials',
    'tour testimonials',
    'travel testimonials',
    'adventure testimonials',
    'tour reviews',
    'travel reviews',
    'adventure reviews',
    
    // Content Types
    'off-road adventure tales',
    'enduro adventure stories',
    'trail riding stories',
    'bike tour stories',
    'motorcycle tour stories',
    'adventure travel blog',
    'travel blog Lombok',
    'adventure travel blog Indonesia'
  ],
  openGraph: {
    title: 'Adventure Stories & Travel Blog - Real Rider Experiences from Lombok Trails | ElevenTrails',
    description: 'Read real adventure stories and travel tales from ElevenTrails riders! Discover amazing dirt bike tour experiences, enduro adventures, and trail riding stories from Lombok.',
    images: ['/hero-bg.png'],
  },
}

export default function StoriesPage() {
  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      <HeroStories />
      <TravelStories />
      <Values />
      <Suspense fallback={null}>
        <Cta />
      </Suspense>
      <Footer />
    </main>
  )
}

