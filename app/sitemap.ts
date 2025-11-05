import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleventrails.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic pages - fetch active rides
  try {
    const { data: rides, error } = await supabaseAdmin
      .from('rides')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (!error && rides) {
      const ridePages: MetadataRoute.Sitemap = rides.map((ride) => ({
        url: `${baseUrl}/rides/${ride.id}`,
        lastModified: ride.updated_at ? new Date(ride.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))

      return [...staticPages, ...ridePages]
    }
  } catch (error) {
    console.error('Error fetching rides for sitemap:', error)
  }

  return staticPages
}

