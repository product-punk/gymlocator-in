import Image from 'next/image'
import Link from 'next/link'

type FooterLink = { label: string; href: string; comingSoon?: boolean }

const FOOTER_SECTIONS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: 'Discover',
    links: [
      { label: 'Gyms in Bangalore', href: '/gyms/bangalore' },
      { label: 'Gyms in Mumbai',    href: '/gyms/mumbai' },
      { label: 'Gyms in Delhi',     href: '/gyms/delhi' },
      { label: 'Gyms in Hyderabad', href: '/gyms/hyderabad' },
      { label: 'Gyms in Chennai',   href: '/gyms/chennai' },
      { label: 'Gyms in Pune',      href: '/gyms/pune' },
      { label: 'Gyms in Kolkata',   href: '/gyms/kolkata' },
      { label: 'Gyms in Ahmedabad', href: '/gyms/ahmedabad' },
    ],
  },
  {
    heading: 'By Category',
    links: [
      { label: 'Budget Gyms in Mumbai',       href: '/gyms/mumbai/budget' },
      { label: 'Budget Gyms in Delhi',        href: '/gyms/delhi/budget' },
      { label: 'Budget Gyms in Bangalore',    href: '/gyms/bangalore/budget' },
      { label: 'Budget Gyms in Pune',         href: '/gyms/pune/budget' },
      { label: 'Women-Only Gyms in Mumbai',   href: '/gyms/mumbai/women' },
      { label: 'Women-Only Gyms in Delhi',    href: '/gyms/delhi/women' },
      { label: 'Women-Only Gyms in Bangalore', href: '/gyms/bangalore/women' },
      { label: 'Premium Gyms in Bangalore',   href: '/gyms/bangalore/premium' },
      { label: 'Premium Gyms in Mumbai',      href: '/gyms/mumbai/premium' },
      { label: 'Gyms with Pool in Mumbai',    href: '/gyms/mumbai/with-swimming-pool' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { label: 'Protein Calculator', href: '/calculators/protein' },
      { label: 'Fitness Blog',       href: '', comingSoon: true },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',       href: '/about' },
      { label: 'Contact',        href: '/contact' },
      { label: 'List your gym',  href: '/list-your-gym' },
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

          {/* Left - brand */}
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
            <p className="text-[13px] text-accent leading-relaxed max-w-[200px] mt-3">
              India&apos;s most trusted gym discovery platform.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL.map(({ icon, label }) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-sm bg-raised b-hair flex items-center justify-center text-accent hover:text-text hover:bg-border transition-colors"
                >
                  <i className={`ti ${icon} text-[16px]`} />
                </a>
              ))}
            </div>
          </div>

          {/* Right - link columns */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_SECTIONS.map(({ heading, links }) => (
              <div key={heading}>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-text mb-4">
                  {heading}
                </div>
                <div className="flex flex-col gap-2.5">
                  {links.map(({ label, href, comingSoon }) =>
                    comingSoon ? (
                      <span key={label} className="text-[13px] text-accent cursor-not-allowed">
                        {label} (coming soon)
                      </span>
                    ) : (
                      <Link key={href} href={href} className="ghost text-[13px] text-accent">
                        {label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="bt-hair py-5">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12px] text-accent">
            © 2026 Gymlocator.in - All rights reserved.
          </div>
          <div className="text-[12px] text-accent">
            Built with ❤️ for Indian fitness enthusiasts.
          </div>
        </div>
      </div>

    </footer>
  )
}
