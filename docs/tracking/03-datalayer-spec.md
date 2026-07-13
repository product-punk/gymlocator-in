# 03 · Data Layer Specification
**Version:** 1.0 · 2026-07-10 · Audience: coding agents. Copy these shapes exactly.

## Rules
1. `window.dataLayer = window.dataLayer || []` is initialized by the GTM snippet;
   code must still guard: `(window.dataLayer ||= []).push(...)` via the helper.
2. All pushes go through ONE helper: `src/lib/analytics/track.ts`. No component
   ever calls `window.dataLayer.push` directly. This centralizes the null-guard,
   TypeScript typing, and future consent gating.
3. Event param keys/values: snake_case, lowercase slugs, booleans as real booleans
   in dataLayer (GTM stringifies for GA4).
4. **No PII.** No form values, no phone/email strings, no calculator body metrics.
5. Clear ephemeral keys: pushes use flat event objects; we do NOT use
   `dataLayer.push({ecommerce: null})`-style resets (no ecommerce in v1).

## The helper (canonical implementation)
```ts
// src/lib/analytics/track.ts
type Primitive = string | number | boolean | null;
export type TrackParams = Record<string, Primitive>;

export function track(event: string, params: TrackParams = {}): void {
  if (typeof window === 'undefined') return;
  (window.dataLayer = window.dataLayer || []).push({ event, ...params });
}

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}
```

## Global `page_meta` push
Fired by `<AnalyticsListener />` (doc 07) on every route change, BEFORE the
`page_view` event, in the same tick:

```js
// 1. context
dataLayer.push({
  event: 'page_meta',
  page_meta: {
    page_type: 'gym_detail',      // see taxonomy E01 enum
    city: 'mumbai',               // or null
    locality: 'andheri-west',     // or null
    amenity: null,                // or 'crossfit'
    gym_slug: 'golds-gym-andheri-west-mumbai'  // or null
  }
});
// 2. the page view itself
dataLayer.push({
  event: 'page_view',
  page_location: 'https://gymlocator.in/gym/golds-gym-andheri-west-mumbai',
  page_title: document.title
});
```
GTM reads `page_meta.*` via Data Layer Variables (Version 2, which persists the
value until overwritten by the next route's push) and attaches them to every
GA4 event tag.

`page_type` resolution lives in `src/lib/analytics/route-meta.ts` — a pure
function `getPageMeta(pathname: string): PageMeta` using the route table and the
existing `AMENITIES` list to disambiguate `/gyms/[city]/[slug]`. Blog category
vs post on `/blog/[slug]` cannot be resolved from the URL alone client-side;
resolve using the fixed 12-category slug list duplicated from
`src/lib/blog-categories.ts` (import it — it's a plain array, client-safe).

## Code-pushed events (exact shapes)

```js
// E06 form_start — ListGymForm, first focus, once
track('form_start', { form_id: 'list_gym' });

// E07 form_field_complete — on blur, non-empty, once per field
track('form_field_complete', { form_id: 'list_gym', field_name: 'phone' });

// E08 form_submit — handler entry
track('form_submit', { form_id: 'list_gym', fields_completed: 7 });

// E09 form_success — after res.ok
track('form_success', { form_id: 'list_gym', city: 'mumbai' }); // lowercased form value

// E10 form_error
track('form_error', { form_id: 'list_gym', error_type: 'api' }); // or 'network'

// E11 search — in handleSubmit before router.push
track('search', { search_term: 'gold gym andheri', search_source: 'hero' });

// E12 search_suggestion_click — in each suggestion onClick before router.push
track('search_suggestion_click', {
  search_term: 'andh', suggestion_type: 'locality', suggestion_slug: 'andheri-west'
});

// E13 search_zero_results — when empty state condition becomes true
track('search_zero_results', { search_term: 'gym in indore' });

// E14–E16 calculator
track('calculator_start',    { calculator_id: 'protein' });
track('calculator_submit',   { calculator_id: 'protein' });
track('calculator_complete', { calculator_id: 'protein', verdict: 'slightly_low' });

// E20 sort_change — in GymFilters updateSort
track('sort_change', { sort_value: 'price_asc' });
```

## Attribute-driven events (server components — NO code pushes)
Server-rendered `<a>`/`<Link>` elements carry data attributes; GTM does the rest.

```tsx
// gym detail — Call Now
<a href={`tel:${gym.phone}`}
   data-gtm-event="call_click"
   data-gtm-gym-slug={gym.slug}
   data-gtm-gym-name={gym.name}
   data-gtm-price-range={gym.price_range}
   data-gtm-gender={gym.gender}
   data-gtm-is-247={String(gym.is_247)}
   className="...">Call Now</a>

// WhatsApp: data-gtm-event="whatsapp_click"  (same gym attrs)
// Directions: data-gtm-event="directions_click" (same gym attrs)

// contact page mailto cards
<a href="mailto:corrections@gymlocator.in"
   data-gtm-event="contact_click"
   data-gtm-contact-type="corrections">…</a>

// GymCard — put on the wrapping <article> so all inner links inherit via closest()
<article data-gtm-event="select_content"
         data-gtm-content-type="gym_card"
         data-gtm-item-id={gym.slug}
         data-gtm-list-position={index + 1}>

// calculator results CTA
<Link href="/cities"
      data-gtm-event="calculator_cta_click"
      data-gtm-calculator-id="protein"
      data-gtm-cta-destination="/cities">…</Link>
```

GTM trigger predicate: Click Element **matches CSS selector**
`[data-gtm-event="call_click"], [data-gtm-event="call_click"] *` — the `*`
variant catches clicks on the icon `<i>` inside the anchor. Attribute values are
read with a Custom JS variable using `closest('[data-gtm-event]')` (doc 04).

## Why this split (teaching note)
Client pushes are unavoidable where the meaningful moment is a *state change*
(API success, results rendered, debounce settled) — GTM can't see React state.
Clicks on static links are pure DOM events — GTM sees those natively, so adding
client JS there would buy nothing and cost hydration. The data attributes are
rendered on the server for free.
