# 08 · QA & Debug Plan
**Version:** 1.0 · 2026-07-10

## Toolchain & workflow
1. **GTM Preview (Tag Assistant):** connect to production URL (or local dev with
   the env var temporarily set). Verify: which tags fired, on which trigger,
   with which variable values. This is where 90% of debugging happens.
2. **GA4 DebugView:** Admin → DebugView. Traffic from GTM Preview is auto-tagged
   as debug. Verify events arrive with correct params AND that custom dimensions
   show values (params appear even unregistered; dimensions need registration).
3. **Console check:** `window.dataLayer` inspect — confirm push order
   (page_meta before page_view) and shapes match doc 03.
4. **Realtime report:** final smoke test post-publish.

Order of operations per ticket: dataLayer console → GTM Preview → DebugView →
mark ticket AC met.

## Per-event validation checklist

### PV — page_view
- [ ] PV-1 Hard load on `/` fires exactly ONE page_view (no double from Enhanced Measurement)
- [ ] PV-2 Client-side nav home → city → gym detail fires one page_view each
- [ ] PV-3 `page_title` matches the NEW page's title after soft nav (not stale)
- [ ] PV-4 Changing sort on a city page (`?sort=`) fires ZERO page_view
- [ ] PV-5 `page_meta` values correct on: home, city, locality, amenity
  (`/gyms/bangalore/crossfit` → page_type=amenity, amenity=crossfit,
  locality=null), gym_detail, blog post vs blog category, author
- [ ] PV-6 Back/forward browser buttons each fire one page_view

### CTA — call/whatsapp/directions/contact
- [ ] CTA-1 Clicking the ICON inside the anchor still fires (closest() works)
- [ ] CTA-2 All gym params populated (slug, name, price_range, gender, is_247)
- [ ] CTA-3 Phone number/email NEVER appears in any param (inspect full hit)
- [ ] CTA-4 Gym with no whatsapp renders no wa.me link and no phantom events
- [ ] CTA-5 contact_click carries correct contact_type per card

### FORM — list your gym
- [ ] F-1 form_start fires once, on first focus only (tab through — still once)
- [ ] F-2 form_field_complete: blur with value fires; blur empty does NOT;
  same field re-blur does not re-fire
- [ ] F-3 field_name values match schema keys exactly
- [ ] F-4 NO field VALUE in any param (hard PII check — inspect network hit payload)
- [ ] F-5 form_submit carries correct fields_completed count
- [ ] F-6 form_success only after 2xx; form_error on forced API failure
  (test by temporarily breaking the endpoint or offline mode → error_type=network)

### SRCH — search
- [ ] S-1 Submit fires `search` with lowercased trimmed term, then navigates
- [ ] S-2 Suggestion click fires E12 with correct type/slug, and does NOT also fire `search`
- [ ] S-3 Zero-results: type gibberish → exactly one search_zero_results after
  debounce; continuing to type the same term doesn't re-fire; page_view NOT fired
- [ ] S-4 Two-letter minimum respected (1 char fires nothing)

### CALC — protein calculator
- [ ] C-1 calculator_start on first chip tap OR first input, once
- [ ] C-2 complete fires only on successful result render; verdict is snake_case
- [ ] C-3 NO weight/height/age/gender in any hit (PII-adjacent check)
- [ ] C-4 Results CTA click fires calculator_cta_click via GTM

### CARD — select_content
- [ ] SC-1 Image click, title click, and "View gym" click all fire once each
  (not twice per click)
- [ ] SC-2 item_id + list_position correct for 1st and 5th cards

### ENV — environment guards
- [ ] E-1 Netlify deploy preview: view source → NO GTM snippet present
- [ ] E-2 GTM Preview on prod: GA4 Config exception blocks nothing on gymlocator.in
- [ ] E-3 localhost with env var set: GTM loads (dev convenience) but hostname
  exception blocks GA4 tags → confirm no localhost hits in DebugView unless
  deliberately testing (document the override: temporarily remove exception in
  a workspace, never publish it)

## Regression rule
Any PR touching SearchBar, ListGymForm, ProteinCalculator, GymCard, gym detail
page, or layout.tsx must re-run the affected checklist section. Add this note
to CLAUDE.md (done — see Tracking section).

## Known failure modes to watch (from field experience)
- **Double page_view:** Enhanced Measurement history events + manual push.
  Symptom: engagement rate craters. Fix: verify send_page_view false + PV-1/PV-2.
- **Stale page_meta:** event tag reads previous page's city. Symptom: gym CTA
  events attributed to wrong city. DLV v2 persists until overwritten — push
  order (meta before view) is the guarantee; verify PV-5 after soft navs.
- **Trigger fires on child element with no closest():** CTA-1 covers it.
- **DebugView shows params but reports show (not set):** dimensions registered
  late or name typo'd. Fix in doc 05 registration table.
