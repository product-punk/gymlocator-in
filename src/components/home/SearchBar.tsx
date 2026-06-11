'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function formatSlug(slug: string) {
  return slug?.split('-').map((w: string) =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ') || ''
}

type SearchResults = {
  gyms: { id: string; name: string; slug: string; city_slug: string; locality_slug: string | null; rating: number }[]
  cities: { id: string; name: string; slug: string; gym_count: number }[]
  localities: { id: string; name: string; slug: string; city_slug: string }[]
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({ gyms: [], cities: [], localities: [] })
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ gyms: [], cities: [], localities: [] })
      setOpen(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const q = query.toLowerCase().trim()

      const [gymsRes, citiesRes, localitiesRes] = await Promise.all([
        supabase
          .from('gyms')
          .select('id, name, slug, city_slug, locality_slug, rating')
          .eq('is_active', true)
          .ilike('name', `%${q}%`)
          .order('rating', { ascending: false })
          .limit(5),
        supabase
          .from('cities')
          .select('id, name, slug, gym_count')
          .ilike('name', `%${q}%`)
          .limit(3),
        supabase
          .from('localities')
          .select('id, name, slug, city_slug')
          .ilike('name', `%${q}%`)
          .limit(4),
      ])

      setResults({
        gyms: gymsRes.data ?? [],
        cities: citiesRes.data ?? [],
        localities: localitiesRes.data ?? [],
      })
      setOpen(true)
      setLoading(false)
    }, 300)
  }, [query])

  const hasResults =
    results.cities.length > 0 ||
    results.localities.length > 0 ||
    results.gyms.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div ref={ref} className="relative w-full max-w-[680px]">
      <form
        onSubmit={handleSubmit}
        className="search-glow flex items-center bg-surface b-hair rounded-md overflow-hidden focus-within:border-border-hi transition-colors"
      >
        <div className="flex items-center gap-3 pl-4 pr-2 flex-1 min-w-0">
          {loading
            ? <i className="ti ti-loader-2 text-[18px] text-accent animate-spin flex-shrink-0" />
            : <i className="ti ti-search text-[18px] text-accent flex-shrink-0" />
          }
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => hasResults && setOpen(true)}
            placeholder="Search by city, locality or gym name..."
            className="flex-1 min-w-0 bg-transparent py-4 text-[15px] text-text placeholder:text-accent outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setOpen(false) }}
              className="p-1 text-accent hover:text-text transition-colors flex-shrink-0"
            >
              <i className="ti ti-x text-[16px]" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="btn-shimmer bg-accent text-[#0C0C0C] font-bold text-[14px] px-6 py-4 hover:bg-text transition-colors flex-shrink-0 flex items-center gap-2"
        >
          <i className="ti ti-search text-[15px]" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* DROPDOWN */}
      {open && hasResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface b-hair rounded-md shadow-lg z-50 overflow-hidden">

          {results.cities.length > 0 && (
            <div>
              <div className="px-4 py-2 label !text-accent">Cities</div>
              {results.cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    router.push(`/gyms/${city.slug}`)
                    setOpen(false)
                    setQuery(city.name)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-raised transition-colors text-left"
                >
                  <i className="ti ti-building-skyscraper text-[16px] text-accent flex-shrink-0" />
                  <div>
                    <div className="text-[14px] font-semibold text-text">{city.name}</div>
                    <div className="text-[12px] text-accent">{city.gym_count} gyms</div>
                  </div>
                  <i className="ti ti-arrow-right text-[14px] text-accent ml-auto" />
                </button>
              ))}
            </div>
          )}

          {results.localities.length > 0 && (
            <div className="bt-hair">
              <div className="px-4 py-2 label !text-accent">Localities</div>
              {results.localities.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    router.push(`/gyms/${loc.city_slug}/${loc.slug}`)
                    setOpen(false)
                    setQuery(loc.name)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-raised transition-colors text-left"
                >
                  <i className="ti ti-map-pin text-[16px] text-accent flex-shrink-0" />
                  <div>
                    <div className="text-[14px] font-semibold text-text">{loc.name}</div>
                    <div className="text-[12px] text-accent">{formatSlug(loc.city_slug)}</div>
                  </div>
                  <i className="ti ti-arrow-right text-[14px] text-accent ml-auto" />
                </button>
              ))}
            </div>
          )}

          {results.gyms.length > 0 && (
            <div className="bt-hair">
              <div className="px-4 py-2 label !text-accent">Gyms</div>
              {results.gyms.map((gym) => (
                <button
                  key={gym.id}
                  onClick={() => {
                    router.push(`/gym/${gym.slug}`)
                    setOpen(false)
                    setQuery(gym.name)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-raised transition-colors text-left"
                >
                  <i className="ti ti-barbell text-[16px] text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-text truncate">{gym.name}</div>
                    <div className="text-[12px] text-accent">
                      {gym.locality_slug ? formatSlug(gym.locality_slug) + ', ' : ''}
                      {formatSlug(gym.city_slug)}
                    </div>
                  </div>
                  {gym.rating > 0 && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="text-[12px] font-bold text-text">{gym.rating}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="bt-hair p-3">
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query)}`)
                setOpen(false)
              }}
              className="w-full text-center text-[13px] text-accent hover:text-accent transition-colors py-1"
            >
              View all results for &ldquo;{query}&rdquo;
              <i className="ti ti-arrow-right text-[13px] ml-1" />
            </button>
          </div>

        </div>
      )}

      {/* NO RESULTS */}
      {open && query.length >= 2 && !loading && !hasResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface b-hair rounded-md p-6 text-center z-50">
          <p className="text-[14px] text-accent">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-[12px] text-accent mt-1">Try a city name, locality or gym name</p>
        </div>
      )}
    </div>
  )
}
