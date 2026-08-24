import { NextRequest, NextResponse } from 'next/server'
import { checkChatRateLimit, extractIp } from '@/lib/rate-limit'
import { processLead } from '@/lib/lead-machine/intake'
import { LP_SLUGS } from '@/lib/lp-content'
import { PAIN_LABELS } from '@/lib/lead-machine/types'

export const runtime = 'nodejs'

const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'fbp',
  'fbc',
  'referrer',
  'slug',
] as const

const EMAIL_RE = /^[^\s@<>"'\\]+@[^\s@<>"'\\]+\.[^\s@<>"'\\]+$/
const EVENT_ID_RE = /^[A-Za-z0-9_-]{8,80}$/
const FBP_RE = /^fb\.\d\.\d{10,16}\.\d{1,20}$/
const FBC_RE = /^fb\.\d\.\d{10,16}\.[A-Za-z0-9_-]{1,256}$/
const SITE_ORIGINS = ['https://www.ilift.com', 'https://ilift.com', 'http://localhost:3000', 'http://localhost:3111']

function safePageUrl(raw: string): string {
  try {
    const u = new URL(raw)
    if (SITE_ORIGINS.includes(u.origin) && u.pathname.startsWith('/lp/')) return `${u.origin}${u.pathname}`
  } catch {
    /* fall through */
  }
  return 'https://www.ilift.com/lp'
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  // Honeypot: bots fill "website"; humans never see it. Swallow silently.
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true })
  }

  const ip = extractIp(request.headers)
  const rl = checkChatRateLimit(`lead:${ip}`, { minuteCap: 5, dayCap: 40 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  const str = (k: string, max = 200) =>
    typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : ''
  const name = str('name')
  const phone = str('phone', 40)
  const company = str('company')
  const email = str('email')
  const pain = str('pain', 40)
  const vertical = str('vertical', 40)
  const eventId = str('eventId', 80)
  const pageUrl = str('pageUrl', 500)

  if (!phone) return NextResponse.json({ error: 'phone_required' }, { status: 400 })
  if (vertical && !(LP_SLUGS as readonly string[]).includes(vertical)) {
    return NextResponse.json({ error: 'bad_vertical' }, { status: 400 })
  }
  if (pain && !(pain in PAIN_LABELS)) return NextResponse.json({ error: 'bad_pain' }, { status: 400 })
  if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: 'bad_email' }, { status: 400 })

  const rawTracking = (
    body.tracking && typeof body.tracking === 'object' ? body.tracking : {}
  ) as Record<string, unknown>
  const tracking: Record<string, string> = {}
  for (const k of TRACKING_KEYS) {
    if (typeof rawTracking[k] === 'string') tracking[k] = (rawTracking[k] as string).slice(0, 300)
  }
  // Only forward Meta identifiers that look like Meta identifiers — anything else would poison attribution.
  if (tracking.fbp && !FBP_RE.test(tracking.fbp)) delete tracking.fbp
  if (tracking.fbc && !FBC_RE.test(tracking.fbc)) delete tracking.fbc

  const eid = EVENT_ID_RE.test(eventId) ? eventId : crypto.randomUUID()
  try {
    const result = await processLead({
      name,
      phone,
      email: email || null,
      company: company || null,
      pain: pain || null,
      vertical: vertical || null,
      source: 'meta_lp',
      tracking,
      context: {
        eventId: eid,
        sourceUrl: safePageUrl(pageUrl),
        ip,
        ua: request.headers.get('user-agent'),
      },
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    // A deduped submission sent no CAPI event, so hand back no event id: the thanks page then fires no browser Lead either.
    return NextResponse.json({ ok: true, eid: result.deduped ? null : eid, deduped: result.deduped })
  } catch (err) {
    console.error('[api/lead] failed', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
