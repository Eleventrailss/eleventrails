import type { Metadata } from 'next'
import { Suspense } from "react"
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
  title: 'ElevenTrails - Dirt Bike Adventure Tours, Enduro Tours & Trail Riding in Lombok Indonesia',
  description: 'Book your dirt bike adventure tour, enduro tour, or trail riding experience in Lombok! Professional guides, top-quality equipment, and unforgettable adventures. Browse tour packages, read rider stories, and discover why ElevenTrails is Lombok\'s #1 adventure tour operator. Available: Dirt Bike Tours | Enduro Tours | Trail Riding | Off-Road Adventures | Motorcycle Tours.',
  keywords: [
    // Tour & Travel
    'tour Lombok',
    'travel Lombok',
    'tour Indonesia',
    'travel Indonesia',
    'adventure tour',
    'adventure travel',
    'tour package',
    'travel package',
    'tour operator',
    'travel agency',
    'Lombok tour',
    'Indonesia tour',
    'travel adventure',
    'tour guide',
    'travel guide',
    'adventure tour operator',
    'travel tour',
    'tour experience',
    'travel experience',
    'tour booking',
    'travel booking',
    
    // Dirt Bike
    'dirt bike tour',
    'dirt bike adventure',
    'dirt bike tour Lombok',
    'dirt bike rental',
    'dirt bike guide',
    'dirt bike experience',
    'dirt bike tour Indonesia',
    'dirt bike adventure tour',
    'dirt bike trail',
    'dirt bike riding',
    'dirt bike tours',
    'dirt bike package',
    'dirt bike tour package',
    'dirt bike tour operator',
    
    // Enduro
    'enduro tour',
    'enduro tour Lombok',
    'enduro tour Indonesia',
    'enduro racing',
    'enduro riding',
    'enduro adventure',
    'enduro trail',
    'enduro bike tour',
    'enduro experience',
    'enduro tour package',
    'enduro motorcycle tour',
    'enduro off-road',
    'enduro tour guide',
    
    // Off-Road & Trail
    'off-road tour',
    'off-road adventure',
    'off-road tour Lombok',
    'off-road tour Indonesia',
    'trail riding',
    'trail riding tour',
    'trail riding Lombok',
    'trail riding Indonesia',
    'mountain trail',
    'dirt trail',
    'off-road motorcycle',
    'off-road adventure tour',
    'trail bike tour',
    'trail adventure',
    
    // Motocross & Motorcycle
    'motocross tour',
    'motocross tour Lombok',
    'motocross tour Indonesia',
    'motorcycle tour',
    'motorcycle tour Lombok',
    'motorcycle tour Indonesia',
    'bike tour',
    'bike tour Lombok',
    'bike tour Indonesia',
    'mountain biking tour',
    'motocross adventure',
    'motorcycle adventure',
    'bike rental',
    'motorcycle rental',
    
    // Adventure & Extreme Sports
    'extreme sports',
    'extreme sports tour',
    'extreme adventure',
    'extreme tour',
    'extreme riding',
    'adventure sports',
    'outdoor adventure',
    'adventure activities',
    'extreme sports Lombok',
    'adventure travel Indonesia',
    'extreme adventure tour',
    'outdoor activities',
    'adventure sports tour',
    
    // Location Specific
    'Lombok adventure',
    'Lombok travel',
    'Lombok tour guide',
    'Central Lombok tour',
    'Nusa Tenggara Barat tour',
    'Lombok Indonesia tour',
    'Indonesia adventure',
    'Indonesia travel',
    'Indonesia tour operator',
    
    // Other Related
    'bike adventure',
    'motorcycle tour package',
    'adventure tour package',
    'travel tour package',
    'outdoor tour',
    'outdoor adventure tour',
    'mountain tour',
    'adventure guide',
    'tour guide Lombok',
    'travel guide Lombok'
  ],
  openGraph: {
    title: 'ElevenTrails - Dirt Bike Adventure Tours, Enduro Tours & Trail Riding in Lombok Indonesia',
    description: 'Book your dirt bike adventure tour, enduro tour, or trail riding experience in Lombok! Professional guides, top-quality equipment, and unforgettable adventures. Browse tour packages, read rider stories, and discover why ElevenTrails is Lombok\'s #1 adventure tour operator.',
    images: ['/hero-bg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElevenTrails - Dirt Bike Adventure Tours, Enduro Tours & Trail Riding in Lombok',
    description: 'Experience the ultimate dirt bike adventure tours, enduro tours, and trail riding in Lombok with ElevenTrails.',
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
      <Suspense fallback={null}>
        <CTA />
      </Suspense>
      <Footer />
    </main>
  )
}
