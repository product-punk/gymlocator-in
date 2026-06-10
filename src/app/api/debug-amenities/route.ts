import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') || 'ahmedabad'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('gyms')
    .select('name, amenities, gender, price_monthly')
    .eq('city_slug', city)
    .eq('is_active', true)
    .limit(200)

  const amenityCount: Record<string, number> = {}
  const genderCount: Record<string, number> = {}

  for (const gym of data ?? []) {
    for (const a of gym.amenities ?? []) {
      amenityCount[a] = (amenityCount[a] || 0) + 1
    }
    if (gym.gender) {
      genderCount[gym.gender] = (genderCount[gym.gender] || 0) + 1
    }
  }

  const sortedAmenities = Object.entries(amenityCount)
    .sort((a, b) => b[1] - a[1])

  return NextResponse.json({
    city,
    total_gyms: data?.length ?? 0,
    amenity_values: sortedAmenities,
    gender_values: genderCount,
    price_sample: data?.slice(0, 5).map(g => ({ name: g.name, price_monthly: g.price_monthly })),
  })
}
