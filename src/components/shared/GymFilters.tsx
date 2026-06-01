'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type Props = {
  citySlug: string
  localitySlug?: string
  total: number
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function GymFilters({ citySlug, localitySlug, total }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const gender = searchParams.get('gender') || ''
  const is247 = searchParams.get('247') === '1'
  const sort = searchParams.get('sort') || 'rating'
  const minRating = searchParams.get('min_rating') || ''

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    const base = localitySlug
      ? `/gyms/${citySlug}/${localitySlug}`
      : `/gyms/${citySlug}`
    router.push(`${base}?${params.toString()}`)
  }, [searchParams, citySlug, localitySlug, router])

  const basePath = localitySlug
    ? `/gyms/${citySlug}/${localitySlug}`
    : `/gyms/${citySlug}`

  const hasFilters = gender || is247 || minRating

  return (
    <div className="bg-base bt-hair bb-hair py-3">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">

          {/* 24/7 — indexed amenity URL */}
          <Link
            href={`${basePath}/24-7`}
            className={`flex-shrink-0 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] px-3 py-2 rounded-sm b-hair transition-colors hover:border-border-hi ${
              is247
                ? 'bg-accent text-[#0C0C0C] border-transparent'
                : 'bg-surface text-text-muted'
            }`}
          >
            <i className="ti ti-clock-24 text-[13px]" />
            24/7
          </Link>

          {/* Women Only — indexed amenity URL */}
          <Link
            href={`${basePath}/women-only`}
            className={`flex-shrink-0 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] px-3 py-2 rounded-sm b-hair transition-colors hover:border-border-hi ${
              gender === 'women-only'
                ? 'bg-accent text-[#0C0C0C] border-transparent'
                : 'bg-surface text-text-muted'
            }`}
          >
            <i className="ti ti-venus text-[13px]" />
            Women Only
          </Link>

          {/* Rating filter — noindex query param */}
          <button
            onClick={() => updateParam('min_rating', minRating === '4' ? null : '4')}
            className={`flex-shrink-0 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] px-3 py-2 rounded-sm b-hair transition-colors hover:border-border-hi ${
              minRating === '4'
                ? 'bg-accent text-[#0C0C0C] border-transparent'
                : 'bg-surface text-text-muted'
            }`}
          >
            <i className="ti ti-star text-[13px]" />
            4★ & above
          </button>

          <div className="w-px h-5 bg-border flex-shrink-0 mx-1" />

          {/* Sort */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[12px] text-text-muted uppercase tracking-[0.08em] font-bold">
              Sort
            </span>
            <select
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}
              className="bg-surface b-hair rounded-sm text-[12px] text-text-primary px-2 py-1.5 outline-none hover:border-border-hi transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={() => router.push(basePath)}
              className="flex-shrink-0 flex items-center gap-1 text-[12px] text-text-muted hover:text-accent transition-colors ml-auto"
            >
              <i className="ti ti-x text-[13px]" />
              Clear
            </button>
          )}

        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] text-text-muted">Filtered:</span>
            {is247 && (
              <span className="text-[11px] bg-accent-dim text-accent px-2 py-0.5 rounded-sm font-bold">
                24/7 Only
              </span>
            )}
            {gender === 'women-only' && (
              <span className="text-[11px] bg-accent-dim text-accent px-2 py-0.5 rounded-sm font-bold">
                Women Only
              </span>
            )}
            {minRating && (
              <span className="text-[11px] bg-accent-dim text-accent px-2 py-0.5 rounded-sm font-bold">
                4★ & above
              </span>
            )}
            <span className="text-[11px] text-text-muted">· {total} results</span>
          </div>
        )}
      </div>
    </div>
  )
}
