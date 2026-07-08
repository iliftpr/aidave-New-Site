// Server-only lead pipeline: every lead lands in the Supabase mailbox table
// (CRM-lite — read/manage in Supabase Studio) and the Resend audience (for
// nurture broadcasts). Both writes are fail-soft: lead capture must never
// break the user-facing flow that triggered it, and each half no-ops when its
// env vars are unset.

export type LeadSource = 'contact_form' | 'dave_agent' | 'cal_booking' | 'scorecard' | 'other'

export interface LeadRecord {
  name?: string
  email: string
  phone?: string
  company?: string
  source: LeadSource
  service?: string
  message?: string
  status?: 'new' | 'contacted' | 'call_booked' | 'proposal' | 'won' | 'lost'
}

export async function recordLead(lead: LeadRecord): Promise<void> {
  await Promise.allSettled([insertSupabase(lead), addToResendAudience(lead)])
}

async function insertSupabase(lead: LeadRecord): Promise<void> {
  const url = process.env.LEADS_SUPABASE_URL
  const key = process.env.LEADS_SUPABASE_ANON_KEY
  if (!url || !key) return
  try {
    const res = await fetch(`${url}/rest/v1/ilift_leads`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: lead.name ?? null,
        email: lead.email,
        phone: lead.phone ?? null,
        company: lead.company ?? null,
        source: lead.source,
        service: lead.service ?? null,
        message: lead.message ?? null,
        status: lead.status ?? 'new',
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.error('[leads] supabase insert failed:', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.error('[leads] supabase insert error (non-fatal):', err)
  }
}

async function addToResendAudience(lead: LeadRecord): Promise<void> {
  const key = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!key || !audienceId) return
  try {
    const [firstName, ...rest] = (lead.name ?? '').trim().split(/\s+/)
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: lead.email,
        first_name: firstName || undefined,
        last_name: rest.join(' ') || undefined,
        unsubscribed: false,
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.error('[leads] resend audience add failed:', res.status)
    }
  } catch (err) {
    console.error('[leads] resend audience error (non-fatal):', err)
  }
}
