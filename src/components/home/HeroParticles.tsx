/*
 * Static particle field — 14 dots drifting upward via the `particle`
 * CSS keyframe in globals.css. Negative delays distribute them mid-cycle
 * so the field looks "full" from the first frame. All class strings are
 * literals so Tailwind's scanner picks up the arbitrary values.
 */
const PARTICLES = [
  'left-[4%]  w-[2px] h-[2px] [--dur:19s] [--delay:-3s]',
  'left-[11%] w-[3px] h-[3px] [--dur:14s] [--delay:-9s]',
  'left-[18%] w-[2px] h-[2px] [--dur:22s] [--delay:-1s]',
  'left-[26%] w-[2px] h-[2px] [--dur:16s] [--delay:-12s]',
  'left-[33%] w-[3px] h-[3px] [--dur:20s] [--delay:-6s]',
  'left-[41%] w-[2px] h-[2px] [--dur:13s] [--delay:-4s]',
  'left-[48%] w-[2px] h-[2px] [--dur:24s] [--delay:-15s]',
  'left-[55%] w-[3px] h-[3px] [--dur:17s] [--delay:-8s]',
  'left-[62%] w-[2px] h-[2px] [--dur:21s] [--delay:-2s]',
  'left-[70%] w-[2px] h-[2px] [--dur:15s] [--delay:-11s]',
  'left-[77%] w-[3px] h-[3px] [--dur:23s] [--delay:-5s]',
  'left-[84%] w-[2px] h-[2px] [--dur:18s] [--delay:-13s]',
  'left-[91%] w-[2px] h-[2px] [--dur:14s] [--delay:-7s]',
  'left-[96%] w-[3px] h-[3px] [--dur:20s] [--delay:-10s]',
]

export default function HeroParticles() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none motion-reduce:hidden"
    >
      {PARTICLES.map((classes, i) => (
        <span
          key={i}
          className={`particle absolute bottom-[-2%] rounded-full bg-text ${classes}`}
        />
      ))}
    </div>
  )
}
