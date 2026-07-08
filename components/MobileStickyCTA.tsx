'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/constants'

/**
 * Thumb-reachable booking bar, mobile only. Appears after the hero scrolls
 * away. Left-aligned with right padding so the floating chat bubble
 * (bottom-right) never covers it.
 */
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 550)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden pr-24 pl-4 pb-4 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <a
        href={COMPANY_INFO.links.calcom.audit}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl px-5 py-3.5 shadow-xl shadow-amber-500/40 border-2 border-amber-600"
        tabIndex={visible ? 0 : -1}
      >
        <Calendar size={18} />
        Book a discovery call
      </a>
    </div>
  )
}
