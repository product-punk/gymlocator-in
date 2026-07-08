import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Gymlocator.in',
  description: 'Privacy policy for Gymlocator.in - how we collect, use and protect your data.',
  alternates: { canonical: 'https://gymlocator.in/privacy' },
}

const SECTIONS = [
  {
    heading: 'Information We Collect',
    body: 'We collect information you voluntarily provide when contacting us or listing a gym - such as your name, email address, and gym details. We also collect standard server logs and analytics data (pages visited, device type, referring URL) to improve the site.',
  },
  {
    heading: 'How We Use It',
    body: 'We use your information to respond to enquiries, display gym listings, and improve Gymlocator.in. We do not sell or rent your personal data to third parties.',
  },
  {
    heading: 'Cookies & Analytics',
    body: 'We use cookies and third-party analytics tools (such as Google Analytics) to understand how visitors use the site. You can disable cookies in your browser settings, though some features may not work as expected.',
  },
  {
    heading: 'Third-Party Links',
    body: 'Gymlocator.in links to gym websites and third-party services. We are not responsible for the privacy practices of those sites and encourage you to review their policies.',
  },
  {
    heading: 'Data Retention',
    body: 'We retain contact and listing data only as long as necessary to fulfil the purpose for which it was collected, or as required by law.',
  },
  {
    heading: 'Your Rights',
    body: 'You may request access to, correction of, or deletion of any personal data we hold about you by emailing us at the address on our Contact page.',
  },
  {
    heading: 'Changes to This Policy',
    body: 'We may update this policy from time to time. The date at the bottom of this page reflects the most recent revision. Continued use of the site after any changes constitutes acceptance of the updated policy.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-base">
      <div className="max-w-[780px] mx-auto px-5 md:px-10 py-16">

        <nav className="flex items-center gap-2 text-[12px] text-accent mb-10">
          <Link href="/" className="ghost">Home</Link>
          <span>›</span>
          <span>Privacy Policy</span>
        </nav>

        <h1 className="h1 text-text mb-3">Privacy Policy</h1>
        <p className="text-[14px] text-accent mb-12">Last updated: June 2026</p>

        <div className="space-y-10">
          {SECTIONS.map(({ heading, body }) => (
            <div key={heading}>
              <h2 className="text-[16px] font-semibold text-text mb-2">{heading}</h2>
              <p className="text-[15px] text-accent leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 bt-hair text-[14px] text-accent">
          Questions? <Link href="/contact" className="text-text hover:underline">Contact us</Link>.
        </div>

      </div>
    </main>
  )
}
