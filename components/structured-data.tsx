export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eleventrails.com"
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "ElevenTrails",
    "description": "Professional dirt bike adventure tours, enduro tours, trail riding experiences, and travel adventures in Lombok, Indonesia. Offering off-road tours, motorcycle tours, and extreme sports adventures.",
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
    "tourBookingPage": `${siteUrl}/rides`,
    "keywords": [
      "dirt bike tour",
      "enduro tour",
      "trail riding",
      "off-road tour",
      "motorcycle tour",
      "adventure tour",
      "travel tour",
      "tour Lombok",
      "travel Lombok",
      "adventure travel",
      "extreme sports",
      "tour operator",
      "travel agency"
    ]
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#organization`,
    "name": "ElevenTrails",
    "description": "Professional dirt bike adventure tours, enduro tours, trail riding experiences, and travel adventures in Lombok, Indonesia. Specializing in off-road tours, motorcycle tours, and extreme sports adventures.",
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
      "name": "Dirt Bike Adventure Tours, Enduro Tours & Travel Packages",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Dirt Bike Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Dirt Bike Trail Riding Tours",
                "description": "Professional dirt bike trail riding tours and adventures"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Enduro Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Enduro Motorcycle Tours",
                "description": "Enduro racing and off-road enduro tours"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Adventure Travel Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Adventure Travel Packages",
                "description": "Travel adventure tours and packages"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Off-Road Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Off-Road Motorcycle Tours",
                "description": "Off-road adventure tours and trail riding"
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
    "description": "Professional dirt bike adventure tours, enduro tours, trail riding, and travel adventures in Lombok, Indonesia",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/rides?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "ElevenTrails",
      "url": siteUrl
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Rides",
          "item": `${siteUrl}/rides`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Stories",
          "item": `${siteUrl}/stories`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "About",
          "item": `${siteUrl}/about`
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "FAQ",
          "item": `${siteUrl}/faq`
        }
      ]
    }
  }

  const organizationSchemaEnhanced = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ElevenTrails",
    "alternateName": "Eleven Trails",
    "url": siteUrl,
    "logo": `${siteUrl}/hero-bg.png`,
    "description": "ElevenTrails is Lombok's premier adventure tour operator specializing in dirt bike tours, enduro tours, trail riding, and travel adventures. We offer professional guides, top-quality equipment, and unforgettable experiences for riders of all skill levels.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-822-6600-7272",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Indonesian"],
      "areaServed": ["ID", "Lombok", "Indonesia"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Central Lombok",
      "addressRegion": "Nusa Tenggara Barat",
      "addressCountry": "ID"
    },
    "sameAs": [
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      process.env.NEXT_PUBLIC_TIKTOK_URL,
      process.env.NEXT_PUBLIC_YOUTUBE_URL
    ].filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ElevenTrails Adventure Tours",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Dirt Bike Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Dirt Bike Trail Riding Tours",
                "description": "Professional dirt bike trail riding tours and adventures in Lombok"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Enduro Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Enduro Motorcycle Tours",
                "description": "Enduro racing and off-road enduro tours in Lombok"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Trail Riding",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Trail Riding Adventures",
                "description": "Off-road trail riding experiences and adventures"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Adventure Travel Tours",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Travel Adventure Packages",
                "description": "Travel adventure tours and packages in Lombok"
              }
            }
          ]
        }
      ]
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchemaEnhanced) }}
      />
    </>
  )
}

