import type { Metadata } from 'next'
import Header from "@/components/header"
import Hero from "@/components/hero"
import Explore from "@/components/explore"
import Gear from "@/components/gear"
import Rides from "@/components/rides"
import Team from "@/components/team"
import Testimonials from "@/components/testimonials"
import Stories from "@/components/stories"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'ElevenTrails - Dirt Bike Adventure Tours & Trail Riding in Lombok',
  description: 'Experience the ultimate dirt bike adventure tours in Lombok with ElevenTrails. Professional off-road trail riding, mountain biking tours, and extreme sports adventures. Book your dirt bike tour today!',
  keywords: [
    'dirt bike tour',
    'dirt bike adventure',
    'dirt bike tour Lombok',
    'off-road tour',
    'trail riding',
    'mountain biking tour',
    'extreme sports',
    'adventure tour',
    'tour Lombok',
    'travel Lombok',
    'dirt bike rental',
    'motocross tour',
    'adventure travel',
    'outdoor adventure',
    'extreme tour',
    'dirt bike guide',
    'Lombok adventure',
    'bike tour Indonesia',
    'off-road adventure',
    'extreme riding'
  ],
  openGraph: {
    title: 'ElevenTrails - Dirt Bike Adventure Tours & Trail Riding in Lombok',
    description: 'Experience the ultimate dirt bike adventure tours in Lombok with ElevenTrails. Professional off-road trail riding, mountain biking tours, and extreme sports adventures.',
    images: ['/hero-bg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElevenTrails - Dirt Bike Adventure Tours & Trail Riding in Lombok',
    description: 'Experience the ultimate dirt bike adventure tours in Lombok with ElevenTrails.',
    images: ['/hero-bg.png'],
  },
}

export default function Home() {
  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      <Hero />
      <Explore />
      <Gear />
      <Rides />
      <Team />
      <Testimonials />
      <Stories />
      <Values />
      <CTA />
      <Footer />
    </main>
  )
}
