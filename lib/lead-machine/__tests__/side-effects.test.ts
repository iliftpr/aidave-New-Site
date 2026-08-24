import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildSmsText, sendLeadSms } from '@/lib/lead-machine/sms'
import { sendTelegramPing, buildTelegramText } from '@/lib/lead-machine/telegram'
import { sendCapiLead, hashPii } from '@/lib/lead-machine/capi'
import { sendConfirmationEmail, buildConfirmationText } from '@/lib/lead-machine/email'
import type { LeadForNotify } from '@/lib/lead-machine/types'

const lead: LeadForNotify = {
  id: 'lead-1',
  name: 'Mike Rodriguez',
  phone_e164: '+15163229380',
  email: 'mike@example.com',
  company: 'Rodriguez HVAC',
  pain: 'missed_calls',
  vertical: 'contractors',
  source: 'meta_lp',
  tracking: { fbp: 'fb.1.1.1', fbc: 'fb.1.1.abc', utm_campaign: 'nmc', campaign_name: 'Camp', ad_name: 'Ad A' },
}

const fetchMock = () => fetch as unknown as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ events_received: 1, fbtrace_id: 't' }), { status: 200 })),
  )
})

describe('sms', () => {
  it('template uses first name and pain label, fits one segment-ish', () => {
    const t = buildSmsText(lead)
    expect(t).toMatch(/^Hey Mike — Dave from iLift\./)
    expect(t).toContain('missed calls')
    expect(t).toContain('cal.com/ilift/automation-audit')
    expect(t).toContain('after hours')
    expect(t.length).toBeLessThanOrEqual(200)
  })
  it('falls back gracefully without a name or pain', () => {
    expect(buildSmsText({ ...lead, name: null, pain: null })).toMatch(/^Hey there — Dave from iLift\. Got your note about your business\./)
  })
  it('does nothing when LEAD_SMS_ENABLED is unset', async () => {
    vi.stubEnv('LEAD_SMS_ENABLED', '')
    expect(await sendLeadSms(lead)).toEqual({ sent: false, reason: 'disabled' })
    expect(fetch).not.toHaveBeenCalled()
  })
  it('posts to Twilio with basic auth when enabled', async () => {
    vi.stubEnv('LEAD_SMS_ENABLED', '1')
    vi.stubEnv('TWILIO_ACCOUNT_SID', 'AC1')
    vi.stubEnv('TWILIO_AUTH_TOKEN', 'tok')
    vi.stubEnv('TWILIO_FROM', '+15550001111')
    const r = await sendLeadSms(lead)
    expect(r).toEqual({ sent: true })
    const [url, init] = fetchMock().mock.calls[0]
    expect(url).toBe('https://api.twilio.com/2010-04-01/Accounts/AC1/Messages.json')
    expect((init.headers as Record<string, string>).Authorization).toBe('Basic ' + Buffer.from('AC1:tok').toString('base64'))
    expect(String(init.body)).toContain('To=%2B15163229380')
    expect(String(init.body)).toContain('From=%2B15550001111')
  })
  it('reports http failures without throwing', async () => {
    vi.stubEnv('LEAD_SMS_ENABLED', '1')
    vi.stubEnv('TWILIO_ACCOUNT_SID', 'AC1')
    vi.stubEnv('TWILIO_AUTH_TOKEN', 'tok')
    vi.stubEnv('TWILIO_FROM', '+15550001111')
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 401 })))
    expect(await sendLeadSms(lead)).toEqual({ sent: false, reason: 'http_401' })
  })
})

describe('telegram', () => {
  it('sends HTML with a tel link and escapes user text', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'b')
    vi.stubEnv('TELEGRAM_CHAT_ID', 'c')
    const r = await sendTelegramPing({ ...lead, company: '<b>x</b>' })
    expect(r).toEqual({ sent: true })
    const [url, init] = fetchMock().mock.calls[0]
    expect(url).toBe('https://api.telegram.org/botb/sendMessage')
    const body = JSON.parse(String(init.body))
    expect(body.chat_id).toBe('c')
    expect(body.text).toContain('tel:+15163229380')
    expect(body.text).toContain('&lt;b&gt;x&lt;/b&gt;')
    expect(body.text).toContain('Camp › Ad A')
  })
  it('labels the source', () => {
    expect(buildTelegramText({ ...lead, source: 'meta_form' })).toContain('Instant Form')
    expect(buildTelegramText(lead)).toContain('Landing page')
  })
  it('is a no-op when not configured', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')
    expect(await sendTelegramPing(lead)).toEqual({ sent: false, reason: 'not_configured' })
  })
})

describe('capi', () => {
  it('hashes lowercase trimmed values', () => {
    expect(hashPii(' Mike ')).toBe(hashPii('mike'))
    expect(hashPii('x')).toMatch(/^[a-f0-9]{64}$/)
  })
  it('sends Lead with event_id, fbp/fbc, hashed phone', async () => {
    vi.stubEnv('NEXT_PUBLIC_META_PIXEL_ID', '123')
    vi.stubEnv('META_CAPI_TOKEN', 'tok')
    const r = await sendCapiLead(lead, { eventId: 'evt-1', sourceUrl: 'https://www.ilift.com/lp/contractors', ip: '1.2.3.4', ua: 'UA' })
    expect(r).toEqual({ sent: true })
    const [url, init] = fetchMock().mock.calls[0]
    expect(url).toContain('/123/events')
    expect(url).toContain('access_token=tok')
    const body = JSON.parse(String(init.body))
    const ev = body.data[0]
    expect(ev.event_name).toBe('Lead')
    expect(ev.event_id).toBe('evt-1')
    expect(ev.action_source).toBe('website')
    expect(ev.user_data.ph[0]).toBe(hashPii('15163229380'))
    expect(ev.user_data.em[0]).toBe(hashPii('mike@example.com'))
    expect(ev.user_data.fn[0]).toBe(hashPii('Mike'))
    expect(ev.user_data.fbp).toBe('fb.1.1.1')
    expect(ev.user_data.fbc).toBe('fb.1.1.abc')
    expect(ev.user_data.client_ip_address).toBe('1.2.3.4')
  })
  it('treats events_received 0 as discarded', async () => {
    vi.stubEnv('NEXT_PUBLIC_META_PIXEL_ID', '123')
    vi.stubEnv('META_CAPI_TOKEN', 'tok')
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ events_received: 0 }), { status: 200 })))
    expect(await sendCapiLead(lead, { eventId: 'evt-2', sourceUrl: 'u' })).toEqual({ sent: false, reason: 'discarded' })
  })
  it('is a no-op without a token', async () => {
    vi.stubEnv('META_CAPI_TOKEN', '')
    expect(await sendCapiLead(lead, { eventId: 'e', sourceUrl: 'u' })).toEqual({ sent: false, reason: 'disabled' })
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('email', () => {
  it('skips when the lead has no email', async () => {
    expect(await sendConfirmationEmail({ ...lead, email: null })).toEqual({ sent: false, reason: 'no_email' })
  })
  it('skips when Resend is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    expect(await sendConfirmationEmail(lead)).toEqual({ sent: false, reason: 'not_configured' })
  })
  it('confirmation text greets by first name and links the calendar', () => {
    const t = buildConfirmationText(lead)
    expect(t).toMatch(/^Hi Mike,/)
    expect(t).toContain('cal.com/ilift/automation-audit')
  })
})
