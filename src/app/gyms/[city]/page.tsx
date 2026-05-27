import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCityBySlug, getGymsByCity, getLocalitiesByCity } from '@/lib/supabase/queries'

export const revalidate = 3600

type Props = { params: Promise<{ city: string }> }

export async function generateStaticParams() {
  return [
    { city: 'bangalore' },
    { city: 'mumbai' },
    { city: 'delhi' },
    { city: 'hyderabad' },
    { city: 'chennai' },
    { city: 'pune' },
    { city: 'kolkata' },
    { city: 'ahmedabad' },
  ]
}

export async function generateMetadata({ params }: Props) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)
  if (!city) return {}
  return {
    title: `Best Gyms in ${city.name} – Compare Fees, Timings & Ratings | Gymlocator`,
    description: city.meta_description || `Find the best gyms in ${city.name} on Gymlocator. Compare ${city.gym_count}+ gyms by fees, ratings, timings & amenities. Book a free trial near you today.`,
    alternates: {
      canonical: `https://gymlocator.in/gyms/${citySlug}`,
    },
  }
}

function formatSlug(slug: string) {
  return slug.split('-').map((w: string) =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params

  const [city, gyms, localities] = await Promise.all([
    getCityBySlug(citySlug),
    getGymsByCity(citySlug),
    getLocalitiesByCity(citySlug),
  ])

  if (!city) notFound()

  const cityName = city.name

  const faqs = city.faqs?.length > 0
    ? city.faqs
    : [
        {
          q: `How much does a gym membership cost in ${cityName}?`,
          a: `Gym memberships in ${cityName} typically range from ${city.price_budget_monthly || '₹1,200–₹1,800'}/month for budget gyms to ${city.price_premium_monthly || '₹4,000–₹8,000+'}/month for premium clubs.`,
        },
        {
          q: `Which is the best 24-hour gym in ${cityName}?`,
          a: `Several gyms in ${cityName} offer 24/7 access. Use the 24x7 filter above to find all round-the-clock gyms near you.`,
        },
        {
          q: `Are there women-only gyms in ${cityName}?`,
          a: `Yes, ${cityName} has several women-only gyms and fitness studios. Use the Women-only filter to browse all options.`,
        },
        {
          q: `Do gyms in ${cityName} offer a free trial?`,
          a: `Most gyms in ${cityName} offer a free trial session or a one-day pass. Look for the Free Trial badge on gym cards above.`,
        },
        {
          q: `What documents do I need to join a gym in ${cityName}?`,
          a: `Most gyms in ${cityName} require a government-issued photo ID (Aadhaar, PAN, or passport) and a recent passport-size photograph.`,
        },
        {
          q: `Which gyms in ${cityName} offer personal training?`,
          a: `Many gyms in ${cityName} offer personal training. Filter by Personal Trainer above to find certified PT-enabled gyms near you.`,
        },
      ]

  const popularSearches = [
    { label: `best gym in ${cityName}`, href: `/gyms/${citySlug}` },
    { label: `gym near me ${cityName}`, href: `/gyms/${citySlug}` },
    { label: `24 hour gym ${cityName}`, href: `/gyms/${citySlug}/24-7` },
    { label: `women only gym ${cityName}`, href: `/gyms/${citySlug}/women-only` },
    { label: `cheap gym near me`, href: `/gyms/${citySlug}` },
    { label: `gym fees ${cityName}`, href: `/gyms/${citySlug}` },
    { label: `personal trainer ${cityName}`, href: `/gyms/${citySlug}` },
    { label: `yoga classes ${cityName}`, href: `/gyms/${citySlug}/yoga` },
    { label: `crossfit ${cityName}`, href: `/gyms/${citySlug}/crossfit` },
    { label: `gyms in Delhi`, href: `/gyms/delhi` },
    { label: `gyms in Mumbai`, href: `/gyms/mumbai` },
    { label: `gyms in Bangalore`, href: `/gyms/bangalore` },
    { label: `gyms in Pune`, href: `/gyms/pune` },
    ...localities.slice(0, 8).map((l: { name: string; slug: string }) => ({
      label: `gym in ${l.name}`,
      href: `/gyms/${citySlug}/${l.slug}`,
    })),
  ]

  return (
    <main className="min-h-screen bg-base">

      {/* BREADCRUMB */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-6">
        <nav className="flex items-center gap-2 text-[12px] text-text-muted">
          <Link href="/" className="ghost">Home</Link>
          <span>›</span>
          <Link href="/cities" className="ghost">Cities</Link>
          <span>›</span>
          <span className="text-text-secondary">{cityName}</span>
        </nav>
      </div>

      {/* HERO */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-8 pb-6 bb-hair">
        <h1 className="h1 text-text-primary">
          {city.seo_h1 || `Best Gyms in ${cityName}`}
        </h1>
        <p className="text-[16px] text-text-secondary mt-3 max-w-[640px]">
          {city.seo_subtitle || `Compare ${city.gym_count || gyms.length}+ gyms across ${cityName} by fees, ratings, timings and amenities.`}
        </p>

        {/* FILTER BAR */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 p-2 bg-surface rounded-md b-hair max-w-[780px]">
          <div className="flex items-center gap-3 flex-1 px-3">
            <i className="ti ti-search text-[20px] text-text-muted" />
            <input
              type="text"
              placeholder="Search by locality, pincode or gym name…"
              className="bg-transparent w-full py-3 text-[15px] text-text-primary placeholder:text-text-muted border-0 outline-none"
            />
          </div>
          <button className="bg-accent text-base font-bold text-[14px] px-6 py-3 rounded-sm hover:bg-white transition-colors">
            Search
          </button>
        </div>

        {/* FILTER CHIPS */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['All', 'Women-only', 'AC', '24/7', 'CrossFit', 'Yoga', 'Swimming', 'Budget', 'Premium'].map((f) => (
            <button key={f} className={`filter-pill ${f === 'All' ? 'active' : ''}`}>
              {f}
            </button>
          ))}
        </div>

        {/* LOCALITY QUICK-JUMP */}
        {localities.length > 0 && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="label !text-text-muted whitespace-nowrap flex-shrink-0">Areas</span>
            {localities.map((loc: { id: string; name: string; slug: string }) => (
              <Link
                key={loc.id}
                href={`/gyms/${citySlug}/${loc.slug}`}
                className="flex-shrink-0 text-[13px] text-text-muted px-3 py-1.5 bg-surface b-hair rounded-pill hover:border-border-hi hover:text-text-primary transition-colors whitespace-nowrap"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* GYM CARD GRID */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12">
        <h2 className="h2 text-text-primary mb-8">Top Gyms in {cityName}</h2>

        {gyms.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <i className="ti ti-building-skyscraper text-[48px] mb-4 block" />
            <p className="text-[16px]">No gyms listed yet in {cityName}.</p>
            <p className="text-[14px] mt-2">Check back soon — we&apos;re adding new listings daily.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gyms.map((gym: {
              id: string; slug: string; name: string; locality_slug: string | null;
              is_featured: boolean; is_verified: boolean; is_247: boolean;
              rating: number; review_count: number; timing_open: string | null;
              timing_close: string | null; amenities: string[]; price_monthly: number | null;
              price_range: string; address: string;
            }, index: number) => (
              <article key={gym.id} className="bg-surface b-hair rounded-md overflow-hidden flex flex-col hover:border-border-hi transition-colors group">

                {/* Image zone */}
                <Link href={`/gym/${gym.slug}`} className="block">
                  <div className="img-placeholder h-[180px] relative">
                    {gym.is_featured && (
                      <span className="absolute top-3 left-3 label !text-accent bg-accent-dim px-2 py-1 rounded-sm">
                        Featured
                      </span>
                    )}
                    {gym.is_verified && (
                      <span className="absolute top-3 right-3 label !text-accent bg-accent-dim px-2 py-1 rounded-sm flex items-center gap-1">
                        <i className="ti ti-circle-check text-[12px]" /> Verified
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 text-[10px] text-text-disabled">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </Link>

                {/* Card body */}
                <div className="p-4 flex flex-col gap-2 flex-1">

                  {/* Name + Rating */}
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/gym/${gym.slug}`}>
                      <h3 className="h3 text-text-primary group-hover:text-accent transition-colors leading-tight">
                        {gym.name}
                      </h3>
                    </Link>
                    {gym.rating > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-[13px] font-bold text-text-primary">{gym.rating}</span>
                        {gym.review_count > 0 && (
                          <span className="text-[12px] text-text-muted">({gym.review_count})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Locality */}
                  <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
                    <i className="ti ti-map-pin text-[13px]" />
                    {gym.locality_slug ? formatSlug(gym.locality_slug) : cityName}
                    {gym.is_247 && (
                      <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.08em] bg-accent-dim text-accent px-2 py-0.5 rounded-sm">
                        24/7
                      </span>
                    )}
                  </div>

                  {/* Hours */}
                  {gym.timing_open && (
                    <div className="text-[12px] text-text-muted flex items-center gap-1.5">
                      <i className="ti ti-clock text-[12px]" />
                      {gym.timing_open} – {gym.timing_close}
                    </div>
                  )}

                  {/* Amenity tags */}
                  {gym.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {gym.amenities.slice(0, 3).map((a: string, i: number) => (
                        <span
                          key={a}
                          className={`text-[11px] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-sm ${
                            i === 0 ? 'bg-accent-dim text-accent' : 'bg-raised b-hair text-text-muted'
                          }`}
                        >
                          {a}
                        </span>
                      ))}
                      {gym.amenities.length > 3 && (
                        <span className="text-[11px] text-text-muted px-2 py-1">
                          +{gym.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer — price + CTA */}
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
                      <div className="text-[11px] text-text-disabled mt-0.5">
                        {gym.price_range === 'budget' ? 'Budget' : gym.price_range === 'premium' ? 'Premium' : 'Standard'}
                      </div>
                    </div>
                    <Link
                      href={`/gym/${gym.slug}`}
                      className="inline-flex items-center gap-1.5 bg-accent text-base font-bold text-[12px] px-3 py-2 rounded-sm hover:bg-white transition-colors flex-shrink-0"
                    >
                      <i className="ti ti-phone text-[13px]" /> View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* BROWSE BY AREA */}
      {localities.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12 bb-hair bt-hair">
          <h2 className="h2 text-text-primary mb-8">Browse Gyms by Area in {cityName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {localities.map((loc: { id: string; name: string; slug: string; gym_count: number }) => (
              <Link
                key={loc.id}
                href={`/gyms/${citySlug}/${loc.slug}`}
                className="bg-surface b-hair rounded-md p-4 hover:bg-raised hover:border-border-hi transition-colors"
              >
                <div className="text-[14px] font-semibold text-text-primary">
                  Gyms in {loc.name}
                </div>
                {loc.gym_count > 0 && (
                  <div className="text-[12px] text-text-muted mt-1">{loc.gym_count} gyms</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO CONTENT */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12">

        {/* About */}
        <div className="max-w-[780px] mb-12">
          <h2 className="h2 text-text-primary mb-4">About Gyms in {cityName}</h2>
          <p className="text-[15px] text-text-secondary leading-relaxed">
            {city.about_text || `${cityName}'s fitness scene spans 24-hour franchise gyms to boutique strength studios. Monthly memberships range from ₹1,200 for neighbourhood gyms to ₹6,000+ for premium clubs.`}
          </p>
        </div>

        {/* What to look for */}
        <div className="max-w-[780px] mb-12">
          <h2 className="h2 text-text-primary mb-4">What to Look for in a Gym in {cityName}</h2>
          <ul className="space-y-3">
            {(city.what_to_look_for?.length > 0
              ? city.what_to_look_for
              : [
                  'Certified trainers and a free trial session before you commit',
                  'Hygiene: sanitised equipment, clean changing rooms, towel service',
                  'Equipment quality: free weights, cardio mix, functional training zone',
                  'Distance: under 15 minutes from home or office for better adherence',
                  'Locker, shower, and parking for working professionals',
                  'Women-only timings or dedicated zones if relevant to you',
                ]
            ).map((point: string) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing table */}
        <div className="max-w-[780px] mb-12">
          <h2 className="h2 text-text-primary mb-4">Average Gym Membership Cost in {cityName}</h2>
          <div className="b-hair rounded-md overflow-hidden">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-surface">
                  <th className="text-left p-4 text-text-secondary font-semibold bb-hair">Tier</th>
                  <th className="text-left p-4 text-text-secondary font-semibold bb-hair">Monthly</th>
                  <th className="text-left p-4 text-text-secondary font-semibold bb-hair">Annual</th>
                  <th className="text-left p-4 text-text-secondary font-semibold bb-hair hidden md:table-cell">Includes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: 'Budget', monthly: city.price_budget_monthly || '₹1,200–1,800', annual: city.price_budget_annual || '₹10,000–15,000', includes: 'Equipment, locker, basic trainer' },
                  { tier: 'Standard', monthly: city.price_standard_monthly || '₹2,000–3,500', annual: city.price_standard_annual || '₹18,000–28,000', includes: '+ Group classes, shower, personal plan' },
                  { tier: 'Premium', monthly: city.price_premium_monthly || '₹4,000–8,000+', annual: city.price_premium_annual || '₹35,000–80,000', includes: '+ Pool, steam/sauna, dedicated PT' },
                ].map((row, i) => (
                  <tr key={row.tier} className={i < 2 ? 'bb-hair' : ''}>
                    <td className="p-4 font-semibold text-text-primary">{row.tier}</td>
                    <td className="p-4 text-text-secondary">{row.monthly}</td>
                    <td className="p-4 text-text-secondary">{row.annual}</td>
                    <td className="p-4 text-text-muted hidden md:table-cell">{row.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-[780px] mb-12">
          <h2 className="h2 text-text-primary mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq: { q: string; a: string }, i: number) => (
              <details key={i} className="bg-surface b-hair rounded-md group">
                <summary className="p-4 cursor-pointer text-[15px] font-semibold text-text-primary list-none flex items-center justify-between gap-4 hover:text-accent transition-colors">
                  {faq.q}
                  <i className="ti ti-chevron-down text-[16px] text-text-muted flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-[14px] text-text-secondary leading-relaxed bt-hair pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Popular searches */}
        <div className="max-w-[780px]">
          <h2 className="h2 text-text-primary mb-6">Popular Searches in {cityName}</h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="text-[13px] text-text-muted px-3 py-1.5 bg-surface b-hair rounded-pill hover:border-border-hi hover:text-text-primary transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'CollectionPage',
                '@id': `https://gymlocator.in/gyms/${citySlug}#webpage`,
                url: `https://gymlocator.in/gyms/${citySlug}`,
                name: `Best Gyms in ${cityName}`,
                description: `Find the best gyms in ${cityName} on Gymlocator.`,
                breadcrumb: { '@id': `https://gymlocator.in/gyms/${citySlug}#breadcrumb` },
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `https://gymlocator.in/gyms/${citySlug}#breadcrumb`,
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gymlocator.in/' },
                  { '@type': 'ListItem', position: 2, name: 'Cities', item: 'https://gymlocator.in/cities' },
                  { '@type': 'ListItem', position: 3, name: cityName, item: `https://gymlocator.in/gyms/${citySlug}` },
                ],
              },
              {
                '@type': 'ItemList',
                name: `Top Gyms in ${cityName}`,
                numberOfItems: gyms.length,
                itemListElement: gyms.slice(0, 10).map((gym: {
                  slug: string; name: string; address: string;
                  locality_slug: string | null; rating: number; review_count: number;
                }, i: number) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  item: {
                    '@type': ['HealthClub', 'SportsActivityLocation', 'LocalBusiness'],
                    '@id': `https://gymlocator.in/gym/${gym.slug}`,
                    name: gym.name,
                    url: `https://gymlocator.in/gym/${gym.slug}`,
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: gym.address,
                      addressLocality: gym.locality_slug ? formatSlug(gym.locality_slug) : cityName,
                      addressRegion: cityName,
                      addressCountry: 'IN',
                    },
                    ...(gym.rating > 0 && {
                      aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: gym.rating,
                        reviewCount: gym.review_count || 1,
                      },
                    }),
                  },
                })),
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq: { q: string; a: string }) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              },
            ],
          }),
        }}
      />

    </main>
  )
}
