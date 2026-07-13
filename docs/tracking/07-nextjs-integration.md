# 07 · Next.js App Router Integration Plan
**Version:** 1.0 · 2026-07-10 · Stack: Next.js 16, React 19, Netlify.
Audience: coding agents. File paths are exact.

## New files
```
src/lib/analytics/track.ts          # push helper (shape in doc 03)
src/lib/analytics/route-meta.ts     # pathname → PageMeta pure function + types
src/components/analytics/GTM.tsx    # GTM snippet injection (server-safe)
src/components/analytics/AnalyticsListener.tsx  # 'use client' — page_meta + page_view on route change
```

## Environment (Netlify)
- `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` — set for **Production context ONLY**
  (Netlify → Site config → Environment variables → scope to Production).
  Deploy Previews/branch deploys get no value → GTM never loads there.
  This is guard #1; the GTM hostname exception (doc 04) is guard #2.

## 1. GTM injection — root layout (stays a server component)
`layout.tsx` is a server component and must remain one. `next/script` works
fine inside server components (it renders instructions, executes client-side).

```tsx
// src/components/analytics/GTM.tsx  (server component — no 'use client')
import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export function GTMScript() {
  if (!GTM_ID) return null
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`
      /* CONSENT MODE V2 stub — see docs/tracking/06, keep commented until banner ships */
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  )
}

export function GTMNoScript() {
  if (!GTM_ID) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
```

In `src/app/layout.tsx`: render `<GTMScript />` inside `<html>` (before `<body>`
content is fine with next/script), `<GTMNoScript />` as first child of `<body>`,
and `<AnalyticsListener />` (wrapped in `<Suspense>`) anywhere in `<body>`:

```tsx
import { Suspense } from 'react'
import { GTMScript, GTMNoScript } from '@/components/analytics/GTM'
import AnalyticsListener from '@/components/analytics/AnalyticsListener'
// inside the returned JSX:
//   <GTMScript />
//   <body ...>
//     <GTMNoScript />
//     <Suspense fallback={null}><AnalyticsListener /></Suspense>
//     ...existing children...
```
**Why Suspense:** `useSearchParams` in a client component without a Suspense
boundary forces the nearest route into client-side rendering / triggers a build
error in App Router. The boundary contains the blast radius to the listener.

## 2. SPA page_view — the App Router trap, solved
App Router soft navigations don't reload the page; nothing fires page_view
unless we do. GTM's History Change trigger over-fires (replaceState from
filters/sort would spam page_views). Manual, deterministic solution:

```tsx
// src/components/analytics/AnalyticsListener.tsx
'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { track } from '@/lib/analytics/track'
import { getPageMeta } from '@/lib/analytics/route-meta'

export default function AnalyticsListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    // fire on pathname change only — searchParams changes (sort/filter/q)
    // do NOT create a new page_view; they have their own events
    if (lastPath.current === pathname) return
    lastPath.current = pathname

    const meta = getPageMeta(pathname)
    track('page_meta', { page_meta: meta } as never) // object push, see doc 03
    track('page_view', {
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}
```
Notes for the implementing agent:
- `track('page_meta', ...)` pushes a nested object; either widen the helper's
  type to allow one level of nesting or add a dedicated `trackPageMeta(meta)`
  export. Prefer the dedicated export — keeps `track` flat-typed.
- `document.title` timing: in App Router, metadata is applied before effects
  run on navigation commit; if titles ever lag, fall back to a 0ms rAF. Verify
  in QA (doc 08, check PV-3).
- searchParams is in the dep array intentionally: it doesn't fire page_view
  (guarded by lastPath) but keeps the hook honest if logic evolves.

## 3. route-meta.ts contract
```ts
export type PageMeta = {
  page_type: 'home'|'city'|'locality'|'amenity'|'gym_detail'|'search'
    |'blog_hub'|'blog_post'|'blog_category'|'blog_author'|'calculator'
    |'list_gym'|'contact'|'about'|'privacy'|'cities'
  city: string | null
  locality: string | null
  amenity: string | null
  gym_slug: string | null
}
export function getPageMeta(pathname: string): PageMeta
```
Resolution rules:
- `/` → home · `/cities` → cities · `/search` → search · `/contact`, `/about`,
  `/privacy`, `/list-your-gym` → respective types · `/calculators/protein` → calculator
- `/gyms/{city}` → city, city=segment
- `/gyms/{city}/{slug}` → slug ∈ AMENITIES (import from `@/lib/amenities`)
  ? amenity : locality
- `/gym/{slug}` → gym_detail, gym_slug=slug. Do NOT parse city/locality out of
  the gym slug (format not guaranteed); leave null — CTA events carry gym
  context via data attributes.
- `/blog` → blog_hub · `/blog/author/{slug}` → blog_author
- `/blog/{slug}` → slug ∈ category slug list (import from
  `@/lib/blog-categories`) ? blog_category : blog_post
- Unknown → page_type `'home'`? NO — add `'other'`? Keep enum closed: map
  unknown to nearest static type is wrong; extend the union with `'other'`
  and use it. (Agents: add `'other'` to the union.)

## 4. Client/server boundary per tracked element
| Element | Component | Boundary status | Change required |
|---|---|---|---|
| Call/WhatsApp/Directions CTAs | `app/gym/[slug]/page.tsx` | server | Add data-gtm-* attrs only (doc 03) — stays server |
| Contact mailto cards | `app/contact/page.tsx` | server | Add data-gtm-* attrs — stays server |
| Gym cards | `GymCard.tsx` | server | Add data-gtm-* attrs on `<article>` + list_position prop from parent map index — stays server |
| Calculator results CTA | `ProteinCalculator.tsx` | already client | data-gtm-* attrs (GTM handles it; no push needed) |
| SearchBar | already client | — | Add track() calls: E11 in handleSubmit, E12 in each suggestion onClick, E13 in the zero-results effect (with once-per-term guard) |
| ListGymForm | already client | — | Add E06–E10 pushes: onFocus (first, once) / onBlur per field / submit / success / error |
| GymFilters | already client | — | Add E20 in updateSort |
| ProteinCalculator lifecycle | already client | — | E14 (first interaction, once) / E15 in submit / E16 after setResult |

Zero new client components are created for tracking. Zero server components are
converted. This is the whole point of Path C.

## 5. Netlify notes
- No framework-level analytics conflicts; do NOT enable Netlify Analytics
  simultaneously without noting it measures server-side (numbers won't match GA4 — that's expected, not a bug).
- `@netlify/plugin-nextjs` handles next/script fine; no config.
- Confirm the env var scoping in the Netlify UI — this is the #1 way preview
  pollution happens.
