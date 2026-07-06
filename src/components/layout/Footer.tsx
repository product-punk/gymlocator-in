import Image from 'next/image'
import Link from 'next/link'
import { getTopLocalities } from '@/lib/supabase/queries'
import { BLOG_CATEGORIES } from '@/lib/blog-categories'

type FooterLink = { label: string; href: string }

const CITY_LINKS: FooterLink[] = [
  { label: 'Gyms in Bangalore', href: '/gyms/bangalore' },
  { label: 'Gyms in Mumbai',    href: '/gyms/mumbai' },
  { label: 'Gyms in Delhi',     href: '/gyms/delhi' },
  { label: 'Gyms in Hyderabad', href: '/gyms/hyderabad' },
  { label: 'Gyms in Chennai',   href: '/gyms/chennai' },
  { label: 'Gyms in Pune',      href: '/gyms/pune' },
  { label: 'Gyms in Kolkata',   href: '/gyms/kolkata' },
  { label: 'Gyms in Ahmedabad', href: '/gyms/ahmedabad' },
]

// Facet × city pairs rotated across top cities for link diversity
const CATEGORY_LINKS: FooterLink[] = [
  { label: 'Budget Gyms in Mumbai',        href: '/gyms/mumbai/budget' },
  { label: 'Budget Gyms in Delhi',         href: '/gyms/delhi/budget' },
  { label: 'Women-Only Gyms in Bangalore', href: '/gyms/bangalore/women' },
  { label: 'Women-Only Gyms in Mumbai',    href: '/gyms/mumbai/women' },
  { label: 'Premium Gyms in Bangalore',    href: '/gyms/bangalore/premium' },
  { label: 'Premium Gyms in Hyderabad',    href: '/gyms/hyderabad/premium' },
  { label: 'Gyms with Pool in Mumbai',     href: '/gyms/mumbai/with-swimming-pool' },
  { label: 'Personal Trainers in Pune',    href: '/gyms/pune/with-personal-trainer' },
  { label: 'Steam & Sauna in Delhi',       href: '/gyms/delhi/with-steam-sauna' },
  { label: 'Cardio Gyms in Chennai',       href: '/gyms/chennai/cardio' },
]

const RESOURCE_LINKS: FooterLink[] = [
  { label: 'Fitness Blog',       href: '/blog' },
  { label: 'Protein Calculator', href: '/calculators/protein' },
  ...BLOG_CATEGORIES.slice(0, 6).map(c => ({
    label: c.label,
    href: `/blog/${c.slug}`,
  })),
]

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About Us',       href: '/about' },
  { label: 'Contact',        href: '/contact' },
  { label: 'List your gym',  href: '/list-your-gym' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Sitemap',        href: '/sitemap.xml' },
]

function cityName(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

function LinkColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-text mb-4">
        {heading}
      </div>
      <div className="flex flex-col gap-2.5">
        {links.map(({ label, href }) => (
          <Link key={href} href={href} className="ghost text-[13px] text-accent">
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default async function Footer() {
  const topLocalities = await getTopLocalities(8)
  const localityLinks: FooterLink[] = topLocalities.map(l => ({
    label: `${l.name}, ${cityName(l.city_slug)}`,
    href: `/gyms/${l.city_slug}/${l.slug}`,
  }))

  return (
    <footer className="bt-hair">

      {/* Top section */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-8">

          {/* Left - brand */}
          <div className="lg:col-span-1">
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
          </div>

          {/* Right - link columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <LinkColumn heading="Discover" links={CITY_LINKS} />
            {localityLinks.length > 0 && (
              <LinkColumn heading="Popular Localities" links={localityLinks} />
            )}
            <LinkColumn heading="By Category" links={CATEGORY_LINKS} />
            <LinkColumn heading="Fitness Hub" links={RESOURCE_LINKS} />
            <LinkColumn heading="Company" links={COMPANY_LINKS} />
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
