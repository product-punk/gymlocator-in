import HeroSection from '@/components/home/HeroSection'
import AccentMarquee from '@/components/home/AccentMarquee'
import GymMarquee from '@/components/home/GymMarquee'
import TrendingCities from '@/components/home/TrendingCities'
import FeaturedGyms from '@/components/home/FeaturedGyms'
import HowItWorks from '@/components/home/HowItWorks'
import { getCities, getFeaturedGyms, getPartnerGyms } from '@/lib/supabase/queries'

export const revalidate = 3600

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Gymlocator.in',
      url: 'https://gymlocator.in',
      description:
        'Discover and compare gyms across India. Compare fees, timings, amenities and ratings - no signup needed.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://gymlocator.in/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'Gymlocator.in',
      url: 'https://gymlocator.in',
      logo: 'https://gymlocator.in/logo.png',
    },
  ],
}

export default async function HomePage() {
  const [cities, featuredGyms, partnerGyms] = await Promise.all([
    getCities(),
    getFeaturedGyms(),
    getPartnerGyms(),
  ])

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <AccentMarquee />
      <GymMarquee gyms={partnerGyms} />
      <TrendingCities cities={cities} />
      <FeaturedGyms gyms={featuredGyms} />
      <HowItWorks />
    </main>
  )
}
