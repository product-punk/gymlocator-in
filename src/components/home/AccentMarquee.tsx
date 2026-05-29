export default function AccentMarquee() {
  return (
    <section className="silver-section bb-hair bt-hair">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-4 overflow-x-auto scrollbar-none flex items-center gap-x-8 gap-y-0 text-[12px] font-bold uppercase tracking-[0.14em] font-mono whitespace-nowrap">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0C0C0C]" />
          Live across India
        </span>
        <span className="opacity-25">———</span>
        <span>
          <strong className="text-[15px] mr-1">2,580+</strong> gyms listed
        </span>
        <span className="opacity-25">———</span>
        <span>
          <strong className="text-[15px] mr-1">8</strong> cities
        </span>
        <span className="opacity-25">———</span>
        <span>
          <strong className="text-[15px] mr-1">13</strong> amenities
        </span>
        <span className="opacity-25">———</span>
        <span>
          <strong className="text-[15px] mr-1">24/7</strong> open access
        </span>
      </div>
    </section>
  )
}
