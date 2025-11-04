import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import StructuredData from '@/components/structured-data'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eleventrails.com'),
  title: {
    default: 'ElevenTrails - Dirt Bike Adventure Tours & Trail Riding in Lombok',
    template: '%s | ElevenTrails'
  },
  description: 'Experience the ultimate dirt bike adventure tours in Lombok with ElevenTrails. Professional off-road trail riding, mountain biking tours, and extreme sports adventures. Book your dirt bike tour today!',
  keywords: [
    'dirt bike tour',
    'dirt bike adventure',
    'dirt bike tour Lombok',
    'off-road tour',
    'trail riding',
    'mountain biking tour',
    'extreme sports',
    'adventure tour',
    'tour Lombok',
    'travel Lombok',
    'dirt bike rental',
    'motocross tour',
    'adventure travel',
    'outdoor adventure',
    'extreme tour',
    'dirt bike guide',
    'Lombok adventure',
    'bike tour Indonesia',
    'off-road adventure',
    'extreme riding'
  ],
  authors: [{ name: 'ElevenTrails' }],
  creator: 'ElevenTrails',
  publisher: 'ElevenTrails',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://eleventrails.com',
    siteName: 'ElevenTrails',
    title: 'ElevenTrails - Dirt Bike Adventure Tours & Trail Riding in Lombok',
    description: 'Experience the ultimate dirt bike adventure tours in Lombok with ElevenTrails. Professional off-road trail riding, mountain biking tours, and extreme sports adventures.',
    images: [
      {
        url: '/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'ElevenTrails Dirt Bike Adventure Tours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElevenTrails - Dirt Bike Adventure Tours & Trail Riding in Lombok',
    description: 'Experience the ultimate dirt bike adventure tours in Lombok with ElevenTrails.',
    images: ['/hero-bg.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://eleventrails.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-plusjakarta antialiased`}>
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
