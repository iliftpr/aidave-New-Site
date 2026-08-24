import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/lead-machine/db', () => ({
  getSync: vi.fn(async (form_id: string) => ({ form_id, last_created_time: '2026-08-20T00:00:00Z', consecutive_errors: 0 })),
  setSync: vi.fn(async () => undefined),
}))
vi.mock('@/lib/lead-machine/intake', () => ({
  processLead: vi.fn(async () => ({ ok: true, id: 'l', deduped: false })),
}))
vi.mock('@/lib/lead-machine/telegram', () => ({ sendTelegramText: vi.fn(async () => ({ sent: true })) }))

import { mapMetaLead, syncMetaLeads, type MetaLead } from '@/lib/lead-machine/meta-leads'
import * as db from '@/lib/lead-machine/db'
import { processLead } from '@/lib/lead-machine/intake'
import { sendTelegramText } from '@/lib/lead-machine/telegram'

const metaLead: MetaLead = {
  id: '9001',
  created_time: '2026-08-24T12:00:00+0000',
  ad_id: '1',
  ad_name: 'Ad A',
  adset_name: 'Set 1',
  campaign_name: 'Camp',
  form_id: 'form1',
  field_data: [
    { name: 'full_name', values: ['Mike Rodriguez'] },
    { name: 'phone_number', values: ['p:+15163229380'] },
    { name: 'email', values: ['mike@example.com'] },
    { name: 'company_name', values: ['Rodriguez HVAC'] },
    { name: "what's_costing_you_the_most_right_now?", values: ['Missed calls'] },
  ],
}

const fetchMock = () => fetch as unknown as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(db.getSync).mockImplementation(async (form_id: string) => ({
    form_id,
    last_created_time: '2026-08-20T00:00:00Z',
    consecutive_errors: 0,
  }))
  vi.mocked(processLead).mockResolvedValue({ ok: true, id: 'l', deduped: false })
  vi.stubEnv('META_PAGE_TOKEN', 'ptok')
  vi.stubEnv('META_LEAD_FORM_IDS', 'form1')
})

describe('mapMetaLead', () => {
  it('maps standard + custom fields', () => {
    const m = mapMetaLead(metaLead)
    expect(m).toMatchObject({
      name: 'Mike Rodriguez',
      phone: 'p:+15163229380',
      email: 'mike@example.com',
      company: 'Rodriguez HVAC',
      pain: 'missed_calls',
      metaLeadId: '9001',
      source: 'meta_form',
    })
    expect(m.tracking).toMatchObject({ ad_name: 'Ad A', adset_name: 'Set 1', campaign_name: 'Camp', meta_form_id: 'form1' })
  })
  it('leaves pain null when the answer is unknown', () => {
    const m = mapMetaLead({ ...metaLead, field_data: [{ name: 'costing', values: ['Something else'] }] })
    expect(m.pain).toBeNull()
  })
})

describe('syncMetaLeads', () => {
  it('fetches after the watermark, processes, advances the watermark', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ data: [metaLead] }), { status: 200 })))
    const r = await syncMetaLeads()
    const url = String(fetchMock().mock.calls[0][0])
    expect(url).toContain('/form1/leads')
    expect(url).toContain('access_token=ptok')
    expect(decodeURIComponent(url)).toContain('"field":"time_created"')
    expect(decodeURIComponent(url)).toContain(`"value":${Math.floor(Date.parse('2026-08-20T00:00:00Z') / 1000)}`)
    expect(processLead).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'meta_form', metaLeadId: '9001', context: { eventId: 'meta:9001', sourceUrl: 'https://www.facebook.com/' } }),
    )
    expect(db.setSync).toHaveBeenCalledWith(
      expect.objectContaining({ form_id: 'form1', last_created_time: '2026-08-24T12:00:00.000Z', consecutive_errors: 0, last_error: null }),
    )
    expect(r).toEqual({ forms: 1, fetched: 1, processed: 1, errors: 0 })
  })

  it('counts deduped leads as fetched but not processed', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ data: [metaLead] }), { status: 200 })))
    vi.mocked(processLead).mockResolvedValueOnce({ ok: true, id: 'old', deduped: true })
    expect(await syncMetaLeads()).toEqual({ forms: 1, fetched: 1, processed: 0, errors: 0 })
  })

  it('records an error and increments consecutive_errors on a Graph failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { message: 'bad token', code: 190 } }), { status: 400 })))
    const r = await syncMetaLeads()
    expect(r.errors).toBe(1)
    expect(db.setSync).toHaveBeenCalledWith(
      expect.objectContaining({ consecutive_errors: 1, last_error: expect.stringContaining('190'), last_created_time: '2026-08-20T00:00:00Z' }),
    )
    expect(sendTelegramText).not.toHaveBeenCalled()
  })

  it('alerts on the third consecutive failure', async () => {
    vi.mocked(db.getSync).mockResolvedValueOnce({ form_id: 'form1', last_created_time: '2026-08-20T00:00:00Z', consecutive_errors: 2 })
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })))
    await syncMetaLeads()
    expect(sendTelegramText).toHaveBeenCalledWith(expect.stringContaining('form1'))
  })

  it('does nothing without a page token', async () => {
    vi.stubEnv('META_PAGE_TOKEN', '')
    expect(await syncMetaLeads()).toEqual({ forms: 0, fetched: 0, processed: 0, errors: 0, skipped: 'not_configured' })
  })
})
