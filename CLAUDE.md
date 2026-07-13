# Gymlocator.in — Claude Code Project Instructions

## What this is
India's gym discovery and comparison platform. Users find, filter, and connect
with gyms in their city or locality. Think Zomato UX but for fitness centers.

---

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS only — no component libraries, no inline styles
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify (production + deploy previews)
- **Analytics**: GTM + GA4 — see "Tracking & Analytics" section (docs/tracking/)
- **Blog**: Contentful (headless CMS) — see "Blog / Contentful" section
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
├── page.tsx                              → /
├── gyms/
│   └── [city]/
│       ├── page.tsx                      → /gyms/bangalore
│       └── [slug]/
│           └── page.tsx                  → /gyms/bangalore/koramangala (locality)
│                                            /gyms/bangalore/crossfit    (amenity)
├── gym/
│   └── [slug]/
│       └── page.tsx                      → /gym/cult-fit-koramangala-bangalore
├── blog/
│   ├── page.tsx                          → /blog (hub)
│   ├── [slug]/
│   │   └── page.tsx                      → /blog/best-gyms-bangalore-2026  (post)
│   │                                        /blog/supplements-nutrition    (category hub — shared route)
│   └── author/
│       └── [slug]/
│           └── page.tsx                  → /blog/author/arjun-kapoor
├── about/page.tsx
├── contact/page.tsx
└── sitemap.xml/route.ts                  → auto-generated
```

### Locality vs Amenity (Option B)
`/gyms/[city]/[slug]` is shared. Resolve using the known amenity list:

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

## Blog / Contentful

Blog content lives in Contentful (not MDX). Client + queries in `src/lib/contentful.ts`.
Env vars: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`.

### `blogPost` content type
```
title          Short text
slug           Short text (unique)
excerpt        Long text
body           Rich text
coverImage     Media
author         Reference (Author only) — links to an author entry; editors pick
               from existing authors. Legacy name strings still render but
               won't get profile links unless they match authorNameToSlug.
publishedDate  Date
seoTitle       Short text (optional)
seoDescription Long text (optional)
categories     Short text, list — stores category SLUGS (e.g. 'supplements-nutrition'),
               NOT labels. Slug→label mapping lives in src/lib/blog-categories.ts
```

### `author` content type
```
name          Short text (required) — must exactly match blogPost.author strings
slug          Short text (unique)   — kebab-case of name, e.g. 'arjun-kapoor'
                                      must equal authorNameToSlug(name) from contentful.ts
designation   Short text            — e.g. 'Certified Fitness Trainer & Gym Reviewer'
photo         Media
bio           Long text             — paragraphs separated by blank lines
quote         Short text            — pull-quote rendered after bio
credentials   Short text, list      — e.g. ['ACE Certified', 'NSCA-CPT', '9 years experience']
verified      Boolean               — shows 'Verified Contributor' badge
linkedin      Short text (URL)
twitter       Short text (URL)
instagram     Short text (URL)
website       Short text (URL)
gymsReviewed  Short text            — display stat, e.g. '120+'
totalReads    Short text            — display stat, e.g. '1.2M'
```

### Blog routing rules
- `/blog/[slug]` is shared between posts and category hubs — resolved via
  `getCategoryBySlug()` from `src/lib/blog-categories.ts` (12 fixed categories)
- `/blog/author/[slug]` — author profile page; posts matched by author NAME
  (`getPostsByAuthor(name)`), page looked up by slug (`getAuthorBySlug(slug)`)
