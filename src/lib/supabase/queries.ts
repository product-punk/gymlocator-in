import { supabase } from './client'

export async function getCities() {
  const { data } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('wave', { ascending: true })
  return data ?? []
}

export async function getFeaturedGyms() {
  const { data } = await supabase
    .from('gyms')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .limit(6)
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

export async function searchGymsAndLocalities(query: string) {
  if (!query || query.length < 2) return { gyms: [], cities: [], localities: [] }

  const q = query.toLowerCase().trim()

  const [gymsRes, citiesRes, localitiesRes] = await Promise.all([
    supabase
      .from('gyms')
      .select('id, name, slug, city_slug, locality_slug, rating, images')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .order('rating', { ascending: false })
      .limit(5),

    supabase
      .from('cities')
      .select('id, name, slug, gym_count')
      .ilike('name', `%${q}%`)
      .limit(3),

    supabase
      .from('localities')
      .select('id, name, slug, city_slug')
      .ilike('name', `%${q}%`)
      .limit(4),
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
