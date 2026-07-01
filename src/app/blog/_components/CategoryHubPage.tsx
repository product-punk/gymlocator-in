import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/contentful'
import type { BlogCategory } from '@/lib/blog-categories'
import { getLabelFromSlug } from '@/lib/blog-categories'
import BlogCategoryNav from './BlogCategoryNav'

function resolveImgUrl(url: string | undefined): string | null {
  if (!url) return null
  if (url.startsWith('//')) return `https:${url}`
  return url
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function initials(name?: string): string {
  if (!name) return 'GL'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function CategoryPill({ category }: { category?: string }) {
  if (!category) return null
  return (
    <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-pill bg-accent-dim text-accent whitespace-nowrap self-start">
      {getLabelFromSlug(category)}
    </span>
  )
}

function PostMeta({ post }: { post: BlogPost }) {
  const { fields } = post
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full bg-raised border-[0.5px] border-border flex items-center justify-center text-[11px] font-bold text-accent flex-none">
        {initials(fields.author)}
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold text-text-secondary">{fields.author || 'Gymlocator'}</span>
        {fields.publishedDate && (
          <span className="text-[11px] text-text-muted">{formatDate(fields.publishedDate)}</span>
        )}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: BlogPost }) {
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

export default function CategoryHubPage({
  category,
  posts,
}: {
  category: BlogCategory
  posts: BlogPost[]
}) {
  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="bb-hair">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-16 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] text-text-muted mb-6">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-text-secondary">{category.label}</span>
          </nav>

          <div className="label flex items-center gap-2 mb-[18px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009A6B] inline-block" />
            Fitness Hub
          </div>
          <h1 className="h1 max-w-[760px]">{category.label}</h1>
          <p className="mt-[18px] max-w-[560px] text-[16px] leading-[1.6] text-text-secondary">
            {category.description}
          </p>
        </div>
      </section>

      <BlogCategoryNav activeSlug={category.slug} />

      {/* Posts grid */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-14">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted text-[15px]">No articles in this category yet — check back soon.</p>
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
            >
              <i className="ti ti-arrow-left" />
              Back to all articles
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-7">
              <div>
                <div className="label mb-2">{posts.length} article{posts.length !== 1 ? 's' : ''}</div>
                <h2 className="h2">{category.label}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map(p => (
                <PostCard key={p.sys.id} post={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
