# Gymlocator.in — Tracking & Analytics Architecture
**Version:** 1.0 · **Date:** 2026-07-10 · **Owner:** Site owner · **Author:** Tracking Architect (Claude)

## What this is
The complete, handoff-ready measurement architecture for gymlocator.in. Any coding
agent (Claude Code, Cursor, etc.) should be able to implement tracking from these
documents alone, without asking the owner design questions.

## Document map
| Doc | Purpose | Audience |
|---|---|---|
| `01-measurement-plan.md` | Objectives → KPIs → funnels → events | Owner + agents |
| `02-event-taxonomy.md` | **Frozen** event catalog: names, triggers, params | All agents (canonical) |
| `03-datalayer-spec.md` | Exact `dataLayer.push` object shapes | Coding agents |
| `04-gtm-blueprint.md` | GTM tags, triggers, variables, naming, workspaces | Whoever configures GTM |
| `05-ga4-config.md` | GA4 property setup, key events, custom dimensions | Whoever configures GA4 |
| `06-consent-privacy.md` | Consent Mode v2 design (DEFERRED, pre-designed) | Future |
| `07-nextjs-integration.md` | Where code goes in the Next.js 16 App Router app | Coding agents |
| `08-qa-plan.md` | Per-event validation checklist, debug workflow | Owner + agents |
| `09-rollout-tickets.md` | Phased ticket list with acceptance criteria | Coding agents |

## Stack (authoritative — overrides older docs)
- Next.js **16** (App Router) · React **19** · TypeScript strict
- Hosting: **Netlify** (production + deploy previews)
- Supabase (Postgres), Contentful (blog)
- GTM-first: **all vendor tags live in GTM**; site code only pushes to `dataLayer`
- Live URL: `https://gymlocator.in` · No staging URL yet

## Frozen decisions (do not re-litigate in tickets)
1. **GTM-first architecture.** Site never loads gtag.js directly. One GTM container.
2. **Hybrid instrumentation (Path C).** Server-rendered CTAs get `data-gtm-*`
   attributes read by GTM click triggers. Interactive client components
   (search, forms, calculator) push custom events to `dataLayer` directly.
3. **Event names are frozen in `02-event-taxonomy.md`.** New events require a
   taxonomy version bump, never ad-hoc names.
4. **No PII in dataLayer or GA4, ever.** No phone numbers, emails, names, or
   form field *values*. Field *names* only.
5. **`form_success` (server-confirmed) is the conversion — never `form_submit`.**
6. **page_view is fired manually from code on every App Router route change.**
   GA4 config tag has `send_page_view` disabled. GTM History Change trigger is NOT used.
7. **Production hostname guard.** GTM loads only when
   `NEXT_PUBLIC_GTM_ID` is set (Netlify production context only), and GA4 tags
   additionally check `hostname == gymlocator.in`. Deploy previews stay clean.
8. Consent banner / Consent Mode v2: **deferred** but the injection code ships
   with a commented consent-default stub so retrofit is a config change.

## ASSUMPTIONS pending owner confirmation
Search the docs for the string `ASSUMPTION:` — there are three:
- **A1:** `call_click` and `whatsapp_click` are tracked AND marked GA4 key events,
  even though the owner's final ranking omitted them. Rationale: owner's #1
  decision is "does SEO traffic contact gyms," unanswerable without them.
- **A2:** Field-level form tracking = `form_field_complete` fired on **blur with
  non-empty value**, carrying field name only. No per-field timing in v1.
- **A3:** `select_content` (gym card clicks) is included in v1 to measure the
  list→detail funnel step.

If the owner overrides any assumption, update `02-event-taxonomy.md`, bump its
version, and adjust affected tickets in `09-rollout-tickets.md`.

## Versioning convention
Docs carry a version header. Breaking changes to event names/params = minor bump
of the taxonomy (1.0 → 1.1) + changelog entry at bottom of that doc. GTM uses
workspace-per-change with version notes referencing the ticket ID (see doc 04).
