export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eleventrails.com"
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "ElevenTrails",
    "description": "Professional dirt bike adventure tours and trail riding experiences in Lombok, Indonesia",
    "url": siteUrl,
    "logo": `${siteUrl}/hero-bg.png`,
    "image": `${siteUrl}/hero-bg.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Central Lombok",
      "addressRegion": "Nusa Tenggara Barat",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-822-6600-7272",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Indonesian"]
    },
    "sameAs": [
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      process.env.NEXT_PUBLIC_TIKTOK_URL,
      process.env.NEXT_PUBLIC_YOUTUBE_URL
    ].filter(Boolean),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "tourBookingPage": `${siteUrl}/rides`
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#organization`,
    "name": "ElevenTrails",
    "description": "Professional dirt bike adventure tours and trail riding experiences in Lombok",
    "url": siteUrl,
    "logo": `${siteUrl}/hero-bg.png`,
    "image": `${siteUrl}/hero-bg.png`,
    "priceRange": "$$",
    "telephone": "+62-822-6600-7272",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Central Lombok",
      "addressLocality": "Central Lombok",
      "addressRegion": "Nusa Tenggara Barat",
      "postalCode": "",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-8.5639",
      "longitude": "116.3514"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "servesCuisine": "Adventure Tours",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dirt Bike Adventure Tours",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Trail Riding Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Dirt Bike Trail Riding",
                "description": "Professional dirt bike trail riding tours"
              }
            }
          ]
        }
      ]
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ElevenTrails",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/rides?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}

