import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getCityBySlug,
  getLocalityBySlug,
  getGymsByLocality,
  getGymsByAmenity,
  getGymsByFacet,
  getFacetContent,
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

const ALL_CITY_SLUGS = [
  'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai',
  'pune', 'kolkata', 'ahmedabad', 'gurgaon', 'noida', 'ghaziabad',
]

type FacetConfig = {
  label: string
  pageTitle: (city: string) => string
  subtitle: (total: number, city: string) => string
  seoTitle: (city: string) => string
  seoDescription: (city: string) => string
  seoContent: (city: string) => string
  cities: string[] | 'all'
}

const FACETS: Record<string, FacetConfig> = {
  'women': {
    label: 'Women-Only Gyms',
    pageTitle: (city) => `Women-Only Gyms in ${city}`,
    subtitle: (total, city) => `Compare ${total} women-only gyms in ${city} — dedicated spaces with female trainers and women-exclusive equipment floors.`,
    seoTitle: (city) => `Women-Only Gyms in ${city} - Safe & Comfortable | Gymlocator`,
    seoDescription: (city) => `Find women-only gyms in ${city}. Compare fees, timings and amenities at all-female fitness spaces near you.`,
    seoContent: (city) => `Women-only gyms in ${city} provide a comfortable, distraction-free environment for women of all fitness levels. These gyms feature dedicated equipment floors, female trainers, and flexible timings designed around working women. Many also offer group classes like Zumba, yoga, and aerobics. Memberships typically range from ₹1,200 to ₹4,500 per month depending on the area and facilities.`,
    cities: ['ahmedabad', 'mumbai', 'hyderabad', 'pune', 'chennai', 'bangalore', 'kolkata', 'delhi'],
  },
  'budget': {
    label: 'Budget Gyms',
    pageTitle: (city) => `Budget Gyms in ${city} Under ₹1,500/Month`,
    subtitle: (total, city) => `${total} affordable gyms in ${city} with memberships under ₹1,500 per month.`,
    seoTitle: (city) => `Budget Gyms in ${city} - Under ₹1,500/Month | Gymlocator`,
    seoDescription: (city) => `Find affordable gyms in ${city} with monthly fees under ₹1,500. Compare equipment, timings and trainers at cheap gyms near you.`,
    seoContent: (city) => `Budget gyms in ${city} offer everything you need to build a solid fitness routine without breaking the bank. Most budget gyms include cardio equipment, free weights, and basic machines for under ₹1,500 per month. Some offer annual plans starting at ₹8,000–₹12,000. Look for gyms in neighbourhood markets and residential areas — they tend to be more affordable than gym chains.`,
    cities: 'all',
  },
  'premium': {
    label: 'Premium Gyms',
    pageTitle: (city) => `Premium Gyms in ${city}`,
    subtitle: (total, city) => `${total} high-end gyms in ${city} with top-tier equipment, personal trainers and luxury amenities.`,
    seoTitle: (city) => `Premium Gyms in ${city} - Top-Tier Fitness Centers | Gymlocator`,
    seoDescription: (city) => `Discover the best premium gyms in ${city}. Compare luxury fitness clubs with pools, saunas, personal trainers and state-of-the-art equipment.`,
    seoContent: (city) => `Premium gyms in ${city} offer an elevated fitness experience with commercial-grade equipment, dedicated personal trainers, swimming pools, steam rooms and recovery facilities. Memberships typically range from ₹3,500 to ₹10,000 per month and often include group classes, nutrition consultations and guest passes. Brands like Anytime Fitness, Gold's Gym, and boutique studios dominate this segment.`,
    cities: 'all',
  },
  'cardio': {
    label: 'Cardio Gyms',
    pageTitle: (city) => `Best Cardio Gyms in ${city}`,
    subtitle: (total, city) => `${total} gyms in ${city} with dedicated cardio floors — treadmills, cycles, ellipticals and steppers.`,
    seoTitle: (city) => `Cardio Gyms in ${city} - Treadmills, Cycles & More | Gymlocator`,
    seoDescription: (city) => `Find gyms in ${city} with excellent cardio equipment. Compare cardio-focused gyms by fees, timings and machine variety near you.`,
    seoContent: (city) => `Cardio gyms in ${city} are ideal for weight loss, endurance training, and heart health. Look for gyms with a wide variety of machines: treadmills, ellipticals, stationary bikes, rowing machines and stair climbers. The best cardio gyms also offer group fitness classes like cycling, aerobics and HIIT to keep your routine varied.`,
    cities: 'all',
  },
  'with-personal-trainer': {
    label: 'Gyms with Personal Trainer',
    pageTitle: (city) => `Gyms with Personal Trainer in ${city}`,
    subtitle: (total, city) => `${total} gyms in ${city} offering certified personal training sessions.`,
    seoTitle: (city) => `Gyms with Personal Trainer in ${city} - Find PT Sessions | Gymlocator`,
    seoDescription: (city) => `Find gyms in ${city} that offer personal training. Compare PT-enabled gyms by fees, trainer certifications and session rates.`,
    seoContent: (city) => `Personal trainers at gyms in ${city} help you set realistic goals, learn correct form, and stay accountable. PT sessions typically cost ₹500–₹2,000 per hour depending on the trainer's experience and gym tier. Many gyms include a few free PT sessions with annual memberships. Look for gyms where trainers hold ACSM, NASM, or ACE certifications for the best guidance.`,
    cities: 'all',
  },
  'with-swimming-pool': {
    label: 'Gyms with Swimming Pool',
    pageTitle: (city) => `Gyms with Swimming Pool in ${city}`,
    subtitle: (total, city) => `${total} gyms in ${city} with swimming pools — full-body training and active recovery.`,
    seoTitle: (city) => `Gyms with Swimming Pool in ${city} - Find & Compare | Gymlocator`,
    seoDescription: (city) => `Find gyms and fitness clubs in ${city} with swimming pools. Compare pool facilities, membership fees and timings near you.`,
    seoContent: (city) => `Gyms with swimming pools in ${city} offer a complete fitness experience combining strength training with aquatic exercise. Swimming is one of the best low-impact full-body workouts — ideal for weight loss, joint recovery and endurance. Pool-equipped gyms in ${city} tend to be mid-to-premium priced (₹2,500–₹8,000/month) but often include the pool in the base membership.`,
    cities: 'all',
  },
  'with-steam-sauna': {
    label: 'Gyms with Steam & Sauna',
    pageTitle: (city) => `Gyms with Steam Room & Sauna in ${city}`,
    subtitle: (total, city) => `${total} gyms in ${city} with steam rooms and saunas for post-workout recovery.`,
    seoTitle: (city) => `Gyms with Steam & Sauna in ${city} - Recovery Facilities | Gymlocator`,
    seoDescription: (city) => `Find gyms in ${city} with steam rooms and saunas. Compare recovery-focused fitness centers by fees, amenities and timings near you.`,
    seoContent: (city) => `Steam rooms and saunas at gyms in ${city} help speed up muscle recovery, improve circulation, and reduce post-workout soreness. Many gyms include steam and sauna in premium memberships alongside pools and jacuzzis. Regular use can also support respiratory health and stress reduction. Look for gyms that maintain their steam rooms with proper hygiene and temperature controls.`,
    cities: 'all',
  },
}

