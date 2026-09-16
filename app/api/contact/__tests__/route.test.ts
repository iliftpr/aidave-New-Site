import { describe, it, expect, vi, beforeEach } from 'vitest'

const { send } = vi.hoisted(() => ({ send: vi.fn() }))

vi.mock('resend', () => ({
  Resend: class {
    emails = { send }
  },
}))

vi.mock('@/lib/leads', () => ({
  recordLead: vi.fn(async () => undefined),
}))

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/contact/route'
import { recordLead } from '@/lib/leads'

function req(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('https://www.ilift.com/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.ilift.com',
      host: 'www.ilift.com',
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

const good = {
  name: 'Maria Lopez',
  email: 'maria@lopezdental.com',
  phone: '516-555-0100',
  message: 'We miss calls after hours.',
  service: 'general',
  elapsedMs: 30_000,
}

const SILENT_OK = { success: true, message: 'Message sent successfully' }

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 're_test')
  send.mockReset()
  send.mockResolvedValue({ data: { id: 'email-1' }, error: null })
})

describe('POST /api/contact', () => {
  it('emails Dave, records the lead and confirms to the visitor', async () => {
    const res = await POST(req(good))
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ success: true, id: 'email-1' })
    expect(send).toHaveBeenCalledTimes(2)
    expect(send.mock.calls[0][0]).toMatchObject({ to: ['dave@ilift.com'], replyTo: good.email })
    expect(recordLead).toHaveBeenCalledWith(expect.objectContaining({ email: good.email, source: 'contact_form' }))
  })

  it('honeypot → silent 200, nothing sent', async () => {
    const res = await POST(req({ ...good, website: 'http://spam' }))
    expect(await res.json()).toEqual(SILENT_OK)
    expect(send).not.toHaveBeenCalled()
  })

  it.each([
    ['missing-origin', {}, { origin: '' }],
    ['cross-origin', {}, { origin: 'https://evil.example' }],
    ['no-timer', { elapsedMs: undefined }, {}],
    ['too-fast', { elapsedMs: 400 }, {}],
    ['gibberish-name', { name: 'XJDBGUngExAjCXFXWps' }, {}],
    ['gibberish-message', { message: 'qtNPeIFRxMdUXUCupoyA' }, {}],
  ])('%s → same silent 200, no email and no lead', async (reason, body, headers) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const res = await POST(req({ ...good, ...body }, headers))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(SILENT_OK)
    expect(send).not.toHaveBeenCalled()
    expect(recordLead).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`Spam filter (${reason})`), expect.any(String))
  })

  it('logs enough of a dropped submission to recover it, clipped', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const long = `Please call me back.\n${'x'.repeat(500)}`
    await POST(req({ ...good, message: long, elapsedMs: 100 }))
    const logged = JSON.parse(warn.mock.calls[0][1] as string)
    expect(logged).toMatchObject({ email: good.email, name: good.name, phone: good.phone, elapsedMs: '100' })
    expect(logged.message).toBe(long.slice(0, 120))
  })

  it('a real visitor who passes the filter still gets field validation', async () => {
    const res = await POST(req({ ...good, email: '' }))
    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })
})
