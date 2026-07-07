import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/contentful'
import { postAuthorName } from '@/lib/post-author'
import { getLabelFromSlug } from '@/lib/blog-categories'

// Contentful returns protocol-relative URLs (//images.ctfassets.net/...)
// Guard against already-absolute URLs to avoid double-prefixing.
export function resolveImgUrl(url: string | undefined): string | null {
  if (!url) return null
  if (url.startsWith('//')) return `https:${url}`
  return url
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function initials(name?: string): string {
  if (!name) return 'GL'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function CategoryPill({ category }: { category?: string }) {
  if (!category) return null
  return (
    <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-pill bg-accent-dim text-accent whitespace-nowrap self-start">
      {getLabelFromSlug(category)}
    </span>
  )
}

export function PostMeta({ post }: { post: BlogPost }) {
  const { fields } = post
  const authorName = postAuthorName(fields.author)
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full bg-raised border-[0.5px] border-border flex items-center justify-center text-[11px] font-bold text-accent flex-none">
        {initials(authorName)}
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold text-text-secondary">{authorName || 'Gymlocator'}</span>
        {fields.publishedDate && (
          <span className="text-[11px] text-text-muted">{formatDate(fields.publishedDate)}</span>
        )}
      </div>
    </div>
  )
}

export default function PostCard({ post }: { post: BlogPost }) {
  const { fields } = post
  const imgUrl = resolveImgUrl(fields.coverImage?.fields.file.url)
  return (
    <Link
      href={`/blog/${fields.slug}`}
      className="flex flex-col bg-surface border-[0.5px] border-border rounded-[12px] overflow-hidden transition-all duration-[180ms] hover:border-border-hi hover:-translate-y-0.5 group"
    >
      <div className="aspect-[16/10] relative">
        {imgUrl ? (
          <Image
            src={`${imgUrl}?w=600&h=375&fit=fill`}
            alt={fields.title}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 img-placeholder" />
        )}
      </div>
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <CategoryPill category={fields.categories?.[0]} />
        <div className="text-[17px] font-bold tracking-[-0.4px] leading-[1.25] text-text group-hover:text-white transition-colors line-clamp-2">
          {fields.title}
        </div>
        {fields.excerpt && (
          <div className="text-[13px] leading-[1.55] text-text-secondary line-clamp-2">{fields.excerpt}</div>
        )}
        <div className="mt-auto pt-3 border-t-[0.5px] border-border">
          <PostMeta post={post} />
        </div>
      </div>
    </Link>
  )
}
