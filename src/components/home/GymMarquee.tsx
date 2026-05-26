const GYM_BRANDS = [
  { name: 'Cult Fit',        abbr: 'CF' },
  { name: "Gold's Gym",      abbr: 'GG' },
  { name: 'Anytime Fitness', abbr: 'AF' },
  { name: 'Snap Fitness',    abbr: 'SF' },
  { name: 'Fitness First',   abbr: 'FF' },
  { name: 'Talwalkars',      abbr: 'TW' },
  { name: 'Planet Fitness',  abbr: 'PF' },
  { name: 'CrossFit India',  abbr: 'CI' },
  { name: 'F45 Training',    abbr: 'F4' },
  { name: 'Energize Gym',    abbr: 'EG' },
  { name: 'Iron Body',       abbr: 'IB' },
  { name: 'PowerHouse Gym',  abbr: 'PH' },
]

export default function GymMarquee() {
  return (
    <section className="bb-hair py-10 overflow-hidden">
      <div className="text-center mb-8">
        <div className="label !text-text-muted">
          Trusted by India&apos;s top gyms
        </div>
      </div>

      <div className="marquee-fade overflow-hidden">
        <div className="marquee-track">
          {[...GYM_BRANDS, ...GYM_BRANDS].map((gym, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-surface b-hair rounded-md px-5 py-3 mx-4 hover:bg-raised hover:border-border-hi transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-sm bg-raised flex items-center justify-center text-[11px] font-bold text-accent flex-shrink-0">
                {gym.abbr}
              </span>
              <span className="text-[13px] font-semibold text-text-secondary whitespace-nowrap">
                {gym.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
