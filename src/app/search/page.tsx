import Link from 'next/link'
import { searchGymsAndLocalities } from '@/lib/supabase/queries'
import GymCard from '@/components/shared/GymCard'

export const revalidate = 0

type Props = {
  searchParams: Promise<{ q?: string }>
}

function formatSlug(slug: string) {
  if (!slug) return ''
  return slug.split('-').map((w: string) =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

export async function generateMetadata({ searchParams }: Props) {
  const { q = '' } = await searchParams
  return {
    title: q
      ? `Search results for "${q}" | Gymlocator`
      : 'Search Gyms | Gymlocator',
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q: rawQ = '' } = await searchParams
  const q = rawQ.trim()

  const { gyms, cities, localities } = q.length >= 2
    ? await searchGymsAndLocalities(q)
    : { gyms: [], cities: [], localities: [] }

  const totalResults = gyms.length + cities.length + localities.length

  return (
    <main className="min-h-screen bg-base">

      {/* HEADER */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-10 pb-8 bb-hair">
        <div className="label !text-text-muted mb-3">Search results</div>
        <h1 className="h1 text-text-primary">
          {q ? `"${q}"` : 'Search gyms in India'}
        </h1>
        {q && (
          <p className="text-[15px] text-text-muted mt-2">
            {totalResults > 0
              ? `${totalResults} result${totalResults !== 1 ? 's' : ''} found`
              : 'No results found'}
          </p>
        )}
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10 space-y-12">

        {/* NO QUERY STATE */}
        {!q && (
          <div className="text-center py-20">
            <i className="ti ti-search text-[48px] text-text-disabled block mb-4" />
            <p className="text-[16px] text-text-muted">
              Search for a city, locality or gym name
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Andheri', 'Koramangala', 'Dwarka'].map((c) => (
                <Link
                  key={c}
                  href={`/search?q=${encodeURIComponent(c)}`}
                  className="text-[13px] text-text-muted px-3 py-1.5 bg-surface b-hair rounded-pill hover:border-border-hi hover:text-text-primary transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* NO RESULTS */}
        {q && totalResults === 0 && (
          <div className="text-center py-20">
            <i className="ti ti-search-off text-[48px] text-text-disabled block mb-4" />
            <p className="text-[16px] text-text-primary font-semibold mb-2">
              No results for &ldquo;{q}&rdquo;
            </p>
            <p className="text-[14px] text-text-muted mb-8">
              Try searching for a city, locality or gym name
            </p>
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 bg-accent text-[#0C0C0C] font-bold text-[14px] px-5 py-2.5 rounded-sm hover:bg-white transition-colors"
            >
              Browse all cities
              <i className="ti ti-arrow-right text-[14px]" />
            </Link>
          </div>
        )}

        {/* CITIES */}
        {cities.length > 0 && (
          <section>
            <h2 className="h2 text-text-primary mb-6 flex items-center gap-3">
              <i className="ti ti-building-skyscraper text-[22px] text-accent" />
              Cities
              <span className="text-[14px] text-text-muted font-normal">({cities.length})</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(cities as { id: string; name: string; slug: string; gym_count: number }[]).map((city) => (
                <Link
                  key={city.id}
                  href={`/gyms/${city.slug}`}
                  className="bg-surface b-hair rounded-md p-5 hover:bg-raised hover:border-border-hi transition-colors group"
                >
                  <div className="text-[16px] font-bold text-text-primary group-hover:text-accent transition-colors">
                    {city.name}
                  </div>
                  <div className="text-[12px] text-text-muted mt-1">
                    {city.gym_count || 0} gyms
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* LOCALITIES */}
        {localities.length > 0 && (
          <section>
            <h2 className="h2 text-text-primary mb-6 flex items-center gap-3">
              <i className="ti ti-map-pin text-[22px] text-accent" />
              Localities
              <span className="text-[14px] text-text-muted font-normal">({localities.length})</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(localities as { id: string; name: string; slug: string; city_slug: string }[]).map((loc) => (
                <Link
                  key={loc.id}
                  href={`/gyms/${loc.city_slug}/${loc.slug}`}
                  className="bg-surface b-hair rounded-md p-5 hover:bg-raised hover:border-border-hi transition-colors group"
                >
                  <div className="text-[15px] font-bold text-text-primary group-hover:text-accent transition-colors">
                    {loc.name || formatSlug(loc.slug)}
                  </div>
                  <div className="text-[12px] text-text-muted mt-1">
                    {formatSlug(loc.city_slug)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* GYMS */}
        {gyms.length > 0 && (
          <section>
            <h2 className="h2 text-text-primary mb-6 flex items-center gap-3">
              <i className="ti ti-barbell text-[22px] text-accent" />
              Gyms
              <span className="text-[14px] text-text-muted font-normal">({gyms.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          </section>
        )}

      </div>

    </main>
  )
}
