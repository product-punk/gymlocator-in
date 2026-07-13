# 02 · Event Taxonomy & Naming Convention
**Version:** 1.0 · 2026-07-10 · Status: FROZEN — changes require version bump + changelog

## Naming rules
1. GA4 standard names where a true semantic match exists (`search`, `select_content`).
2. Otherwise `object_action` snake_case: `call_click`, `form_success`.
3. All lowercase. No spaces, camelCase, or hyphens in event names or param keys.
4. Param values: slugs stay slugs (`andheri-west`), never Title Case.
5. **Deviation from GA4 standards, justified:** contact CTAs get named events
   (`call_click`) instead of overloading `select_content` + `content_type`.
   Named events keep reports readable and key-event marking trivial. Also,
   `generate_lead` is NOT used in v1; if Google Ads ever runs, `form_success`
   gets a GA4 "create event" alias to `generate_lead` (config, not code).

## Global context: `page_meta`
Every dataLayer event is preceded (same page) by a `page_meta` push (doc 03).
GTM attaches these params to ALL GA4 event tags:

| Param | Type | Values / example | Source |
|---|---|---|---|
| `page_type` | string | `home · city · locality · amenity · gym_detail · search · blog_hub · blog_post · blog_category · blog_author · calculator · list_gym · contact · about · privacy · cities` | route matcher |
| `city` | string\|null | `mumbai` | URL segment |
| `locality` | string\|null | `andheri-west` | URL segment (null on amenity pages) |
| `amenity` | string\|null | `crossfit` | URL segment when slug ∈ AMENITIES |
| `gym_slug` | string\|null | `golds-gym-andheri-west-mumbai` | URL segment |

## Event catalog

### E01 `page_view`
- **Fires:** every route render, including SPA client-side navigations. Manual push from code; GA4 auto page_view disabled.
- **Pages:** all.
- **Params:** `page_location`, `page_title` + global page_meta.
- **Key event:** no.

### E02 `call_click` — ASSUMPTION A1 (key event)
- **Fires:** click on any `a[href^="tel:"]` carrying `data-gtm-event="call_click"`.
- **Pages:** gym_detail (sticky CTA card). Gym cards have no tel: link in v1 — if added later, same attributes apply.
- **Mechanism:** GTM click trigger + data attributes (no client JS).
- **Params:** `gym_slug` (string), `gym_name` (string), `price_range` (`budget|mid|premium`), `gender` (`mixed|women-only|men-only`), `is_247` (`"true"|"false"` string), + page_meta.
- **Never send:** the phone number itself.
- **Key event:** YES.

### E03 `whatsapp_click` — ASSUMPTION A1 (key event)
- **Fires:** click on `a[href^="https://wa.me/"]` with `data-gtm-event="whatsapp_click"`.
- **Pages:** gym_detail. Params + mechanism identical to E02. **Key event:** YES.

### E04 `directions_click` (key event)
- **Fires:** click on Google Maps directions `<a>` with `data-gtm-event="directions_click"`.
- **Pages:** gym_detail. Params + mechanism identical to E02. **Key event:** YES.

### E05 `contact_click` (key event)
- **Fires:** click on any `a[href^="mailto:"]` with `data-gtm-event="contact_click"`.
- **Pages:** contact (3 mailto cards), footer if mailto exists.
- **Params:** `contact_type` (`general|corrections|partnerships`), + page_meta.
- **Never send:** the email address value (it's the site's own, but keep the rule uniform).
- **Key event:** YES.

### E06 `form_start`
- **Fires:** first `focus` on any List Your Gym field, once per page load.
- **Mechanism:** code push (client component). **Params:** `form_id: "list_gym"`.

### E07 `form_field_complete` — ASSUMPTION A2
- **Fires:** field `blur` with non-empty value; once per field per page load (re-fires allowed only if field was emptied then refilled — implementation: fire once per field, simplest).
- **Params:** `form_id: "list_gym"`, `field_name` (`gym_name|owner_name|phone|email|city|locality|address|website|message`).
- **NEVER the field value.** This is the PII line — hard rule.

