import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/lead-machine/meta-leads', () => ({
  syncMetaLeads: vi.fn(async () => ({ forms: 1, fetched: 0, processed: 0, errors: 0 })),
}))

import { NextRequest } from 'next/server'
import { GET } from '@/app/api/cron/meta-leads/route'

describe('GET /api/cron/meta-leads', () => {
  it('401 without the cron secret', async () => {
    vi.stubEnv('CRON_SECRET', 's3')
    const res = await GET(new NextRequest('https://www.ilift.com/api/cron/meta-leads'))
    expect(res.status).toBe(401)
  })
  it('401 when the secret is unset (never open by default)', async () => {
    vi.stubEnv('CRON_SECRET', '')
    const res = await GET(new NextRequest('https://www.ilift.com/api/cron/meta-leads', { headers: { authorization: 'Bearer ' } }))
    expect(res.status).toBe(401)
  })
  it('200 with the bearer secret', async () => {
    vi.stubEnv('CRON_SECRET', 's3')
    const res = await GET(new NextRequest('https://www.ilift.com/api/cron/meta-leads', { headers: { authorization: 'Bearer s3' } }))
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ forms: 1 })
  })
})
