import Link from 'next/link'

export const metadata = {
  title: 'About Gymlocator.in — Built by a Fitness Obsessive',
  description: 'Gymlocator.in was built by someone who has spent 10+ years training across gyms in India — from luxury wellness clubs to basement iron rooms. Real experience behind every recommendation.',
  alternates: { canonical: 'https://gymlocator.in/about' },
  robots: { index: true, follow: true },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-base">

      {/* HERO */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-16 pb-12 bb-hair">
        <div className="label !text-accent mb-4">About us</div>
        <h1 className="h1 text-text max-w-[700px]">
          Built by someone who has trained in 100+ gyms across India.
        </h1>
        <p className="text-[17px] text-accent mt-5 max-w-[620px] leading-relaxed">
          Not a tech company that discovered fitness. A fitness obsessive who got frustrated with
          every gym discovery tool available in India and decided to build something better.
        </p>
      </div>

      {/* FOUNDER STORY */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 bb-hair">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          <div>
            <h2 className="h2 text-text mb-6">The experience behind this</h2>
            <div className="space-y-4 text-[15px] text-accent leading-relaxed">
              <p>
                The founder of Gymlocator.in has been training consistently for over 10 years.
                Not occasionally - religiously. Weights, running, cycling, basketball. The kind of
                person who researches a gym before checking into a hotel, and has opinions about
                squat rack depth.
              </p>
              <p>
                Across those years, he has trained in gyms that span the full spectrum of what
                India offers. Luxury wellness clubs in Bandra and Jubilee Hills with ice baths and
                Rs 10,000 monthly fees. Old-school iron rooms in Laxmi Nagar and Baranagar where
                the equipment is 20 years old but the gains are real. Corporate 24-hour gyms in
                HITEC City and Whitefield built for shift workers. Women-only studios in South
                Chennai. Boutique CrossFit boxes in Koramangala. Budget gyms in Mira Road where
                Rs 1,000 gets you more than you expect.
              </p>
              <p>
                That range of experience is what makes Gymlocator.in different. Every locality
                page, every pricing tier, every &ldquo;what to look for&rdquo; bullet is informed
                by someone who has actually trained in that market - not scraped it from a dataset.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="h2 text-text mb-6">What 10 years teaches you</h2>
            {[
              {
                icon: 'ti-barbell',
                title: 'The equipment gap is real',
                desc: 'A Rs 5,000 gym is not always better than a Rs 1,500 gym. The best squat rack in India I ever used was in a basement gym in Dwarka charging Rs 1,200 a month. Equipment quality and price have a weak correlation in India.',
              },
              {
                icon: 'ti-clock',
                title: 'Timing matters more than most admit',
                desc: 'A great gym at the wrong time is worse than an average gym at the right time. Crowd density at 7:30 PM in Indian gyms is a genuine problem. 24-hour access is not a luxury for shift workers - it is a productivity tool.',
              },
              {
                icon: 'ti-map-pin',
                title: 'Proximity is the only filter that matters long-term',
                desc: 'Every fitness professional will tell you this. The best gym is the one you actually go to. Anything more than 15 minutes from home or office has a 90 percent dropout rate within 60 days, regardless of quality.',
              },
              {
                icon: 'ti-users',
                title: 'Women-only spaces are underrated',
                desc: 'Having trained alongside members who switched from mixed to women-only gyms, the retention and consistency improvement is significant. This is not a niche preference. It is a structural need in the Indian fitness market.',
              },
              {
                icon: 'ti-run',
                title: 'Cross-training changes your standards',
                desc: 'Running, cycling, and basketball alongside weight training gives you a sharper eye for what a well-rounded facility looks like. A gym that only serves powerlifters serves one demographic. The best gyms serve all of them.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-surface b-hair rounded-md p-4">
                <i className={`ti ${item.icon} text-[20px] text-accent flex-shrink-0 mt-0.5`} />
                <div>
                  <div className="text-[14px] font-bold text-text mb-1">{item.title}</div>
                  <div className="text-[13px] text-accent leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* WHY THIS EXISTS */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 bb-hair">
        <div className="max-w-[720px]">
          <h2 className="h2 text-text mb-6">Why Gymlocator.in exists</h2>
          <div className="space-y-4 text-[15px] text-accent leading-relaxed">
            <p>
              Every time someone asked for a gym recommendation in a new city, the answer required
              10 minutes of explaining - which locality, what budget, what time of day, what fitness
              goals, whether they care about crowds. None of the existing platforms captured that
              nuance.
            </p>
            <p>
              Justdial shows listings but not context. Google Maps shows ratings but not pricing.
              Cult.fit shows only its own gyms. Fitternity requires a signup before showing anything
              useful. Every platform prioritizes its own revenue over your decision.
            </p>
            <p>
              Gymlocator.in was built to be the recommendation you would get from someone who has
              actually trained in that city - specific, honest, and free.
            </p>
          </div>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 bb-hair">
        <h2 className="h2 text-text mb-8">How we make recommendations</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: 'ti-star',
              title: 'Real Google ratings',
              desc: 'Every rating and review count is pulled directly from Google Maps. No paid placements, no inflated scores.',
            },
            {
              icon: 'ti-currency-rupee',
              title: 'Real pricing tiers',
              desc: 'Budget, standard, and premium tiers are based on actual market research per locality - not generic city-wide averages.',
            },
            {
              icon: 'ti-map-pin',
              title: 'Hyper-local context',
              desc: 'Each locality page is written with knowledge of the actual neighbourhood - traffic patterns, demographics, gym culture, and what to watch out for.',
            },
            {
              icon: 'ti-phone',
              title: 'Direct gym contact',
              desc: 'Real phone numbers so you call the gym directly. No booking commissions, no platform cut, no middlemen.',
            },
            {
              icon: 'ti-photo',
              title: 'Real gym photos',
              desc: 'Photos sourced from Google Maps - actual gym interiors and exteriors, not marketing shots from the gym itself.',
            },
            {
              icon: 'ti-shield-check',
              title: 'No paid rankings',
              desc: 'Gyms cannot pay to rank higher on Gymlocator.in. Default sort is by genuine Google Maps rating, highest first.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-surface b-hair rounded-md p-5">
              <i className={`ti ${item.icon} text-[22px] text-accent mb-3 block`} />
              <div className="text-[14px] font-bold text-text mb-1.5">{item.title}</div>
              <div className="text-[13px] text-accent leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="silver-section bt-hair bb-hair">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '1,090+', label: 'Gyms listed' },
            { number: '8',      label: 'Cities covered' },
            { number: '60',     label: 'Localities' },
            { number: '100%',   label: 'Free to use' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-[32px] font-black tracking-tight text-base">{stat.number}</div>
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
              Get your gym listed on Gymlocator.in for free. Verified listings get priority
              placement on city and locality pages.
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
