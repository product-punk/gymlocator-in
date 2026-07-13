# 04 · GTM Container Blueprint
**Version:** 1.0 · 2026-07-10 · Container: to be created (web), name `gymlocator.in`

## Naming conventions
- Tags: `GA4 - Config` · `GA4 - Event - {event_name}`
- Triggers: `CE - {event_name}` (custom event) · `Click - {event_name}` (click) · `Init - Consent` (future)
- Variables: `DLV - {key}` (data layer) · `CJS - {name}` (custom JS) · `Const - {name}`
- Folders: `01 Core` · `02 Contact CTAs` · `03 Forms` · `04 Search` · `05 Calculator` · `06 Content` · `99 Utilities`

## Workspace & versioning strategy
- One change-set = one workspace, named after the ticket: `T-05 contact CTAs`.
- Publish notes must reference the ticket ID and taxonomy version.
- Never edit Default Workspace directly. Owner is sole publisher for now.

## Variables

### Built-in to enable
Click Element, Click URL, Click Text, Page Hostname, Page Path, Page URL, Event.

### Data Layer Variables (Version 2)
| Name | DL key |
|---|---|
| `DLV - page_meta.page_type` | `page_meta.page_type` |
| `DLV - page_meta.city` | `page_meta.city` |
| `DLV - page_meta.locality` | `page_meta.locality` |
| `DLV - page_meta.amenity` | `page_meta.amenity` |
| `DLV - page_meta.gym_slug` | `page_meta.gym_slug` |
| `DLV - search_term` | `search_term` |
| `DLV - search_source` | `search_source` |
| `DLV - suggestion_type` | `suggestion_type` |
| `DLV - suggestion_slug` | `suggestion_slug` |
| `DLV - form_id` | `form_id` |
| `DLV - field_name` | `field_name` |
| `DLV - fields_completed` | `fields_completed` |
| `DLV - error_type` | `error_type` |
| `DLV - form_city` | `city` (form_success only; event-level key) |
| `DLV - calculator_id` | `calculator_id` |
| `DLV - verdict` | `verdict` |
| `DLV - sort_value` | `sort_value` |
| `DLV - page_location` | `page_location` |

### Custom JS variables (read data-gtm-* from clicked element)
One reusable pattern; create per attribute:
```js
// CJS - gtm_attr_gym_slug   (repeat for each attribute, changing the name)
function() {
  var el = {{Click Element}};
  if (!el || !el.closest) return undefined;
  var host = el.closest('[data-gtm-event]');
  return host ? host.getAttribute('data-gtm-gym-slug') : undefined;
}
```
Create: `CJS - gtm_attr_event`, `- gym_slug`, `- gym_name`, `- price_range`,
`- gender`, `- is_247`, `- contact_type`, `- content_type`, `- item_id`,
`- list_position`, `- calculator_id`, `- cta_destination`.

### Constants
- `Const - GA4 Measurement ID` = `G-XXXXXXXXXX` (fill after GA4 creation)
- `Const - Production Hostname` = `gymlocator.in`

## Triggers

### Custom Event triggers (code-pushed)
`CE - page_view`, `CE - form_start`, `CE - form_field_complete`,
`CE - form_submit`, `CE - form_success`, `CE - form_error`, `CE - search`,
`CE - search_suggestion_click`, `CE - search_zero_results`,
`CE - calculator_start`, `CE - calculator_submit`, `CE - calculator_complete`,
`CE - sort_change`.
Each: Trigger type Custom Event, event name exact match.

### Click triggers (attribute-driven)
Type: Click - All Elements, fire on Some Clicks, condition
`CJS - gtm_attr_event` **equals** `{event_name}`:
`Click - call_click`, `Click - whatsapp_click`, `Click - directions_click`,
`Click - contact_click`, `Click - select_content`, `Click - calculator_cta_click`.

Why CJS-based matching instead of CSS selector matching: clicks land on child
elements (`<i>` icons, `<div>`s inside cards); `closest()` in the variable
resolves the intended host uniformly, and the same variable then feeds params.

