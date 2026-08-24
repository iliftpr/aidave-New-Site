import { env } from './env'
import { getSync, setSync } from './db'
import { processLead, type LeadInput } from './intake'
import { sendTelegramText } from './telegram'

export interface MetaLead {
  id: string
  created_time: string
  ad_id?: string
  ad_name?: string
  adset_name?: string
  campaign_name?: string
  form_id?: string
  field_data: { name: string; values: string[] }[]
}

const PAIN_BY_LABEL: Record<string, string> = {
  'missed calls': 'missed_calls',
  'no-shows': 'no_shows',
  'no shows': 'no_shows',
  'not enough leads': 'not_enough_leads',
  'bad/few reviews': 'reviews',
  'bad or too few reviews': 'reviews',
  reviews: 'reviews',
}

function field(lead: MetaLead, ...names: string[]): string | undefined {
  for (const n of names) {
    const f = lead.field_data.find((x) => x.name.toLowerCase() === n)
    if (f?.values?.[0]) return f.values[0]
  }
  return undefined
}

export function mapMetaLead(lead: MetaLead): Omit<LeadInput, 'context'> {
  const painRaw = lead.field_data.find((x) => /costing|pain|problem/i.test(x.name))?.values?.[0]
  const pain = painRaw ? (PAIN_BY_LABEL[painRaw.trim().toLowerCase()] ?? null) : null
  return {
    name: field(lead, 'full_name', 'first_name') ?? null,
    phone: field(lead, 'phone_number', 'phone') ?? null,
    email: field(lead, 'email') ?? null,
    company: field(lead, 'company_name', 'business_name', 'company') ?? null,
    pain,
    vertical: null,
    source: 'meta_form',
    metaLeadId: lead.id,
    tracking: {
      ad_id: lead.ad_id,
      ad_name: lead.ad_name,
      adset_name: lead.adset_name,
      campaign_name: lead.campaign_name,
      meta_form_id: lead.form_id,
      meta_created_time: lead.created_time,
    },
  }
}

export interface SyncResult {
  forms: number
  fetched: number
  processed: number
  errors: number
  skipped?: string
}

/** Poll every configured Instant Form for leads newer than its watermark and push them through processLead. */
export async function syncMetaLeads(): Promise<SyncResult> {
  const token = env.metaPageToken()
  const forms = env.metaLeadFormIds()
  if (!token || forms.length === 0) return { forms: 0, fetched: 0, processed: 0, errors: 0, skipped: 'not_configured' }

  const out: SyncResult = { forms: forms.length, fetched: 0, processed: 0, errors: 0 }

  for (const formId of forms) {
    const sync = await getSync(formId)
    const sinceUnix = Math.floor(new Date(sync.last_created_time).getTime() / 1000)
    const q = new URLSearchParams({
      access_token: token,
      fields: 'id,created_time,ad_id,ad_name,adset_name,campaign_name,form_id,field_data',
      filtering: JSON.stringify([{ field: 'time_created', operator: 'GREATER_THAN', value: sinceUnix }]),
      limit: '100',
    })
    try {
      const res = await fetch(`https://graph.facebook.com/${env.metaGraphVersion()}/${formId}/leads?${q}`, {
        signal: AbortSignal.timeout(15000),
      })
      const json = (await res.json().catch(() => ({}))) as {
        data?: MetaLead[]
        error?: { message: string; code: number }
      }
      if (!res.ok || json.error) {
        throw new Error(`graph ${res.status} code=${json.error?.code ?? '?'} ${json.error?.message ?? ''}`.trim())
      }
      const leads = (json.data ?? []).sort((a, b) => a.created_time.localeCompare(b.created_time))
      out.fetched += leads.length
      let watermark = sync.last_created_time
      for (const lead of leads) {
        const mapped = mapMetaLead(lead)
        const r = await processLead({
          ...mapped,
          context: { eventId: `meta:${lead.id}`, sourceUrl: 'https://www.facebook.com/' },
        })
        if (r.ok && !r.deduped) out.processed++
        watermark = new Date(lead.created_time).toISOString()
      }
      await setSync({ form_id: formId, last_created_time: watermark, consecutive_errors: 0, last_error: null })
    } catch (err) {
      out.errors++
      const msg = err instanceof Error ? err.message : String(err)
      const n = (sync.consecutive_errors ?? 0) + 1
      console.error('[meta-leads] form', formId, 'failed:', msg)
      await setSync({
        form_id: formId,
        last_created_time: sync.last_created_time,
        consecutive_errors: n,
        last_error: msg.slice(0, 500),
      }).catch(() => undefined)
      if (n === 3) {
        await sendTelegramText(`⚠️ Instant-Form lead sync failing for form ${formId} (3×): ${msg.slice(0, 200)}`).catch(
          () => undefined,
        )
      }
    }
  }
  return out
}