- Blog pages use ISR: `export const revalidate = 3600`
- Blog design system: dark theme tokens in `src/app/globals.css`
  (base #0C0C0C, surface, raised, border, accent #D4D4D4, signal #009A6B)
- Design reference prototypes: `design-handoff/gym-locator/project/blog/`

---

## SEO Rules — Follow on Every Page

### Meta title templates
```
Homepage:    "Find Best Gyms in India | Gymlocator.in"
City:        "Best Gyms in {City} 2026 — Fees, Reviews & Timings | Gymlocator"
Locality:    "Gyms in {Locality}, {City} — Top Fitness Centers | Gymlocator"
Amenity:     "{Amenity} Gyms in {City} — Find & Compare | Gymlocator"
Gym detail:  "{Gym Name}, {Locality} {City} — Timings, Fees & Reviews"
Blog post:   "{Post Title} | Gymlocator Fitness Guide"
Blog cat.:   "{Category Label} — Guides, Tips & Advice | Gymlocator"
Author:      "{Name} — {Designation} | Gymlocator"
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
| Author      | `ProfilePage` + `Person` + `BreadcrumbList`       |

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
- On submit → navigate to `/gyms/[city]?q=[query]`

### Filter bar (city/locality pages)
Filters: Price tier · Gender · AC/Non-AC · Amenities (multi-select)
- Filters update URL params: `/gyms/bangalore?price=budget&gender=women-only`
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

## Launch Strategy

### Wave 1 (Launch Day) — 4 cities only
Mumbai · Delhi · Bangalore · Pune

### Minimum DB requirement before publishing a page
- City page:     ≥ 10 gyms in that city
- Locality page: ≥ 5 gyms in that locality
- Pages below threshold: return 404 or redirect to city page

### Wave 1 Localities to seed in DB

Mumbai (8 at launch):
mira-road · chembur · ghatkopar-east · andheri-west ·
borivali-west · malad-west · vashi · kharghar

Delhi (8 at launch):
dwarka · saket · janakpuri · paschim-vihar ·
laxmi-nagar · karol-bagh · lajpat-nagar · rajouri-garden

Bangalore (4 at launch):
indiranagar · hsr-layout · koramangala · rr-nagar

Pune (8 at launch):
baner · kharadi · kothrud · viman-nagar ·
wakad · kalyani-nagar · pimple-saudagar · hinjewadi-phase-1

### Target page count at launch
- 4 city pages
- 28 locality pages
- 1 homepage
- 250–600 gym detail pages
- Total: ~285–640 indexable pages

### Seed priority
Mumbai first → validate template → scale to 4 cities

### Wave 2 (+30 days)
Hyderabad · Gurgaon · Noida · Ahmedabad · Chennai · Kolkata

### Wave 3 (+60–90 days)
Indore · Chandigarh · Jaipur · Dehradun · Lucknow ·
Surat · Coimbatore · Bhopal · Thane · Nagpur

---

## Tracking & Analytics (READ BEFORE TOUCHING TRACKED COMPONENTS)

Full architecture lives in `docs/tracking/` (00-README is the index).
The event catalog in `docs/tracking/02-event-taxonomy.md` is FROZEN — never
invent event names or parameters; if a new event seems needed, stop and ask.

### Absolute tracking rules
1. **GTM-first.** Never add gtag.js, Meta Pixel, or any vendor script to code.
   All vendor tags live in the GTM container.
2. **One push helper.** All dataLayer pushes go through
   `src/lib/analytics/track.ts`. Never call `window.dataLayer.push` directly.
3. **No PII, ever.** No form field values, names, emails, phone numbers, or
   calculator body metrics in any event. Field *names* and slugs only.
4. **Never convert a server component to a client component for tracking.**
   Static CTAs (tel:, wa.me, maps, mailto, gym cards) are tracked via
   `data-gtm-*` attributes + GTM click triggers — attributes render server-side.
   Only state-dependent moments (form success, search results, calculator
   completion) use `track()` pushes in already-client components.
5. **page_view is fired manually** by `AnalyticsListener` on pathname change.
   Never add GTM History triggers or GA4 enhanced page_view collection.
   Query-param changes (sort/filter/search) must NOT fire page_view.
6. **GTM loads only in production.** `NEXT_PUBLIC_GTM_ID` is scoped to the
   Netlify Production context. Never hardcode a GTM/GA4 ID.
7. `form_success` (API 2xx confirmed) is the conversion — never `form_submit`.

### Tracked components — re-run QA (docs/tracking/08-qa-plan.md) when editing
`src/app/layout.tsx` · `src/app/gym/[slug]/page.tsx` · `src/app/contact/page.tsx`
· `src/components/home/SearchBar.tsx` · `src/components/shared/GymCard.tsx`
· `src/components/shared/GymFilters.tsx` · `src/app/list-your-gym/ListGymForm.tsx`
· `src/app/calculators/protein/ProteinCalculator.tsx`

### data-gtm-* attribute contract (server components)
Every tracked static element carries `data-gtm-event="<event_name>"` plus its
params as `data-gtm-<param>` attributes. Exact shapes:
`docs/tracking/03-datalayer-spec.md`. GymCard requires a `list_position` prop
(1-based index) from every parent that maps over gyms.

## What We Are NOT Building (MVP)
- User accounts / login
- Gym owner dashboard
- Reviews / ratings system (show static data only)
- Payment or booking
- Push notifications
- Native app