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

/** A form seen for the first time starts here, so a launch never replays historical leads. */
export const FIRST_RUN_LOOKBACK_MS = 10 * 60_000
/** Re-read one second of overlap so ties at the watermark second are never skipped (dedupe by meta_lead_id). */
const OVERLAP_SECONDS = 1
const MAX_PAGES = 10

function field(lead: MetaLead, ...names: string[]): string | undefined {
  for (const n of names) {
    const f = lead.field_data.find((x) => x.name.toLowerCase() === n)
    if (f?.values?.[0]) return f.values[0]
  }
  return undefined
}

function esc(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
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
  invalid: number
  errors: number
  skipped?: string
}

interface GraphPage {
  data?: MetaLead[]
  paging?: { next?: string }
  error?: { message: string; code: number }
}

/** Fetch every page of leads newer than `sinceUnix` (strict >), oldest first. Throws on a Graph error. */
async function fetchLeadsSince(formId: string, token: string, sinceUnix: number): Promise<MetaLead[]> {
  const q = new URLSearchParams({
    access_token: token,
    fields: 'id,created_time,ad_id,ad_name,adset_name,campaign_name,form_id,field_data',
    filtering: JSON.stringify([{ field: 'time_created', operator: 'GREATER_THAN', value: sinceUnix }]),
    limit: '100',
  })
  let url: string | undefined = `https://graph.facebook.com/${env.metaGraphVersion()}/${formId}/leads?${q}`
  const all: MetaLead[] = []
  for (let page = 0; url && page < MAX_PAGES; page++) {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    const json = (await res.json().catch(() => ({}))) as GraphPage
    if (!res.ok || json.error) {
      throw new Error(`graph ${res.status} code=${json.error?.code ?? '?'} ${json.error?.message ?? ''}`.trim())
    }
    all.push(...(json.data ?? []))
    url = json.paging?.next
  }
  return all.sort((a, b) => a.created_time.localeCompare(b.created_time))
}

/** Poll every configured Instant Form for leads newer than its watermark and push them through processLead. */
export async function syncMetaLeads(): Promise<SyncResult> {
  const token = env.metaPageToken()
  const forms = env.metaLeadFormIds()
  if (!token || forms.length === 0) {
    return { forms: 0, fetched: 0, processed: 0, invalid: 0, errors: 0, skipped: 'not_configured' }
  }

  const out: SyncResult = { forms: forms.length, fetched: 0, processed: 0, invalid: 0, errors: 0 }

  for (const formId of forms) {
    const sync = await getSync(formId)
    if (!sync.exists) {
      // First time we see this form: start from "now minus a few minutes", never from history.
      const seed = new Date(Date.now() - FIRST_RUN_LOOKBACK_MS).toISOString()
      await setSync({ form_id: formId, last_created_time: seed, consecutive_errors: 0, last_error: null })
      sync.last_created_time = seed
    }
    const sinceUnix = Math.floor(new Date(sync.last_created_time).getTime() / 1000) - OVERLAP_SECONDS

    try {
      const leads = await fetchLeadsSince(formId, token, sinceUnix)
      out.fetched += leads.length
      let watermark = sync.last_created_time
      for (const lead of leads) {
        const mapped = mapMetaLead(lead)
        // Throws (DB down, etc.) abort the batch WITHOUT advancing the watermark — retried next minute.
        const r = await processLead({
          ...mapped,
          context: { eventId: `meta:${lead.id}`, sourceUrl: 'https://www.facebook.com/' },
        })
        if (!r.ok) {
          // Unusable record (e.g. no valid phone): log and move past it so it cannot block the form.
          out.invalid++
          console.warn('[meta-leads] skipped lead', lead.id, r.error)
        } else if (!r.deduped) {
          out.processed++
        }
        const t = new Date(lead.created_time).toISOString()
        if (t > watermark) watermark = t
      }
      await setSync({ form_id: formId, last_created_time: watermark, consecutive_errors: 0, last_error: null })
    } catch (err) {
      out.errors++
      const msg = (err instanceof Error ? err.message : String(err)).slice(0, 300)
      const n = (sync.consecutive_errors ?? 0) + 1
      console.error('[meta-leads] form', formId, 'failed:', msg)
      await setSync({
        form_id: formId,
        last_created_time: sync.last_created_time,
        consecutive_errors: n,
        last_error: msg,
      }).catch(() => undefined)
      if (n === 3) {
        await sendTelegramText(
          `⚠️ Instant-Form lead sync failing for form ${esc(formId)} (3×): ${esc(msg.slice(0, 200))}`,
        ).catch(() => undefined)
      }
    }
  }
  return out
}
