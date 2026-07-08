'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SearchBar from './SearchBar'
import HeroParticles from './HeroParticles'
import BeamsBackground from './BeamsBackground'

const POPULAR_CITIES = [
  { name: 'Bangalore', slug: 'bangalore' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Pune', slug: 'pune' },
  { name: 'Hyderabad', slug: 'hyderabad' },
  { name: 'Chennai', slug: 'chennai' },
]

const HEADLINE = 'Find the best gyms in your city.'
const HEADLINE_WORDS = HEADLINE.split(' ')

export default function HeroSection() {
  // SSR and the hydration pass render everything visible (initial: false) so
  // the H1 paints immediately and LCP never waits on JS. After mount the key
  // flips, remounting the content tree with hidden initial states so the
  // entrance sequence plays. Reduced motion keeps the static tree forever.
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()
  useEffect(() => setMounted(true), [])
  const animated = mounted && !reduceMotion

  const enter = (from: { x?: number; y?: number }) =>
    animated ? { opacity: 0, ...from } : false

  return (
    <section className="bb-hair relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Beams 3D background */}
      <BeamsBackground />
      {animated && <HeroParticles />}

      <AnimatePresence>
        <div
          key={animated ? 'animated' : 'static'}
          className="relative max-w-[1280px] w-full mx-auto px-5 md:px-10 py-20 md:py-28"
        >
          {/* Eyebrow */}
          <motion.div
            className="label flex items-center gap-2"
            initial={enter({ y: 16 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          >
            <motion.span
              className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
              animate={animated ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : undefined}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            India&apos;s gym discovery platform
          </motion.div>

          {/* H1 - word-by-word stagger */}
          <h1 className="h1 text-text max-w-[920px] mt-6" aria-label={HEADLINE}>
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block whitespace-pre"
                initial={enter({ y: 12 })}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.45, ease: 'easeOut' }}
              >
                {word}
                {i < HEADLINE_WORDS.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            className="max-w-[620px] text-[16px] leading-relaxed text-accent mt-6"
            initial={enter({ y: 10 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          >
            Discover, compare and connect with top fitness centers across India.
            Filter by amenity, price tier, locality and timing - no signup needed.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="mt-10"
            initial={enter({ y: 20 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease: 'easeOut' }}
          >
            <SearchBar />
          </motion.div>

          {/* Quick city chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[13px] text-accent">
            <motion.span
              className="label !text-accent mr-2"
              initial={enter({ x: -8 })}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.4, ease: 'easeOut' }}
            >
              Popular
            </motion.span>
            {POPULAR_CITIES.map((city, i) => (
              <motion.span
                key={city.slug}
                className="inline-block"
                initial={enter({ x: -8 })}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                whileHover={animated ? { scale: 1.05 } : undefined}
              >
                <Link
                  href={`/gyms/${city.slug}`}
                  className="inline-block px-3.5 py-1.5 rounded-full border-[0.5px] border-border bg-surface text-[13px] text-accent hover:text-text hover:border-accent transition-colors"
                >
                  {city.name}
                </Link>
              </motion.span>
            ))}
          </div>
        </div>
      </AnimatePresence>
    </section>
  )
}
