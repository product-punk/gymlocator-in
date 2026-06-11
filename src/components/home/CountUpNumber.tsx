'use client'

import { useEffect, useRef, useState } from 'react'
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
  const started = useRef(false)

  useEffect(() => {
    if (!play || started.current) return
    started.current = true
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
