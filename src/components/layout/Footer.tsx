import Image from 'next/image'
import Link from 'next/link'

const FOOTER_SECTIONS = [
  {
    heading: 'Discover',
    links: [
      { label: 'Gyms in Bangalore', href: '/city/bangalore' },
      { label: 'Gyms in Mumbai',    href: '/city/mumbai' },
      { label: 'Gyms in Delhi',     href: '/city/delhi' },
      { label: 'Gyms in Hyderabad', href: '/city/hyderabad' },
      { label: 'Gyms in Chennai',   href: '/city/chennai' },
      { label: 'Gyms in Pune',      href: '/city/pune' },
    ],
  },
  {
    heading: 'By Category',
    links: [
      { label: 'CrossFit Gyms',   href: '/city/bangalore/crossfit' },
      { label: 'Women-only Gyms', href: '/city/bangalore/women-only' },
      { label: '24/7 Gyms',       href: '/city/bangalore/24-7' },
      { label: 'Swimming Pools',  href: '/city/bangalore/swimming' },
      { label: 'Yoga Studios',    href: '/city/bangalore/yoga' },
      { label: 'Budget Gyms',     href: '/city/bangalore/budget' },
    ],
  },
  {
    heading: 'Content',
    links: [
      { label: 'Fitness Blog',       href: '/blog' },
      { label: 'Nutrition Guides',   href: '/blog/nutrition' },
      { label: 'Workout Plans',      href: '/blog/workout-plans' },
      { label: 'Gym Buying Guide',   href: '/blog/gym-buying-guide' },
      { label: 'Supplement Reviews', href: '/blog/supplements' },
      { label: 'Trainer Tips',       href: '/blog/trainer-tips' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',       href: '/about' },
      { label: 'Contact',        href: '/contact' },
      { label: 'List Your Gym',  href: '/list-your-gym' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use',   href: '/terms' },
      { label: 'Sitemap',        href: '/sitemap.xml' },
    ],
  },
]

const SOCIAL = [
  { icon: 'ti-brand-instagram', label: 'Instagram' },
  { icon: 'ti-brand-twitter',   label: 'Twitter' },
  { icon: 'ti-brand-youtube',   label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bt-hair">

      {/* Top section */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">

          {/* Left — brand */}
          <div className="md:col-span-1">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Gymlocator.in"
                width={120}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-text-muted leading-relaxed max-w-[200px] mt-3">
              India&apos;s most trusted gym discovery platform.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL.map(({ icon, label }) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-sm bg-raised b-hair flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-border transition-colors"
                >
                  <i className={`ti ${icon} text-[16px]`} />
                </a>
              ))}
            </div>
          </div>

          {/* Right — link columns */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_SECTIONS.map(({ heading, links }) => (
              <div key={heading}>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-text-primary mb-4">
                  {heading}
                </div>
                <div className="flex flex-col gap-2.5">
                  {links.map(({ label, href }) => (
                    <Link key={href} href={href} className="ghost text-[13px] text-text-muted">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="bt-hair py-5">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12px] text-text-muted">
            © 2026 Gymlocator.in — All rights reserved.
          </div>
          <div className="text-[12px] text-text-muted">
            Built with ❤️ for Indian fitness enthusiasts.
          </div>
        </div>
      </div>

    </footer>
  )
}
