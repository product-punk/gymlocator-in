import { supabase } from './client'

export async function getCities() {
  const { data } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('gym_count', { ascending: false })
  return data ?? []
}

export async function getFeaturedGyms(limit = 6) {
  const { data } = await supabase
    .from('gyms')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getPartnerGyms() {
  const { data } = await supabase
    .from('gyms')
    .select('*')
    .eq('is_partner', true)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  return data ?? []
}

export async function getGymBySlug(slug: string) {
  const { data } = await supabase
    .from('gyms')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export async function getGymsByCity(
  citySlug: string,
  limit = 12,
  offset = 0,
  filters?: {
    gender?: string
    is247?: boolean
    minRating?: number
    sort?: string
  }
) {
  let query = supabase
    .from('gyms')
    .select('*', { count: 'exact' })
    .eq('city_slug', citySlug)
    .eq('is_active', true)

  if (filters?.gender) query = query.eq('gender', filters.gender)
  if (filters?.is247) query = query.eq('is_247', true)
  if (filters?.minRating) query = query.gte('rating', filters.minRating)

  const sort = filters?.sort || 'rating'
  if (sort === 'price_asc') {
    query = query.order('price_monthly', { ascending: true, nullsFirst: false })
  } else if (sort === 'price_desc') {
    query = query.order('price_monthly', { ascending: false, nullsFirst: false })
  } else if (sort === 'reviews') {
    query = query.order('review_count', { ascending: false })
  } else {
    query = query.order('rating', { ascending: false })
  }

  const { data, count } = await query.range(offset, offset + limit - 1)
  return { gyms: data ?? [], total: count ?? 0 }
}

export async function getLocalitiesByCity(citySlug: string) {
  const { data } = await supabase
    .from('localities')
    .select('*')
    .eq('city_slug', citySlug)
    .eq('is_active', true)
    .order('search_volume', { ascending: false })
  return data ?? []
}

export async function getLocalityBySlug(citySlug: string, localitySlug: string) {
  const { data } = await supabase
    .from('localities')
    .select('*')
    .eq('city_slug', citySlug)
    .eq('slug', localitySlug)
    .single()
  return data
}

export async function getGymsByLocality(
  citySlug: string,
  localitySlug: string,
  limit = 12,
  offset = 0,
  filters?: {
    gender?: string
    is247?: boolean
    minRating?: number
    sort?: string
  }
) {
  let query = supabase
    .from('gyms')
    .select('*', { count: 'exact' })
    .eq('city_slug', citySlug)
    .eq('locality_slug', localitySlug)
    .eq('is_active', true)

  if (filters?.gender) query = query.eq('gender', filters.gender)
  if (filters?.is247) query = query.eq('is_247', true)
  if (filters?.minRating) query = query.gte('rating', filters.minRating)

  const sort = filters?.sort || 'rating'
  if (sort === 'price_asc') {
    query = query.order('price_monthly', { ascending: true, nullsFirst: false })
  } else if (sort === 'price_desc') {
    query = query.order('price_monthly', { ascending: false, nullsFirst: false })
  } else if (sort === 'reviews') {
    query = query.order('review_count', { ascending: false })
  } else {
    query = query.order('rating', { ascending: false })
  }

  const { data, count } = await query.range(offset, offset + limit - 1)
  return { gyms: data ?? [], total: count ?? 0 }
}

export async function getGymsByAmenity(
  citySlug: string,
  amenity: string,
  limit = 12,
  offset = 0
) {
  const { data, count } = await supabase
    .from('gyms')
    .select('*', { count: 'exact' })
    .eq('city_slug', citySlug)
    .eq('is_active', true)
    .contains('amenities', [amenity])
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1)
  return { gyms: data ?? [], total: count ?? 0 }
}

export async function getActiveFacetsForCity(citySlug: string): Promise<string[]> {
  const base = () =>
    supabase.from('gyms').select('id').eq('city_slug', citySlug).eq('is_active', true).limit(1)

  const WOMEN_CITIES = ['ahmedabad', 'mumbai', 'hyderabad', 'pune', 'chennai', 'bangalore', 'kolkata', 'delhi']

  const checks = await Promise.allSettled([
    base().not('price_monthly', 'is', null).lte('price_monthly', 1500),       // 0: budget
    base().not('price_monthly', 'is', null).gte('price_monthly', 3500),       // 1: premium
    base().contains('amenities', ['Cardio']),                                  // 2: cardio
    base().contains('amenities', ['Personal Trainer']),                        // 3: with-personal-trainer
    base().contains('amenities', ['Swimming']),                                // 4: with-swimming-pool
    base().contains('amenities', ['Sauna']),                                   // 5: with-steam-sauna
    WOMEN_CITIES.includes(citySlug)
      ? base().eq('gender', 'women-only')
      : Promise.resolve({ data: [] as { id: string }[] }),                    // 6: women
  ])

  const slugs = ['budget', 'premium', 'cardio', 'with-personal-trainer', 'with-swimming-pool', 'with-steam-sauna', 'women']

  const active: string[] = []
  checks.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`[facets] ${citySlug}/${slugs[i]} error:`, result.reason)
      return
    }
    const count = result.value.data?.length ?? 0
    console.log(`[facets] ${citySlug}/${slugs[i]}: ${count > 0 ? count + ' gyms' : 'none'}`)
    if (count > 0) active.push(slugs[i])
  })

  return active
}

