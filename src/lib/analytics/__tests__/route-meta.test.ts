import { describe, it, expect } from 'vitest'
import { getPageMeta, type PageMeta } from '../route-meta'
import { AMENITIES } from '@/lib/amenities'
import { CATEGORY_SLUGS } from '@/lib/blog-categories'

const NULLS = { city: null, locality: null, amenity: null, gym_slug: null }

describe('getPageMeta — static routes', () => {
  const cases: Array<[string, PageMeta['page_type']]> = [
    ['/', 'home'],
    ['/cities', 'cities'],
    ['/search', 'search'],
    ['/contact', 'contact'],
    ['/about', 'about'],
    ['/privacy', 'privacy'],
    ['/list-your-gym', 'list_gym'],
    ['/calculators/protein', 'calculator'],
    ['/blog', 'blog_hub'],
  ]
  it.each(cases)('%s -> %s', (path, type) => {
    expect(getPageMeta(path)).toEqual({ page_type: type, ...NULLS })
  })
})

describe('getPageMeta — gyms: city / locality / amenity', () => {
  it('/gyms/{city} -> city', () => {
    expect(getPageMeta('/gyms/mumbai')).toEqual({
      page_type: 'city',
      city: 'mumbai',
      locality: null,
      amenity: null,
      gym_slug: null,
    })
  })

  it('/gyms/{city}/{amenity} -> amenity (AC example)', () => {
    const meta = getPageMeta('/gyms/pune/crossfit')
    expect(meta.page_type).toBe('amenity')
    expect(meta).toEqual({
      page_type: 'amenity',
      city: 'pune',
      locality: null,
      amenity: 'crossfit',
      gym_slug: null,
    })
  })

  it('/gyms/{city}/{locality} -> locality (non-amenity slug)', () => {
    expect(getPageMeta('/gyms/bangalore/koramangala')).toEqual({
      page_type: 'locality',
      city: 'bangalore',
      locality: 'koramangala',
      amenity: null,
      gym_slug: null,
    })
  })

  it('every AMENITY slug resolves to amenity, not locality', () => {
    for (const a of AMENITIES) {
      const meta = getPageMeta(`/gyms/delhi/${a}`)
      expect(meta.page_type).toBe('amenity')
      expect(meta.amenity).toBe(a)
      expect(meta.locality).toBeNull()
    }
  })
})

describe('getPageMeta — gym detail', () => {
  it('/gym/{slug} -> gym_detail, slug captured, city/locality left null', () => {
    expect(getPageMeta('/gym/golds-gym-andheri-west-mumbai')).toEqual({
      page_type: 'gym_detail',
      city: null,
      locality: null,
      amenity: null,
      gym_slug: 'golds-gym-andheri-west-mumbai',
    })
  })
})

describe('getPageMeta — blog: hub / author / category vs post', () => {
  it('/blog/author/{slug} -> blog_author', () => {
    expect(getPageMeta('/blog/author/arjun-kapoor').page_type).toBe('blog_author')
  })

  it('/blog/{categorySlug} -> blog_category', () => {
    const slug = CATEGORY_SLUGS[0]
    expect(getPageMeta(`/blog/${slug}`).page_type).toBe('blog_category')
  })

  it('every category slug resolves to blog_category', () => {
    for (const slug of CATEGORY_SLUGS) {
      expect(getPageMeta(`/blog/${slug}`).page_type).toBe('blog_category')
    }
  })

  it('/blog/{postSlug} (not a category) -> blog_post', () => {
    expect(getPageMeta('/blog/best-gyms-bangalore-2026').page_type).toBe('blog_post')
  })
})

describe('getPageMeta — normalization & unknowns', () => {
  it('ignores query string and hash', () => {
    expect(getPageMeta('/gyms/mumbai?sort=rating#top').page_type).toBe('city')
  })

  it('ignores trailing slash', () => {
    expect(getPageMeta('/contact/').page_type).toBe('contact')
  })

  it('unknown route -> other (closed enum, never a nearest guess)', () => {
    expect(getPageMeta('/totally/unknown/path').page_type).toBe('other')
    expect(getPageMeta('/blog/author').page_type).toBe('other')
  })
})
