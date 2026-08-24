import { createHash } from 'node:crypto'
import { env } from './env'
import type { LeadForNotify, SideEffectResult } from './types'

export function hashPii(v: string): string {
  return createHash('sha256').update(v.trim().toLowerCase()).digest('hex')
}

export interface CapiContext {
  /** Shared with the browser pixel's eventID so Meta dedupes the two. */
  eventId: string
  sourceUrl: string
  ip?: string | null
  ua?: string | null
}

/** Meta Conversions API "Lead". Meta answers 200 with events_received:0 for dropped events — treated as not sent. */
export async function sendCapiLead(lead: LeadForNotify, ctx: CapiContext): Promise<SideEffectResult> {
  const pixel = env.metaPixelId()
  const token = env.metaCapiToken()
  if (!pixel || !token) return { sent: false, reason: 'disabled' }

  const t = (lead.tracking ?? {}) as Record<string, string | undefined>
  const [fn, ...rest] = (lead.name ?? '').trim().split(/\s+/)
  const user_data: Record<string, unknown> = {}
  if (lead.phone_e164) user_data.ph = [hashPii(lead.phone_e164.replace(/\D/g, ''))]
  if (lead.email) user_data.em = [hashPii(lead.email)]
  if (fn) user_data.fn = [hashPii(fn)]
  if (rest.length) user_data.ln = [hashPii(rest.join(' '))]
  if (t.fbp) user_data.fbp = t.fbp
  if (t.fbc) user_data.fbc = t.fbc
  if (ctx.ip) user_data.client_ip_address = ctx.ip
  if (ctx.ua) user_data.client_user_agent = ctx.ua

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: ctx.eventId,
        action_source: 'website',
        event_source_url: ctx.sourceUrl,
        user_data,
        custom_data: { content_name: lead.vertical ?? 'lp', lead_source: lead.source },
      },
    ],
  }

  const url = `https://graph.facebook.com/${env.metaGraphVersion()}/${pixel}/events?access_token=${encodeURIComponent(token)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  })
  const json = (await res.json().catch(() => ({}))) as { events_received?: number; fbtrace_id?: string }
  if (!res.ok) {
    console.error('[lead-machine] capi failed', res.status, JSON.stringify(json))
    return { sent: false, reason: `http_${res.status}` }
  }
  if (!json.events_received) {
    console.warn('[lead-machine] capi ACCEPTED BUT DISCARDED', json.fbtrace_id)
    return { sent: false, reason: 'discarded' }
  }
  return { sent: true }
}
