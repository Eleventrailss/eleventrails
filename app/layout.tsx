import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import StructuredData from '@/components/structured-data'
import FaviconUpdater from '@/components/favicon-updater'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eleventrails.com'),
  title: {
    default: 'ElevenTrails - Dirt Bike Adventure Tours & Trail Riding in Lombok',
    template: '%s | ElevenTrails'
  },
  description: 'ElevenTrails - Lombok\'s premier adventure tour operator. Book dirt bike tours, enduro tours, trail riding, and travel adventures. Professional guides, top-quality equipment, unforgettable experiences. Browse tour packages, read rider stories, and discover why we\'re Lombok\'s #1 adventure tour operator.',
  keywords: [
    // Tour & Travel
    'tour Lombok',
    'travel Lombok',
    'tour Indonesia',
    'travel Indonesia',
    'adventure tour',
    'adventure travel',
    'tour package',
    'travel package',
    'tour operator',
    'travel agency',
    'Lombok tour',
    'Indonesia tour',
    'travel adventure',
    'tour guide',
    'travel guide',
    'adventure tour operator',
    'travel tour',
    'tour experience',
    'travel experience',
    'tour booking',
    'travel booking',
    
    // Dirt Bike
    'dirt bike tour',
    'dirt bike adventure',
    'dirt bike tour Lombok',
    'dirt bike rental',
    'dirt bike guide',
    'dirt bike experience',
    'dirt bike tour Indonesia',
    'dirt bike adventure tour',
    'dirt bike trail',
    'dirt bike riding',
    'dirt bike tours',
    'dirt bike package',
    'dirt bike tour package',
    'dirt bike tour operator',
    
    // Enduro
    'enduro tour',
    'enduro tour Lombok',
    'enduro tour Indonesia',
    'enduro racing',
    'enduro riding',
    'enduro adventure',
    'enduro trail',
    'enduro bike tour',
    'enduro experience',
    'enduro tour package',
    'enduro motorcycle tour',
    'enduro off-road',
    'enduro tour guide',
    
    // Off-Road & Trail
    'off-road tour',
    'off-road adventure',
    'off-road tour Lombok',
    'off-road tour Indonesia',
    'trail riding',
    'trail riding tour',
    'trail riding Lombok',
    'trail riding Indonesia',
    'mountain trail',
    'dirt trail',
    'off-road motorcycle',
    'off-road adventure tour',
    'trail bike tour',
    'trail adventure',
    
    // Motocross & Motorcycle
    'motocross tour',
    'motocross tour Lombok',
    'motocross tour Indonesia',
    'motorcycle tour',
    'motorcycle tour Lombok',
    'motorcycle tour Indonesia',
    'bike tour',
    'bike tour Lombok',
    'bike tour Indonesia',
    'mountain biking tour',
    'motocross adventure',
    'motorcycle adventure',
    'bike rental',
    'motorcycle rental',
    
    // Adventure & Extreme Sports
    'extreme sports',
    'extreme sports tour',
    'extreme adventure',
    'extreme tour',
    'extreme riding',
    'adventure sports',
    'outdoor adventure',
    'adventure activities',
    'extreme sports Lombok',
    'adventure travel Indonesia',
    'extreme adventure tour',
    'outdoor activities',
    'adventure sports tour',
    
    // Location Specific
    'Lombok adventure',
    'Lombok travel',
    'Lombok tour guide',
    'Central Lombok tour',
    'Nusa Tenggara Barat tour',
    'Lombok Indonesia tour',
    'Indonesia adventure',
    'Indonesia travel',
    'Indonesia tour operator',
    
    // Other Related
    'bike adventure',
    'motorcycle tour package',
    'adventure tour package',
    'travel tour package',
    'outdoor tour',
    'outdoor adventure tour',
    'mountain tour',
    'adventure guide',
    'tour guide Lombok',
    'travel guide Lombok'
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
    title: 'ElevenTrails - Dirt Bike Adventure Tours, Enduro Tours & Trail Riding in Lombok Indonesia',
    description: 'ElevenTrails - Lombok\'s premier adventure tour operator. Book dirt bike tours, enduro tours, trail riding, and travel adventures. Professional guides, top-quality equipment, unforgettable experiences.',
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
    google: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
        <FaviconUpdater />
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
