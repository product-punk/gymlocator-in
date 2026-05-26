import Hero from '@/components/home/Hero'
import GymMarquee from '@/components/home/GymMarquee'
import TrendingCities from '@/components/home/TrendingCities'
import FeaturedGyms from '@/components/home/FeaturedGyms'
import HowItWorks from '@/components/home/HowItWorks'
import { getCities, getFeaturedGyms, getPartnerGyms } from '@/lib/supabase/queries'

export const revalidate = 3600

export default async function HomePage() {
  const [cities, featuredGyms, partnerGyms] = await Promise.all([
    getCities(),
    getFeaturedGyms(),
    getPartnerGyms(),
  ])

  return (
    <main>
      <Hero />
      <GymMarquee gyms={partnerGyms} />
      <TrendingCities cities={cities} />
      <FeaturedGyms gyms={featuredGyms} />
      <HowItWorks />
    </main>
  )
}
