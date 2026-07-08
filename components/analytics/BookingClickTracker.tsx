'use client'

import { useEffect } from 'react'
import { trackLead } from '@/lib/tracking'

/**
 * One document-level listener that fires a Lead event whenever any Cal.com
 * booking link is clicked — covers every CTA sitewide without touching
 * individual call sites.
 */
export function BookingClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (anchor?.href?.includes('cal.com')) {
        trackLead('booking_click')
      }
    }
    document.addEventListener('click', onClick, { capture: true, passive: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
