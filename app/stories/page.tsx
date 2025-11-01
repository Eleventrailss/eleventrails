import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroStories from "@/components/hero-stories"
import TravelStories from "@/components/travel-stories"
import Values from "@/components/values"
import Cta from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'ElevenTrails - Stories',
  description: 'Read amazing stories from our riders - Tales from the trails of ElevenTrails',
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

