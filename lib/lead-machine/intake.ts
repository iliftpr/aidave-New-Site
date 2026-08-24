import { insertLead, findRecentLeadByPhone, findLeadByMetaId, type LeadSourceKind } from './db'
import { toE164 } from './phone'
import { sendLeadSms } from './sms'
import { sendTelegramPing } from './telegram'
import { sendCapiLead, type CapiContext } from './capi'
import { sendConfirmationEmail } from './email'
import type { LeadForNotify } from './types'

export interface LeadInput {
  name?: string | null
  phone?: string | null
  email?: string | null
  company?: string | null
  pain?: string | null
  vertical?: string | null
  source: LeadSourceKind
  tracking?: Record<string, unknown>
  metaLeadId?: string | null
  context: CapiContext
}

export type ProcessResult =
  | { ok: true; id: string; deduped: boolean }
  | { ok: false; error: 'invalid_phone' }

const DEDUPE_HOURS = 24
const SIDE_EFFECTS = ['sms', 'telegram', 'capi', 'email'] as const

/**
 * The one path every lead takes (landing page form + Instant-Form poller).
 * Order: validate → dedupe → insert (MUST succeed; throws) → fan-out (fail-soft).
 */
export async function processLead(input: LeadInput): Promise<ProcessResult> {
  const phone_e164 = toE164(input.phone)
  if (!phone_e164) return { ok: false, error: 'invalid_phone' }

  if (input.metaLeadId) {
    const existing = await findLeadByMetaId(input.metaLeadId)
    if (existing) return { ok: true, id: existing.id, deduped: true }
  }
  const recent = await findRecentLeadByPhone(phone_e164, DEDUPE_HOURS)
  if (recent) return { ok: true, id: recent.id, deduped: true }

  const tracking = { ...(input.tracking ?? {}), event_id: input.context.eventId }
  const id = await insertLead({
    name: input.name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    phone_e164,
    company: input.company ?? null,
    source: input.source,
    service: 'ai-receptionist',
    message: [input.vertical, input.pain].filter(Boolean).join(' / ') || null,
    vertical: input.vertical ?? null,
    pain: input.pain ?? null,
    tracking,
    meta_lead_id: input.metaLeadId ?? null,
  })

  const lead: LeadForNotify = {
    id,
    name: input.name,
    email: input.email,
    phone_e164,
    company: input.company,
    pain: input.pain,
    vertical: input.vertical,
    source: input.source,
    tracking,
  }

  // Instant-Form leads are already recorded by Meta as native lead events — replaying them through
  // CAPI as a website Lead would double-count. Only our own landing pages send CAPI.
  const capi =
    input.source === 'meta_lp'
      ? sendCapiLead(lead, input.context)
      : Promise.resolve({ sent: false, reason: 'disabled' } as const)
  const results = await Promise.allSettled([
    sendLeadSms(lead),
    sendTelegramPing(lead),
    capi,
    sendConfirmationEmail(lead),
  ])
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error('[lead-machine] side effect', SIDE_EFFECTS[i], 'threw', r.reason)
    } else if (!r.value.sent && r.value.reason !== 'disabled' && r.value.reason !== 'no_email') {
      console.warn('[lead-machine] side effect', SIDE_EFFECTS[i], 'not sent:', r.value.reason)
    }
  })
  return { ok: true, id, deduped: false }
}
