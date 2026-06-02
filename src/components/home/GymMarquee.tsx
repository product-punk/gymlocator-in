interface Gym {
  name: string
}

const FALLBACK = [
  'Cult Fit', "Gold's Gym", 'Anytime Fitness',
  'Snap Fitness', 'Talwalkars', 'Fitness First',
  'PowerHouse Gym', 'Iron Body', 'CrossFit India',
]

export default function GymMarquee({ gyms }: { gyms: Gym[] }) {
  const brands = gyms.length > 0
    ? gyms.map((g) => ({
        name: g.name,
        abbr: g.name.replace(/[^A-Z]/g, '').slice(0, 2) || g.name.slice(0, 2).toUpperCase(),
      }))
    : FALLBACK.map((name) => ({
        name,
        abbr: name.replace(/[^A-Z]/g, '').slice(0, 2) || name.slice(0, 2).toUpperCase(),
      }))

  return (
    <section className="bb-hair py-10 overflow-hidden">
      <div className="text-center mb-8">
        <div className="label !text-accent">
          Trusted by India&apos;s top gyms
        </div>
      </div>

      <div className="marquee-fade overflow-hidden">
        <div className="marquee-track">
          {[...brands, ...brands].map((gym, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-surface b-hair rounded-md px-5 py-3 mx-4 hover:bg-raised hover:border-border-hi transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-sm bg-raised flex items-center justify-center text-[11px] font-bold text-accent flex-shrink-0">
                {gym.abbr}
              </span>
              <span className="text-[13px] font-semibold text-accent whitespace-nowrap">
                {gym.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
