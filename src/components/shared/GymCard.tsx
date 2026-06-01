import Link from 'next/link'

function formatSlug(slug: string) {
  if (!slug) return ''
  return slug.split('-').map((w: string) =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

export default function GymCard({ gym }: { gym: {
  id: string
  slug: string
  name: string
  city_slug?: string
  locality_slug?: string | null
  images?: string[]
  is_featured?: boolean
  is_verified?: boolean
  is_247?: boolean
  gender?: string
  rating?: number | null
  review_count?: number | null
  timing_open?: string | null
  timing_close?: string | null
  amenities?: string[]
  price_monthly?: number | null
} }) {
  return (
    <article className="bg-surface b-hair rounded-md overflow-hidden flex flex-col hover:border-border-hi transition-colors group">

      {/* IMAGE */}
      <Link href={`/gym/${gym.slug}`} className="block">
        <div className="h-[180px] relative overflow-hidden bg-raised">
          {gym.images?.[0] && gym.images[0] !== '' && gym.images[0] !== 'nan' ? (
            <img
              src={gym.images[0]}
              alt={gym.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="ti ti-building-skyscraper text-[40px] text-text-disabled" />
            </div>
          )}

          {/* BADGES */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              {gym.is_featured && (
                <span className="label !text-accent bg-accent-dim px-2 py-1 rounded-sm self-start">
                  Featured
                </span>
              )}
              {gym.gender === 'women-only' && (
                <span className="label !text-[#FF85A1] bg-[#2A1018] px-2 py-1 rounded-sm self-start">
                  Women Only
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {gym.is_247 && (
                <span className="label !text-accent bg-accent-dim px-2 py-1 rounded-sm">
                  24/7
                </span>
              )}
              {gym.is_verified && (
                <span className="label !text-accent bg-accent-dim px-2 py-1 rounded-sm flex items-center gap-1">
                  <i className="ti ti-circle-check text-[11px]" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2 flex-1">

        {/* NAME + RATING */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/gym/${gym.slug}`}>
            <h3 className="text-[15px] font-bold text-text-primary group-hover:text-accent transition-colors leading-snug">
              {gym.name}
            </h3>
          </Link>
          {(gym.rating ?? 0) > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[13px] font-bold text-text-primary">{gym.rating}</span>
              {(gym.review_count ?? 0) > 0 && (
                <span className="text-[11px] text-text-muted">({gym.review_count})</span>
              )}
            </div>
          )}
        </div>

        {/* LOCALITY */}
        <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
          <i className="ti ti-map-pin text-[12px]" />
          {gym.locality_slug
            ? formatSlug(gym.locality_slug)
            : formatSlug(gym.city_slug ?? '')}
        </div>

        {/* TIMINGS */}
        {(gym.timing_open || gym.is_247) && (
          <div className="text-[12px] text-text-muted flex items-center gap-1.5">
            <i className="ti ti-clock text-[12px]" />
            {gym.is_247
              ? '24 / 7 Open'
              : `${gym.timing_open} – ${gym.timing_close}`}
          </div>
        )}

        {/* AMENITIES */}
        {(gym.amenities?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {gym.amenities!.slice(0, 3).map((a: string, i: number) => (
              <span
                key={a}
                className={`text-[11px] font-bold uppercase tracking-[0.07em] px-2 py-0.5 rounded-sm ${
                  i === 0
                    ? 'bg-accent-dim text-accent'
                    : 'bg-raised b-hair text-text-muted'
                }`}
              >
                {a}
              </span>
            ))}
            {gym.amenities!.length > 3 && (
              <span className="text-[11px] text-text-muted px-1 py-0.5">
                +{gym.amenities!.length - 3}
              </span>
            )}
          </div>
        )}

        {/* PRICE + CTA */}
        <div className="mt-auto pt-3 bt-hair flex items-center justify-between gap-2">
          <div>
            {gym.price_monthly ? (
              <div className="text-[15px] font-bold text-text-primary">
                ₹{gym.price_monthly.toLocaleString('en-IN')}
                <span className="text-[12px] font-normal text-text-muted">/mo</span>
              </div>
            ) : (
              <div className="text-[13px] text-text-muted">Price on request</div>
            )}
          </div>
          <Link
            href={`/gym/${gym.slug}`}
            className="inline-flex items-center gap-1.5 bg-accent text-[#0C0C0C] font-bold text-[12px] px-3 py-2 rounded-sm hover:bg-white transition-colors flex-shrink-0"
          >
            View gym
            <i className="ti ti-arrow-right text-[12px]" />
          </Link>
        </div>

      </div>
    </article>
  )
}
