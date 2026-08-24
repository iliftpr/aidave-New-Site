import { env } from './env'
import { PAIN_LABELS, type LeadForNotify, type SideEffectResult } from './types'

function esc(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildTelegramText(lead: LeadForNotify): string {
  const t = (lead.tracking ?? {}) as Record<string, unknown>
  const ad = [t.campaign_name, t.adset_name, t.ad_name].filter(Boolean).join(' › ')
  const where = lead.source === 'meta_form' ? 'Instant Form' : 'Landing page'
  const lines = [
    `🔥 <b>New lead</b> (${esc(where)}${lead.vertical ? ' · ' + esc(lead.vertical) : ''})`,
    `<b>${esc(lead.name || 'No name')}</b>${lead.company ? ' — ' + esc(lead.company) : ''}`,
    lead.phone_e164 ? `📞 <a href="tel:${esc(lead.phone_e164)}">${esc(lead.phone_e164)}</a>` : '📞 no phone',
    lead.email ? `✉️ ${esc(lead.email)}` : '',
    lead.pain ? `Pain: ${esc(PAIN_LABELS[lead.pain] ?? lead.pain)}` : '',
    ad ? `Ad: ${esc(ad)}` : '',
    `${env.siteUrl()}/leads`,
  ]
  return lines.filter(Boolean).join('\n')
}

/** Raw send — also used by the poller for failure alerts. */
export async function sendTelegramText(text: string): Promise<SideEffectResult> {
  const token = env.telegramToken()
  const chatId = env.telegramChatId()
  if (!token || !chatId) return { sent: false, reason: 'not_configured' }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    console.error('[lead-machine] telegram failed', res.status, await res.text().catch(() => ''))
    return { sent: false, reason: `http_${res.status}` }
  }
  return { sent: true }
}

export function sendTelegramPing(lead: LeadForNotify): Promise<SideEffectResult> {
  return sendTelegramText(buildTelegramText(lead))
}
