import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroFaq from "@/components/hero-faq"
import DetailsFaq from "@/components/details-faq"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'ElevenTrails - FAQ',
  description: 'Frequently Asked Questions - Everything you need to know about ElevenTrails dirt bike adventures',
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

