'use client'

import { useState } from 'react'

/**
 * Gym photos are scraped Google Maps CDN URLs that expire (403) over time.
 * Renders the placeholder icon when the URL is missing or fails to load.
 */
export default function GymImage({
  src,
  alt,
  className,
  iconSize = 40,
  icon = 'ti-building-skyscraper',
}: {
  src?: string | null
  alt: string
  className?: string
  iconSize?: number
  icon?: string
}) {
  const [failed, setFailed] = useState(false)
  const valid = src && src !== '' && src !== 'nan'

  if (!valid || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-raised">
        <i className={`ti ${icon} text-accent`} style={{ fontSize: iconSize }} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
