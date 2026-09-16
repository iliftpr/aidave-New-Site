import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/lead-machine/db', () => ({
  getSync: vi.fn(),
  setSync: vi.fn(async () => undefined),
}))
vi.mock('@/lib/lead-machine/intake', () => ({
  processLead: vi.fn(async () => ({ ok: true, id: 'l', deduped: false })),
}))
vi.mock('@/lib/lead-machine/telegram', () => ({ sendTelegramText: vi.fn(async () => ({ sent: true })) }))

import { mapMetaLead, syncMetaLeads, FIRST_RUN_LOOKBACK_MS, type MetaLead } from '@/lib/lead-machine/meta-leads'
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
const WATERMARK = '2026-08-20T00:00:00.000Z'
const existing = (over: Partial<db.SyncRow> = {}): db.SyncRow => ({
  form_id: 'form1',
  last_created_time: WATERMARK,
  consecutive_errors: 0,
  exists: true,
  ...over,
})

const fetchMock = () => fetch as unknown as ReturnType<typeof vi.fn>
const page = (data: MetaLead[], next?: string) =>
  new Response(JSON.stringify({ data, paging: next ? { next } : undefined }), { status: 200 })

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(db.getSync).mockResolvedValue(existing())
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
  it('maps the option slug Meta actually returns for a multiple-choice answer', () => {
    // Real /leads payload from the 2026-08-25 Test-Form lead: values are slugs, not labels.
    const slug = (v: string) => ({ ...metaLead, field_data: [{ name: "what's_costing_you_the_most_right_now?", values: [v] }] })
    expect(mapMetaLead(slug('not_enough_leads')).pain).toBe('not_enough_leads')
    expect(mapMetaLead(slug('missed_calls')).pain).toBe('missed_calls')
    expect(mapMetaLead(slug('no_shows')).pain).toBe('no_shows')
    expect(mapMetaLead(slug('reviews')).pain).toBe('reviews')
  })
})

describe('syncMetaLeads', () => {
  it('fetches from one second before the watermark, processes, advances the watermark', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => page([metaLead])))
    const r = await syncMetaLeads()
    const url = decodeURIComponent(String(fetchMock().mock.calls[0][0]))
    expect(url).toContain('/form1/leads')
    expect(url).toContain('access_token=ptok')
    expect(url).toContain('"field":"time_created"')
    expect(url).toContain(`"value":${Math.floor(Date.parse(WATERMARK) / 1000) - 1}`)
    expect(processLead).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'meta_form', metaLeadId: '9001', context: { eventId: 'meta:9001', sourceUrl: 'https://www.facebook.com/' } }),
    )
    expect(db.setSync).toHaveBeenCalledWith(
      expect.objectContaining({ form_id: 'form1', last_created_time: '2026-08-24T12:00:00.000Z', consecutive_errors: 0, last_error: null }),
    )
    expect(r).toEqual({ forms: 1, fetched: 1, processed: 1, invalid: 0, errors: 0 })
  })

  it('never replays history: a form seen for the first time is seeded to now minus the lookback and fetched from there', async () => {
    vi.mocked(db.getSync).mockResolvedValueOnce(existing({ last_created_time: '1970-01-01T00:00:00Z', exists: false }))
    vi.stubGlobal('fetch', vi.fn(async () => page([])))
    const before = Date.now()
    await syncMetaLeads()
    const seedCall = vi.mocked(db.setSync).mock.calls[0][0]
    const seedMs = Date.parse(seedCall.last_created_time)
    expect(before - seedMs).toBeGreaterThanOrEqual(FIRST_RUN_LOOKBACK_MS - 1000)
    expect(before - seedMs).toBeLessThan(FIRST_RUN_LOOKBACK_MS + 5000)
    const url = decodeURIComponent(String(fetchMock().mock.calls[0][0]))
    expect(url).not.toContain('"value":-1')
    expect(url).toContain(`"value":${Math.floor(seedMs / 1000) - 1}`)
  })

  it('follows paging.next and commits the newest timestamp only after every page', async () => {
    const older = { ...metaLead, id: '9000', created_time: '2026-08-24T11:00:00+0000' }
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => (String(url).includes('page2') ? page([metaLead]) : page([older], 'https://graph.facebook.com/page2'))),
    )
    const r = await syncMetaLeads()
    expect(fetchMock()).toHaveBeenCalledTimes(2)
    expect(r.fetched).toBe(2)
    const ids = vi.mocked(processLead).mock.calls.map((c) => c[0].metaLeadId)
    expect(ids).toEqual(['9000', '9001'])
    expect(db.setSync).toHaveBeenLastCalledWith(expect.objectContaining({ last_created_time: '2026-08-24T12:00:00.000Z' }))
  })

  it('counts deduped leads as fetched but not processed', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => page([metaLead])))
    vi.mocked(processLead).mockResolvedValueOnce({ ok: true, id: 'old', deduped: true })
    expect(await syncMetaLeads()).toEqual({ forms: 1, fetched: 1, processed: 0, invalid: 0, errors: 0 })
  })

  it('skips an unusable record (no valid phone) without blocking the form', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => page([metaLead])))
    vi.mocked(processLead).mockResolvedValueOnce({ ok: false, error: 'invalid_phone' })
    const r = await syncMetaLeads()
    expect(r).toEqual({ forms: 1, fetched: 1, processed: 0, invalid: 1, errors: 0 })
    expect(db.setSync).toHaveBeenCalledWith(expect.objectContaining({ last_created_time: '2026-08-24T12:00:00.000Z' }))
  })

  it('a thrown processLead keeps the old watermark so the batch is retried', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => page([metaLead])))
    vi.mocked(processLead).mockRejectedValueOnce(new Error('insertLead failed: 500'))
    const r = await syncMetaLeads()
    expect(r.errors).toBe(1)
    expect(db.setSync).toHaveBeenCalledWith(expect.objectContaining({ last_created_time: WATERMARK, consecutive_errors: 1 }))
  })

  it('records an error and increments consecutive_errors on a Graph failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { message: 'bad token', code: 190 } }), { status: 400 })))
    const r = await syncMetaLeads()
    expect(r.errors).toBe(1)
    expect(db.setSync).toHaveBeenCalledWith(
      expect.objectContaining({ consecutive_errors: 1, last_error: expect.stringContaining('190'), last_created_time: WATERMARK }),
    )
    expect(sendTelegramText).not.toHaveBeenCalled()
  })

  it('alerts on the third consecutive failure, HTML-escaped', async () => {
    vi.mocked(db.getSync).mockResolvedValueOnce(existing({ consecutive_errors: 2 }))
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { message: '<b>boom</b>', code: 1 } }), { status: 500 })))
    await syncMetaLeads()
    const text = vi.mocked(sendTelegramText).mock.calls[0][0]
    expect(text).toContain('form1')
    expect(text).toContain('&lt;b&gt;boom&lt;/b&gt;')
  })

  it('does nothing without a page token', async () => {
    vi.stubEnv('META_PAGE_TOKEN', '')
    expect(await syncMetaLeads()).toEqual({ forms: 0, fetched: 0, processed: 0, invalid: 0, errors: 0, skipped: 'not_configured' })
  })
})
