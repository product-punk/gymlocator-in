import Link from 'next/link'

export const metadata = {
  title: 'Contact Us | Gymlocator.in',
  description: 'Get in touch with the Gymlocator.in team. For gym listings, corrections, partnerships or general queries.',
  alternates: { canonical: 'https://gymlocator.in/contact' },
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-base">

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-16 pb-12 bb-hair">
        <div className="label !text-accent mb-4">Contact</div>
        <h1 className="h1 text-text">Get in touch</h1>
        <p className="text-[17px] text-accent mt-4 max-w-[520px]">
          Questions, corrections, partnership enquiries or feedback - we read every message.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 grid md:grid-cols-2 gap-12">

        {/* Contact options */}
        <div className="space-y-4">
          {[
            {
              icon: 'ti-mail',
              title: 'General enquiries',
              desc: 'For anything not covered below',
              value: 'hello@gymlocator.in',
              href: 'mailto:hello@gymlocator.in',
            },
            {
              icon: 'ti-building-skyscraper',
              title: 'List your gym',
              desc: 'Add or update your gym listing',
              value: 'List your gym free',
              href: '/list-your-gym',
            },
            {
              icon: 'ti-edit',
              title: 'Report incorrect info',
              desc: 'Wrong fees, timings or details',
              value: 'corrections@gymlocator.in',
              href: 'mailto:corrections@gymlocator.in',
            },
            {
              icon: 'ti-handshake',
              title: 'Partnerships',
              desc: 'Business and media enquiries',
              value: 'partnerships@gymlocator.in',
              href: 'mailto:partnerships@gymlocator.in',
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="flex items-start gap-4 bg-surface b-hair rounded-md p-5 hover:bg-raised hover:border-border-hi transition-colors group"
            >
              <i className={`ti ${item.icon} text-[22px] text-accent flex-shrink-0 mt-0.5`} />
              <div>
                <div className="text-[14px] font-bold text-text group-hover:text-accent transition-colors">
                  {item.title}
                </div>
                <div className="text-[13px] text-accent mb-1">{item.desc}</div>
                <div className="text-[13px] text-accent">{item.value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="h2 text-text mb-6">Common questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'How do I list my gym?',
                a: 'Click List your gym in the navigation and fill in your gym details. Listings are free and go live within 24 hours after verification.',
              },
              {
                q: 'My gym details are incorrect. How do I fix them?',
                a: 'Email corrections@gymlocator.in with your gym name, city and the correct details. We update listings within 48 hours.',
              },
              {
                q: 'Is Gymlocator.in free to use?',
                a: 'Yes, completely free for gym seekers. There are no booking fees, no commissions and no signup required to browse listings.',
              },
              {
                q: 'How are gyms verified?',
                a: 'Gym data is sourced from Google Maps and cross-checked manually. Verified badges are given to gyms that have confirmed their listing with our team.',
              },
            ].map((faq, i) => (
              <details key={i} className="bg-surface b-hair rounded-md group">
                <summary className="p-4 cursor-pointer text-[15px] font-semibold text-text list-none flex items-center justify-between gap-4 hover:text-accent transition-colors">
                  {faq.q}
                  <i className="ti ti-chevron-down text-[16px] text-accent flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-[14px] text-accent leading-relaxed bt-hair pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
