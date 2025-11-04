import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroAbout from "@/components/hero-about"
import TrailsAbout from "@/components/trails-about"
import CommitmentAbout from "@/components/commitment-about"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'About ElevenTrails - Professional Dirt Bike Adventure Tours in Lombok',
  description: 'Learn about ElevenTrails - Your trusted partner for professional dirt bike adventure tours in Lombok. Experienced guides, top-quality gear, and unforgettable trail riding experiences.',
  keywords: [
    'dirt bike tour company',
    'adventure tour operator Lombok',
    'professional dirt bike guides',
    'Lombok tour operator',
    'trail riding company',
    'adventure travel company',
    'dirt bike tour Lombok',
    'off-road adventure company',
    'extreme sports tour',
    'mountain biking tour Lombok'
  ],
  openGraph: {
    title: 'About ElevenTrails - Professional Dirt Bike Adventure Tours in Lombok',
    description: 'Learn about ElevenTrails - Your trusted partner for professional dirt bike adventure tours in Lombok.',
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

