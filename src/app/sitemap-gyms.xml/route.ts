import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://gymlocator.in'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: gyms, error } = await supabase
    .from('gyms')
    .select('slug, updated_at')

  console.log('Gyms count:', gyms?.length)
  console.log('Gyms error:', error)

  const urls = (gyms ?? []).map((g: { slug: string; updated_at: string | null }) => ({
    loc: `${baseUrl}/gym/${g.slug}`,
    lastmod: g.updated_at
      ? new Date(g.updated_at).toISOString()
      : new Date().toISOString(),
  }))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
