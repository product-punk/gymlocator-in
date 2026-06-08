import { NextResponse } from 'next/server'
import { contentfulClient } from '@/lib/contentful'

export async function GET() {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
    })
    return NextResponse.json({
      success: true,
      count: entries.total,
      items: entries.items.map((i: any) => ({
        title: i.fields.title,
        slug: i.fields.slug,
      }))
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message })
  }
}