### Blocking trigger (preview-deploy guard)
`Exception - Non-production hostname`: Page Hostname **does not equal**
`gymlocator.in`. Attach as an exception to the GA4 Config tag. Belt-and-braces:
code-level guard (doc 07) means GTM shouldn't even load off-production, but
this protects against the env var leaking into a preview context.

## Tags

### `GA4 - Config` (Google tag)
- Measurement ID: `Const - GA4 Measurement ID`
- **send_page_view: false** (critical — code fires page_view manually)
- Trigger: Initialization - All Pages. Exception: Non-production hostname.

### `GA4 - Event - page_view`
- Event name `page_view`; params: `page_location` = `DLV - page_location`
  (page_title is auto-collected). Plus the 5 page_meta params (see shared table).
- Trigger: `CE - page_view`.

### Shared page_meta params — attach to EVERY GA4 event tag
| Param | Value |
|---|---|
| `page_type` | `DLV - page_meta.page_type` |
| `city` | `DLV - page_meta.city` |
| `locality` | `DLV - page_meta.locality` |
| `amenity` | `DLV - page_meta.amenity` |
| `gym_slug` | `DLV - page_meta.gym_slug` |

(GTM has no "global params" feature on event tags; either repeat on each tag or
use a single Google Tag with event settings variable — **use a Google Tag Event
Settings variable** `GTES - page_meta` containing the 5 rows, referenced by all
event tags. One place to maintain.)

### Event tags (all reference `GTES - page_meta` + their own params)
| Tag | Trigger | Own params |
|---|---|---|
| `GA4 - Event - call_click` | Click - call_click | gym_slug*, gym_name, price_range, gender, is_247 (from CJS vars) |
| `GA4 - Event - whatsapp_click` | Click - whatsapp_click | same as above |
| `GA4 - Event - directions_click` | Click - directions_click | same |
| `GA4 - Event - contact_click` | Click - contact_click | contact_type |
| `GA4 - Event - select_content` | Click - select_content | content_type, item_id, list_position |
| `GA4 - Event - calculator_cta_click` | Click - calculator_cta_click | calculator_id, cta_destination |
| `GA4 - Event - form_start` | CE | form_id |
| `GA4 - Event - form_field_complete` | CE | form_id, field_name |
| `GA4 - Event - form_submit` | CE | form_id, fields_completed |
| `GA4 - Event - form_success` | CE | form_id, city → `DLV - form_city` |
| `GA4 - Event - form_error` | CE | form_id, error_type |
| `GA4 - Event - search` | CE | search_term, search_source |
| `GA4 - Event - search_suggestion_click` | CE | search_term, suggestion_type, suggestion_slug |
| `GA4 - Event - search_zero_results` | CE | search_term |
| `GA4 - Event - calculator_start/submit/complete` | CE each | calculator_id (+ verdict on complete) |
| `GA4 - Event - sort_change` | CE | sort_value |

*On CTA tags, `gym_slug` from the CJS attribute overrides the page_meta value —
they should be identical on gym_detail; the CJS one wins deliberately so card
CTAs (future) attribute to the clicked gym, not the page.

## What GTM native triggers replaced vs required code (decision record)
| Element | Chosen mechanism | Why |
|---|---|---|
| tel:/wa.me/maps CTAs | GTM click + data attributes | Static server DOM; zero hydration cost; rich params via attributes |
| mailto on /contact | GTM click + data attributes | Same |
| Gym cards | GTM click + data attributes | Same |
| Search (all 3) | Code push | Meaning lives in React state (debounce settled, zero results, suggestion identity) |
| Form lifecycle | Code push | API success is invisible to the DOM reliably; blur semantics cleaner in code |
| Calculator | Code push | Result render is a state change |
| SPA page_view | Code push | GTM History Change trigger is unreliable with App Router soft navigation and double-fires with parallel routes; manual = deterministic |
