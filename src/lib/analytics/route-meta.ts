import { AMENITIES } from '@/lib/amenities'
import { CATEGORY_SLUGS } from '@/lib/blog-categories'

// Global page-context object attached to every GA4 event via GTM.
// See docs/tracking/02-event-taxonomy.md (page_meta) and 07-nextjs-integration.md §3.
export type PageType =
  | 'home'
  | 'city'
  | 'locality'
  | 'amenity'
  | 'gym_detail'
  | 'search'
  | 'blog_hub'
  | 'blog_post'
  | 'blog_category'
  | 'blog_author'
  | 'calculator'
  | 'list_gym'
  | 'contact'
  | 'about'
  | 'privacy'
  | 'cities'
  | 'other'

export type PageMeta = {
  page_type: PageType
  city: string | null
  locality: string | null
  amenity: string | null
  gym_slug: string | null
}

const AMENITY_SET: ReadonlySet<string> = new Set(AMENITIES)
const CATEGORY_SET: ReadonlySet<string> = new Set(CATEGORY_SLUGS)

function empty(page_type: PageType): PageMeta {
  return { page_type, city: null, locality: null, amenity: null, gym_slug: null }
}

/**
 * Pure pathname -> PageMeta resolver. No window / router access, so it is safe
 * for both the client listener and unit tests. Query strings and trailing
 * slashes are ignored. Unknown routes resolve to 'other' (closed enum — never
 * guess a nearest static type).
 */
export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.split('?')[0].split('#')[0]
  const normalized = path !== '/' ? path.replace(/\/+$/, '') : path
  const seg = normalized.split('/').filter(Boolean)

  if (seg.length === 0) return empty('home')

  const [s0, s1, s2] = seg

  // Single-segment static routes
  if (seg.length === 1) {
    switch (s0) {
      case 'cities':
        return empty('cities')
      case 'search':
        return empty('search')
      case 'contact':
        return empty('contact')
      case 'about':
        return empty('about')
      case 'privacy':
        return empty('privacy')
      case 'list-your-gym':
        return empty('list_gym')
      case 'blog':
        return empty('blog_hub')
      default:
        return empty('other')
    }
  }

  // /calculators/protein (only calculator route in v1)
  if (s0 === 'calculators') {
    return empty('calculator')
  }

  // /gym/{slug} — do NOT parse city/locality out of the gym slug (doc 07 §3)
  if (s0 === 'gym' && seg.length === 2) {
    return { ...empty('gym_detail'), gym_slug: s1 }
  }

  // /gyms/{city} and /gyms/{city}/{slug} (amenity vs locality)
  if (s0 === 'gyms') {
    if (seg.length === 2) {
      return { ...empty('city'), city: s1 }
    }
    if (seg.length >= 3) {
      if (AMENITY_SET.has(s2)) {
        return { ...empty('amenity'), city: s1, amenity: s2 }
      }
      return { ...empty('locality'), city: s1, locality: s2 }
    }
  }

  // /blog/author/{slug} and /blog/{slug} (category vs post)
  if (s0 === 'blog') {
    if (s1 === 'author') {
      return seg.length >= 3 ? empty('blog_author') : empty('other')
    }
    if (seg.length === 2) {
      return CATEGORY_SET.has(s1) ? empty('blog_category') : empty('blog_post')
    }
  }

  return empty('other')
}
