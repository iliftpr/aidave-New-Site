import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/lead-machine/db', () => ({
  insertLead: vi.fn(async () => 'lead-1'),
  findRecentLeadByPhone: vi.fn(async () => null),
  findLeadByMetaId: vi.fn(async () => null),
}))
vi.mock('@/lib/lead-machine/sms', () => ({ sendLeadSms: vi.fn(async () => ({ sent: true })) }))
vi.mock('@/lib/lead-machine/telegram', () => ({ sendTelegramPing: vi.fn(async () => ({ sent: true })) }))
vi.mock('@/lib/lead-machine/capi', () => ({ sendCapiLead: vi.fn(async () => ({ sent: true })) }))
vi.mock('@/lib/lead-machine/email', () => ({ sendConfirmationEmail: vi.fn(async () => ({ sent: true })) }))

import { processLead, type LeadInput } from '@/lib/lead-machine/intake'
import * as db from '@/lib/lead-machine/db'
import * as sms from '@/lib/lead-machine/sms'
import * as tg from '@/lib/lead-machine/telegram'
import * as capi from '@/lib/lead-machine/capi'

const input: LeadInput = {
  name: 'Mike Rodriguez',
  phone: '516-322-9380',
  company: 'Rodriguez HVAC',
  pain: 'missed_calls',
  vertical: 'contractors',
  source: 'meta_lp',
  tracking: { utm_source: 'meta' },
  context: { eventId: 'evt-1', sourceUrl: 'https://www.ilift.com/lp/contractors' },
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(db.insertLead).mockResolvedValue('lead-1')
  vi.mocked(db.findRecentLeadByPhone).mockResolvedValue(null)
  vi.mocked(db.findLeadByMetaId).mockResolvedValue(null)
})

describe('processLead', () => {
  it('inserts, then fans out, and returns the id', async () => {
    const r = await processLead(input)
    expect(r).toEqual({ ok: true, id: 'lead-1', deduped: false })
    expect(db.insertLead).toHaveBeenCalledWith(
      expect.objectContaining({ phone_e164: '+15163229380', source: 'meta_lp', pain: 'missed_calls', tracking: { utm_source: 'meta', event_id: 'evt-1' } }),
    )
    expect(sms.sendLeadSms).toHaveBeenCalledWith(expect.objectContaining({ id: 'lead-1', phone_e164: '+15163229380' }))
    expect(tg.sendTelegramPing).toHaveBeenCalled()
    expect(capi.sendCapiLead).toHaveBeenCalledWith(expect.objectContaining({ id: 'lead-1' }), input.context)
  })

  it('rejects a lead with no usable phone', async () => {
    const r = await processLead({ ...input, phone: 'nope' })
    expect(r).toEqual({ ok: false, error: 'invalid_phone' })
    expect(db.insertLead).not.toHaveBeenCalled()
  })

  it('dedupes within 24h by phone and sends nothing', async () => {
    vi.mocked(db.findRecentLeadByPhone).mockResolvedValueOnce({ id: 'old', created_at: 'x', status: 'new', source: 'meta_lp' })
    const r = await processLead(input)
    expect(r).toEqual({ ok: true, id: 'old', deduped: true })
    expect(db.insertLead).not.toHaveBeenCalled()
    expect(sms.sendLeadSms).not.toHaveBeenCalled()
    expect(tg.sendTelegramPing).not.toHaveBeenCalled()
  })

  it('dedupes by meta_lead_id', async () => {
    vi.mocked(db.findLeadByMetaId).mockResolvedValueOnce({ id: 'old', created_at: 'x', status: 'new', source: 'meta_form' })
    const r = await processLead({ ...input, source: 'meta_form', metaLeadId: 'm1' })
    expect(r).toEqual({ ok: true, id: 'old', deduped: true })
    expect(db.findLeadByMetaId).toHaveBeenCalledWith('m1')
    expect(db.insertLead).not.toHaveBeenCalled()
  })

  it('side-effect failures never fail the request', async () => {
    vi.mocked(sms.sendLeadSms).mockRejectedValueOnce(new Error('twilio down'))
    vi.mocked(tg.sendTelegramPing).mockRejectedValueOnce(new Error('tg down'))
    vi.mocked(capi.sendCapiLead).mockResolvedValueOnce({ sent: false, reason: 'discarded' })
    const r = await processLead(input)
    expect(r).toEqual({ ok: true, id: 'lead-1', deduped: false })
  })

  it('insert failure propagates (must-succeed)', async () => {
    vi.mocked(db.insertLead).mockRejectedValueOnce(new Error('insertLead failed: 500'))
    await expect(processLead(input)).rejects.toThrow(/insertLead/)
    expect(sms.sendLeadSms).not.toHaveBeenCalled()
  })
})
