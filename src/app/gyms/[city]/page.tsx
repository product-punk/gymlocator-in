import type { Metadata } from 'next'

export const revalidate = 86400

type Props = { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityName = city.charAt(0).toUpperCase() + city.slice(1)
  return {
    title: `Best Gyms in ${cityName} 2026 — Fees, Reviews & Timings | Gymlocator`,
    description: `Find the best gyms in ${cityName}. Compare fees, timings, amenities, and reviews for top fitness centers near you.`,
  }
}

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

export default async function CityPage({ params }: Props) {
  const { city } = await params
  const cityName = city.charAt(0).toUpperCase() + city.slice(1)

  return (
    <main className="max-w-[1280px] mx-auto px-5 md:px-10 py-16">
      <h1 className="h1 text-text-primary">Best Gyms in {cityName}</h1>
      <p className="text-text-secondary mt-4">Gym listings coming soon.</p>
    </main>
  )
}
