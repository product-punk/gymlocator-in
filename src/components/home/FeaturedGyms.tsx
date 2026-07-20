import GymCard from '@/components/shared/GymCard'

interface Gym {
  id: string
  slug: string
  name: string
  locality_slug: string | null
  city_slug: string
  rating: number | null
  review_count: number | null
  price_monthly: number | null
  amenities: string[]
  is_featured?: boolean
  is_verified?: boolean
  is_247?: boolean
  gender?: string
  timing_open?: string | null
  timing_close?: string | null
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
            <h2 className="h2 text-text">Top-rated gyms</h2>
          </div>
          <a
            href="/gyms/bangalore"
            className="ghost text-[13px] inline-flex items-center gap-1.5 whitespace-nowrap hidden md:inline-flex"
          >
            View all <i className="ti ti-arrow-right text-[14px]" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gyms.map((gym, i) => (
            <GymCard key={gym.id} gym={gym} list_position={i + 1} />
          ))}
        </div>

      </div>
    </section>
  )
}
