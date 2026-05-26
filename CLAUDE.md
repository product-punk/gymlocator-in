# Gymlocator.in — Claude Code Project Instructions

## What this is
India's gym discovery and comparison platform. Users find, filter, and connect
with gyms in their city or locality. Think Zomato UX but for fitness centers.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS only — no component libraries, no inline styles
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Blog**: MDX files (no DB)
- **Maps**: Google Maps iframe embed (no API key required)

---

## Absolute Rules
1. TailwindCSS only — never write custom CSS files or inline styles
2. Mobile-first always — build for 375px first, then scale up
3. No component libraries (no shadcn, no MUI, no Chakra)
4. TypeScript strict — no `any` types
5. Every page must have proper `<title>`, `<meta description>`, and OG tags
6. All images must have meaningful `alt` text
7. Use `next/image` for all images, `next/link` for all internal links

---

## Route Structure

```
app/
├── page.tsx                          → /
├── city/
│   └── [city]/
│       ├── page.tsx                  → /city/bangalore
│       └── [slug]/
│           └── page.tsx              → /city/bangalore/koramangala (locality)
│                                        /city/bangalore/crossfit    (amenity)
├── gym/
│   └── [slug]/
│       └── page.tsx                  → /gym/cult-fit-koramangala-bangalore
├── blog/
│   ├── page.tsx                      → /blog
│   └── [slug]/
│       └── page.tsx                  → /blog/best-gyms-bangalore-2025
├── about/page.tsx
├── contact/page.tsx
└── sitemap.xml/route.ts              → auto-generated
```

### Locality vs Amenity (Option B)
`/city/[city]/[slug]` is shared. Resolve using the known amenity list:

```ts
// lib/amenities.ts
export const AMENITIES = [
  'crossfit', 'yoga', 'zumba', 'swimming', 'pilates',
  'women-only', '24-7', 'mma', 'boxing', 'calisthenics',
  'functional-training', 'powerlifting', 'cardio-only'
]
```

In `[slug]/page.tsx`:
```ts
const isAmenity = AMENITIES.includes(params.slug)
// render <AmenityPage> or <LocalityPage> accordingly
```

---

## Database Schema (Supabase)

### `gyms` table
```sql
id            uuid primary key
name          text not null
slug          text unique not null        -- cult-fit-koramangala-bangalore
city          text not null               -- bangalore (lowercase, no spaces)
locality      text not null               -- koramangala
address       text not null
lat           float8
lng           float8
phone         text
amenities     text[]                      -- ['crossfit', 'ac', 'parking']
gender        text                        -- 'mixed' | 'women-only' | 'men-only'
price_range   text                        -- 'budget' | 'mid' | 'premium'
ac            boolean default false
timing_open   text                        -- '06:00'
timing_close  text                        -- '22:00'
is_247        boolean default false
rating        float4
review_count  int default 0
images        text[]                      -- array of image URLs
is_featured   boolean default false
is_active     boolean default true
created_at    timestamptz default now()
```

### `cities` table
```sql
id            uuid primary key
name          text not null               -- Bangalore
slug          text unique not null        -- bangalore
gym_count     int default 0
is_active     boolean default true
```

### `localities` table
```sql
id            uuid primary key
name          text not null               -- Koramangala
slug          text unique not null        -- koramangala
city_slug     text not null               -- bangalore
gym_count     int default 0
```

---

## SEO Rules — Follow on Every Page

### Meta title templates
```
Homepage:    "Find Best Gyms in India | Gymlocator.in"
City:        "Best Gyms in {City} 2025 — Fees, Reviews & Timings | Gymlocator"
Locality:    "Gyms in {Locality}, {City} — Top {N} Fitness Centers | Gymlocator"
Amenity:     "{Amenity} Gyms in {City} — Find & Compare | Gymlocator"
Gym detail:  "{Gym Name}, {Locality} {City} — Timings, Fees & Reviews"
Blog post:   "{Post Title} | Gymlocator Fitness Guide"
```

### Schema markup per page
| Page        | Schema types                                      |
|-------------|---------------------------------------------------|
| Homepage    | `WebSite` + `SearchAction`                        |
| City        | `CollectionPage` + `BreadcrumbList`               |
| Locality    | `CollectionPage` + `BreadcrumbList`               |
| Amenity     | `CollectionPage` + `BreadcrumbList`               |
| Gym detail  | `LocalBusiness` + `SportsActivityLocation` + `BreadcrumbList` |
| Blog post   | `Article` + `BreadcrumbList`                      |

### Breadcrumbs (always render these)
```
Home > Bangalore > Koramangala > Cult Fit
Home > Bangalore > CrossFit Gyms
```

### Static generation
- All city, locality, amenity, and gym pages use `generateStaticParams`
- Revalidate every 24 hours using ISR: `export const revalidate = 86400`

---

## Component Patterns

### Gym card (used on city, locality, amenity pages)
Must show: name, locality, rating, price_range, top 3 amenities, phone CTA

### Search bar (homepage hero)
- Searches by city, locality, or gym name
- Autocomplete from Supabase
- On submit → navigate to `/city/[city]?q=[query]`

### Filter bar (city/locality pages)
Filters: Price tier · Gender · AC/Non-AC · Amenities (multi-select)
- Filters update URL params: `/city/bangalore?price=budget&gender=women-only`
- Always use `useSearchParams` + `router.push` — never local state only

---

## Cities in Scope (MVP)
bangalore · mumbai · delhi · hyderabad · chennai · pune · kolkata · ahmedabad

---

## Amenities in Scope (MVP)
crossfit · yoga · zumba · swimming · pilates · women-only · 24-7 · mma ·
boxing · calisthenics · functional-training · powerlifting · cardio-only

---

## Naming Conventions
- Page components: `PascalCase` (e.g. `CityPage`, `GymCard`)
- Utility functions: `camelCase` (e.g. `formatSlug`, `getGymsByCity`)
- Database queries: in `lib/supabase/` folder, one file per entity
- Route segments: always lowercase kebab-case slugs

---

## Performance Rules
- No layout shift — always set width/height on images
- Lazy load images below the fold: `loading="lazy"`
- Gym list pages: server components only, no client-side fetching
- Filter changes: use URL params + server component re-render (no useState for data)

---

## What We Are NOT Building (MVP)
- User accounts / login
- Gym owner dashboard
- Reviews / ratings system (show static data only)
- Payment or booking
- Push notifications
- Native app