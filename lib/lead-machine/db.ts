import { env } from './env'

export type LeadStatus = 'new' | 'contacted' | 'call_booked' | 'won' | 'lost'
export type LeadSourceKind = 'meta_lp' | 'meta_form'

export interface LeadInsert {
  name?: string | null
  email?: string | null
  phone?: string | null
  phone_e164?: string | null
  company?: string | null
  source: LeadSourceKind
  service?: string | null
  message?: string | null
  vertical?: string | null
  pain?: string | null
  tracking?: Record<string, unknown>
  meta_lead_id?: string | null
  status?: LeadStatus
}

export interface LeadRow extends LeadInsert {
  id: string
  created_at: string
  status: LeadStatus
  notes?: string | null
  called_at?: string | null
}

export interface SyncRow {
  form_id: string
  last_created_time: string
  last_run_at?: string | null
  last_error?: string | null
  consecutive_errors: number
}

const TIMEOUT_MS = 8000

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const key = env.supabaseServiceKey()
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

function base(): string {
  const url = env.supabaseUrl()
  if (!url || !env.supabaseServiceKey()) {
    throw new Error('LEADS_SUPABASE_URL / LEADS_SUPABASE_SERVICE_KEY not set')
  }
  return `${url}/rest/v1`
}

async function ok(res: Response, what: string): Promise<Response> {
  if (!res.ok) {
    throw new Error(`${what} failed: ${res.status} ${await res.text().catch(() => '')}`)
  }
  return res
}

/** Must-succeed insert. Throws on any failure so callers can surface a real error. */
export async function insertLead(lead: LeadInsert): Promise<string> {
  const res = await ok(
    await fetch(`${base()}/ilift_leads`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=representation' }),
      body: JSON.stringify({ status: 'new', tracking: {}, ...lead }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }),
    'insertLead',
  )
  const rows = (await res.json()) as { id: string }[]
  return rows[0].id
}

export async function findRecentLeadByPhone(phoneE164: string, hours: number): Promise<LeadRow | null> {
  const since = new Date(Date.now() - hours * 3600_000).toISOString()
  const q = new URLSearchParams({
    select: 'id,created_at,name,phone_e164,status,source',
    phone_e164: `eq.${phoneE164}`,
    created_at: `gte.${since}`,
    order: 'created_at.desc',
    limit: '1',
  })
  const res = await ok(
    await fetch(`${base()}/ilift_leads?${q}`, {
      method: 'GET',
      headers: headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }),
    'findRecentLeadByPhone',
  )
  const rows = (await res.json()) as LeadRow[]
  return rows[0] ?? null
}

export async function findLeadByMetaId(metaLeadId: string): Promise<LeadRow | null> {
  const q = new URLSearchParams({
    select: 'id,created_at,status,source',
    meta_lead_id: `eq.${metaLeadId}`,
    limit: '1',
  })
  const res = await ok(
    await fetch(`${base()}/ilift_leads?${q}`, {
      method: 'GET',
      headers: headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }),
    'findLeadByMetaId',
  )
  const rows = (await res.json()) as LeadRow[]
  return rows[0] ?? null
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<LeadRow, 'status' | 'notes' | 'called_at'>>,
): Promise<void> {
  await ok(
    await fetch(`${base()}/ilift_leads?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(patch),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }),
    'updateLead',
  )
}

export async function listLeads(limit = 200): Promise<LeadRow[]> {
  const q = new URLSearchParams({ select: '*', order: 'created_at.desc', limit: String(limit) })
  const res = await ok(
    await fetch(`${base()}/ilift_leads?${q}`, {
      method: 'GET',
      headers: headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    }),
    'listLeads',
  )
  return (await res.json()) as LeadRow[]
}

export async function getSync(formId: string): Promise<SyncRow> {
  const q = new URLSearchParams({ select: '*', form_id: `eq.${formId}`, limit: '1' })
  const res = await ok(
    await fetch(`${base()}/ilift_lead_sync?${q}`, {
      method: 'GET',
      headers: headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }),
    'getSync',
  )
  const rows = (await res.json()) as SyncRow[]
  return rows[0] ?? { form_id: formId, last_created_time: '1970-01-01T00:00:00Z', consecutive_errors: 0 }
}

export async function setSync(row: SyncRow): Promise<void> {
  await ok(
    await fetch(`${base()}/ilift_lead_sync`, {
      method: 'POST',
      headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ ...row, last_run_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }),
    'setSync',
  )
}
