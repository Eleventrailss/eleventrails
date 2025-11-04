import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroRides from "@/components/hero-rides"
import ListRides from "@/components/list-rides"
import Testimonials from "@/components/testimonials"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'Dirt Bike Tours & Trail Riding Packages - ElevenTrails',
  description: 'Choose your perfect dirt bike adventure tour package. Explore our range of trail riding experiences for all skill levels - from beginner-friendly tours to extreme off-road adventures in Lombok.',
  keywords: [
    'dirt bike tour packages',
    'trail riding tours',
    'dirt bike tour Lombok',
    'off-road tour packages',
    'mountain biking tours',
    'extreme sports packages',
    'adventure tour packages',
    'dirt bike rental',
    'motocross tour',
    'bike tour packages',
    'trail riding packages',
    'off-road adventure packages',
    'extreme riding tours',
    'dirt bike experience',
    'adventure travel packages'
  ],
  openGraph: {
    title: 'Dirt Bike Tours & Trail Riding Packages - ElevenTrails',
    description: 'Choose your perfect dirt bike adventure tour package. Explore our range of trail riding experiences for all skill levels.',
    images: ['/hero-bg.png'],
  },
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