### E08 `form_submit`
- **Fires:** submit handler entered (client validation passed), before fetch.
- **Params:** `form_id: "list_gym"`, `fields_completed` (int, count of non-empty fields).

### E09 `form_success` (THE supply conversion, key event)
- **Fires:** `/api/list-gym` responds 2xx and success state renders.
- **Params:** `form_id: "list_gym"`, `city` (the SELECTED city from the form, lowercased slug — overrides page_meta city, which is null on /list-your-gym).
- **Key event:** YES.

### E10 `form_error`
- **Fires:** API non-2xx or fetch throw. **Params:** `form_id`, `error_type` (`api|network`). Not a key event; it's the health metric.

### E11 `search` (key event per owner ranking)
- **Fires:** search form submitted → navigation to `/search?q=`.
- **Params:** `search_term` (lowercased, trimmed), `search_source` (`hero|navbar` — v1 only `hero`).
- **Key event:** YES (owner ranked it; recommend demoting to non-key after 60 days once its diagnostic value is established — flag in review).

### E12 `search_suggestion_click`
- **Fires:** autocomplete item clicked.
- **Params:** `search_term` (query at time of click), `suggestion_type` (`gym|city|locality`), `suggestion_slug` (the target slug).

### E13 `search_zero_results`
- **Fires:** empty-state ("No results for …") renders after debounce completes.
- **Params:** `search_term`. Fire once per unique term per page load (guard against per-keystroke spam: only fire when loading finishes AND term length ≥ 2 AND term differs from last-fired term).

### E14 `calculator_start`
- **Fires:** first interaction (any input change or chip toggle) on protein calculator, once per page load. **Params:** `calculator_id: "protein"`.

### E15 `calculator_submit`
- **Fires:** calculator form submitted (before fetch). **Params:** `calculator_id`.

### E16 `calculator_complete` (key event)
- **Fires:** result object successfully rendered.
- **Params:** `calculator_id: "protein"`, `verdict` (the verdict string, lowercased snake, e.g. `on_track`), **NOT** weight/height/age/gender — health data is PII-adjacent; never send it.
- **Key event:** YES.

### E17 `calculator_cta_click`
- **Fires:** "Browse gyms by city" click on results screen.
- **Params:** `calculator_id`, `cta_destination: "/cities"`. Mechanism: data attributes + GTM click trigger.

### E18 `select_content` — ASSUMPTION A3
- **Fires:** gym card click (image, title, or "View gym" button) on city/locality/amenity/search pages.
- **Params (GA4 standard):** `content_type: "gym_card"`, `item_id` (gym slug), + `city`, `locality` from page_meta, `list_position` (int, 1-based index in the rendered list).
- **Mechanism:** data attributes on the card's `<Link>` elements + GTM click trigger.

### E19 `filter_apply`
- **Fires:** any filter changes URL params on list pages.
- **Params:** `filter_type` (`price|gender|ac|amenity`), `filter_value` (slug/string). v1 site only has sort — this event is RESERVED until filters ship.

### E20 `sort_change`
- **Fires:** sort select changed in GymFilters. **Params:** `sort_value` (`rating|reviews|price_asc|price_desc`). Code push (component is already client).

### RESERVED (do not implement, do not rename when implementing later)
- `blog_cta_click` — params: `cta_destination`, `blog_slug`.
- `outbound_click` — generic external link tracking.
- `generate_lead` — alias of form_success, GA4-config-side only, if Ads launches.

## Key events summary (GA4 marking list)
`form_success`, `contact_click`, `directions_click`, `call_click` (A1),
`whatsapp_click` (A1), `calculator_complete`, `search`.

## Changelog
- 1.0 (2026-07-10): initial frozen catalog.
