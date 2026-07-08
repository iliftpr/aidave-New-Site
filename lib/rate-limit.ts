type Bucket = {
  minuteCount: number
  minuteResetAt: number
  dayCount: number
  dayResetAt: number
}

const buckets = new Map<string, Bucket>()

const MINUTE_MS = 60_000
const DAY_MS = 24 * 60 * 60_000

const DEFAULT_MINUTE_CAP = 10
const DEFAULT_DAY_CAP = 100

const VOICE_HOUR_MS = 60 * 60_000
const VOICE_HOUR_CAP = 5
const voiceBuckets = new Map<string, { count: number; resetAt: number }>()

function gc(now: number) {
  if (buckets.size > 5_000) {
    for (const [k, v] of buckets) {
      if (v.dayResetAt < now && v.minuteResetAt < now) buckets.delete(k)
    }
  }
  if (voiceBuckets.size > 1_000) {
    for (const [k, v] of voiceBuckets) {
      if (v.resetAt < now) voiceBuckets.delete(k)
    }
  }
}

export function checkChatRateLimit(
  ip: string,
  opts: { minuteCap?: number; dayCap?: number } = {}
): { ok: true } | { ok: false; retryAfter: number; reason: 'minute' | 'day' } {
  const now = Date.now()
  gc(now)

  const minuteCap = opts.minuteCap ?? DEFAULT_MINUTE_CAP
  const dayCap = opts.dayCap ?? DEFAULT_DAY_CAP

  let bucket = buckets.get(ip)
  if (!bucket) {
    bucket = {
      minuteCount: 0,
      minuteResetAt: now + MINUTE_MS,
      dayCount: 0,
      dayResetAt: now + DAY_MS,
    }
    buckets.set(ip, bucket)
  }

  if (now >= bucket.minuteResetAt) {
    bucket.minuteCount = 0
    bucket.minuteResetAt = now + MINUTE_MS
  }
  if (now >= bucket.dayResetAt) {
    bucket.dayCount = 0
    bucket.dayResetAt = now + DAY_MS
  }

  if (bucket.dayCount >= dayCap) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.dayResetAt - now) / 1000),
      reason: 'day',
    }
  }
  if (bucket.minuteCount >= minuteCap) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.minuteResetAt - now) / 1000),
      reason: 'minute',
    }
  }

  bucket.minuteCount++
  bucket.dayCount++
  return { ok: true }
}

export function checkVoiceRateLimit(
  ip: string
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now()
  gc(now)

  let bucket = voiceBuckets.get(ip)
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + VOICE_HOUR_MS }
    voiceBuckets.set(ip, bucket)
  }

  if (bucket.count >= VOICE_HOUR_CAP) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count++
  return { ok: true }
}

// On Vercel, x-forwarded-for is append-only: the LAST entry is Vercel's verified
// client IP. Trusting the first entry lets a client spoof its IP via the header.
export function extractIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) {
    const parts = fwd.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]!
  }
  const real = headers.get('x-real-ip')
  if (real) return real.trim()
  // Avoid the shared 'unknown' bucket (would let any header-stripped attacker DoS
  // legitimate proxy-less users) — give each header-less request its own ephemeral key.
  return `anon-${Math.random().toString(36).slice(2, 10)}`
}
