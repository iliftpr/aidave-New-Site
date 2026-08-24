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

  const eid = eventId || crypto.randomUUID()
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
        sourceUrl: pageUrl || 'https://www.ilift.com/lp',
        ip,
        ua: request.headers.get('user-agent'),
      },
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ ok: true, eid, deduped: result.deduped })
  } catch (err) {
    console.error('[api/lead] failed', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
