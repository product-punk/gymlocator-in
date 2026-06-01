import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getCityBySlug,
  getLocalityBySlug,
  getGymsByLocality,
  getGymsByAmenity,
} from '@/lib/supabase/queries'
import GymCard from '@/components/shared/GymCard'
import GymFilters from '@/components/shared/GymFilters'

export const revalidate = 3600

const GYMS_PER_PAGE = 12

const AMENITIES = [
  'crossfit', 'yoga', 'zumba', 'swimming', 'pilates',
  'women-only', '24-7', 'mma', 'boxing', 'calisthenics',
  'functional-training', 'powerlifting', 'cardio-only',
] as const

const AMENITY_LABELS: Record<string, string> = {
  'crossfit':            'CrossFit',
  'yoga':                'Yoga',
  'zumba':               'Zumba',
  'swimming':            'Swimming',
  'pilates':             'Pilates',
  'women-only':          'Women-Only',
  '24-7':                '24/7',
  'mma':                 'MMA',
  'boxing':              'Boxing',
  'calisthenics':        'Calisthenics',
  'functional-training': 'Functional Training',
  'powerlifting':        'Powerlifting',
  'cardio-only':         'Cardio',
}

type Gym = {
  id: string
  name: string
  slug: string
  city_slug: string
  locality_slug: string
  address: string
  phone: string | null
  amenities: string[]
  gender: string
  price_monthly: number | null
  ac: boolean
  timing_open: string | null
  timing_close: string | null
  is_247: boolean
  rating: number
  review_count: number
  images: string[]
  is_featured: boolean
  is_active: boolean
}

type Props = {
  params: Promise<{ city: string; slug: string }>
  searchParams: Promise<{ page?: string; gender?: string; '247'?: string; min_rating?: string; sort?: string }>
}

function formatSlug(slug: string) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { city: citySlug, slug } = await params
  const { page, gender, '247': is247, min_rating } = await searchParams
  const currentPage = parseInt(page || '1')
  const hasFilters = !!(gender || is247 || min_rating)
  const isAmenity = AMENITIES.includes(slug as typeof AMENITIES[number])
  const cityName = formatSlug(citySlug)
  const city = await getCityBySlug(citySlug)
  if (!city) return {}

  if (isAmenity) {
    const label = AMENITY_LABELS[slug] || formatSlug(slug)
    return {
      title: `${label} Gyms in ${cityName} — Find & Compare | Gymlocator`,
      description: `Find the best ${label} gyms in ${cityName} on Gymlocator. Compare fees, ratings, timings & amenities.`,
      robots: { index: currentPage === 1, follow: true },
      alternates: { canonical: `https://gymlocator.in/gyms/${citySlug}/${slug}` },
    }
  }

  const localityName = formatSlug(slug)
  return {
    title: `Best Gyms in ${localityName}, ${cityName} — Fees, Timings & Reviews | Gymlocator`,
    description: `Discover top gyms in ${localityName}, ${cityName}. Compare fees, ratings, timings & amenities. Filter by 24x7, women-only, personal trainer & more.`,
    robots: { index: currentPage === 1 && !hasFilters, follow: true },
    alternates: { canonical: `https://gymlocator.in/gyms/${citySlug}/${slug}` },
  }
}

