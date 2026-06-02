import Link from 'next/link'

export const metadata = {
  title: 'About Gymlocator.in — Find the Best Gyms in India',
  description: 'Gymlocator.in helps you find, compare and connect with the best gyms across India. No signup, no booking fees — just honest gym discovery.',
  alternates: { canonical: 'https://gymlocator.in/about' },
  robots: { index: true, follow: true },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-base">

      {/* HERO */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-16 pb-12 bb-hair">
        <div className="label !text-accent mb-4">About us</div>
        <h1 className="h1 text-text max-w-[640px]">
          India&apos;s most honest gym discovery platform.
        </h1>
        <p className="text-[17px] text-accent mt-5 max-w-[600px] leading-relaxed">
          Gymlocator.in helps you find, compare and connect with the best gyms in your city — no
          signup required, no hidden booking fees, no middlemen.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 grid md:grid-cols-2 gap-16">

        {/* Our Story */}
        <div>
          <h2 className="h2 text-text mb-5">Why we built this</h2>
          <div className="space-y-4 text-[15px] text-accent leading-relaxed">
            <p>
              Finding a gym in India is harder than it should be. You search Google, get a mix of
              outdated listings, paid ads, and aggregator sites that want you to sign up before
              showing you anything useful.
            </p>
            <p>
              We built Gymlocator.in to fix that. Every gym listing shows you real fees, real
              timings, real photos from Google Maps, and a direct phone number — so you can call
              the gym yourself, without a platform taking a cut.
            </p>
            <p>
              We are starting with Mumbai, Delhi, Bangalore and Pune, and expanding to every major
              Indian city. Our goal is to make gym discovery in India as fast and transparent as
              checking a restaurant on Zomato.
            </p>
          </div>
        </div>

        {/* What we offer */}
        <div>
          <h2 className="h2 text-text mb-5">What you get</h2>
          <div className="space-y-4">
            {[
              {
                icon: 'ti-search',
                title: 'No signup needed',
                desc: 'Browse every gym, compare fees and timings without creating an account or giving us your phone number.',
              },
              {
                icon: 'ti-phone',
                title: 'Direct gym contact',
                desc: 'Every listing shows a real phone number. Call the gym directly — no booking fees, no commissions.',
              },
              {
                icon: 'ti-map-pin',
                title: 'Hyper-local data',
                desc: 'Locality-level pages with real pricing, crowd insights and what to look for in each specific area.',
              },
              {
                icon: 'ti-star',
                title: 'Real Google ratings',
                desc: 'Ratings and review counts pulled directly from Google Maps — no fake reviews or paid placements.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-surface b-hair rounded-md p-4">
                <i className={`ti ${item.icon} text-[20px] text-accent flex-shrink-0 mt-0.5`} />
                <div>
                  <div className="text-[14px] font-bold text-text mb-1">{item.title}</div>
                  <div className="text-[13px] text-accent">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* STATS */}
      <div className="silver-section bt-hair bb-hair">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '554+', label: 'Gyms listed' },
            { number: '8',    label: 'Cities covered' },
            { number: '28',   label: 'Localities' },
            { number: '100%', label: 'Free to use' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-[32px] font-black tracking-tight text-base">
                {stat.number}
              </div>
              <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-accent mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16">
        <div className="bg-surface b-hair rounded-md p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="h2 text-text mb-2">Own a gym?</h2>
            <p className="text-[15px] text-accent">
              Get your gym listed on Gymlocator.in for free. Verified listings get priority placement.
            </p>
          </div>
          <Link
            href="/list-your-gym"
            className="inline-flex items-center gap-2 bg-accent text-[#0C0C0C] font-bold text-[14px] px-6 py-3 rounded-sm hover:bg-text transition-colors flex-shrink-0"
          >
            List your gym free
            <i className="ti ti-arrow-right text-[14px]" />
          </Link>
        </div>
      </div>

    </main>
  )
}
