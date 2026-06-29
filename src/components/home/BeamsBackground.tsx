'use client'

import dynamic from 'next/dynamic'

const Beams = dynamic(() => import('./Beams'), { ssr: false })

export default function BeamsBackground() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={10}
        lightColor="#D4D4D4"
        speed={1.2}
        noiseIntensity={1.4}
        scale={0.2}
        rotation={35}
      />
    </div>
  )
}
