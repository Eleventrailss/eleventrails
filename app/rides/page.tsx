import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroRides from "@/components/hero-rides"
import ListRides from "@/components/list-rides"
import Testimonials from "@/components/testimonials"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'Dirt Bike Tours, Enduro Tours & Trail Riding Packages - ElevenTrails',
  description: 'Choose your perfect dirt bike adventure tour package, enduro tour, or trail riding experience. Explore our range of tour packages for all skill levels - from beginner-friendly tours to extreme off-road adventures in Lombok.',
  keywords: [
    // Tour Packages
    'tour package',
    'tour packages',
    'travel package',
    'travel packages',
    'adventure tour package',
    'adventure tour packages',
    'tour booking',
    'travel booking',
    'tour operator',
    'travel agency',
    
    // Dirt Bike Packages
    'dirt bike tour packages',
    'dirt bike tour package',
    'dirt bike package',
    'dirt bike tour Lombok',
    'dirt bike tour Indonesia',
    'dirt bike rental',
    'dirt bike experience',
    'dirt bike adventure tour',
    'dirt bike tour operator',
    
    // Enduro Packages
    'enduro tour',
    'enduro tour package',
    'enduro tour packages',
    'enduro tour Lombok',
    'enduro tour Indonesia',
    'enduro experience',
    'enduro adventure',
    'enduro tour operator',
    
    // Trail Riding
    'trail riding tours',
    'trail riding packages',
    'trail riding Lombok',
    'trail riding Indonesia',
    'trail bike tour',
    'trail adventure',
    'mountain trail',
    
    // Off-Road
    'off-road tour packages',
    'off-road tour package',
    'off-road adventure packages',
    'off-road tour Lombok',
    'off-road tour Indonesia',
    'off-road motorcycle',
    
    // Motorcycle & Bike
    'motocross tour',
    'motocross tour package',
    'motorcycle tour',
    'motorcycle tour package',
    'bike tour packages',
    'bike tour package',
    'mountain biking tours',
    'bike rental',
    'motorcycle rental',
    
    // Adventure & Extreme
    'extreme sports packages',
    'extreme riding tours',
    'extreme adventure tour',
    'adventure travel packages',
    'adventure tour operator',
    'outdoor adventure tour',
    
    // Location
    'tour Lombok',
    'travel Lombok',
    'tour Indonesia',
    'travel Indonesia',
    'Lombok tour',
    'Indonesia tour',
    
    // Other
    'tour guide',
    'travel guide',
    'adventure guide'
  ],
  openGraph: {
    title: 'Dirt Bike Tours, Enduro Tours & Trail Riding Packages - ElevenTrails',
    description: 'Choose your perfect dirt bike adventure tour package, enduro tour, or trail riding experience. Explore our range of tour packages for all skill levels.',
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

