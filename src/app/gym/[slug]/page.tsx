import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGymBySlug } from '@/lib/supabase/queries'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

function formatSlug(slug: string) {
  if (!slug) return ''
  return slug.split('-').map((w: string) =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const gym = await getGymBySlug(slug)
  if (!gym) return {}
  return {
    title: `${gym.name}, ${gym.locality_slug ? formatSlug(gym.locality_slug) + ' ' : ''}${formatSlug(gym.city_slug)} — Timings, Fees & Reviews | Gymlocator`,
    description: `${gym.name} in ${gym.locality_slug ? formatSlug(gym.locality_slug) + ', ' : ''}${formatSlug(gym.city_slug)}. ${gym.price_monthly ? 'Membership from Rs ' + gym.price_monthly + '/month. ' : ''}Timings, amenities, contact and directions on Gymlocator.`,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://gymlocator.in/gym/${slug}`,
    },
  }
}

const AMENITY_ICONS: Record<string, string> = {
  'AC': 'ti-air-conditioning',
  'Free Weights': 'ti-barbell',
  'Cardio': 'ti-run',
  'CrossFit': 'ti-trophy',
  'Boxing': 'ti-box',
  'MMA': 'ti-shield',
  'Yoga': 'ti-activity',
  'Zumba': 'ti-music',
  'Swimming': 'ti-swim',
  'Sauna': 'ti-flame',
  'Steam': 'ti-droplet',
  'Personal Training': 'ti-user-check',
  'Functional Training': 'ti-antenna',
  'Powerlifting': 'ti-barbell',
  'Locker': 'ti-lock',
  'Shower': 'ti-droplet',
  'Changing Room': 'ti-door',
  'Parking': 'ti-car',
  'Cafe': 'ti-coffee',
  'CCTV': 'ti-camera',
  'Towel Service': 'ti-wash',
  'Bike Parking': 'ti-bike',
  'Women Hours': 'ti-users',
}

