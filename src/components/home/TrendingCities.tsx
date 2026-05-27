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
  console.log('Cities received:', cities)

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
              className="bg-surface b-hair rounded-md p-5 flex items-center gap-4 hover:bg-raised hover:border-border-hi transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 bg-raised rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-border transition-colors">
                <i className="ti ti-building-skyscraper text-[20px] text-accent" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-text-primary tracking-tight">
                  {city.name}
                </div>
                <div className="text-[12px] text-text-muted mt-0.5 flex items-center gap-1">
                  <i className="ti ti-map-pin text-[11px]" />
                  {city.gym_count ?? 0} gyms
                </div>
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
