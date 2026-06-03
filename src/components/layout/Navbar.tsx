'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Cities', href: '/cities' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur bb-hair">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
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
        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="ghost text-[14px] text-accent">
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
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
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'} text-[22px]`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-surface bb-hair">
          <nav className="mx-auto max-w-[1280px] px-5 py-4 flex flex-col gap-0">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="ghost text-[15px] text-accent py-3 bt-hair first:border-t-0"
                onClick={() => setMenuOpen(false)}
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
