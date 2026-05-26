import Link from 'next/link'

const CITIES = [
  { name: 'Bangalore', slug: 'bangalore', count: 380, icon: 'ti-building-skyscraper' },
  { name: 'Mumbai',    slug: 'mumbai',    count: 520, icon: 'ti-building-skyscraper' },
  { name: 'Delhi',     slug: 'delhi',     count: 450, icon: 'ti-building-skyscraper' },
  { name: 'Hyderabad', slug: 'hyderabad', count: 280, icon: 'ti-building-skyscraper' },
  { name: 'Chennai',   slug: 'chennai',   count: 320, icon: 'ti-building-skyscraper' },
  { name: 'Pune',      slug: 'pune',      count: 250, icon: 'ti-building-skyscraper' },
  { name: 'Kolkata',   slug: 'kolkata',   count: 200, icon: 'ti-building-skyscraper' },
  { name: 'Ahmedabad', slug: 'ahmedabad', count: 180, icon: 'ti-building-skyscraper' },
]

export default function TrendingCities() {
  return (
    <section id="cities" className="bb-hair">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-20 md:py-24">

        {/* Section header */}
        <div className="mb-12">
          <div className="label mb-3">Trending Cities</div>
          <h2 className="h2 text-text-primary">Find gyms in your city</h2>
          <p className="text-[15px] text-text-secondary mt-3 max-w-[480px]">
            Discover fitness centers in India&apos;s major cities.
            Top-rated facilities with verified listings.
          </p>
        </div>

        {/* Cities grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CITIES.map((city) => (
            <Link key={city.slug} href={`/gyms/${city.slug}`}>
              <div className="bg-surface b-hair rounded-md p-5 flex items-center gap-4 hover:bg-raised hover:border-border-hi transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-raised rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-border transition-colors">
                  <i className={`ti ${city.icon} text-[20px] text-accent`} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-text-primary tracking-tight">
                    {city.name}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5 flex items-center gap-1">
                    <i className="ti ti-map-pin text-[11px]" />
                    {city.count} gyms
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-8 text-center">
          <a href="/cities" className="ghost text-[13px] inline-flex items-center gap-1.5">
            View all cities <i className="ti ti-arrow-right text-[14px]" />
          </a>
        </div>

      </div>
    </section>
  )
}
