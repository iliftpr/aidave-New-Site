'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PAINS = [
  { value: 'missed_calls', label: 'Missed calls' },
  { value: 'no_shows', label: 'No-shows' },
  { value: 'not_enough_leads', label: 'Not enough leads' },
  { value: 'reviews', label: 'Bad or too few reviews' },
]

const TRACK_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']

function readCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(name + '='))
    ?.split('=')[1]
}

function newEventId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now())
}

const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200'

export function LeadForm({ slug, submitLabel }: { slug: string; submitLabel: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventId] = useState(newEventId)
  const [tracking, setTracking] = useState<Record<string, string>>({})

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const t: Record<string, string> = { slug, referrer: document.referrer.slice(0, 300) }
    for (const k of TRACK_PARAMS) {
      const v = p.get(k)
      if (v) t[k] = v
    }
    const fbp = readCookie('_fbp')
    if (fbp) t.fbp = fbp
    const fbc = readCookie('_fbc')
    if (fbc) t.fbc = fbc
    else if (t.fbclid) {
      // Meta's _fbc format: fb.<subdomainIndex>.<ms>.<fbclid>; index = levels in the host minus one
      // (ilift.com → 1, www.ilift.com → 2). The pixel usually sets the cookie itself; this is the fallback.
      const idx = Math.max(1, window.location.hostname.split('.').length - 1)
      t.fbc = `fb.${idx}.${Date.now()}.${t.fbclid}`
    }
    setTracking(t)
  }, [slug])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      company: fd.get('company'),
      pain: fd.get('pain'),
      website: fd.get('website'),
      vertical: slug,
      eventId,
      pageUrl: window.location.href,
      tracking,
    }
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; eid?: string; error?: string }
      if (!res.ok || !json.ok) {
        setError(
          json.error === 'invalid_phone' || json.error === 'phone_required'
            ? 'Please enter a valid mobile number.'
            : 'Something went wrong — call or text 516-322-9380.',
        )
        setBusy(false)
        return
      }
      router.push(`/lp/${slug}/thanks?eid=${encodeURIComponent(json.eid ?? eventId)}`)
    } catch {
      setError('Something went wrong — call or text 516-322-9380.')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="lead-form">
      {/* Honeypot — bots fill it, humans never see it. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Your name</span>
        <input name="name" required autoComplete="name" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Mobile number</span>
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Business name</span>
        <input name="company" required autoComplete="organization" className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">What&apos;s costing you the most right now?</span>
        <select name="pain" required defaultValue="" className={`${inputClass} bg-white`}>
          <option value="" disabled>
            Pick one
          </option>
          {PAINS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg border-2 border-primary-800 bg-primary-700 px-6 py-4 text-lg font-semibold text-white shadow-xl shadow-primary-700/40 hover:bg-primary-800 disabled:opacity-60"
      >
        {busy ? 'Sending…' : submitLabel}
      </button>
      <p className="text-xs text-gray-500">
        By submitting you agree to receive a text and a call from iLift about your request. Msg &amp; data rates may
        apply. Reply STOP to opt out. See our{' '}
        <a href="/privacy" className="underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  )
}
