'use client'

import Link from 'next/link'
import { BLOG_CATEGORIES } from '@/lib/blog-categories'

interface Props {
  /** The active category slug, or undefined / 'all' for the main hub */
  activeSlug?: string
}

export default function BlogCategoryNav({ activeSlug }: Props) {
  const isAll = !activeSlug || activeSlug === 'all'

  return (
    <div className="sticky top-16 z-40 bg-base/95 backdrop-blur-sm bb-hair">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-[14px]">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <Link
            href="/blog"
            className={`flex-none text-[13px] font-semibold px-4 py-[9px] rounded-pill border-[0.5px] whitespace-nowrap transition-all duration-150 ${
              isAll
                ? 'bg-accent text-base border-accent'
                : 'bg-surface text-text-secondary border-border hover:border-border-hi hover:text-text'
            }`}
          >
            All
          </Link>

          {BLOG_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/blog/${cat.slug}`}
              className={`flex-none text-[13px] font-semibold px-4 py-[9px] rounded-pill border-[0.5px] whitespace-nowrap transition-all duration-150 ${
                activeSlug === cat.slug
                  ? 'bg-accent text-base border-accent'
                  : 'bg-surface text-text-secondary border-border hover:border-border-hi hover:text-text'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
