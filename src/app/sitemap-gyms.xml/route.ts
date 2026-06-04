import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

export async function GET() {
  const baseUrl = 'https://gymlocator.in'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key exists:', !!supabaseKey)

  if (!supabaseUrl || !supabaseKey) {
    return new NextResponse(
      `<!-- ERROR: Missing env vars. URL: ${supabaseUrl}, Key: ${!!supabaseKey} -->`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: gyms, error, count } = await supabase
    .from('gyms')
    .select('slug, updated_at', { count: 'exact' })
    .limit(5)

  console.log('Gyms fetched:', gyms?.length)
  console.log('Total count:', count)
  console.log('Error:', error)
  console.log('First gym:', gyms?.[0])

  if (error) {
    return new NextResponse(
      `<!-- DB ERROR: ${error.message} | Code: ${error.code} -->`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }

  if (!gyms || gyms.length === 0) {
    return new NextResponse(
      `<!-- NO DATA: Table empty or wrong table name. Count: ${count} -->`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }

  const urls = gyms.map((g: { slug: string; updated_at: string | null }) => ({
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
    headers: { 'Content-Type': 'application/xml' },
  })
}
