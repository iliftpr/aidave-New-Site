import { Resend } from 'resend'
import { env } from './env'
import { firstName, type LeadForNotify, type SideEffectResult } from './types'

export function buildConfirmationText(lead: LeadForNotify): string {
  return [
    `Hi ${firstName(lead.name)},`,
    '',
    "Thanks for reaching out. I'll text you shortly. If you'd rather just grab a time now, here's my calendar for a free 15-minute look:",
    env.auditUrl(),
    '',
    '— Dave',
    'iLift · 516-322-9380',
  ].join('\n')
}

export async function sendConfirmationEmail(lead: LeadForNotify): Promise<SideEffectResult> {
  if (!lead.email) return { sent: false, reason: 'no_email' }
  if (!env.resendKey()) return { sent: false, reason: 'not_configured' }
  const resend = new Resend(env.resendKey())
  const { error } = await resend.emails.send({
    from: 'Dave at iLift <dave@ilift.com>',
    to: lead.email,
    subject: 'Got it — here is the 15-minute look',
    text: buildConfirmationText(lead),
  })
  if (error) {
    console.error('[lead-machine] resend failed', error)
    return { sent: false, reason: 'resend_error' }
  }
  return { sent: true }
}
