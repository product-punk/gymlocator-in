'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { BlogPost } from '@/lib/contentful'
import { getLabelFromSlug } from '@/lib/blog-categories'
import BlogCategoryNav from './BlogCategoryNav'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Contentful returns protocol-relative URLs (//images.ctfassets.net/...)
// Guard against already-absolute URLs to avoid double-prefixing.
function resolveImgUrl(url: string | undefined): string | null {
  if (!url) return null
  if (url.startsWith('//')) return `https:${url}`
  return url
}

function initials(name?: string): string {
  if (!name) return 'GL'
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
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

function FeaturedCard({ post }: { post: BlogPost }) {
  const { fields } = post
  const imgUrl = resolveImgUrl(fields.coverImage?.fields.file.url)
  return (
    <Link
      href={`/blog/${fields.slug}`}
      className="flex flex-col bg-surface border-[0.5px] border-border rounded-[12px] overflow-hidden transition-all duration-[180ms] hover:border-border-hi hover:-translate-y-0.5 group"
    >
      <div className="aspect-[16/11] relative">
        {imgUrl ? (
          <Image
            src={`${imgUrl}?w=800&h=550&fit=fill`}
            alt={fields.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 img-placeholder" />
        )}
        {fields.categories?.[0] && (
          <div className="absolute top-3.5 left-3.5">
            <CategoryPill category={fields.categories[0]} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="text-[24px] font-bold tracking-[-0.6px] leading-[1.25] text-text group-hover:text-white transition-colors">
          {fields.title}
        </div>
        {fields.excerpt && (
          <div className="text-[14px] leading-[1.55] text-text-secondary line-clamp-2">{fields.excerpt}</div>
        )}
        <div className="mt-auto pt-3 border-t-[0.5px] border-border">
          <PostMeta post={post} />
        </div>
      </div>
    </Link>
  )
}

function MiniCard({ post }: { post: BlogPost }) {
  const { fields } = post
  const imgUrl = resolveImgUrl(fields.coverImage?.fields.file.url)
  return (
    <Link
      href={`/blog/${fields.slug}`}
      className="flex gap-3.5 bg-surface border-[0.5px] border-border rounded-[12px] p-3 transition-all duration-[180ms] hover:border-border-hi"
    >
      <div className="w-24 flex-none rounded-[8px] overflow-hidden aspect-square relative">
        {imgUrl ? (
          <Image
            src={`${imgUrl}?w=192&h=192&fit=fill`}
            alt={fields.title}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 img-placeholder" />
        )}
      </div>
      <div className="flex flex-col gap-2 justify-center">
        <CategoryPill category={fields.categories?.[0]} />
        <div className="text-[14px] font-bold leading-[1.3] tracking-[-0.3px] text-text line-clamp-2">
          {fields.title}
        </div>
        <div className="text-[12px] text-text-muted">
          {fields.author || 'Gymlocator'}
          {fields.publishedDate ? ` · ${formatDate(fields.publishedDate)}` : ''}
        </div>
      </div>
    </Link>
  )
}

function SectionHead({
  label,
  title,
  href,
  linkText,
}: {
  label: string
  title: string
  href?: string
  linkText?: string
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-7">
      <div>
        <div className="label mb-2">{label}</div>
        <h2 className="h2">{title}</h2>
      </div>
      {href && linkText && (
        <Link
          href={href}
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text transition-colors flex-none"
        >
          {linkText}
          <i className="ti ti-arrow-right" />
        </Link>
      )}
    </div>
  )
}

export default function BlogHubClient({ posts }: { posts: BlogPost[] }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubscribed(true)
    }
  }

  const featured = posts[0]
  const sideCards = posts.slice(1, 4)
  const newlyPublished = posts.slice(0, 3)

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="bb-hair">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-16 pb-12">
          <div className="label flex items-center gap-2 mb-[18px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009A6B] inline-block" />
            Fitness Hub
          </div>
          <h1 className="h1 max-w-[760px]">
            Train smarter.<br />Pick the right gym.
          </h1>
          <p className="mt-[18px] max-w-[560px] text-[16px] leading-[1.6] text-text-secondary">
            Workout guides, honest gym reviews and no-nonsense nutrition advice — written by certified trainers who actually train in India.
          </p>
        </div>
      </section>

      <BlogCategoryNav />

      {/* Trending */}
      {posts.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-14">
          <SectionHead label="Trending now" title="Top reads this week" href="/blog" linkText="View all" />
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
            {featured && <FeaturedCard post={featured} />}
            {sideCards.length > 0 && (
              <div className="flex flex-col gap-5">
                {sideCards.map(p => (
                  <MiniCard key={p.sys.id} post={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newly published */}
      {newlyPublished.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-[72px]">
          <SectionHead
            label="Fresh off the press"
            title="Newly published"
            href="/blog"
            linkText="All articles"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {newlyPublished.map(p => (
              <PostCard key={p.sys.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-[72px]">
        <div className="bg-surface border-[0.5px] border-border rounded-[16px] p-8 md:p-10 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(212,212,212,0.06) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div className="relative flex flex-col gap-6 items-start">
            <div className="max-w-[520px]">
              <div className="label mb-2.5">Newsletter</div>
              <h2 className="h2 text-[28px]">Get the weekly fitness brief</h2>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-text-secondary">
                One email every Friday — the best new guides, gym openings near you, and a workout to try. No spam, unsubscribe anytime.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-3 text-[14px]">
                <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-none">
                  <i className="ti ti-check text-[11px] text-base" />
                </span>
                <span className="text-text-secondary">
                  You&apos;re in! We&apos;ll send your first brief this Friday.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-wrap gap-2.5 w-full max-w-[480px]"
              >
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 min-w-[200px] bg-base border-[0.5px] border-border rounded-[10px] px-3.5 py-3 text-[14px] text-text placeholder:text-text-muted focus:outline-none focus:border-border-hi font-sans"
                />
                <button
                  type="submit"
                  className="bg-accent text-base font-bold text-[13px] px-5 py-3 rounded-[8px] hover:bg-text transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  Subscribe<i className="ti ti-arrow-right" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* All articles */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-[72px]">
        <SectionHead label="The archive" title="All articles" />
        {posts.length === 0 ? (
          <p className="text-text-muted text-[15px] py-8">No articles yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(p => (
              <PostCard key={p.sys.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
