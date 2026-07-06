import { NextResponse } from 'next/server'

export const revalidate = 86400

export async function GET() {
  const baseUrl = 'https://gymlocator.in'
  const now = new Date().toISOString()

  const urls = [
    { loc: baseUrl, priority: '1.0', freq: 'daily' },
    { loc: `${baseUrl}/cities`, priority: '0.9', freq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.7', freq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.7', freq: 'monthly' },
    { loc: `${baseUrl}/list-your-gym`, priority: '0.8', freq: 'monthly' },
    { loc: `${baseUrl}/calculators/protein`, priority: '0.8', freq: 'monthly' },
    { loc: `${baseUrl}/privacy`, priority: '0.3', freq: 'yearly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}
