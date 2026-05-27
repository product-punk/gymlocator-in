import type { Metadata } from 'next'
import { AMENITIES } from '@/lib/amenities'

export const revalidate = 86400

type Props = { params: Promise<{ city: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params
  const cityName = city.charAt(0).toUpperCase() + city.slice(1)
  const slugName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const isAmenity = AMENITIES.includes(slug as typeof AMENITIES[number])

  const title = isAmenity
    ? `${slugName} Gyms in ${cityName} — Find & Compare | Gymlocator`
    : `Gyms in ${slugName}, ${cityName} — Top Fitness Centers | Gymlocator`

  return { title }
}

export default async function CitySlugPage({ params }: Props) {
  const { city, slug } = await params
  const isAmenity = AMENITIES.includes(slug as typeof AMENITIES[number])
  const cityName = city.charAt(0).toUpperCase() + city.slice(1)
  const slugName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <main className="max-w-[1280px] mx-auto px-5 md:px-10 py-16">
      <h1 className="h1 text-text-primary">
        {isAmenity ? `${slugName} Gyms in ${cityName}` : `Gyms in ${slugName}, ${cityName}`}
      </h1>
      <p className="text-text-secondary mt-4">Gym listings coming soon.</p>
    </main>
  )
}
