import type { PageMeta } from './route-meta'

// The ONLY place dataLayer is written to. Every component pushes through here so
// the null-guard, typing, and (future) consent gating live in one spot.
// See docs/tracking/03-datalayer-spec.md.

type Primitive = string | number | boolean | null
export type TrackParams = Record<string, Primitive>

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** Push a flat custom event. Event names/params come from doc 02 ONLY. */
export function track(event: string, params: TrackParams = {}): void {
  if (typeof window === 'undefined') return
  ;(window.dataLayer = window.dataLayer || []).push({ event, ...params })
}

/**
 * Push the nested page_meta context object. Kept separate from `track` so the
 * flat `TrackParams` typing stays honest (doc 07 §2). Fired by AnalyticsListener
 * immediately before page_view on every route change.
 */
export function trackPageMeta(meta: PageMeta): void {
  if (typeof window === 'undefined') return
  ;(window.dataLayer = window.dataLayer || []).push({
    event: 'page_meta',
    page_meta: meta,
  })
}
