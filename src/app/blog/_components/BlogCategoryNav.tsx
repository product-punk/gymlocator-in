'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BLOG_CATEGORIES } from '@/lib/blog-categories'

interface Props {
  /** The active category slug, or undefined / 'all' for the main hub */
  activeSlug?: string
}

export default function BlogCategoryNav({ activeSlug }: Props) {
  const isAll = !activeSlug || activeSlug === 'all'

  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 1)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      ro.disconnect()
    }
  }, [updateArrows])

  // Center the active pill within the rail on load so the selected category is
  // visible even when it sits off-screen in the overflow. Set scrollLeft
  // directly (not scrollIntoView) so we only move the rail horizontally and
  // never jump-scroll the whole page vertically toward the sticky nav.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    if (el.scrollWidth <= el.clientWidth) return // no overflow, nothing to do
    const active = el.querySelector('[data-active="true"]') as HTMLElement | null
    if (active) {
      el.scrollLeft = active.offsetLeft - (el.clientWidth - active.clientWidth) / 2
    }
  }, [activeSlug])

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const pillClass = (active: boolean) =>
    `flex-none text-[13px] font-semibold px-4 py-[9px] rounded-pill border-[0.5px] whitespace-nowrap transition-all duration-150 ${
      active
        ? 'bg-accent text-base border-accent'
        : 'bg-surface text-text-secondary border-border hover:border-border-hi hover:text-text'
    }`

  return (
    <div className="sticky top-16 z-40 bg-base/95 backdrop-blur-sm bb-hair">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-[14px]">
        <div className="relative">
          {/* Left arrow + fade (desktop only; native swipe covers touch) */}
          <div
            className={`hidden md:flex absolute left-0 top-0 bottom-0 z-10 items-center pr-8 pl-0 pointer-events-none bg-gradient-to-r from-base via-base to-transparent transition-opacity duration-200 ${
              canLeft ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => scroll(-1)}
              className="pointer-events-auto w-8 h-8 flex-none flex items-center justify-center rounded-full bg-surface border-[0.5px] border-border text-text-secondary hover:border-border-hi hover:text-text focus-visible:border-accent focus-visible:text-text outline-none transition-colors cursor-pointer"
            >
              <i className="ti ti-chevron-left text-[16px]" />
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="flex gap-2 overflow-x-auto no-scrollbar pb-1 scroll-smooth"
          >
            <Link href="/blog" data-active={isAll} className={pillClass(isAll)}>
              All
            </Link>

            {BLOG_CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/blog/${cat.slug}`}
                data-active={activeSlug === cat.slug}
                className={pillClass(activeSlug === cat.slug)}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Right arrow + fade */}
          <div
            className={`hidden md:flex absolute right-0 top-0 bottom-0 z-10 items-center pl-8 pr-0 justify-end pointer-events-none bg-gradient-to-l from-base via-base to-transparent transition-opacity duration-200 ${
              canRight ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => scroll(1)}
              className="pointer-events-auto w-8 h-8 flex-none flex items-center justify-center rounded-full bg-surface border-[0.5px] border-border text-text-secondary hover:border-border-hi hover:text-text focus-visible:border-accent focus-visible:text-text outline-none transition-colors cursor-pointer"
            >
              <i className="ti ti-chevron-right text-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
