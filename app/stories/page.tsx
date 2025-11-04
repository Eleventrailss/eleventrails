import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroStories from "@/components/hero-stories"
import TravelStories from "@/components/travel-stories"
import Values from "@/components/values"
import Cta from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'Adventure Stories & Travel Tales - ElevenTrails Dirt Bike Tours',
  description: 'Read amazing stories from our riders - Tales from the Lombok trails. Real adventure stories, travel experiences, and dirt bike tour testimonials from ElevenTrails adventurers.',
  keywords: [
    'dirt bike tour stories',
    'adventure travel stories',
    'trail riding experiences',
    'travel stories Lombok',
    'adventure tales',
    'dirt bike tour testimonials',
    'Lombok adventure stories',
    'off-road adventure tales',
    'travel blog Lombok',
    'adventure travel blog'
  ],
  openGraph: {
    title: 'Adventure Stories & Travel Tales - ElevenTrails Dirt Bike Tours',
    description: 'Read amazing stories from our riders - Tales from the Lombok trails.',
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

