import Link from 'next/link'

interface Gym {
  slug: string
  name: string
  locality_slug: string | null
  city_slug: string
  rating: number | null
  review_count: number | null
  price_monthly: number | null
  amenities: string[]
}

function formatSlug(slug: string) {
  return slug.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

export default function FeaturedGyms({ gyms }: { gyms: Gym[] }) {
  if (gyms.length === 0) return null

  return (
    <section className="bb-hair">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-20 md:py-24">

        {/* Section header */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="label mb-3">Featured</div>
            <h2 className="h2 text-text-primary">Top-rated gyms</h2>
          </div>
          <a
            href="/gyms/bangalore"
            className="ghost text-[13px] inline-flex items-center gap-1.5 whitespace-nowrap hidden md:inline-flex"
          >
            View all <i className="ti ti-arrow-right text-[14px]" />
          </a>
        </div>

        {/* Scrollable row */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {gyms.map((gym) => (
            <article key={gym.slug} className="flex-none w-[300px] sm:w-[320px] snap-start bg-surface b-hair rounded-md overflow-hidden flex flex-col hover:border-border-hi transition-colors group relative">

              {/* Full-card link underlay */}
              <Link href={`/gym/${gym.slug}`} className="absolute inset-0 z-0" aria-label={gym.name} />

              {/* Image zone */}
              <div className="h-[180px] img-placeholder relative">
                <span className="absolute top-3 left-3 label !text-accent bg-accent-dim px-2 py-1 rounded-[20px]">
                  Featured
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] font-mono uppercase text-text-muted bg-base/70 backdrop-blur px-2 py-1 b-hair">
                  gym photo
                </span>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Name + location */}
                <div>
                  <h3 className="h3 text-text-primary">{gym.name}</h3>
                  <div className="flex items-center gap-1.5 text-[13px] text-text-muted mt-1">
                    <i className="ti ti-map-pin text-[13px]" />
                    {gym.locality_slug ? formatSlug(gym.locality_slug) : ''}, {formatSlug(gym.city_slug)}
                  </div>
                </div>

                {/* Amenity tags */}
                <div className="flex flex-wrap gap-1.5">
                  {gym.amenities.slice(0, 3).map((tag, i) => (
                    i === 0 ? (
                      <span key={tag} className="text-[11px] font-bold uppercase tracking-[0.08em] bg-accent-dim text-accent px-2 py-1 rounded-sm">
                        {tag}
                      </span>
                    ) : (
                      <span key={tag} className="text-[11px] font-bold uppercase tracking-[0.08em] bg-raised b-hair text-text-muted px-2 py-1 rounded-sm">
                        {tag}
                      </span>
                    )
                  ))}
                </div>

                {/* Footer row */}
                <div className="mt-auto pt-3 bt-hair flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[13px] text-text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    <span className="font-bold">{gym.rating ?? '—'}</span>
                    <span className="text-text-muted">({gym.review_count ?? 0})</span>
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    {gym.price_monthly ? (
                      <><span className="text-text-muted">₹</span>{gym.price_monthly}<span className="text-text-muted">/mo</span></>
                    ) : (
                      <span className="text-text-muted">Price on request</span>
                    )}
                  </div>
                  <Link
                    href={`/gym/${gym.slug}`}
                    className="relative z-10 inline-flex items-center gap-1.5 bg-accent text-base font-bold text-[12px] px-3 py-2 rounded-sm hover:bg-white transition-colors flex-shrink-0"
                  >
                    <i className="ti ti-phone text-[13px]" /> Call now
                  </Link>
                </div>

              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
