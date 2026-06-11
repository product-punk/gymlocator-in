'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import CountUpNumber from './CountUpNumber'

export default function AccentMarquee() {
  // Same SSR-visible / remount-to-animate pattern as HeroSection: the bar is
  // fully rendered for crawlers and no-JS, then fades in last (1.4s) with
  // counters running once it enters the viewport. Viewport detection uses
  // whileInView/onViewportEnter (not useInView) so it re-binds when the
  // key flip remounts the element.
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const reduceMotion = useReducedMotion()
  useEffect(() => setMounted(true), [])
  const animated = mounted && !reduceMotion
  const play = animated && inView

  return (
    <motion.section
      key={animated ? 'animated' : 'static'}
      className="silver-section silver-elite bb-hair bt-hair"
      initial={animated ? { opacity: 0 } : false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={() => setInView(true)}
      transition={{ delay: 1.4, duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-10 py-4 overflow-x-auto scrollbar-none flex items-center gap-x-8 gap-y-0 text-[12px] font-bold uppercase tracking-[0.14em] font-mono whitespace-nowrap">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-base" />
          Live across India
        </span>
        <span className="opacity-25">---</span>
        <span>
          <CountUpNumber value={1626} suffix="+" play={play} delay={1.4} className="text-[15px] font-bold mr-1" />
          gyms listed
        </span>
        <span className="opacity-25">---</span>
        <span>
          <CountUpNumber value={11} play={play} delay={1.4} className="text-[15px] font-bold mr-1" />
          cities
        </span>
        <span className="opacity-25">---</span>
        <span>
          <CountUpNumber value={113} suffix="+" play={play} delay={1.4} className="text-[15px] font-bold mr-1" />
          localities
        </span>
        <span className="opacity-25">---</span>
        <span>
          <strong className="text-[15px] mr-1">24/7</strong> open access
        </span>
      </div>
    </motion.section>
  )
}