export async function getGymsByFacet(
  citySlug: string,
  facet: string,
  limit = 12,
  offset = 0
) {
  let query = supabase
    .from('gyms')
    .select('*', { count: 'exact' })
    .eq('city_slug', citySlug)
    .eq('is_active', true)

  switch (facet) {
    case 'women':
      query = query.eq('gender', 'women-only')
      break
    case 'budget':
      query = query.not('price_monthly', 'is', null).lte('price_monthly', 1500)
      break
    case 'premium':
      query = query.not('price_monthly', 'is', null).gte('price_monthly', 3500)
      break
    case 'cardio':
      query = query.contains('amenities', ['Cardio'])
      break
    case 'with-personal-trainer':
      query = query.contains('amenities', ['Personal Trainer'])
      break
    case 'with-swimming-pool':
      query = query.contains('amenities', ['Swimming'])
      break
    case 'with-steam-sauna':
      query = query.contains('amenities', ['Sauna'])
      break
  }

  const { data, count } = await query
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1)

  return { gyms: data ?? [], total: count ?? 0 }
}

export async function searchGymsAndLocalities(query: string) {
  if (!query || query.length < 2) return { gyms: [], cities: [], localities: [] }

  const q = query.toLowerCase().trim()

  const [gymsRes, citiesRes, localitiesRes] = await Promise.all([
    supabase
      .from('gyms')
      .select('id, name, slug, city_slug, locality_slug, rating, review_count, images, price_monthly, amenities, is_247, gender')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .order('rating', { ascending: false })
      .limit(20),

    supabase
      .from('cities')
      .select('id, name, slug, gym_count')
      .ilike('name', `%${q}%`)
      .limit(4),

    supabase
      .from('localities')
      .select('id, name, slug, city_slug')
      .ilike('name', `%${q}%`)
      .limit(6),
  ])

  return {
    gyms: gymsRes.data ?? [],
    cities: citiesRes.data ?? [],
    localities: localitiesRes.data ?? [],
  }
}

export async function getCityBySlug(citySlug: string) {
  const { data } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .eq('is_active', true)
    .single()
  return data
}

export async function getFacetContent(citySlug: string, facetSlug: string) {
  const { data } = await supabase
    .from('facet_content')
    .select('*')
    .eq('city_slug', citySlug)
    .eq('facet_slug', facetSlug)
    .single()
  return data
}
