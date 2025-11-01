import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroAbout from "@/components/hero-about"
import TrailsAbout from "@/components/trails-about"
import CommitmentAbout from "@/components/commitment-about"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'ElevenTrails - About',
  description: 'Learn more about ElevenTrails - Our commitment to providing exceptional dirt bike adventure experiences',
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

