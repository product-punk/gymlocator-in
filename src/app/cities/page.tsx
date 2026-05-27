import Link from 'next/link'
import { getCities } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Find Gyms by City in India | Gymlocator',
  description: 'Browse gyms across India by city. Compare fees, ratings and amenities in Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata and Ahmedabad.',
  alternates: { canonical: 'https://gymlocator.in/cities' },
}

export default async function CitiesPage() {
  const cities = await getCities()
  return (
    <main className="max-w-[1280px] mx-auto px-5 md:px-10 py-16">
      <div className="label mb-3">All Cities</div>
      <h1 className="h1 text-text-primary mb-10">Find Gyms by City</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cities.map((city: { id: string; name: string; slug: string; gym_count: number }) => (
          <Link
            key={city.id}
            href={`/gyms/${city.slug}`}
            className="bg-surface b-hair rounded-md p-5 hover:bg-raised hover:border-border-hi transition-colors"
          >
            <div className="text-[15px] font-bold text-text-primary">{city.name}</div>
            <div className="text-[12px] text-text-muted mt-1">{city.gym_count} gyms</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
