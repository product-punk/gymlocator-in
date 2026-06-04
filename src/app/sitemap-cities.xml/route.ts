import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://gymlocator.in'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: cities } = await supabase
    .from('cities')
    .select('slug, created_at')
    .eq('is_active', true)

  const urls = (cities ?? []).map((c: { slug: string; created_at: string | null }) => ({
    loc: `${baseUrl}/gyms/${c.slug}`,
    lastmod: c.created_at
      ? new Date(c.created_at).toISOString()
      : new Date().toISOString(),
  }))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
