import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroAbout from "@/components/hero-about"
import TrailsAbout from "@/components/trails-about"
import CommitmentAbout from "@/components/commitment-about"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'About ElevenTrails - Lombok\'s Premier Dirt Bike & Enduro Tour Operator | Our Story',
  description: 'Learn about ElevenTrails - Lombok\'s trusted adventure tour operator since [year]. We offer professional dirt bike tours, enduro tours, and trail riding experiences. Meet our experienced guides, discover our commitment to safety, and explore our adventure trails. Why choose us: Expert guides | Top-quality gear | Safety first | Unforgettable experiences.',
  keywords: [
    // Company & Operator
    'dirt bike tour company',
    'adventure tour operator Lombok',
    'tour operator Lombok',
    'travel agency Lombok',
    'tour company Indonesia',
    'adventure tour company',
    'travel tour operator',
    'professional tour operator',
    
    // Guides & Services
    'professional dirt bike guides',
    'tour guide Lombok',
    'travel guide Lombok',
    'adventure guide',
    'professional guides',
    'experienced tour guides',
    
    // Services
    'trail riding company',
    'adventure travel company',
    'dirt bike tour Lombok',
    'enduro tour Lombok',
    'off-road adventure company',
    'extreme sports tour',
    'mountain biking tour Lombok',
    'motorcycle tour operator',
    'bike tour company',
    
    // Tour Types
    'tour operator',
    'travel agency',
    'adventure tour operator',
    'tour company',
    'travel company',
    'adventure company',
    'tour service',
    'travel service'
  ],
  openGraph: {
    title: 'About ElevenTrails - Professional Dirt Bike, Enduro & Adventure Tour Operator in Lombok',
    description: 'Learn about ElevenTrails - Your trusted partner for professional dirt bike adventure tours, enduro tours, and travel adventures in Lombok.',
    images: ['/hero-bg.png'],
  },
}

export default function About() {
  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      <HeroAbout />
      <TrailsAbout />
      <CommitmentAbout />
      <Values />
      <CTA />
      <Footer />
    </main>
  )
}

