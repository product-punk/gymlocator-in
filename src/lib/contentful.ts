import { createClient } from 'contentful'

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

import type { PostAuthor } from './post-author'

export { postAuthorName, postAuthorSlug, authorNameToSlug } from './post-author'
export type { PostAuthor } from './post-author'

export interface BlogPost {
  sys: { id: string; createdAt: string; updatedAt: string }
  fields: {
    title: string
    slug: string
    excerpt: string
    body: unknown
    coverImage?: {
      fields: {
        file: { url: string }
        title: string
      }
    }
    author?: PostAuthor
    publishedDate: string
    seoTitle?: string
    seoDescription?: string
    /** Array of category slugs — e.g. ['supplements-nutrition'] */
    categories?: string[]
    /** JSON object field — array of { question, answer } */
    faqs?: BlogFaq[]
  }
}

export type BlogFaq = { question?: string; answer?: string; q?: string; a?: string }

/** Normalise FAQ entries to { q, a }, dropping incomplete ones. */
export function normalizeFaqs(faqs?: BlogFaq[]): { q: string; a: string }[] {
  if (!Array.isArray(faqs)) return []
  return faqs
    .map(f => ({ q: (f.question ?? f.q ?? '').trim(), a: (f.answer ?? f.a ?? '').trim() }))
    .filter(f => f.q && f.a)
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

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.categories[in]': categorySlug,
      order: ['-fields.publishedDate'],
    })
    return entries.items as unknown as BlogPost[]
  } catch (e) {
    console.error('Contentful getPostsByCategory error:', e)
    return []
  }
}

export interface Author {
  sys: { id: string }
  fields: {
    name: string
    /** kebab-case of name — e.g. 'arjun-kapoor'. Must match authorNameToSlug(name). */
    slug: string
    designation?: string
    /** fields is absent when the linked asset is unpublished (unresolved link) */
    photo?: {
      fields?: {
        file?: { url: string }
        title?: string
      }
    }
    /** Long text — paragraphs separated by blank lines */
    bio?: string
    /** Pull-quote shown after the bio */
    quote?: string
    /** Badge strip — e.g. ['ACE Certified', 'NSCA-CPT', '9 years experience'] */
    credentials?: string[]
    verified?: boolean
    linkedin?: string
    twitter?: string
    instagram?: string
    website?: string
    /** Display stats — e.g. '120+' */
    gymsReviewed?: string
    /** Display stats — e.g. '1.2M' */
    totalReads?: string
  }
}

export async function getAllAuthors(): Promise<Author[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'author',
      order: ['fields.name'],
    })
    return entries.items as unknown as Author[]
  } catch (e) {
    console.error('Contentful getAllAuthors error:', e)
    return []
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'author',
      'fields.slug': slug,
      limit: 1,
    })
    if (!entries.items.length) return null
    return entries.items[0] as unknown as Author
  } catch (e) {
    console.error('Contentful getAuthorBySlug error:', e)
    return null
  }
}

/**
 * Posts by author — tries the Reference-field lookup (author links to an
 * author entry), then falls back to legacy exact-name matching on a
 * Short text field. One of the two queries 422s depending on the field
 * type; both failing just means no posts.
 */
export async function getPostsByAuthor(author: Author): Promise<BlogPost[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.author.sys.id': author.sys.id,
      order: ['-fields.publishedDate'],
    })
    if (entries.items.length) return entries.items as unknown as BlogPost[]
  } catch {
    // author is a Short text field — fall through to name match
  }
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.author': author.fields.name,
      order: ['-fields.publishedDate'],
    })
    return entries.items as unknown as BlogPost[]
  } catch (e) {
    console.error('Contentful getPostsByAuthor error:', e)
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
