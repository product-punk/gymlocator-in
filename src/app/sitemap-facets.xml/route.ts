import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 86400

const ALL_CITY_SLUGS = [
  'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai',
  'pune', 'kolkata', 'ahmedabad', 'gurgaon', 'noida', 'ghaziabad',
]

export async function GET() {
  const baseUrl = 'https://gymlocator.in'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type FacetDef = { cities: string[] | 'all'; filter: (q: any) => any }

  const facets: Record<string, FacetDef> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'women':                { cities: ['ahmedabad', 'mumbai', 'hyderabad', 'pune', 'chennai'], filter: (q: any) => q.eq('gender', 'women-only') },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'budget':               { cities: 'all', filter: (q: any) => q.not('price_monthly', 'is', null).lte('price_monthly', 1500) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'premium':              { cities: 'all', filter: (q: any) => q.not('price_monthly', 'is', null).gte('price_monthly', 3500) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'cardio':               { cities: 'all', filter: (q: any) => q.contains('amenities', ['Cardio']) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'with-personal-trainer':{ cities: 'all', filter: (q: any) => q.contains('amenities', ['Personal Trainer']) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'with-swimming-pool':   { cities: 'all', filter: (q: any) => q.contains('amenities', ['Swimming']) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'with-steam-sauna':     { cities: 'all', filter: (q: any) => q.overlaps('amenities', ['Sauna', 'Steam']) },
  }

  const results = await Promise.all(
    Object.entries(facets).map(async ([facetSlug, def]) => {
      const allowedCities = def.cities === 'all' ? ALL_CITY_SLUGS : def.cities
      const baseQuery = supabase
        .from('gyms')
        .select('city_slug')
        .eq('is_active', true)
        .in('city_slug', allowedCities)
        .limit(5000)

      const { data, error } = await def.filter(baseQuery)

      if (error) {
        console.error(`[sitemap-facets] ${facetSlug} ERROR:`, error.message)
        return { facetSlug, activeCities: [] as string[] }
      }

      // Count gyms per city
      const cityCount: Record<string, number> = {}
      for (const row of data ?? []) {
        cityCount[row.city_slug] = (cityCount[row.city_slug] || 0) + 1
      }

      for (const [city, count] of Object.entries(cityCount)) {
        console.log(`${city}/${facetSlug}: ${count} gyms`)
      }

      const activeCities = Object.keys(cityCount)
      return { facetSlug, activeCities }
    })
  )

  const urls: string[] = []
  for (const { facetSlug, activeCities } of results) {
    for (const citySlug of activeCities) {
      urls.push(`${baseUrl}/gyms/${citySlug}/${facetSlug}`)
    }
  }

  console.log(`[sitemap-facets] total URLs: ${urls.length}`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}