export default async function GymDetailPage({ params }: Props) {
  const { slug } = await params
  const gym = await getGymBySlug(slug)
  if (!gym) notFound()

  const cityName = formatSlug(gym.city_slug)
  const localityName = gym.locality_slug ? formatSlug(gym.locality_slug) : cityName

  return (
    <main className="min-h-screen bg-base">

      {/* BREADCRUMB */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-6">
        <nav className="flex items-center gap-2 text-[12px] text-text-muted flex-wrap">
          <Link href="/" className="ghost">Home</Link>
          <span>›</span>
          <Link href="/cities" className="ghost">Cities</Link>
          <span>›</span>
          <Link href={`/gyms/${gym.city_slug}`} className="ghost">{cityName}</Link>
          {gym.locality_slug && (
            <>
              <span>›</span>
              <Link href={`/gyms/${gym.city_slug}/${gym.locality_slug}`} className="ghost">
                {localityName}
              </Link>
            </>
          )}
          <span>›</span>
          <span className="text-text-secondary">{gym.name}</span>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT — main content */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">

            {/* IMAGE GALLERY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-md overflow-hidden">

              {/* Hero image - full width on mobile */}
              <div className="col-span-1 md:col-span-2 relative h-[240px] md:h-[280px] bg-raised rounded-md overflow-hidden">
                {gym.images?.[0] && gym.images[0] !== '' && gym.images[0] !== 'nan' ? (
                  <img
                    src={gym.images[0]}
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="ti ti-building-skyscraper text-[48px] text-text-disabled" />
                  </div>
                )}
                {gym.is_featured && (
                  <span className="absolute top-3 left-3 label !text-accent bg-accent-dim px-2 py-1 rounded-sm">
                    Featured
                  </span>
                )}
                {gym.is_verified && (
                  <span className="absolute top-3 right-3 label !text-accent bg-accent-dim px-2 py-1 rounded-sm flex items-center gap-1">
                    <i className="ti ti-circle-check text-[12px]" />
                    Verified
                  </span>
                )}
              </div>

              {/* Thumbnails - desktop only */}
              <div className="hidden md:grid col-span-2 grid-rows-2 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="relative h-[134px] bg-raised rounded-md overflow-hidden">
                    {gym.images?.[n] && gym.images[n] !== '' && gym.images[n] !== 'nan' ? (
                      <img
                        src={gym.images[n]}
                        alt={`${gym.name} photo ${n + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ti ti-photo text-[24px] text-text-disabled" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* GYM NAME + RATING */}
            <div className="mb-4">
              <h1 className="text-[28px] md:text-[40px] font-black tracking-tight text-text-primary leading-tight mb-3">
                {gym.name}
              </h1>
              {gym.rating > 0 && (
                <div className="inline-flex items-center gap-2 bg-surface b-hair rounded-md px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-[16px] font-bold text-text-primary">{gym.rating}</span>
                  {gym.review_count > 0 && (
                    <span className="text-[13px] text-text-muted">({gym.review_count} reviews)</span>
                  )}
                </div>
              )}
            </div>

            {/* ADDRESS */}
            <div className="flex items-start gap-2 text-[14px] text-text-secondary mb-6">
              <i className="ti ti-map-pin text-[16px] text-text-muted mt-0.5 flex-shrink-0" />
              <span>{gym.address}</span>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border b-hair rounded-md overflow-hidden mb-8">
              {[
                {
                  label: 'Timings',
                  value: gym.is_247 ? '24 / 7 Open' : gym.timing_open ? `${gym.timing_open} – ${gym.timing_close}` : 'Call to confirm',
                  icon: 'ti-clock',
                },
                {
                  label: 'Monthly fee',
                  value: gym.price_monthly ? `Rs ${gym.price_monthly.toLocaleString('en-IN')}` : 'On request',
                  icon: 'ti-currency-rupee',
                },
                {
                  label: 'Gender',
                  value: gym.gender === 'women-only' ? 'Women only' : gym.gender === 'men-only' ? 'Men only' : 'Mixed',
                  icon: 'ti-users',
                },
                {
                  label: 'Air conditioning',
                  value: gym.ac ? 'Available' : 'Not available',
                  icon: 'ti-air-conditioning',
                },
              ].map((item) => (
                <div key={item.label} className="bg-base p-4 md:p-5">
                  <div className="flex items-center gap-1.5 label !text-text-muted mb-2">
                    <i className={`ti ${item.icon} text-[13px]`} />
                    {item.label}
                  </div>
                  <div className="text-[15px] font-bold text-text-primary">{item.value}</div>
                </div>
              ))}
            </div>

            {/* AMENITIES */}
            {gym.amenities?.length > 0 && (
              <div className="mb-8">
                <h2 className="h2 text-text-primary mb-5">Amenities at {gym.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gym.amenities.map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-3 bg-surface b-hair rounded-md px-4 py-3">
                      <i className={`ti ${AMENITY_ICONS[amenity] || 'ti-check'} text-[18px] text-accent flex-shrink-0`} />
                      <span className="text-[14px] text-text-secondary">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABOUT */}
            <div className="mb-8 max-w-[680px]">
              <h2 className="h2 text-text-primary mb-4">About {gym.name}</h2>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {gym.name} is a {gym.price_range === 'premium' ? 'premium' : gym.price_range === 'budget' ? 'budget-friendly' : 'well-equipped'} gym located in {localityName}, {cityName}.
                {gym.amenities?.length > 0 && ` The facility offers ${gym.amenities.slice(0, 4).join(', ')} among other amenities.`}
                {gym.is_247 ? ' It operates 24 hours a day, 7 days a week.' : gym.timing_open ? ` Timings are ${gym.timing_open} to ${gym.timing_close}.` : ''}
                {gym.price_monthly ? ` Membership starts from Rs ${gym.price_monthly.toLocaleString('en-IN')} per month.` : ''}
              </p>
            </div>

            {/* MAP */}
            {gym.lat && gym.lng && (
              <div className="mb-8">
                <h2 className="h2 text-text-primary mb-5">Location</h2>
                <div className="b-hair rounded-md overflow-hidden h-[300px]">
                  <iframe
                    title={`${gym.name} location map`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${gym.lat},${gym.lng}&z=15&output=embed`}
                  />
                </div>
                <div className="flex items-start gap-2 text-[13px] text-text-muted mt-3">
                  <i className="ti ti-map-pin text-[14px] mt-0.5" />
                  {gym.address}
                </div>
              </div>
            )}

            {/* NEARBY LOCALITY LINK */}
            {gym.locality_slug && (
              <div className="bg-surface b-hair rounded-md p-5 mb-8">
                <p className="text-[14px] text-text-secondary">
                  Looking for more options?{' '}
                  <Link href={`/gyms/${gym.city_slug}/${gym.locality_slug}`} className="text-accent hover:underline font-semibold">
                    Browse all gyms in {localityName}
                  </Link>
                  {' '}or{' '}
                  <Link href={`/gyms/${gym.city_slug}`} className="text-accent hover:underline font-semibold">
                    explore all gyms in {cityName}
                  </Link>
                </p>
              </div>
            )}

          </div>

          {/* RIGHT — sticky CTA sidebar */}
          <div className="lg:w-[320px] flex-shrink-0 order-1 lg:order-2">
            <div className="sticky top-20">

              {/* CTA CARD */}
              <div className="bg-surface b-hair rounded-md p-6 mb-4">

                {/* Price */}
                {gym.price_monthly ? (
                  <div className="mb-4 pb-4 bb-hair">
                    <div className="text-[28px] font-bold tracking-tight text-text-primary">
                      Rs {gym.price_monthly.toLocaleString('en-IN')}
                      <span className="text-[14px] font-normal text-text-muted"> / month</span>
                    </div>
                    {gym.price_annually && (
                      <div className="text-[12px] text-text-muted mt-1">
                        Rs {gym.price_annually.toLocaleString('en-IN')} / year{' '}
                        <span className="text-accent text-[11px] font-bold">
                          (Save Rs {(gym.price_monthly * 12 - gym.price_annually).toLocaleString('en-IN')})
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[16px] text-text-muted mb-4 pb-4 bb-hair">
                    Price on request
                  </div>
                )}

                {/* Call CTA */}
                {gym.phone ? (
                  <a
                    href={`tel:${gym.phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-base font-bold text-[15px] py-3.5 rounded-sm hover:bg-white transition-colors mb-3"
                  >
                    <i className="ti ti-phone text-[18px]" />
                    Call Now
                  </a>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 bg-raised b-hair text-text-muted text-[14px] py-3.5 rounded-sm mb-3">
                    Phone not available
                  </div>
                )}

                {/* WhatsApp CTA */}
                {gym.whatsapp && (
                  <a
                    href={`https://wa.me/${gym.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 btn-outline text-accent font-bold text-[14px] py-3 rounded-sm hover:bg-accent-dim transition-colors mb-3"
                  >
                    <i className="ti ti-brand-whatsapp text-[18px]" />
                    WhatsApp
                  </a>
                )}

                {/* Directions CTA */}
                {gym.lat && gym.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 btn-outline text-accent font-bold text-[14px] py-3 rounded-sm hover:bg-accent-dim transition-colors"
                  >
                    <i className="ti ti-map-2 text-[18px]" />
                    Get Directions
                  </a>
                )}

              </div>

            </div>
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
                '@type': ['HealthClub', 'SportsActivityLocation', 'LocalBusiness'],
                '@id': `https://gymlocator.in/gym/${slug}`,
                name: gym.name,
                url: `https://gymlocator.in/gym/${slug}`,
                telephone: gym.phone || undefined,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: gym.address,
                  addressLocality: localityName,
                  addressRegion: cityName,
                  addressCountry: 'IN',
                },
                ...(gym.lat && gym.lng && {
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: gym.lat,
                    longitude: gym.lng,
                  },
                }),
                ...(gym.timing_open && !gym.is_247 && {
                  openingHours: `Mo-Su ${gym.timing_open}-${gym.timing_close}`,
                }),
                ...(gym.rating > 0 && {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: gym.rating,
                    reviewCount: gym.review_count || 1,
                  },
                }),
                ...(gym.price_monthly && {
                  priceRange: gym.price_range === 'budget' ? 'Rs' : gym.price_range === 'premium' ? 'Rs Rs Rs' : 'Rs Rs',
                }),
                ...(gym.amenities?.length > 0 && {
                  amenityFeature: gym.amenities.map((a: string) => ({
                    '@type': 'LocationFeatureSpecification',
                    name: a,
                    value: true,
                  })),
                }),
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gymlocator.in/' },
                  { '@type': 'ListItem', position: 2, name: 'Cities', item: 'https://gymlocator.in/cities' },
                  { '@type': 'ListItem', position: 3, name: cityName, item: `https://gymlocator.in/gyms/${gym.city_slug}` },
                  ...(gym.locality_slug
                    ? [{ '@type': 'ListItem', position: 4, name: localityName, item: `https://gymlocator.in/gyms/${gym.city_slug}/${gym.locality_slug}` }]
                    : []),
                  { '@type': 'ListItem', position: gym.locality_slug ? 5 : 4, name: gym.name, item: `https://gymlocator.in/gym/${slug}` },
                ],
              },
            ],
          }),
        }}
      />

    </main>
  )
}
