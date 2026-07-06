import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://gymlocator.in'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Cities from DB, gated at the publishing threshold (≥10 gyms)
  const { data: cityRows } = await supabase
    .from('cities')
    .select('slug, gym_count')
    .eq('is_active', true)
    .gte('gym_count', 10)
  const ALL_CITIES = (cityRows ?? []).map(c => c.slug)

  // A facet page needs enough gyms to be worth indexing
  const MIN_GYMS_PER_FACET = 3

  const FACETS = [
    { slug: 'women',                 filter: { column: 'gender',        value: 'women-only',         type: 'eq' as const },       cities: ALL_CITIES },
    { slug: 'budget',                filter: { column: 'price_monthly', value: 1500,                 type: 'lte' as const },      cities: ALL_CITIES },
    { slug: 'premium',               filter: { column: 'price_monthly', value: 3500,                 type: 'gte' as const },      cities: ALL_CITIES },
    { slug: 'cardio',                filter: { column: 'amenities',     value: ['Cardio'],            type: 'contains' as const }, cities: ALL_CITIES },
    { slug: 'with-personal-trainer', filter: { column: 'amenities',     value: ['Personal Trainer'], type: 'contains' as const }, cities: ALL_CITIES },
    { slug: 'with-swimming-pool',    filter: { column: 'amenities',     value: ['Swimming'],          type: 'contains' as const }, cities: ALL_CITIES },
    { slug: 'with-steam-sauna',      filter: { column: 'amenities',     value: ['Sauna'],             type: 'contains' as const }, cities: ALL_CITIES },
  ]

  const urls: string[] = []

  for (const facet of FACETS) {
    for (const city of facet.cities) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = supabase
        .from('gyms')
        .select('id', { count: 'exact', head: true })
        .eq('city_slug', city)
        .eq('is_active', true)

      if (facet.filter.type === 'eq') {
        query = query.eq(facet.filter.column, facet.filter.value)
      } else if (facet.filter.type === 'lte') {
        query = query.not(facet.filter.column, 'is', null).lte(facet.filter.column, facet.filter.value)
      } else if (facet.filter.type === 'gte') {
        query = query.not(facet.filter.column, 'is', null).gte(facet.filter.column, facet.filter.value)
      } else if (facet.filter.type === 'contains') {
        query = query.contains(facet.filter.column, facet.filter.value)
      }

      const { count } = await query

      if (count && count >= MIN_GYMS_PER_FACET) {
        urls.push(`${baseUrl}/gyms/${city}/${facet.slug}`)
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
