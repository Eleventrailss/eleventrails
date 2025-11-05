import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroStories from "@/components/hero-stories"
import TravelStories from "@/components/travel-stories"
import Values from "@/components/values"
import Cta from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'Adventure Stories & Travel Tales - ElevenTrails Dirt Bike & Enduro Tours',
  description: 'Read amazing stories from our riders - Tales from the Lombok trails. Real adventure stories, travel experiences, enduro adventures, and dirt bike tour testimonials from ElevenTrails adventurers.',
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
    title: 'Adventure Stories & Travel Tales - ElevenTrails Dirt Bike & Enduro Tours',
    description: 'Read amazing stories from our riders - Tales from the Lombok trails. Real adventure stories, travel experiences, and enduro adventures.',
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
      <Cta />
      <Footer />
    </main>
  )
}

