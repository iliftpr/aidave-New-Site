import { env } from './env'
import { PAIN_LABELS, firstName, type LeadForNotify, type SideEffectResult } from './types'

export function buildSmsText(lead: LeadForNotify): string {
  const pain = (lead.pain && PAIN_LABELS[lead.pain]) || 'your business'
  return `Hey ${firstName(lead.name)} — Dave from iLift. Got your note about ${pain}. Want 2 quick ideas by text, or a free 15-min look? ${env.auditUrl()} — Dave`
}

/** Twilio REST send. Flag-gated: nothing happens until LEAD_SMS_ENABLED=1 (A2P approval). */
export async function sendLeadSms(lead: LeadForNotify): Promise<SideEffectResult> {
  if (!env.smsEnabled()) return { sent: false, reason: 'disabled' }
  if (!lead.phone_e164) return { sent: false, reason: 'no_phone' }
  const sid = env.twilioSid()
  const token = env.twilioToken()
  const from = env.twilioFrom()
  if (!sid || !token || !from) return { sent: false, reason: 'not_configured' }

  const body = new URLSearchParams({ To: lead.phone_e164, From: from, Body: buildSmsText(lead) })
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    console.error('[lead-machine] twilio failed', res.status, await res.text().catch(() => ''))
    return { sent: false, reason: `http_${res.status}` }
  }
  return { sent: true }
}
