# 05 · GA4 Configuration Spec
**Version:** 1.0 · 2026-07-10 · Property: to be created

## Property setup (one-time, owner does this in UI)
1. Account: `Gymlocator` (owner's Google account). Property: `gymlocator.in`,
   timezone `(GMT+05:30) India`, currency INR, industry Health & Fitness.
2. Web data stream: `https://gymlocator.in`, stream name `Web - Production`.
   Copy the `G-XXXXXXXXXX` Measurement ID into GTM `Const - GA4 Measurement ID`
   and record it in this doc.
3. **Enhanced Measurement: turn OFF "Page views" auto-collection is not
   separable — instead leave Enhanced Measurement ON but rely on
   send_page_view:false in the Google tag** (page views from history changes
   are suppressed by that flag). Turn OFF: Scrolls, Site search, Video, File
   downloads. Leave Outbound clicks ON (free signal, no conflict).
   *Why:* our manual page_view is the single source of truth; Enhanced
   Measurement's history-based page_view would double count.
4. Data retention: Event data retention → **14 months** (default is 2).
5. Google Signals: leave OFF for now (consent posture deferred).
6. Link Google Search Console (domain-level property) under Admin → Product links.

## Key events (mark in Admin → Events after first data arrives)
`form_success`, `contact_click`, `directions_click`, `call_click`,
`whatsapp_click`, `calculator_complete`, `search`.
Review at day 60: consider demoting `search` (diagnostic, not a conversion).

## Custom dimensions (Admin → Custom definitions) — all EVENT scoped
| Dimension name | Event parameter | Used by |
|---|---|---|
| Page Type | `page_type` | all events |
| City | `city` | all events |
| Locality | `locality` | all events |
| Amenity | `amenity` | list pages |
| Gym Slug | `gym_slug` | detail + CTAs |
| Gym Name | `gym_name` | CTAs |
| Price Range | `price_range` | CTAs |
| Gender Policy | `gender` | CTAs |
| Is 24x7 | `is_247` | CTAs |
| Contact Type | `contact_type` | contact_click |
| Form ID | `form_id` | form events |
| Field Name | `field_name` | form_field_complete |
| Error Type | `error_type` | form_error |
| Suggestion Type | `suggestion_type` | search |
| Suggestion Slug | `suggestion_slug` | search |
| Calculator Verdict | `verdict` | calculator_complete |
| Sort Value | `sort_value` | sort_change |
| List Position | `list_position` | select_content |
| Search Source | `search_source` | search |

19 of 50 event-scoped slots used. `search_term` needs NO custom dimension —
GA4 exposes it natively when the `search` event carries it.
**Register these within 24h of first data** — GA4 does not backfill dimension
values for events received before registration.

## Custom metrics
None in v1. `fields_completed` stays a param (inspect in BigQuery/DebugView if
ever needed; not worth a metric slot).

## Internal traffic exclusion — DEFINED, NOT ACTIVATED (owner said "not now")
Pre-built for one-click activation later:
1. Admin → Data streams → Configure tag settings → Define internal traffic:
   rule `internal`, IP equals owner's IP (fill in later).
2. Admin → Data filters: `Internal Traffic` filter exists in **Testing** mode
   from day one (Testing mode labels but doesn't drop — you can see the impact
   before activating). Flip to Active when the owner is ready.
*Why Testing-first:* filters are destructive and irreversible for dropped data;
Testing mode is the free trial.

## Unwanted referrals / cross-domain
None. wa.me / maps.google.com are outbound destinations, not referrers into the
site. No config needed.

## Reporting starters (build after 2 weeks of data)
- Exploration: Funnel A (open funnel): page_view(gym_detail) → any of
  call/whatsapp/directions, broken down by City then Locality.
- Exploration: form field drop-off — form_field_complete count by Field Name vs
  form_start.
- Free-form: search_zero_results terms, monthly.
Deferred per owner: Looker Studio dashboard.
