'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/rich-text'

function ShareIcon({ href, icon, label, onClick }: {
  href?: string
  icon: string
  label: string
  onClick?: () => void
}) {
  const cls =
    'w-[38px] h-[38px] rounded-[8px] border-[0.5px] border-border bg-surface flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-150'
  if (onClick) {
    return (
      <button onClick={onClick} aria-label={label} className={cls}>
        <i className={`ti ${icon}`} />
      </button>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
      <i className={`ti ${icon}`} />
    </a>
  )
}

export default function PostSidebar({ toc, url, title }: {
  toc: TocItem[]
  url: string
  title: string
}) {
  const [activeId, setActiveId] = useState(toc[0]?.id)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const heads = toc
      .map(t => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null)
    const spy = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id)
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    )
    heads.forEach(h => spy.observe(h))
    return () => spy.disconnect()
  }, [toc])

  function scrollTo(e: React.MouseEvent, id: string) {
    const t = document.getElementById(id)
    if (t) {
      e.preventDefault()
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.scrollY - 84,
        behavior: 'smooth',
      })
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — ignore
    }
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="sticky top-[88px]">
      {toc.length > 0 && (
        <>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted mb-3.5">
            On this page
          </div>
          <ul className="flex flex-col gap-0.5 border-l-[0.5px] border-border list-none m-0 p-0">
            {toc.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={e => scrollTo(e, item.id)}
                  className={`block text-[13px] leading-[1.4] py-[7px] -ml-px border-l-2 transition-all duration-150 ${
                    item.level === 3 ? 'pl-7 text-[12px]' : 'pl-4'
                  } ${
                    activeId === item.id
                      ? 'text-accent border-accent'
                      : 'text-text-muted border-transparent hover:text-text-secondary'
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className={`text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted mb-3.5 ${toc.length > 0 ? 'mt-7' : ''}`}>
        Share
      </div>
      <div className="flex gap-2">
        <ShareIcon
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          icon="ti-brand-x"
          label="Share on X"
        />
        <ShareIcon
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          icon="ti-brand-linkedin"
          label="Share on LinkedIn"
        />
        <ShareIcon
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          icon="ti-brand-whatsapp"
          label="Share on WhatsApp"
        />
        <ShareIcon
          onClick={copyLink}
          icon={copied ? 'ti-check' : 'ti-link'}
          label="Copy link"
        />
      </div>
    </div>
  )
}
