import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap() {
  const baseUrl = 'https://gymlocator.in'

  const [cities, localities, gyms] = await Promise.all([
    supabase.from('cities').select('slug, updated_at').eq('is_active', true),
    supabase.from('localities').select('slug, city_slug'),
    supabase.from('gyms').select('slug, updated_at').eq('is_active', true),
  ])

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/cities`, lastModified: new Date(), priority: 0.9 },
  ]

  const cityPages = (cities.data ?? []).map((city: { slug: string; updated_at: string | null }) => ({
    url: `${baseUrl}/gyms/${city.slug}`,
    lastModified: city.updated_at ? new Date(city.updated_at) : new Date(),
    priority: 0.9,
    changeFrequency: 'daily' as const,
  }))

  const localityPages = (localities.data ?? []).map((loc: { slug: string; city_slug: string }) => ({
    url: `${baseUrl}/gyms/${loc.city_slug}/${loc.slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const gymPages = (gyms.data ?? []).map((gym: { slug: string; updated_at: string | null }) => ({
    url: `${baseUrl}/gym/${gym.slug}`,
    lastModified: gym.updated_at ? new Date(gym.updated_at) : new Date(),
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }))

  return [
    ...staticPages,
    ...cityPages,
    ...localityPages,
    ...gymPages,
  ]
}
