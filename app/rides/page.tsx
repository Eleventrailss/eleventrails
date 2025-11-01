import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroRides from "@/components/hero-rides"
import ListRides from "@/components/list-rides"
import Testimonials from "@/components/testimonials"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'ElevenTrails - Rides',
  description: 'Choose your perfect ride - Explore our range of dirt bike trail packages for all skill levels',
}

export default function RidesPage() {
  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      <HeroRides />
      <ListRides />
      <Testimonials />
      <Values />
      <CTA />
      <Footer />
    </main>
  )
}

