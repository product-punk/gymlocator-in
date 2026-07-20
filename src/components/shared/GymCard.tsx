import Link from 'next/link'

function formatSlug(slug: string) {
  if (!slug) return ''
  return slug.split('-').map((w: string) =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

export default function GymCard({ gym, list_position }: {
  gym: {
    id: string
    slug: string
    name: string
    city_slug?: string
    locality_slug?: string | null
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
  }
  list_position: number
}) {
  const badges = [
    gym.is_featured && 'Featured',
    gym.is_verified && 'Verified',
    gym.is_247 && '24/7',
    gym.gender === 'women-only' && 'Women Only',
  ].filter(Boolean) as string[]

  return (
    <article
      data-gtm-event="select_content"
      data-gtm-content-type="gym_card"
      data-gtm-item-id={gym.slug}
      data-gtm-list-position={list_position}
      className="bg-surface b-hair rounded-md overflow-hidden flex flex-col hover:border-border-hi hover:-translate-y-0.5 transition-[colors,transform] group"
    >

      {/* HEADER - locality eyebrow, rating, name, badges */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="label flex items-center gap-1.5 truncate">
            <i className="ti ti-map-pin text-[11px]" />
            {gym.locality_slug
              ? formatSlug(gym.locality_slug)
              : formatSlug(gym.city_slug ?? '')}
          </div>
          {(gym.rating ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[13px] font-bold text-text">{gym.rating}</span>
              {(gym.review_count ?? 0) > 0 && (
                <span className="text-[11px] text-accent">({gym.review_count})</span>
              )}
            </div>
          )}
        </div>

        <Link href={`/gym/${gym.slug}`}>
          <h3 className="text-[17px] font-bold text-text group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {gym.name}
          </h3>
        </Link>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {badges.map((b) => (
              <span key={b} className="label !text-accent bg-accent-dim px-2 py-1 rounded-sm flex items-center gap-1">
                {b === 'Verified' && <i className="ti ti-circle-check text-[11px]" />}
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SPEC STRIP - edge-to-edge hairline grid, echoes gym detail info grid */}
      <div className="grid grid-cols-2 gap-px bg-border bt-hair bb-hair">
        <div className="bg-surface px-4 py-3">
          <div className="label flex items-center gap-1.5 mb-1">
            <i className="ti ti-clock text-[11px]" />
            Timings
          </div>
          <div className="text-[13px] font-bold text-text">
            {gym.is_247
              ? '24 / 7 Open'
              : gym.timing_open
                ? `${gym.timing_open} - ${gym.timing_close}`
                : 'Call to confirm'}
          </div>
        </div>
        <div className="bg-surface px-4 py-3">
          <div className="label flex items-center gap-1.5 mb-1">
            <i className="ti ti-currency-rupee text-[11px]" />
            Monthly
          </div>
          <div className="text-[13px] font-bold text-text">
            {gym.price_monthly ? (
              <>
                ₹{gym.price_monthly.toLocaleString('en-IN')}
                <span className="text-[11px] font-normal text-accent">/mo</span>
              </>
            ) : (
              'On request'
            )}
          </div>
        </div>
      </div>

      {/* AMENITIES */}
      {(gym.amenities?.length ?? 0) > 0 && (() => {
        const amenities = gym.amenities ?? []
        return (
          <div className="flex flex-wrap gap-1 p-4 pt-3">
            {amenities.slice(0, 3).map((a: string, i: number) => (
              <span
                key={a}
                className={`label px-2 py-0.5 rounded-sm ${
                  i === 0
                    ? 'bg-accent-dim !text-accent'
                    : 'bg-raised b-hair !text-accent'
                }`}
              >
                {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-[11px] text-accent px-1 py-0.5">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        )
      })()}

      {/* CTA - full-width footer row */}
      <Link
        href={`/gym/${gym.slug}`}
        className="mt-auto bt-hair flex items-center justify-between px-4 py-3 text-[13px] font-bold text-accent hover:text-text hover:bg-accent-dim transition-colors"
      >
        View gym
        <i className="ti ti-arrow-right text-[14px] group-hover:translate-x-0.5 transition-transform" />
      </Link>

    </article>
  )
}
