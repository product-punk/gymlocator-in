import ListGymForm from './ListGymForm'

export const metadata = {
  title: 'List Your Gym Free on Gymlocator.in',
  description: 'Get your gym listed on Gymlocator.in for free. Reach thousands of people searching for gyms in your city every month.',
  alternates: { canonical: 'https://gymlocator.in/list-your-gym' },
  robots: { index: true, follow: true },
}

export default function ListYourGymPage() {
  return (
    <main className="min-h-screen bg-base">

      {/* HERO */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-16 pb-12 bb-hair">
        <div className="label !text-accent mb-4">For gym owners</div>
        <h1 className="h1 text-text max-w-[640px]">
          Get your gym in front of people searching right now.
        </h1>
        <p className="text-[17px] text-accent mt-5 max-w-[580px] leading-relaxed">
          Gymlocator.in is free to list on. Verified gyms get priority placement on city and
          locality pages, putting you above unverified listings when someone searches for a gym
          near them.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 grid md:grid-cols-2 gap-16">

        {/* Benefits */}
        <div>
          <h2 className="h2 text-text mb-6">Why list on Gymlocator.in</h2>
          <div className="space-y-4">
            {[
              {
                icon: 'ti-eye',
                title: 'Free visibility',
                desc: 'Your gym appears on city and locality pages searched by thousands of people monthly at no cost.',
              },
              {
                icon: 'ti-circle-check',
                title: 'Verified badge',
                desc: 'Verified listings get a badge and priority placement above unverified gyms in search results.',
              },
              {
                icon: 'ti-phone',
                title: 'Direct leads',
                desc: 'Members call you directly. No platform takes a booking commission or membership cut.',
              },
              {
                icon: 'ti-photo',
                title: 'Rich listing',
                desc: 'Show your gym photos, timings, amenities, pricing and Google rating all in one place.',
              },
              {
                icon: 'ti-chart-bar',
                title: 'SEO traffic',
                desc: 'Gymlocator pages rank on Google for local gym searches. Your listing benefits from that traffic.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-sm bg-accent-dim flex items-center justify-center flex-shrink-0">
                  <i className={`ti ${item.icon} text-[18px] text-accent`} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-text mb-0.5">{item.title}</div>
                  <div className="text-[13px] text-accent">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="h2 text-text mb-6">Submit your gym</h2>
          <ListGymForm />
        </div>

      </div>

      {/* Silver stats */}
      <div className="silver-section bt-hair bb-hair">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10 flex flex-wrap gap-x-16 gap-y-6">
          {[
            { n: '1,626+', l: 'Gyms listed' },
            { n: '11',     l: 'Cities' },
            { n: 'Free',   l: 'Forever for gyms' },
            { n: '24hrs',  l: 'Listing turnaround' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[28px] font-black tracking-tight text-base">{s.n}</div>
              <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-accent">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  )
}
