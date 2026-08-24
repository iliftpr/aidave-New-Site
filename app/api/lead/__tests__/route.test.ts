import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/lead-machine/intake', () => ({
  processLead: vi.fn(async () => ({ ok: true, id: 'lead-1', deduped: false })),
}))

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/lead/route'
import { processLead } from '@/lib/lead-machine/intake'

function req(body: unknown, ip = '9.9.9.9') {
  return new NextRequest('https://www.ilift.com/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, 'user-agent': 'UA' },
    body: JSON.stringify(body),
  })
}

const good = {
  name: 'Mike',
  phone: '516-322-9380',
  company: 'HVAC Co',
  pain: 'missed_calls',
  vertical: 'contractors',
  eventId: 'evt-00000001',
  pageUrl: 'https://www.ilift.com/lp/contractors',
  tracking: { utm_source: 'meta', fbp: 'fb.1.1700000000000.123456', junk: 'dropped' },
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(processLead).mockResolvedValue({ ok: true, id: 'lead-1', deduped: false })
})

describe('POST /api/lead', () => {
  it('accepts a valid lead and forwards a whitelisted tracking object', async () => {
    const res = await POST(req(good, '1.1.1.1'))
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ ok: true, eid: 'evt-00000001', deduped: false })
    expect(processLead).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'meta_lp',
        vertical: 'contractors',
        tracking: { utm_source: 'meta', fbp: 'fb.1.1700000000000.123456' },
        context: expect.objectContaining({ eventId: 'evt-00000001', ip: '1.1.1.1', ua: 'UA' }),
      }),
    )
  })

  it('honeypot → 200 and no processing', async () => {
    const res = await POST(req({ ...good, website: 'http://spam' }, '2.2.2.2'))
    expect(res.status).toBe(200)
    expect(processLead).not.toHaveBeenCalled()
  })

  it('400 on missing phone', async () => {
    expect((await POST(req({ ...good, phone: '' }, '3.3.3.3'))).status).toBe(400)
  })

  it('400 on unknown vertical / pain / bad email', async () => {
    expect((await POST(req({ ...good, vertical: 'crypto' }, '4.4.4.4'))).status).toBe(400)
    expect((await POST(req({ ...good, pain: 'other' }, '4.4.4.4'))).status).toBe(400)
    expect((await POST(req({ ...good, email: 'not-an-email' }, '4.4.4.4'))).status).toBe(400)
  })

  it('400 when intake reports an invalid phone', async () => {
    vi.mocked(processLead).mockResolvedValueOnce({ ok: false, error: 'invalid_phone' })
    const res = await POST(req(good, '5.5.5.5'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'invalid_phone' })
  })

  it('429 after the minute cap', async () => {
    for (let i = 0; i < 5; i++) expect((await POST(req(good, '7.7.7.7'))).status).toBe(200)
    const res = await POST(req(good, '7.7.7.7'))
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBeTruthy()
  })

  it('500 when the must-succeed insert throws', async () => {
    vi.mocked(processLead).mockRejectedValueOnce(new Error('insertLead failed'))
    expect((await POST(req(good, '6.6.6.6'))).status).toBe(500)
  })

  it('generates an event id when the client sends none or a malformed one', async () => {
    const res = await POST(req({ ...good, eventId: undefined }, '8.8.8.8'))
    expect((await res.json()).eid).toMatch(/^[0-9a-f-]{36}$/)
    const res2 = await POST(req({ ...good, eventId: '<script>' }, '8.8.8.8'))
    expect((await res2.json()).eid).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('returns no event id for a deduped submission', async () => {
    vi.mocked(processLead).mockResolvedValueOnce({ ok: true, id: 'old', deduped: true })
    const res = await POST(req(good, '10.10.10.10'))
    expect(await res.json()).toEqual({ ok: true, eid: null, deduped: true })
  })

  it('drops malformed fbp/fbc and rewrites the page url to the canonical LP', async () => {
    await POST(req({ ...good, pageUrl: 'https://evil.example/x?y=1', tracking: { fbp: 'nope', fbc: 'fb.1.1700000000000.abc', utm_source: 'meta' } }, '11.11.11.11'))
    const call = vi.mocked(processLead).mock.calls[0][0]
    expect(call.tracking).toEqual({ fbc: 'fb.1.1700000000000.abc', utm_source: 'meta' })
    expect(call.context.sourceUrl).toBe('https://www.ilift.com/lp')
    vi.clearAllMocks()
    await POST(req({ ...good, pageUrl: 'https://www.ilift.com/lp/contractors?utm_source=meta&fbclid=zzz' }, '12.12.12.12'))
    expect(vi.mocked(processLead).mock.calls[0][0].context.sourceUrl).toBe('https://www.ilift.com/lp/contractors')
  })
})
