# 09 · Phased Rollout & Executor Task List
**Version:** 1.0 · 2026-07-10
Tickets are sequenced; do not start a phase before the prior phase's gate.
Each ticket: Scope · Files · Acceptance Criteria (AC). Executor agents must read
docs 02, 03, 07 before touching code. Event names/params come from doc 02 ONLY.

---

## PHASE 0 — Accounts (owner, manual, ~45 min) — GATE for everything
### T-00 Create GA4 + GTM
- Create GA4 property + web stream per doc 05 §Property setup (steps 1–6).
- Create GTM web container `gymlocator.in`. Record `GTM-XXXXXXX` and
  `G-XXXXXXXXXX` in doc 04/05 headers.
- Set `NEXT_PUBLIC_GTM_ID` in Netlify, **Production scope only**.
- AC: both IDs recorded; env var visible only in production context.

## PHASE 1 — Plumbing (coding agent)
### T-01 Analytics lib
- Scope: create `track.ts` (+ `trackPageMeta`), `route-meta.ts` with full
  resolution rules incl. `'other'` type; unit tests for getPageMeta covering
  every route class + amenity-vs-locality + blog post-vs-category.
- Files: `src/lib/analytics/track.ts`, `src/lib/analytics/route-meta.ts`,
  `src/lib/analytics/__tests__/route-meta.test.ts`
- AC: tests pass; no `any`; `getPageMeta('/gyms/pune/crossfit').page_type === 'amenity'`.

### T-02 GTM injection + AnalyticsListener
- Scope: per doc 07 §1–2. GTM components, listener with Suspense boundary in
  root layout. Layout REMAINS a server component.
- Files: `src/components/analytics/GTM.tsx`, `AnalyticsListener.tsx`,
  `src/app/layout.tsx`
- AC: build passes; with env var unset, page source contains zero
  googletagmanager references; QA checks PV-1..PV-6 pass in GTM Preview.

## PHASE 2 — GTM container build (owner or agent-with-access, config not code)
### T-03 Container per blueprint
- Scope: all variables (incl. GTES - page_meta), triggers, GA4 Config
  (send_page_view false), page_view event tag, hostname exception, folders.
- AC: GTM Preview on prod shows Config + page_view firing with page_meta
  populated; DebugView receives page_view; ENV E-1..E-3 pass.
- GATE: Phases 3–5 may run in parallel after this.

## PHASE 3 — Contact CTAs (highest value)
### T-04 Data attributes on server pages
- Scope: add data-gtm-* attrs per doc 03 to: gym detail Call/WhatsApp/
  Directions anchors; contact page 3 mailto cards (`contact_type` = general/
  corrections/partnerships); GymCard `<article>` (+ thread `index` prop from
  every parent that maps cards → `list_position`); calculator results CTA Link.
- Files: `src/app/gym/[slug]/page.tsx`, `src/app/contact/page.tsx`,
  `src/components/shared/GymCard.tsx` + its call sites,
  `src/app/calculators/protein/ProteinCalculator.tsx`
- AC: components remain server components (except calculator, already client);
  attributes render in page source with correct values; no visual change.

### T-05 GTM: CTA tags
- Scope: CJS attribute variables, 6 click triggers, event tags for E02–E05,
  E17, E18 per doc 04 tables.
- AC: QA CTA-1..CTA-5 and SC-1..SC-2 pass; events visible in DebugView with
  all params.

## PHASE 4 — Forms
### T-06 ListGymForm instrumentation
- Scope: E06–E10 pushes per doc 03 shapes. form_start once-guard via ref;
  per-field blur once-guard via a Set ref; fields_completed computed at submit;
  success/error pushes in the existing fetch handler branches. City param
  lowercased at push.
- Files: `src/app/list-your-gym/ListGymForm.tsx`
- AC: QA F-1..F-6 pass. **F-4 (no field values) verified against the raw
  network payload, not just DebugView.**

### T-07 GTM: form tags + GA4 key events + dimensions
- Scope: 5 CE triggers + 5 tags; then in GA4 mark all 7 key events (doc 05) and
  register all 19 custom dimensions.
- AC: form_success appears as key event in GA4; dimensions listed in Admin.

## PHASE 5 — Search + Calculator + Sort
### T-08 SearchBar instrumentation
- Scope: E11 in handleSubmit; E12 in city/locality/gym suggestion onClicks AND
  the "View all results" button (fires `search`, source `hero`); E13 in the
  zero-results render path with last-term ref guard.
- Files: `src/components/home/SearchBar.tsx`
- AC: QA S-1..S-4 pass.

### T-09 Calculator + sort instrumentation
- Scope: E14 once-guard on first form interaction; E15 in submit; E16 after
  setResult with verdict snake_cased (`v.toLowerCase().replace(/[^a-z0-9]+/g,'_')`);
  E20 in GymFilters updateSort.
- Files: `ProteinCalculator.tsx`, `src/components/shared/GymFilters.tsx`
- AC: QA C-1..C-3 pass; sort_change in DebugView; C-3 payload inspection done.

### T-10 GTM: remaining tags
- Scope: CE triggers/tags for search (3), calculator (3), sort_change.
- AC: full QA doc 08 executed top to bottom; all boxes checked; GTM version
  published with notes; screenshot of DebugView archived.

## PHASE 6 — Hardening (week 2+)
### T-11 Data quality review (day 14)
- Verify: no localhost/preview hostnames in GA4; page_view counts ≈ Netlify/GSC
  ballpark; submit→success gap < 5%; page_type (not set) rate < 1%.
### T-12 Day-60 review
- Demote `search` from key event if agreed; activate internal-traffic filter
  (doc 05) if owner ready; revisit consent (doc 06) if EU share > 3%.

---
## Executor rules of engagement
1. Never invent event names or params — doc 02 is law; unknowns → stop and ask.
2. Never convert a server component to client for tracking.
3. Never log PII (doc 03 rule 4). Any doubt = leave it out.
4. Every ticket PR links the QA checklist items it satisfies.
