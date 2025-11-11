import { Suspense } from "react"
import type { Metadata } from 'next'
import Header from "@/components/header"
import HeroStoriesDetail from "@/components/hero-stories-detail"
import DetailsStoryDetail from "@/components/details-story-detail"
import Values from "@/components/values"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'ElevenTrails - Stories Detail',
  description: 'Stories detail from ElevenTrails - Into the jungle Lombok dirt bike tours',
}

export default function StoriesDetailPage() {
  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full">
      <Header />
      <HeroStoriesDetail />
      <DetailsStoryDetail />
      <Values />
      <Suspense fallback={null}>
        <CTA />
      </Suspense>
      <Footer />
    </main>
  )
}

