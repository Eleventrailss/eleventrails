import { Suspense } from "react"
import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroRidesDetail from "@/components/hero-rides-detail"
import DetailRidesDetail from "@/components/details-rides-detail"
import GalleryRidesDetail from "@/components/gallery-rides-detail"
import YouMayAlsoLikeRidesDetail from "@/components/you-may-also-like-rides-detail"
import Testimonials from "@/components/testimonials"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'ElevenTrails - Beginner Trail',
  description: 'Beginner Trail - Ideal for beginners, family-friendly, with beautiful natural scenery',
}

export default function BeginnerTrailPage() {
  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      <HeroRidesDetail />
      <DetailRidesDetail 
        title="BEGINNER TRAIL" 
        description="Jalur ideal untuk pemula, ramah keluarga, dan pemandangan alam yang indah. Nikmati pengalaman riding yang aman dan menyenangkan dengan jalur yang telah disesuaikan untuk semua level kemampuan."
      />
      <GalleryRidesDetail />
      <YouMayAlsoLikeRidesDetail />
      <Testimonials />
      <Values />
      <Suspense fallback={null}>
        <CTA />
      </Suspense>
      <Footer />
    </main>
  )
}

