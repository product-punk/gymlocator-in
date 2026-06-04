import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://gymlocator.in'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: gyms } = await supabase
    .from('gyms')
    .select('slug, created_at')

  const urls = (gyms ?? []).map((g: { slug: string; created_at: string | null }) => ({
    loc: `${baseUrl}/gym/${g.slug}`,
    lastmod: g.created_at
      ? new Date(g.created_at).toISOString()
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
