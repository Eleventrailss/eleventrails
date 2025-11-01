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
  title: 'ElevenTrails - Home',
  description: 'Unleash the thrill of the open road with ElevenTrails - Ultimate dirt bike adventure experience',
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
