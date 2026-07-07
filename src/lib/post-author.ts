/**
 * Author helpers safe to import from client components — no Contentful SDK
 * (contentful.ts instantiates the client with server-only env vars).
 *
 * blogPost.author is either a legacy name string or a Reference to an
 * author entry. fields is absent when the linked author is unpublished.
 */
export type PostAuthor =
  | string
  | { sys: { id: string }; fields?: { name?: string; slug?: string } }

/** Derive the author-page slug from a legacy name string */
export function authorNameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function postAuthorName(author?: PostAuthor): string | undefined {
  if (!author) return undefined
  if (typeof author === 'string') return author
  return author.fields?.name
}

export function postAuthorSlug(author?: PostAuthor): string | undefined {
  if (!author) return undefined
  if (typeof author === 'string') return authorNameToSlug(author)
  return author.fields?.slug
}
