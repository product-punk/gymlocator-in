'use client'

import { useEffect, useRef, useState } from 'react'

/** Fixed reading-progress bar + back-to-top button (Post.html design) */
export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`
      setShowTop(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div
        ref={barRef}
        className="fixed top-0 left-0 h-[3px] w-0 bg-accent z-[60] transition-[width] duration-75"
      />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed right-6 bottom-6 w-[46px] h-[46px] rounded-[10px] bg-accent text-base flex items-center justify-center z-40 transition-all duration-200 hover:bg-white ${
          showTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <i className="ti ti-arrow-up text-[20px]" />
      </button>
    </>
  )
}
