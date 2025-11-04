import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroFaq from "@/components/hero-faq"
import DetailsFaq from "@/components/details-faq"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions About Dirt Bike Tours - ElevenTrails',
  description: 'Everything you need to know about ElevenTrails dirt bike adventures. Find answers to common questions about trail riding tours, booking, safety, gear, and more.',
  keywords: [
    'dirt bike tour FAQ',
    'trail riding questions',
    'adventure tour FAQ',
    'dirt bike tour information',
    'tour booking FAQ',
    'off-road tour questions',
    'adventure travel FAQ',
    'dirt bike tour guide',
    'tour safety questions',
    'bike tour FAQ'
  ],
  openGraph: {
    title: 'FAQ - Frequently Asked Questions About Dirt Bike Tours - ElevenTrails',
    description: 'Everything you need to know about ElevenTrails dirt bike adventures.',
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

