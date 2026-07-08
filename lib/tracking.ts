type TrackFn = (...args: unknown[]) => void

declare global {
  interface Window {
    fbq?: TrackFn
    lintrk?: TrackFn
  }
}

/**
 * Fire a Lead conversion on every installed pixel. No-ops safely when a
 * pixel isn't configured — tracking must never break UX.
 */
export function trackLead(source: string) {
  try {
    window.fbq?.('track', 'Lead', { content_name: source })
    const conversionId = process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_ID
    if (conversionId) {
      window.lintrk?.('track', { conversion_id: Number(conversionId) })
    }
  } catch {
    // never let analytics take down the page
  }
}