export default async function CitySlugPage({ params, searchParams }: Props) {
  const { city: citySlug, slug } = await params
  const { page, gender, '247': is247, min_rating, sort } = await searchParams
  const currentPage = parseInt(page || '1')
  const offset = (currentPage - 1) * GYMS_PER_PAGE
  const filters = {
    gender,
    is247: is247 === '1',
    minRating: min_rating ? parseFloat(min_rating) : undefined,
    sort,
  }

  const isAmenity = AMENITIES.includes(slug as typeof AMENITIES[number])

  const city = await getCityBySlug(citySlug)
  if (!city) notFound()

  const cityName = city.name as string

  let gymData: { gyms: Gym[]; total: number }
  let pageTitle: string
  let pageSubtitle: string
  let localityName: string | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let locality: Record<string, any> | null = null

  if (isAmenity) {
    const label = AMENITY_LABELS[slug] || formatSlug(slug)
    gymData = await getGymsByAmenity(citySlug, slug, GYMS_PER_PAGE, offset)
    pageTitle = `${label} Gyms in ${cityName}`
    pageSubtitle = `Compare ${gymData.total} ${label} gyms in ${cityName} by fees, ratings and timings.`
  } else {
    locality = await getLocalityBySlug(citySlug, slug)
    localityName = (locality?.name as string | null) ?? formatSlug(slug)
    gymData = await getGymsByLocality(citySlug, slug, GYMS_PER_PAGE, offset, filters)
    pageTitle = `Best Gyms in ${localityName}, ${cityName}`
    pageSubtitle = `Compare ${gymData.total} gyms in ${localityName} by fees, ratings, timings and amenities.`
  }

  const { gyms, total } = gymData
  const totalPages = Math.ceil(total / GYMS_PER_PAGE)
  const displayLabel = localityName ?? AMENITY_LABELS[slug] ?? formatSlug(slug)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
      acc.push(p)
      return acc
    }, [])

  return (
    <main className="min-h-screen bg-base">

      {/* BREADCRUMB */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-6">
        <nav className="flex items-center gap-2 text-[12px] text-text-muted flex-wrap">
          <Link href="/" className="ghost">Home</Link>
          <span>›</span>
          <Link href="/cities" className="ghost">Cities</Link>
          <span>›</span>
          <Link href={`/gyms/${citySlug}`} className="ghost">{cityName}</Link>
          <span>›</span>
          <span className="text-text-secondary">{displayLabel}</span>
        </nav>
      </div>

      {/* HERO */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-8 pb-6 bb-hair">
        <h1 className="h1 text-text-primary">{pageTitle}</h1>
        <p className="text-[16px] text-text-secondary mt-3 max-w-[640px]">
          {currentPage === 1
            ? pageSubtitle
            : `Showing gyms ${offset + 1}–${Math.min(offset + GYMS_PER_PAGE, total)} of ${total}.`}
        </p>
      </div>

      {/* SILVER STATS BAR */}
      <div className="silver-section bb-hair bt-hair">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-4 overflow-x-auto scrollbar-none flex items-center gap-x-8 text-[12px] font-bold uppercase tracking-[0.12em] font-mono whitespace-nowrap">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0C0C0C]" />
            {displayLabel}
          </span>
          <span className="opacity-25">———</span>
          <span>
            <strong className="text-[15px] mr-1">{total}</strong> gyms
          </span>
          <span className="opacity-25">———</span>
          <span>{cityName}</span>
        </div>
      </div>

      {/* FILTERS — locality pages only */}
      {!isAmenity && (
        <Suspense fallback={<div />}>
          <GymFilters citySlug={citySlug} localitySlug={slug} total={total} />
        </Suspense>
      )}

      {/* GYM GRID */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12">

        <h2 className="h2 text-text-primary mb-8">
          Top Gyms {localityName ? `in ${localityName}, ${cityName}` : `in ${cityName}`}
        </h2>

        {gyms.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <i className="ti ti-building-skyscraper text-[48px] mb-4 block" />
            <p className="text-[16px]">No gyms found here yet.</p>
            <p className="text-[14px] mt-2">
              <Link href={`/gyms/${citySlug}`} className="text-accent hover:underline">
                Browse all gyms in {cityName}
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            {currentPage > 1 && (
              <Link
                href={`/gyms/${citySlug}/${slug}?page=${currentPage - 1}`}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-surface b-hair rounded-md text-[13px] text-text-secondary hover:border-border-hi hover:text-text-primary transition-colors"
              >
                <i className="ti ti-chevron-left text-[14px]" />
                Previous
              </Link>
            )}

            {pages.map((p, idx) =>
              p === '...' ? (
                <span key={`e-${idx}`} className="px-2 text-text-muted text-[13px]">…</span>
              ) : (
                <Link
                  key={`p-${p}`}
                  href={`/gyms/${citySlug}/${slug}?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-[13px] font-semibold transition-colors ${
                    p === currentPage
                      ? 'bg-accent text-[#0C0C0C]'
                      : 'bg-surface b-hair text-text-secondary hover:border-border-hi hover:text-text-primary'
                  }`}
                >
                  {p}
                </Link>
              )
            )}

            {currentPage < totalPages && (
              <Link
                href={`/gyms/${citySlug}/${slug}?page=${currentPage + 1}`}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-surface b-hair rounded-md text-[13px] text-text-secondary hover:border-border-hi hover:text-text-primary transition-colors"
              >
                Next
                <i className="ti ti-chevron-right text-[14px]" />
              </Link>
            )}
          </div>
        )}

        {/* BACK TO CITY */}
        <div className="mt-12 pt-8 bt-hair">
          <p className="text-[14px] text-text-secondary">
            Looking for more options?{' '}
            <Link href={`/gyms/${citySlug}`} className="text-accent hover:underline font-semibold">
              Browse all gyms in {cityName}
            </Link>
          </p>
        </div>

      </div>

      {/* LOCALITY CONTENT SECTIONS */}
      {currentPage === 1 && !isAmenity && locality && (
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 pb-16 mt-12 space-y-12">

          {/* About */}
          {locality.about_text && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text-primary mb-4">About Gyms in {localityName}</h2>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {locality.about_text as string}
              </p>
            </div>
          )}

          {/* What to look for */}
          {locality.what_to_look_for?.length > 0 && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text-primary mb-4">What to Look for in a Gym in {localityName}</h2>
              <ul className="space-y-3">
                {(locality.what_to_look_for as string[]).map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing */}
          {locality.price_budget_monthly && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text-primary mb-4">Gym Membership Cost in {localityName}</h2>
              <div className="b-hair rounded-md overflow-hidden">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-surface">
                      <th className="text-left p-4 text-text-secondary font-semibold bb-hair">Tier</th>
                      <th className="text-left p-4 text-text-secondary font-semibold bb-hair">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      { tier: 'Budget', price: locality.price_budget_monthly },
                      { tier: 'Standard', price: locality.price_standard_monthly },
                      { tier: 'Premium', price: locality.price_premium_monthly },
                    ] as { tier: string; price: unknown }[]).filter((r) => r.price).map((row, i, arr) => (
                      <tr key={row.tier} className={i < arr.length - 1 ? 'bb-hair' : ''}>
                        <td className="p-4 font-semibold text-text-primary">{row.tier}</td>
                        <td className="p-4 text-text-secondary">{row.price as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FAQ */}
          {locality.faqs?.length > 0 && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text-primary mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {(locality.faqs as { q: string; a: string }[]).map((faq, i) => (
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
          )}

          {/* Popular searches */}
          {locality.popular_searches?.length > 0 && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text-primary mb-6">Popular Searches in {localityName}</h2>
              <div className="flex flex-wrap gap-2">
                {(locality.popular_searches as { label: string; href: string }[]).map((s) => (
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
          )}

        </div>
      )}

      {/* JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'CollectionPage',
                '@id': `https://gymlocator.in/gyms/${citySlug}/${slug}#webpage`,
                url: `https://gymlocator.in/gyms/${citySlug}/${slug}`,
                name: pageTitle,
                description: pageSubtitle,
                breadcrumb: { '@id': `https://gymlocator.in/gyms/${citySlug}/${slug}#breadcrumb` },
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `https://gymlocator.in/gyms/${citySlug}/${slug}#breadcrumb`,
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gymlocator.in/' },
                  { '@type': 'ListItem', position: 2, name: 'Cities', item: 'https://gymlocator.in/cities' },
                  { '@type': 'ListItem', position: 3, name: cityName, item: `https://gymlocator.in/gyms/${citySlug}` },
                  { '@type': 'ListItem', position: 4, name: displayLabel, item: `https://gymlocator.in/gyms/${citySlug}/${slug}` },
                ],
              },
              {
                '@type': 'ItemList',
                name: pageTitle,
                numberOfItems: total,
                itemListElement: gyms.slice(0, 10).map((gym, i) => ({
                  '@type': 'ListItem',
                  position: offset + i + 1,
                  item: {
                    '@type': ['HealthClub', 'SportsActivityLocation', 'LocalBusiness'],
                    '@id': `https://gymlocator.in/gym/${gym.slug}`,
                    name: gym.name,
                    url: `https://gymlocator.in/gym/${gym.slug}`,
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: gym.address,
                      addressLocality: localityName ?? cityName,
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
              ...(currentPage === 1 && !isAmenity && locality?.faqs?.length > 0 ? [{
                '@type': 'FAQPage',
                mainEntity: (locality!.faqs as { q: string; a: string }[]).map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              }] : []),
            ],
          }),
        }}
      />

    </main>
  )
}
