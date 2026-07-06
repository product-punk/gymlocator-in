'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FACET_LABELS } from '@/lib/facets'

export type NavCity = {
  name: string
  slug: string
  gymCount: number
  localities: { name: string; slug: string }[]
}

const NAV_LINKS = [
  { label: 'Protein Calculator', href: '/calculators/protein' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

// facet × city pairs shown in the mega menu footer strip
const POPULAR_FACETS: [string, string][] = [
  ['budget', 'mumbai'],
  ['women', 'delhi'],
  ['premium', 'bangalore'],
  ['with-swimming-pool', 'mumbai'],
  ['with-personal-trainer', 'pune'],
  ['with-steam-sauna', 'hyderabad'],
]

function cityName(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

export default function Navbar({ cities }: { cities: NavCity[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileCitiesOpen, setMobileCitiesOpen] = useState(false)

  const closeAll = () => {
    setMenuOpen(false)
    setMegaOpen(false)
    setMobileCitiesOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur bb-hair">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" onClick={closeAll}>
          <Image
            src="/logo.png"
            alt="Gymlocator.in"
            width={160}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9 h-full">
          {/* Mega menu trigger — links to /cities, panel opens on hover/focus */}
          <div
            className="h-full flex items-center"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Link
              href="/cities"
              className="ghost text-[14px] text-accent inline-flex items-center gap-1.5"
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onFocus={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(false)}
            >
              Find Gyms
              <i
                className={`ti ti-chevron-down text-[14px] transition-transform duration-150 ${megaOpen ? 'rotate-180' : ''}`}
              />
            </Link>

            {/* Mega panel — always in the DOM for crawlers, CSS-toggled */}
            <div
              className={`absolute left-0 right-0 top-16 bg-surface bb-hair shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all duration-150 ${
                megaOpen
                  ? 'opacity-100 translate-y-0 visible'
                  : 'opacity-0 -translate-y-1 invisible pointer-events-none'
              }`}
            >
              <div className="mx-auto max-w-[1280px] px-5 md:px-10 py-8">
                <div className="grid grid-cols-4 gap-x-8 gap-y-8">
                  {cities.map(city => (
                    <div key={city.slug}>
                      <Link
                        href={`/gyms/${city.slug}`}
                        onClick={closeAll}
                        className="text-[12px] font-bold uppercase tracking-[0.08em] text-text hover:text-white transition-colors"
                      >
                        {city.name}
                      </Link>
                      <div className="flex flex-col gap-2 mt-3">
                        {city.localities.map(loc => (
                          <Link
                            key={loc.slug}
                            href={`/gyms/${city.slug}/${loc.slug}`}
                            onClick={closeAll}
                            className="ghost text-[13px] text-accent"
                          >
                            {loc.name}
                          </Link>
                        ))}
                        <Link
                          href={`/gyms/${city.slug}`}
                          onClick={closeAll}
                          className="text-[13px] text-text-muted hover:text-text transition-colors inline-flex items-center gap-1"
                        >
                          All {city.name} gyms
                          <i className="ti ti-arrow-right text-[12px]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Popular facets strip */}
                <div className="bt-hair mt-8 pt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                    Popular
                  </span>
                  {POPULAR_FACETS.map(([facet, city]) => (
                    <Link
                      key={`${facet}-${city}`}
                      href={`/gyms/${city}/${facet}`}
                      onClick={closeAll}
                      className="ghost text-[13px] text-accent"
                    >
                      {FACET_LABELS[facet]} in {cityName(city)}
                    </Link>
                  ))}
                  <Link
                    href="/cities"
                    onClick={closeAll}
                    className="text-[13px] text-text-muted hover:text-text transition-colors inline-flex items-center gap-1 ml-auto"
                  >
                    All cities
                    <i className="ti ti-arrow-right text-[12px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="ghost text-[14px] text-accent">
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search gyms"
            className="ghost text-accent p-1 hidden md:inline-flex"
          >
            <i className="ti ti-search text-[19px]" />
          </Link>

          <Link
            href="/list-your-gym"
            className="bg-accent text-base font-bold text-[13px] px-4 py-2.5 rounded-sm hover:bg-text transition-colors inline-flex items-center gap-2"
          >
            <i className="ti ti-plus text-[15px]" />
            List your gym
          </Link>

          {/* Hamburger - mobile only */}
          <button
            className="md:hidden ghost text-accent p-1 -mr-1"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'} text-[22px]`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-surface bb-hair max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="mx-auto max-w-[1280px] px-5 py-4 flex flex-col gap-0">
            {/* Cities accordion */}
            <button
              className="ghost text-[15px] text-accent py-3 flex items-center justify-between"
              onClick={() => setMobileCitiesOpen(prev => !prev)}
              aria-expanded={mobileCitiesOpen}
            >
              Find Gyms
              <i
                className={`ti ti-chevron-down text-[16px] transition-transform duration-150 ${mobileCitiesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileCitiesOpen && (
              <div className="pb-2 pl-4 flex flex-col gap-0">
                {cities.map(city => (
                  <Link
                    key={city.slug}
                    href={`/gyms/${city.slug}`}
                    className="ghost text-[14px] text-accent py-2.5"
                    onClick={closeAll}
                  >
                    Gyms in {city.name}
                  </Link>
                ))}
                <Link
                  href="/cities"
                  className="text-[14px] text-text-muted py-2.5 inline-flex items-center gap-1"
                  onClick={closeAll}
                >
                  All cities
                  <i className="ti ti-arrow-right text-[12px]" />
                </Link>
              </div>
            )}

            {[...NAV_LINKS,
              { label: 'Contact Us', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="ghost text-[15px] text-accent py-3 bt-hair"
                onClick={closeAll}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
