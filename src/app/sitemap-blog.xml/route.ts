import { NextResponse } from 'next/server'
import { getAllPosts, getAllAuthors } from '@/lib/contentful'
import { BLOG_CATEGORIES } from '@/lib/blog-categories'

export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://gymlocator.in'
  const now = new Date().toISOString()

  const [posts, authors] = await Promise.all([getAllPosts(), getAllAuthors()])

  const urls: { loc: string; lastmod: string; freq: string; priority: string }[] = [
    { loc: `${baseUrl}/blog`, lastmod: now, freq: 'daily', priority: '0.8' },
    ...BLOG_CATEGORIES.map(c => ({
      loc: `${baseUrl}/blog/${c.slug}`,
      lastmod: now,
      freq: 'weekly',
      priority: '0.7',
    })),
    ...posts.map(p => ({
      loc: `${baseUrl}/blog/${p.fields.slug}`,
      lastmod: p.sys.updatedAt ?? now,
      freq: 'monthly',
      priority: '0.7',
    })),
    ...authors.map(a => ({
      loc: `${baseUrl}/blog/author/${a.fields.slug}`,
      lastmod: now,
      freq: 'weekly',
      priority: '0.5',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
