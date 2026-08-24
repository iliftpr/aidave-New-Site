import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  insertLead,
  findRecentLeadByPhone,
  findLeadByMetaId,
  updateLead,
  listLeads,
  getSync,
  setSync,
} from '@/lib/lead-machine/db'

const calls: { url: string; init: RequestInit }[] = []

beforeEach(() => {
  calls.length = 0
  vi.stubEnv('LEADS_SUPABASE_URL', 'https://x.supabase.co')
  vi.stubEnv('LEADS_SUPABASE_SERVICE_KEY', 'svc')
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, init })
      if (url.includes('/ilift_leads?') && init.method === 'GET') return new Response('[]', { status: 200 })
      if (url.includes('/ilift_leads') && init.method === 'POST') {
        return new Response(JSON.stringify([{ id: 'lead-1' }]), { status: 201 })
      }
      if (url.includes('/ilift_lead_sync?') && init.method === 'GET') return new Response('[]', { status: 200 })
      // undici rejects a body (even '') on null-body statuses like 204
      return new Response(null, { status: 204 })
    }),
  )
})

const h = (c: { init: RequestInit }) => c.init.headers as Record<string, string>

describe('db', () => {
  it('insertLead posts with service headers and returns the id', async () => {
    const id = await insertLead({ name: 'A', phone_e164: '+15163229380', source: 'meta_lp' })
    expect(id).toBe('lead-1')
    const c = calls[0]
    expect(c.url).toBe('https://x.supabase.co/rest/v1/ilift_leads')
    expect(h(c).apikey).toBe('svc')
    expect(h(c).Authorization).toBe('Bearer svc')
    expect(h(c).Prefer).toContain('return=representation')
    expect(JSON.parse(String(c.init.body))).toMatchObject({ status: 'new', phone_e164: '+15163229380' })
  })

  it('insertLead throws on non-2xx (must-succeed step)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('boom', { status: 500 })))
    await expect(insertLead({ source: 'meta_lp' })).rejects.toThrow(/insertLead failed: 500/)
  })

  it('throws a clear error when env is missing', async () => {
    vi.stubEnv('LEADS_SUPABASE_SERVICE_KEY', '')
    await expect(insertLead({ source: 'meta_lp' })).rejects.toThrow(/LEADS_SUPABASE/)
  })

  it('findRecentLeadByPhone filters by phone and window', async () => {
    const r = await findRecentLeadByPhone('+15163229380', 24)
    expect(r).toBeNull()
    expect(calls[0].url).toContain('phone_e164=eq.%2B15163229380')
    expect(calls[0].url).toContain('created_at=gte.')
    expect(calls[0].url).toContain('order=created_at.desc')
  })

  it('findLeadByMetaId filters by meta_lead_id', async () => {
    await findLeadByMetaId('m1')
    expect(calls[0].url).toContain('meta_lead_id=eq.m1')
  })

  it('updateLead patches by id', async () => {
    await updateLead('lead-1', { status: 'contacted' })
    expect(calls[0].init.method).toBe('PATCH')
    expect(calls[0].url).toContain('id=eq.lead-1')
    expect(JSON.parse(String(calls[0].init.body))).toEqual({ status: 'contacted' })
  })

  it('listLeads orders newest first', async () => {
    await listLeads(50)
    expect(calls[0].url).toContain('order=created_at.desc')
    expect(calls[0].url).toContain('limit=50')
  })

  it('getSync returns the default watermark when no row exists', async () => {
    const s = await getSync('form1')
    expect(s.last_created_time).toBe('1970-01-01T00:00:00Z')
    expect(s.consecutive_errors).toBe(0)
  })

  it('setSync upserts with merge-duplicates', async () => {
    await setSync({ form_id: 'form1', last_created_time: '2026-08-24T00:00:00Z', consecutive_errors: 0 })
    expect(h(calls[0]).Prefer).toContain('resolution=merge-duplicates')
    expect(JSON.parse(String(calls[0].init.body))).toMatchObject({ form_id: 'form1' })
  })
})
