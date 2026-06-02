'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type Props = {
  citySlug: string
  localitySlug?: string
  total: number
}

export default function GymFilters({ citySlug, localitySlug, total }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'rating'

  const updateSort = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    const base = localitySlug
      ? `/gyms/${citySlug}/${localitySlug}`
      : `/gyms/${citySlug}`
    router.push(`${base}?${params.toString()}`)
  }, [searchParams, citySlug, localitySlug, router])

  return (
    <div className="bg-base bt-hair bb-hair py-3">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-text-muted uppercase tracking-[0.08em] font-bold flex-shrink-0">
            Sort by
          </span>
          <select
            value={sort}
            onChange={e => updateSort(e.target.value)}
            className="bg-surface b-hair rounded-sm text-[12px] text-text-primary px-3 py-2 outline-none hover:border-border-hi transition-colors cursor-pointer"
          >
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <span className="text-[12px] text-text-muted ml-2">
            {total} gyms
          </span>
        </div>
      </div>
    </div>
  )
}
