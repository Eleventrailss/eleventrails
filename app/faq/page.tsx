import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroFaq from "@/components/hero-faq"
import DetailsFaq from "@/components/details-faq"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions About Dirt Bike Tours, Enduro Tours & Travel - ElevenTrails',
  description: 'Everything you need to know about ElevenTrails dirt bike adventures, enduro tours, and travel tours. Find answers to common questions about trail riding tours, booking, safety, gear, and more.',
  keywords: [
    // FAQ Categories
    'dirt bike tour FAQ',
    'enduro tour FAQ',
    'tour FAQ',
    'travel FAQ',
    'adventure tour FAQ',
    'trail riding questions',
    'tour questions',
    'travel questions',
    'adventure questions',
    
    // Information
    'dirt bike tour information',
    'tour information',
    'travel information',
    'adventure tour information',
    'enduro tour information',
    'trail riding information',
    
    // Booking
    'tour booking FAQ',
    'travel booking FAQ',
    'tour booking questions',
    'travel booking questions',
    'how to book tour',
    'how to book travel',
    
    // Safety & Gear
    'tour safety questions',
    'travel safety FAQ',
    'tour gear FAQ',
    'travel gear questions',
    'tour safety information',
    'travel safety information',
    
    // Tour Types
    'off-road tour questions',
    'enduro tour questions',
    'dirt bike tour questions',
    'trail riding FAQ',
    'motorcycle tour FAQ',
    'bike tour FAQ',
    'adventure travel FAQ',
    
    // Guides
    'dirt bike tour guide',
    'tour guide',
    'travel guide',
    'adventure guide',
    'tour information guide'
  ],
  openGraph: {
    title: 'FAQ - Frequently Asked Questions About Dirt Bike Tours, Enduro Tours & Travel - ElevenTrails',
    description: 'Everything you need to know about ElevenTrails dirt bike adventures, enduro tours, and travel tours.',
    images: ['/hero-bg.png'],
  },
}

export default function FaqPage() {
  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      <HeroFaq />
      <DetailsFaq />
      <Values />
      <CTA />
      <Footer />
    </main>
  )
}

