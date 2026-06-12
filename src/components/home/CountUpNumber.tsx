'use client'

import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

type CountUpNumberProps = {
  value: number
  /** When this flips true the counter resets to 0 and counts up once. */
  play: boolean
  suffix?: string
  delay?: number
  duration?: number
  className?: string
}

export default function CountUpNumber({
  value,
  play,
  suffix = '',
  delay = 0,
  duration = 1.5,
  className,
}: CountUpNumberProps) {
  // SSR / no-JS / reduced-motion all show the final value.
  const [display, setDisplay] = useState(value)

  // No "ran once" ref guard here: Strict Mode double-invokes effects, and a
  // guard would let the cleanup stop the animation with no second start,
  // freezing the display at 0. Restarting from cleanup is safe.
  useEffect(() => {
    if (!play) return
    setDisplay(0)
    const controls = animate(0, value, {
      delay,
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [play, value, delay, duration])

  return (
    <span className={className}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}
