'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { track, trackPageMeta } from '@/lib/analytics/track'
import { getPageMeta } from '@/lib/analytics/route-meta'

// Manual page_view + page_meta emitter. GA4 enhanced page_view and GTM History
// triggers are intentionally NOT used (CLAUDE.md tracking rule 5) — this is the
// single source of route-change events. On every pathname change it pushes, in
// order: (1) page_meta context, then (2) page_view.

function AnalyticsListenerInner() {
  const pathname = usePathname()
  // Subscribed to so soft/SPA navigations that only change the query string
  // still re-run the effect, but query changes must NOT re-fire page_view
  // (rule 5) — so searchParams is deliberately excluded from the deps below.
  useSearchParams()

  useEffect(() => {
    // 1. page_meta — nested context object (goes through trackPageMeta so the
    //    flat TrackParams typing on track() stays honest; no `any`).
    trackPageMeta(getPageMeta(pathname))

    // 2. page_view — read title/location after paint so document.title reflects
    //    the newly-rendered route's metadata.
    track('page_view', {
      page_location: window.location.href,
      page_title: document.title,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}

export default function AnalyticsListener() {
  // useSearchParams must be inside a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <AnalyticsListenerInner />
    </Suspense>
  )
}
