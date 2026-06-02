import Link from 'next/link'
import SearchBar from './SearchBar'

const POPULAR_CITIES = [
  { name: 'Bangalore', slug: 'bangalore' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Pune', slug: 'pune' },
  { name: 'Hyderabad', slug: 'hyderabad' },
  { name: 'Chennai', slug: 'chennai' },
]

const STATS = [
  { value: '2,580+', label: 'Gyms listed' },
  { value: '8', label: 'Cities' },
  { value: '15', label: 'Localities' },
  { value: '100%', label: 'Free' },
]

export default function Hero() {
  return (
    <section className="bb-hair min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-20 md:py-28">

        {/* Eyebrow */}
        <div className="label flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          India&apos;s gym discovery platform
        </div>

        {/* H1 */}
        <h1 className="h1 text-text max-w-[920px] mt-6">
          Find the best gyms in your city.
        </h1>

        {/* Subtext */}
        <p className="max-w-[620px] text-[16px] leading-relaxed text-accent mt-6">
          Discover, compare and connect with top fitness centers across India.
          Filter by amenity, price tier, locality and timing - no signup needed.
        </p>

        {/* Search bar */}
        <div className="mt-10">
          <SearchBar />
        </div>

        {/* Quick city links */}
        <div className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[13px] text-accent">
          <span className="label !text-accent mr-2">Popular</span>
          {POPULAR_CITIES.map((city, i) => (
            <span key={city.slug} className="contents">
              <Link
                href={`/gyms/${city.slug}`}
                className="text-[13px] text-accent hover:text-text transition-colors px-2 py-1"
              >
                {city.name}
              </Link>
              {i < POPULAR_CITIES.length - 1 && (
                <span className="text-accent">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-16 max-w-[780px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border b-hair rounded-md overflow-hidden">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-surface p-5">
                <div className="text-[24px] font-bold tracking-tight text-text">
                  {value}
                </div>
                <div className="label !text-accent mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
