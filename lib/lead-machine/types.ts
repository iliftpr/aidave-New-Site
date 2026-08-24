import type { LeadSourceKind } from './db'

/** The lead shape every side effect (SMS, Telegram, CAPI, email) receives. */
export interface LeadForNotify {
  id: string
  name?: string | null
  email?: string | null
  phone_e164?: string | null
  company?: string | null
  pain?: string | null
  vertical?: string | null
  source: LeadSourceKind
  tracking?: Record<string, unknown>
}

export type SideEffectResult = { sent: true } | { sent: false; reason: string }

export const PAIN_LABELS: Record<string, string> = {
  missed_calls: 'missed calls',
  no_shows: 'no-shows',
  not_enough_leads: 'not enough leads',
  reviews: 'reviews',
}

export function firstName(name?: string | null): string {
  return (name ?? '').trim().split(/\s+/)[0] || 'there'
}