type FacetContent = {
  facet_slug: string
  city_slug: string
  seo_h1: string | null
  meta_description: string | null
  subtitle: string | null
  seo_subtitle: string | null
  about_text: string | null
  price_budget_monthly: string | null
  price_budget_annual: string | null
  price_standard_monthly: string | null
  price_standard_annual: string | null
  price_premium_monthly: string | null
  price_premium_annual: string | null
  what_to_look_for: string[] | null
  faqs: { question: string; answer: string }[] | null
  popular_searches: string[] | null
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
  const isFacet = slug in FACETS
  const isAmenity = AMENITIES.includes(slug as typeof AMENITIES[number])
  const cityName = formatSlug(citySlug)
  const city = await getCityBySlug(citySlug)
  if (!city) return {}

  if (isFacet) {
    const facet = FACETS[slug]
    const facetContentRaw = await getFacetContent(citySlug, slug)
    const facetContent = facetContentRaw as FacetContent | null
    return {
      title: facetContent?.seo_h1 ? `${facetContent.seo_h1} | Gymlocator` : facet.seoTitle(cityName),
      description: facetContent?.meta_description || facet.seoDescription(cityName),
      robots: { index: currentPage === 1, follow: true },
      alternates: { canonical: `https://gymlocator.in/gyms/${citySlug}/${slug}` },
    }
  }

  if (isAmenity) {
    const label = AMENITY_LABELS[slug] || formatSlug(slug)
    return {
      title: `${label} Gyms in ${cityName} - Find & Compare | Gymlocator`,
      description: `Find the best ${label} gyms in ${cityName} on Gymlocator. Compare fees, ratings, timings & amenities.`,
      robots: { index: currentPage === 1, follow: true },
      alternates: { canonical: `https://gymlocator.in/gyms/${citySlug}/${slug}` },
    }
  }

  const localityName = formatSlug(slug)
  return {
    title: `Best Gyms in ${localityName}, ${cityName} - Fees, Timings & Reviews | Gymlocator`,
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

  const isFacet = slug in FACETS
  const isAmenity = AMENITIES.includes(slug as typeof AMENITIES[number])

  const city = await getCityBySlug(citySlug)
  if (!city) notFound()

  const cityName = city.name as string

  // Validate facet is available for this city
  if (isFacet) {
    const facetConfig = FACETS[slug]
    const allowedCities = facetConfig.cities === 'all' ? ALL_CITY_SLUGS : facetConfig.cities
    if (!allowedCities.includes(citySlug)) notFound()
  }

  let gymData: { gyms: Gym[]; total: number }
  let pageTitle: string
  let pageSubtitle: string
  let localityName: string | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let locality: Record<string, any> | null = null
  let facetContent: FacetContent | null = null

  if (isFacet) {
    const facet = FACETS[slug]
    const [gymDataResult, facetContentRaw] = await Promise.all([
      getGymsByFacet(citySlug, slug, GYMS_PER_PAGE, offset),
      getFacetContent(citySlug, slug),
    ])
    gymData = gymDataResult
    facetContent = facetContentRaw as FacetContent | null
    if (gymData.total === 0) notFound()
    pageTitle = facetContent?.seo_h1 || facet.pageTitle(cityName)
    pageSubtitle = facetContent?.subtitle || facetContent?.seo_subtitle || facet.subtitle(gymData.total, cityName)
  } else if (isAmenity) {
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
  const displayLabel = isFacet
    ? FACETS[slug].label
    : localityName ?? AMENITY_LABELS[slug] ?? formatSlug(slug)

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
        <nav className="flex items-center gap-2 text-[12px] text-accent flex-wrap">
          <Link href="/" className="ghost">Home</Link>
          <span>›</span>
          <Link href="/cities" className="ghost">Cities</Link>
          <span>›</span>
          <Link href={`/gyms/${citySlug}`} className="ghost">{cityName}</Link>
          <span>›</span>
          <span className="text-accent">{displayLabel}</span>
        </nav>
      </div>

      {/* HERO */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-8 pb-6 bb-hair">
        <h1 className="h1 text-text">{pageTitle}</h1>
        <p className="text-[16px] text-accent mt-3 max-w-[640px]">
          {currentPage === 1
            ? pageSubtitle
            : `Showing gyms ${offset + 1}-${Math.min(offset + GYMS_PER_PAGE, total)} of ${total}.`}
        </p>
      </div>

      {/* SILVER STATS BAR */}
      <div className="silver-section bb-hair bt-hair">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-4 overflow-x-auto scrollbar-none flex items-center gap-x-8 text-[12px] font-bold uppercase tracking-[0.12em] font-mono whitespace-nowrap">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-base" />
            {displayLabel}
          </span>
          <span className="opacity-25">---</span>
          <span>
            <strong className="text-[15px] mr-1">{total}</strong> gyms
          </span>
          <span className="opacity-25">---</span>
          <span>{cityName}</span>
        </div>
      </div>

      {/* FILTERS - locality pages only */}
      {!isAmenity && !isFacet && (
        <Suspense fallback={<div />}>
          <GymFilters citySlug={citySlug} localitySlug={slug} total={total} />
        </Suspense>
      )}

      {/* GYM GRID */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12">

        <h2 className="h2 text-text mb-8">
          {isFacet
            ? `${FACETS[slug].label} in ${cityName}`
            : localityName ? `Top Gyms in ${localityName}, ${cityName}` : `Top Gyms in ${cityName}`}
        </h2>

        {gyms.length === 0 ? (
          <div className="text-center py-20 text-accent">
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
                className="flex items-center gap-1.5 px-4 py-2.5 bg-surface b-hair rounded-md text-[13px] text-accent hover:border-border-hi hover:text-text transition-colors"
              >
                <i className="ti ti-chevron-left text-[14px]" />
                Previous
              </Link>
            )}

            {pages.map((p, idx) =>
              p === '...' ? (
                <span key={`e-${idx}`} className="px-2 text-accent text-[13px]">…</span>
              ) : (
                <Link
                  key={`p-${p}`}
                  href={`/gyms/${citySlug}/${slug}?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-[13px] font-semibold transition-colors ${
                    p === currentPage
                      ? 'bg-accent text-[#0C0C0C]'
                      : 'bg-surface b-hair text-accent hover:border-border-hi hover:text-text'
                  }`}
                >
                  {p}
                </Link>
              )
            )}

            {currentPage < totalPages && (
              <Link
                href={`/gyms/${citySlug}/${slug}?page=${currentPage + 1}`}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-surface b-hair rounded-md text-[13px] text-accent hover:border-border-hi hover:text-text transition-colors"
              >
                Next
                <i className="ti ti-chevron-right text-[14px]" />
              </Link>
            )}
          </div>
        )}

        {/* BACK TO CITY */}
        <div className="mt-12 pt-8 bt-hair">
          <p className="text-[14px] text-accent">
            Looking for more options?{' '}
            <Link href={`/gyms/${citySlug}`} className="text-accent hover:underline font-semibold">
              Browse all gyms in {cityName}
            </Link>
          </p>
        </div>

      </div>

      {/* FACET RICH CONTENT */}
      {currentPage === 1 && isFacet && (
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 pb-16 space-y-12">

          {/* About */}
          <div className="max-w-[780px] bt-hair pt-12">
            <h2 className="h2 text-text mb-4">
              About {facetContent?.seo_h1?.split(':')[0] || FACETS[slug].label} in {cityName}
            </h2>
            <p className="text-[15px] text-accent leading-relaxed">
              {facetContent?.about_text || FACETS[slug].seoContent(cityName)}
            </p>
          </div>

          {/* Pricing table */}
          {facetContent?.price_standard_monthly && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text mb-4">Membership Costs in {cityName}</h2>
              <div className="b-hair rounded-md overflow-hidden">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-surface">
                      <th className="text-left p-4 text-accent font-semibold bb-hair">Tier</th>
                      <th className="text-left p-4 text-accent font-semibold bb-hair">Monthly</th>
                      <th className="text-left p-4 text-accent font-semibold bb-hair">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facetContent.price_budget_monthly && (
                      <tr className="bb-hair">
                        <td className="p-4 font-semibold text-text">Budget</td>
                        <td className="p-4 text-accent">{facetContent.price_budget_monthly}</td>
                        <td className="p-4 text-accent">{facetContent.price_budget_annual}</td>
                      </tr>
                    )}
                    <tr className="bb-hair">
                      <td className="p-4 font-semibold text-text">Standard</td>
                      <td className="p-4 text-accent">{facetContent.price_standard_monthly}</td>
                      <td className="p-4 text-accent">{facetContent.price_standard_annual}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-text">Premium</td>
                      <td className="p-4 text-accent">{facetContent.price_premium_monthly}</td>
                      <td className="p-4 text-accent">{facetContent.price_premium_annual}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* What to look for */}
          {facetContent?.what_to_look_for && facetContent.what_to_look_for.length > 0 && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text mb-4">What to Look for</h2>
              <ul className="space-y-3">
                {facetContent.what_to_look_for.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs */}
          {facetContent?.faqs && facetContent.faqs.length > 0 && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {facetContent.faqs.map((faq, i) => (
                  <details key={i} className="bg-surface b-hair rounded-md group">
                    <summary className="p-4 cursor-pointer text-[15px] font-semibold text-text list-none flex items-center justify-between gap-4 hover:text-accent transition-colors">
                      {faq.question}
                      <i className="ti ti-chevron-down text-[16px] text-accent flex-shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 text-[14px] text-accent leading-relaxed bt-hair pt-3">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* LOCALITY CONTENT SECTIONS */}
      {currentPage === 1 && !isAmenity && !isFacet && locality && (
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 pb-16 mt-12 space-y-12">

          {/* About */}
          {locality.about_text && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text mb-4">About Gyms in {localityName}</h2>
              <p className="text-[15px] text-accent leading-relaxed">
                {locality.about_text as string}
              </p>
            </div>
          )}

          {/* What to look for */}
          {locality.what_to_look_for?.length > 0 && (
            <div className="max-w-[780px]">
              <h2 className="h2 text-text mb-4">What to Look for in a Gym in {localityName}</h2>
              <ul className="space-y-3">
                {(locality.what_to_look_for as string[]).map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-accent">
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
              <h2 className="h2 text-text mb-4">Gym Membership Cost in {localityName}</h2>
              <div className="b-hair rounded-md overflow-hidden">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="bg-surface">
                      <th className="text-left p-4 text-accent font-semibold bb-hair">Tier</th>
                      <th className="text-left p-4 text-accent font-semibold bb-hair">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      { tier: 'Budget', price: locality.price_budget_monthly },
                      { tier: 'Standard', price: locality.price_standard_monthly },
                      { tier: 'Premium', price: locality.price_premium_monthly },
                    ] as { tier: string; price: unknown }[]).filter((r) => r.price).map((row, i, arr) => (
                      <tr key={row.tier} className={i < arr.length - 1 ? 'bb-hair' : ''}>
                        <td className="p-4 font-semibold text-text">{row.tier}</td>
                        <td className="p-4 text-accent">{row.price as string}</td>
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
              <h2 className="h2 text-text mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {(locality.faqs as { q: string; a: string }[]).map((faq, i) => (
                  <details key={i} className="bg-surface b-hair rounded-md group">
                    <summary className="p-4 cursor-pointer text-[15px] font-semibold text-text list-none flex items-center justify-between gap-4 hover:text-accent transition-colors">
                      {faq.q}
                      <i className="ti ti-chevron-down text-[16px] text-accent flex-shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 text-[14px] text-accent leading-relaxed bt-hair pt-3">
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
              <h2 className="h2 text-text mb-6">Popular Searches in {localityName}</h2>
              <div className="flex flex-wrap gap-2">
                {(locality.popular_searches as { label: string; href: string }[])
                  .filter((s) =>
                    !s.href.includes('/24-7') &&
                    !s.href.includes('/women-only') &&
                    !s.href.includes('/budget') &&
                    !s.href.includes('/premium')
                  )
                  .map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      className="text-[13px] text-accent px-3 py-1.5 bg-surface b-hair rounded-pill hover:border-border-hi hover:text-text transition-colors"
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
              ...(currentPage === 1 && !isAmenity && !isFacet && locality?.faqs?.length > 0 ? [{
                '@type': 'FAQPage',
                mainEntity: (locality!.faqs as { q: string; a: string }[]).map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              }] : []),
              ...(currentPage === 1 && isFacet && facetContent?.faqs && facetContent.faqs.length > 0 ? [{
                '@type': 'FAQPage',
                mainEntity: facetContent.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
              }] : []),
            ],
          }),
        }}
      />

    </main>
  )
}
