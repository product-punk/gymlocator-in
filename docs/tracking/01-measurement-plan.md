# 01 · Measurement Plan
**Version:** 1.0 · 2026-07-10 · Status: APPROVED (pending 3 assumptions, see 00-README)

## 1. Objectives → Decisions → KPIs

Every event must trace to a decision the owner would make differently. Anything
that doesn't is excluded by design.

| Objective | Decision it drives | KPI | Events |
|---|---|---|---|
| Prove SEO traffic converts to gym contact | Keep investing in SEO vs pivot | Contact rate = (call + whatsapp + directions) ÷ gym-detail sessions | `call_click`, `whatsapp_click`, `directions_click` |
| Grow gym supply | Is the List Your Gym form working; which field kills it | Form completion rate; per-field drop-off | `form_start`, `form_field_complete`, `form_submit`, `form_success` |
| Pick next city/locality (Wave 2/3) | Seeding sequence | Zero-result search volume by term; contact rate by city/locality | `search`, `search_zero_results`, CTA events with geo params |
| Validate content/tools strategy | Invest more in calculators/blog or not | Calculator completion rate; calculator→cities CTA rate | `calculator_*` events |
| Understand acquisition mix | Attribution: organic vs direct vs social | Sessions + key events by GA4 default channel group | `page_view` (correctly fired — nothing custom) |
| Owner-to-owner contact | Is /contact producing leads | mailto click count | `contact_click` |

**Owner's success ranking (from business answers):**
1. List Your Gym submit · 2. Contact email · 3. Get Directions · 4. Protein
calculator · 5. Internal search.
**ASSUMPTION A1:** Call Now + WhatsApp are added as key events alongside these.

## 2. Funnels

### Funnel A — Demand (the money funnel)
```
organic landing (page_view: city|locality|amenity|gym_detail)
  → gym card click            select_content        [ASSUMPTION A3]
  → gym detail view           page_view (page_type=gym_detail)
  → contact action            call_click | whatsapp_click | directions_click
```
- Build as **OPEN funnel** in GA4 Explorations: most SEO sessions land directly
  on gym detail and skip earlier steps. A closed funnel would falsely report
  list pages as failing.
- Reporting split: **hard contact** (call, whatsapp, form_success) vs
  **soft intent** (directions). If ads ever run, optimize on hard contact only.

### Funnel B — Supply
```
page_view (/list-your-gym)
  → form_start            (first field receives focus, once per page load)
  → form_field_complete   (per field, on blur with non-empty value)  [ASSUMPTION A2]
  → form_submit           (submit pressed, client validation passed)
  → form_success          (API /api/list-gym returned 2xx)  ← THE conversion
```
Monitoring metric: submit→success gap. If > 5%, the API or validation is broken.

### Funnel C — Calculator bridge
```
page_view (/calculators/protein)
  → calculator_start      (first interaction with any input/chip)
  → calculator_submit     (form submitted)
  → calculator_complete   (result object rendered)   ← key event
  → calculator_cta_click  ("Browse gyms by city" on results screen)
```

### Funnel D — Search
```
search_suggestion_click   (autocomplete item chosen: gym|city|locality)
search                    (form submitted → /search?q=)
search_zero_results       (empty state rendered)
```
Zero-result terms, grouped monthly, directly feed the Wave 2/3 seeding decision.

## 3. What we deliberately do NOT track (v1)
- Blog CTA clicks (only 2 posts live; taxonomy reserves `blog_cta_click` for later)
- Scroll depth, engagement timers beyond GA4 defaults
- Filter/sort granular analysis beyond simple `filter_apply` / `sort_change`
- Heatmaps (no Clarity/Hotjar in v1)
- Meta Pixel, Google Ads (no paid traffic planned in next 3 months)
- Internal traffic exclusion is DEFINED in doc 05 but NOT activated (owner: "not now")

## 4. Attribution approach
GA4 default channel grouping + (paid, cross-network etc. unused). No custom
events needed. The single biggest attribution risk in App Router apps is
double- or mis-fired `page_view` on client-side navigation — solved in doc 07
by firing page_view manually and disabling automatic collection. Campaign links,
if ever used, follow standard UTM (`utm_source/medium/campaign`), lowercase.

## 5. Glossary
- **Key event:** GA4's term for a conversion (post-2024 rename).
- **Open vs closed funnel:** whether users may enter mid-funnel (open) or must
  start at step 1 (closed). GA4 Explorations toggle.
- **Hard vs soft contact:** signals that identify a lead (call/whatsapp/form)
  vs directional intent (directions).
- **Blur:** browser event when focus leaves an input; standard trigger for
  "field completed."
