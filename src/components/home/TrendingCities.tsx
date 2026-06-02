import Link from 'next/link'

type City = {
  id: string
  name: string
  slug: string
  gym_count: number
  is_active: boolean
  wave: number
}

type Props = {
  cities: City[]
}

export default function TrendingCities({ cities }: Props) {
  if (!cities || cities.length === 0) {
    return null
  }

  return (
    <section id="cities" className="bb-hair">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-20 md:py-24">

        <div className="mb-12">
          <div className="label mb-3">Trending Cities</div>
          <h2 className="h2 text-text-primary">Find gyms in your city</h2>
          <p className="text-[15px] text-text-secondary mt-3 max-w-[480px]">
            Discover fitness centers in India&apos;s major cities.
            Top-rated facilities with verified listings.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={"/gyms/" + city.slug}
              className="group block bg-surface b-hair rounded-md p-5 hover:bg-raised hover:border-border-hi transition-colors"
            >
              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-[#E5E5E5] flex items-center justify-center p-1.5">
                <img
                  src={`/cities/${city.slug}.png`}
                  alt={city.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-8 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[17px] font-bold tracking-tight text-text-primary">
                    {city.name}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5">
                    {city.gym_count ?? 0} gyms
                  </div>
                </div>
                <i className="ti ti-arrow-up-right text-[18px] text-text-muted group-hover:text-text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="/cities" className="ghost text-[13px] inline-flex items-center gap-1.5">
            View all cities <i className="ti ti-arrow-right text-[14px]" />
          </a>
        </div>

      </div>
    </section>
  )
}
