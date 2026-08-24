'use client'

import { useEffect } from 'react'

/** Fires the browser-side Lead once, with the same eventID the server sent to CAPI, so Meta dedupes the pair. */
export function LeadPixelEvent({ eventId, source }: { eventId: string; source: string }) {
  useEffect(() => {
    try {
      const key = `lead-fired:${eventId}`
      if (sessionStorage.getItem(key)) return
      window.fbq?.('track', 'Lead', { content_name: source }, { eventID: eventId })
      sessionStorage.setItem(key, '1')
    } catch {
      // analytics must never break the page
    }
  }, [eventId, source])
  return null
}
