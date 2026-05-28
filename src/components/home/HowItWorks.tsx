import Link from 'next/link'

const STEPS = [
  {
    number: '01',
    icon: 'ti-search',
    title: 'Search your city',
    description:
      'Pick from eight metros or type a locality to narrow down. Zero signup, zero spam.',
  },
  {
    number: '02',
    icon: 'ti-arrows-shuffle-2',
    title: 'Compare gyms',
    description:
      'Side-by-side filters for price tier, AC, timings, gender policy and 13 amenities — including 24/7 and women-only.',
  },
  {
    number: '03',
    icon: 'ti-phone',
    title: 'Connect directly',
    description:
      'Tap to call the gym, get directions on Maps or message the owner. No middleman, no booking fees.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bb-hair">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-20 md:py-24">

        {/* Section header */}
        <div className="mb-12">
          <div className="label mb-3">Process</div>
          <h2 className="h2 text-text-primary max-w-[640px]">
            Three steps from a search to a gym membership.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border b-hair rounded-md overflow-hidden">
          {STEPS.map((step) => (
            <div key={step.number} className="bg-base p-8 md:p-10 flex flex-col gap-6 min-h-[260px]">
              <div className="flex items-start justify-between">
                <i className={`ti ${step.icon} text-[32px] text-accent`} />
                <span className="text-[80px] leading-none font-extrabold tracking-tighter text-text-disabled select-none">
                  {step.number}
                </span>
              </div>
              <div className="mt-auto">
                <h3 className="h3 text-text-primary">{step.title}</h3>
                <p className="text-[14px] text-text-secondary mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="light-card mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 b-hair rounded-md p-6 md:p-8">
          <div>
            <h3 className="h3 text-text-primary">Run a gym? Get listed.</h3>
            <p className="text-[14px] text-text-secondary mt-1">
              Free during beta. Verified listings get priority placement on city pages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/list-your-gym"
              className="btn-outline-dark inline-flex items-center gap-2 font-bold text-[13px] px-4 py-2.5 rounded-sm transition-colors"
            >
              Learn more
            </Link>
            <Link
              href="/list-your-gym"
              className="inline-flex items-center gap-2 bg-[#0C0C0C] text-[#D4D4D4] font-bold text-[13px] px-4 py-2.5 rounded-sm hover:bg-raised transition-colors"
            >
              <i className="ti ti-arrow-right text-[16px]" /> List your gym
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
