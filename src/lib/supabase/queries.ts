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
  offset = 0
) {
  const { data, count } = await supabase
    .from('gyms')
    .select('*', { count: 'exact' })
    .eq('city_slug', citySlug)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1)
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
  offset = 0
) {
  const { data, count } = await supabase
    .from('gyms')
    .select('*', { count: 'exact' })
    .eq('city_slug', citySlug)
    .eq('locality_slug', localitySlug)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1)
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

export async function getCityBySlug(citySlug: string) {
  const { data } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .eq('is_active', true)
    .single()
  return data
}
