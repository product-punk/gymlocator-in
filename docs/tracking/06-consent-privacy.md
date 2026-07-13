# 06 · Consent & Privacy Plan
**Version:** 1.0 · 2026-07-10 · Status: **DEFERRED by owner** — v1 launches
without a consent banner. This doc exists so the retrofit is a config change,
not a rebuild.

## Current posture (v1)
- GA4 via GTM fires for all visitors, no banner.
- India DPDP Act: analytics cookies sit in a gray zone; the site's /privacy page
  already discloses cookies + Google Analytics ("Cookies & Analytics" section),
  which provides notice. Consent is not collected. Owner accepts this posture
  and will revisit. **Risk owner, not architect, holds this decision.**
- No EU targeting; if EU/UK traffic materially appears in GA4 geo reports
  (> ~3%), escalate this doc to active.

## Hard privacy rules ALREADY ENFORCED in v1 (non-negotiable, consent or not)
1. No PII in dataLayer/GA4: no names, emails, phone numbers, form values,
   calculator body metrics. Field names and verdict strings only.
2. No user_id, no persistent custom identifiers (site has no accounts anyway).
3. GA4 IP handling: Google discards IPs at collection for GA4 by default; no
   action needed, but never add tools that log raw IP client-side.

## Pre-designed retrofit (when owner says go)
1. **Consent Mode v2 defaults** — the GTM injection code (doc 07) ships with a
   commented block; uncommenting activates denied-by-default:
```js
// CONSENT MODE V2 — uncomment when banner ships
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('consent', 'default', {
//   ad_storage: 'denied', ad_user_data: 'denied',
//   ad_personalization: 'denied', analytics_storage: 'denied',
//   wait_for_update: 500
// });
```
   Must execute BEFORE the GTM container snippet — it is placed above it in the
   same beforeInteractive script.
2. **Banner:** any CMP or a small first-party banner that calls
   `gtag('consent','update',{analytics_storage:'granted'})` on accept and
   persists choice in a first-party cookie (`gl_consent`, 6-month expiry).
3. **GA4 behavioral modeling** requires Consent Mode active + thresholds;
   don't promise modeled data at this traffic scale.
4. **/privacy page updates required at retrofit:** add banner mention, cookie
   table (GTM/GA4 cookies: `_ga`, `_ga_*`), and DPDP-style rights contact.
   Current copy at `src/app/privacy/page.tsx` already covers collection, use,
   retention, and rights — keep language consistent with it.
5. GTM changes: none to tags (Consent Mode is signal-level), but set each GA4
   tag's built-in consent checks to "require analytics_storage" = NOT set
   (Consent Mode handles it via pings). Do not use GTM "additional consent
   checks" unless a lawyer requires hard-gating.

## Glossary
- **Consent Mode v2:** Google's signal system; tags adapt (cookieless pings vs
  full hits) based on granted/denied state, instead of firing/not firing.
- **CMP:** Consent Management Platform (e.g., Cookiebot, Osano).
