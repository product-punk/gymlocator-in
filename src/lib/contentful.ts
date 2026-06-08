import { createClient } from 'contentful'

console.log('Contentful Space ID:', process.env.CONTENTFUL_SPACE_ID)
console.log('Contentful Token exists:', !!process.env.CONTENTFUL_ACCESS_TOKEN)

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export interface BlogPost {
  sys: { id: string; createdAt: string; updatedAt: string }
  fields: {
    title: string
    slug: string
    excerpt: string
    body: any
    coverImage?: {
      fields: {
        file: { url: string }
        title: string
      }
    }
    author?: string
    publishedDate: string
    seoTitle?: string
    seoDescription?: string
    categories?: string[]
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      order: ['-fields.publishedDate'],
    })
    return entries.items as unknown as BlogPost[]
  } catch (e) {
    console.error('Contentful getAllPosts error:', e)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    })
    if (!entries.items.length) return null
    return entries.items[0] as unknown as BlogPost
  } catch (e) {
    console.error('Contentful getPostBySlug error:', e)
    return null
  }
}
