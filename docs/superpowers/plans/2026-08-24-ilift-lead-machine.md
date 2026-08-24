# iLift Lead Machine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the end-to-end Meta lead machine on ilift.com — campaign landing pages, a shared lead-intake pipeline (Supabase insert → SMS + Telegram + CAPI + email), an Instant-Form poller, a basic-auth `/leads` pipeline page — and build the paused Meta campaign, per `docs/superpowers/specs/2026-08-24-ilift-lead-machine-design.md`.

**Architecture:** All new server logic lives in `lib/lead-machine/*` as small pure-ish modules that talk to external services through `fetch` (no new SDKs). One orchestrator, `processLead`, is called by two entry points: `POST /api/lead` (landing-page form) and `GET /api/cron/meta-leads` (Instant-Form poller). Pages are static Next 16 App Router routes; the only client component is the lead form. Supabase is accessed with the service-role key via PostgREST from server code only.

**Tech Stack:** Next.js 16 (App Router, React 19, TS, Tailwind v4), Supabase (project `apkiueduxqspzefzybpx`, table `ilift_leads`), Resend (installed), Twilio REST, Telegram Bot API, Meta Graph API (Conversions API + leadgen), Vercel Pro crons, vitest (new), Playwright (new).

**Worktree:** `C:/Users/admin/Documents/AI Dave Website/.worktrees/ilift-lead-machine` on branch `feat/ilift-lead-machine`. Run every command from there. Never touch the main checkout.

**Commit identity:** every commit uses `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit …` and ends the message with:
```
Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0165v3vUwcuh5TE8d8MKgqgd
```

---

## File structure

| Path | Responsibility |
|---|---|
| `vitest.config.ts`, `package.json` scripts | unit test runner (`npm run test:run`, never watch mode) |
| `supabase/migrations/20260824120000_lead_machine.sql` | additive schema: nullable email, tracking/vertical/pain/phone_e164/meta_lead_id/called_at on `ilift_leads`; new `ilift_lead_sync` |
| `lib/lead-machine/env.ts` | typed reads of every env var; single place that knows names |
| `lib/lead-machine/phone.ts` | `toE164` normalizer |
| `lib/lead-machine/db.ts` | PostgREST calls with the service key: insert/find/update/list leads, sync watermarks |
| `lib/lead-machine/sms.ts` | Twilio send (flag-gated) + message template |
| `lib/lead-machine/telegram.ts` | Telegram ping to Dave |
| `lib/lead-machine/capi.ts` | Meta Conversions API `Lead` event |
| `lib/lead-machine/email.ts` | Resend confirmation email to the lead |
| `lib/lead-machine/intake.ts` | `processLead` orchestrator: validate → dedupe → insert (must succeed) → fan-out (fail-soft) |
| `lib/lead-machine/meta-leads.ts` | Graph API leadgen fetch + field mapping + watermark loop |
| `app/api/lead/route.ts` | public POST: honeypot, rate limit, body validation → `processLead` |
| `app/api/cron/meta-leads/route.ts` | cron GET guarded by `CRON_SECRET` → `syncMetaLeads` |
| `vercel.json` | the every-minute cron |
| `lib/lp-content.ts` | copy for the three landing-page variants |
| `app/lp/layout.tsx` | noindex metadata, no global nav |
| `app/lp/[slug]/page.tsx` | landing page |
| `app/lp/[slug]/thanks/page.tsx` | thank-you: pixel Lead (dedup id), cal.com embed, tap-to-call |
| `components/lp/LeadForm.tsx` | client form: fields, honeypot, tracking capture, POST, redirect |
| `components/lp/LeadPixelEvent.tsx` | client: fires `fbq('track','Lead',{},{eventID})` once |
| `middleware.ts` | + HTTP basic auth for `/leads` |
| `lib/lead-machine/basic-auth.ts` | pure check used by middleware (testable) |
| `app/leads/page.tsx`, `app/leads/actions.ts`, `app/leads/LeadRow.tsx` | pipeline page + server actions |
| `e2e/lp.spec.ts`, `playwright.config.ts` | browser test of LP → thanks |
| `docs/lead-machine/OWNER_CHECKLIST.md` | Dave's exact steps (tokens, env, Twilio, campaign flip) |
| `.env.example` | new variable names |

---

### Task 0: Research — best hooks, offers, and cheapest-lead tactics (Firecrawl workflow, runs in parallel)

**Files:**
- Create: `marketing/research/2026-08-24-hooks-offers-research.md` (workflow output, synthesized)

Owner directive (2026-08-24): "incredible media — stills from the best models, the best hooks, and the best way to get clients for the cheapest price; the right offers, researched with Firecrawl."

- [ ] **Step 1: Launch a Workflow** (ultracode) with ≤3 concurrent Firecrawl agents:
  1. **Hooks** — Meta Ad Library + swipe-file sites + 2025–26 case studies for "AI receptionist / missed-call text-back / answering service" ads aimed at contractors, dental/med-spa, restaurants. Return the 15 strongest hook lines with source URLs, grouped by mechanism (curiosity gap, loss aversion, direct address, social proof, contrast).
  2. **Offers** — what competitors (Smith.ai, Ruby, Podium, Goodcall, Dialzara, Rosie, local agencies) sell to this buyer, at what price shape, with what guarantee/trial; which offer shapes convert on cold Meta traffic (free audit vs free trial vs paid pilot vs "first 30 days free"). Return a ranked offer shortlist with the evidence.
  3. **Cheapest leads** — current (2026) Meta lead-ad benchmarks for local services (CPL, CTR), what drives cheap *qualified* leads (Instant Form higher-intent settings, conditional questions, "more volume" vs "higher intent", Advantage+ audience vs interest stacks, creative formats: UGC-style stills vs graphic, 4:5 vs 1:1, video vs static), and the top 5 wastes to avoid.
  Then a **synthesis agent** produces: final hook set per vertical (3 each), the recommended offer + fallback, Instant-Form configuration, and an image brief per ad (subject, setting, emotion, text overlay ≤6 words) tuned for **GPT Image 2** (Dave's standard) with Dave's Higgsfield Soul character for the "Long Island AI guy" ad.
- [ ] **Step 2: Read the result and update** `lib/lp-content.ts` headlines/bullets (Task 8) and the Task 13 creative + copy set from it. Cite sources in the research file; never copy a competitor's line verbatim.
- [ ] **Step 3: Commit** `docs(marketing): hooks/offers/cheap-leads research 2026-08-24`.

---

### Task 1: Test tooling (vitest)

**Files:**
- Modify: `package.json` (scripts + devDependencies)
- Create: `vitest.config.ts`
- Create: `lib/lead-machine/__tests__/smoke.test.ts`

- [ ] **Step 1: Install vitest**

Run: `npm install --save-dev vitest@^3 --no-audit --no-fund`
Expected: `added N packages` and `vitest` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Add scripts (no watch mode — watch hangs sessions on this machine)**

In `package.json` `"scripts"` add:
```json
"test:run": "vitest run",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname) } },
  test: {
    environment: 'node',
    include: ['lib/**/__tests__/**/*.test.ts', 'app/**/__tests__/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
})
```

- [ ] **Step 4: Write a smoke test**

`lib/lead-machine/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('vitest wiring', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 5: Run it**

Run: `npm run test:run`
Expected: `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/lead-machine/__tests__/smoke.test.ts
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -m "chore: add vitest (run mode only)" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_0165v3vUwcuh5TE8d8MKgqgd"
```

---

### Task 2: Migration on `apkiueduxqspzefzybpx`

**Files:**
- Create: `supabase/migrations/20260824120000_lead_machine.sql`

⚠ This Supabase project is shared with OrganicSpa. Additive only. The `anon insert only` RLS policy stays; server code uses the service-role key, which bypasses RLS.

- [ ] **Step 1: Write the migration**

```sql
-- iLift lead machine: additive columns + sync watermark table.
-- Safe on a live table: every change is nullable/defaulted.

alter table public.ilift_leads
  alter column email drop not null,
  add column if not exists phone_e164 text,
  add column if not exists vertical text,
  add column if not exists pain text,
  add column if not exists tracking jsonb not null default '{}'::jsonb,
  add column if not exists meta_lead_id text,
  add column if not exists called_at timestamptz;

create unique index if not exists ilift_leads_meta_lead_id_key
  on public.ilift_leads (meta_lead_id) where meta_lead_id is not null;

create index if not exists ilift_leads_phone_e164_created_idx
  on public.ilift_leads (phone_e164, created_at desc);

create table if not exists public.ilift_lead_sync (
  form_id text primary key,
  last_created_time timestamptz not null default '1970-01-01T00:00:00Z',
  last_run_at timestamptz,
  last_error text,
  consecutive_errors integer not null default 0
);

alter table public.ilift_lead_sync enable row level security;
-- No anon/authenticated policies on purpose: only the service role touches this table.
```

- [ ] **Step 2: Apply it with the Supabase MCP**

Call `mcp__plugin_supabase_supabase__apply_migration` with `project_id: apkiueduxqspzefzybpx`, `name: lead_machine`, `query: <file contents>`.
Expected: success.

- [ ] **Step 3: Verify live**

Call `execute_sql`: `select column_name, is_nullable from information_schema.columns where table_name='ilift_leads' and column_name in ('email','tracking','meta_lead_id')` → email `YES`, tracking/meta_lead_id present. And `select count(*) from ilift_lead_sync` → 0.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260824120000_lead_machine.sql
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -m "db: lead machine columns + sync watermark table" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_0165v3vUwcuh5TE8d8MKgqgd"
```

---

### Task 3: `env.ts` + `phone.ts`

**Files:**
- Create: `lib/lead-machine/env.ts`
- Create: `lib/lead-machine/phone.ts`
- Test: `lib/lead-machine/__tests__/phone.test.ts`

- [ ] **Step 1: Failing phone tests**

```ts
import { describe, it, expect } from 'vitest'
import { toE164 } from '@/lib/lead-machine/phone'

describe('toE164', () => {
  it('normalizes US 10-digit', () => expect(toE164('(516) 322-9380')).toBe('+15163229380'))
  it('normalizes 11-digit with leading 1', () => expect(toE164('1 516 322 9380')).toBe('+15163229380'))
  it('keeps an existing + intl number', () => expect(toE164('+44 20 7946 0958')).toBe('+442079460958'))
  it('strips the Meta "p:" prefix', () => expect(toE164('p:+15163229380')).toBe('+15163229380'))
  it('returns null for junk', () => {
    expect(toE164('call me')).toBeNull()
    expect(toE164('123')).toBeNull()
    expect(toE164('')).toBeNull()
  })
})
```

- [ ] **Step 2: Run → fails** (`Cannot find module '@/lib/lead-machine/phone'`)

Run: `npm run test:run`

- [ ] **Step 3: Implement**

`lib/lead-machine/phone.ts`:
```ts
/** Normalize a user-typed or Meta-exported phone to E.164. US default. Null when unusable. */
export function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null
  const s = String(raw).trim().replace(/^p:/i, '')
  const hasPlus = s.startsWith('+')
  const digits = s.replace(/\D/g, '')
  if (hasPlus && digits.length >= 8 && digits.length <= 15) return `+${digits}`
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}
```

`lib/lead-machine/env.ts`:
```ts
/** All lead-machine env reads live here so the names exist in exactly one place. */
export const env = {
  supabaseUrl: () => process.env.LEADS_SUPABASE_URL ?? '',
  supabaseServiceKey: () => process.env.LEADS_SUPABASE_SERVICE_KEY ?? '',
  smsEnabled: () => process.env.LEAD_SMS_ENABLED === '1',
  twilioSid: () => process.env.TWILIO_ACCOUNT_SID ?? '',
  twilioToken: () => process.env.TWILIO_AUTH_TOKEN ?? '',
  twilioFrom: () => process.env.TWILIO_FROM ?? '',
  telegramToken: () => process.env.TELEGRAM_BOT_TOKEN ?? '',
  telegramChatId: () => process.env.TELEGRAM_CHAT_ID ?? '',
  metaPixelId: () => process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
  metaCapiToken: () => process.env.META_CAPI_TOKEN ?? '',
  metaPageToken: () => process.env.META_PAGE_TOKEN ?? '',
  metaLeadFormIds: () =>
    (process.env.META_LEAD_FORM_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  metaGraphVersion: () => process.env.META_GRAPH_VERSION ?? 'v21.0',
  cronSecret: () => process.env.CRON_SECRET ?? '',
  resendKey: () => process.env.RESEND_API_KEY ?? '',
  siteUrl: () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ilift.com',
  auditUrl: () => 'https://cal.com/ilift/automation-audit',
  dashUser: () => process.env.LEADS_DASH_USER ?? '',
  dashPass: () => process.env.LEADS_DASH_PASS ?? '',
}
```

- [ ] **Step 4: Run → passes**. **Step 5: Commit** `feat(lead-machine): env + phone normalizer`.

---

### Task 4: `db.ts` — Supabase service-role access

**Files:**
- Create: `lib/lead-machine/db.ts`
- Test: `lib/lead-machine/__tests__/db.test.ts`

- [ ] **Step 1: Failing tests (mock `fetch`)**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { insertLead, findRecentLeadByPhone, updateLead, listLeads, getSync, setSync } from '@/lib/lead-machine/db'

const calls: { url: string; init: RequestInit }[] = []
beforeEach(() => {
  calls.length = 0
  process.env.LEADS_SUPABASE_URL = 'https://x.supabase.co'
  process.env.LEADS_SUPABASE_SERVICE_KEY = 'svc'
  vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init })
    if (url.includes('/ilift_leads?') && init.method === 'GET') return new Response('[]', { status: 200 })
    if (url.includes('/ilift_leads') && init.method === 'POST')
      return new Response(JSON.stringify([{ id: 'lead-1' }]), { status: 201 })
    if (url.includes('/ilift_lead_sync?') && init.method === 'GET') return new Response('[]', { status: 200 })
    return new Response('{}', { status: 200 })
  }))
})

describe('db', () => {
  it('insertLead posts with service headers and returns id', async () => {
    const id = await insertLead({ name: 'A', phone_e164: '+15163229380', source: 'meta_lp' })
    expect(id).toBe('lead-1')
    const c = calls[0]
    expect(c.url).toBe('https://x.supabase.co/rest/v1/ilift_leads')
    expect((c.init.headers as Record<string, string>).apikey).toBe('svc')
    expect((c.init.headers as Record<string, string>).Prefer).toContain('return=representation')
  })
  it('insertLead throws on non-2xx (must-succeed step)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('boom', { status: 500 })))
    await expect(insertLead({ source: 'meta_lp' })).rejects.toThrow(/500/)
  })
  it('findRecentLeadByPhone filters by phone and window', async () => {
    await findRecentLeadByPhone('+15163229380', 24)
    expect(calls[0].url).toContain('phone_e164=eq.%2B15163229380')
    expect(calls[0].url).toContain('created_at=gte.')
  })
  it('updateLead patches by id', async () => {
    await updateLead('lead-1', { status: 'contacted' })
    expect(calls[0].init.method).toBe('PATCH')
    expect(calls[0].url).toContain('id=eq.lead-1')
  })
  it('getSync returns default watermark when no row', async () => {
    const s = await getSync('form1')
    expect(s.last_created_time).toBe('1970-01-01T00:00:00Z')
  })
  it('setSync upserts', async () => {
    await setSync({ form_id: 'form1', last_created_time: '2026-08-24T00:00:00Z', consecutive_errors: 0 })
    expect((calls[0].init.headers as Record<string, string>).Prefer).toContain('resolution=merge-duplicates')
  })
  it('listLeads orders newest first', async () => {
    await listLeads(50)
    expect(calls[0].url).toContain('order=created_at.desc')
  })
})
```

- [ ] **Step 2: Run → fails.**

- [ ] **Step 3: Implement `lib/lead-machine/db.ts`**

```ts
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

function headers(extra: Record<string, string> = {}) {
  const key = env.supabaseServiceKey()
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

function base() {
  const url = env.supabaseUrl()
  if (!url || !env.supabaseServiceKey()) throw new Error('LEADS_SUPABASE_URL / LEADS_SUPABASE_SERVICE_KEY not set')
  return `${url}/rest/v1`
}

async function ok(res: Response, what: string): Promise<Response> {
  if (!res.ok) throw new Error(`${what} failed: ${res.status} ${await res.text().catch(() => '')}`)
  return res
}

export async function insertLead(lead: LeadInsert): Promise<string> {
  const res = await ok(
    await fetch(`${base()}/ilift_leads`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=representation' }),
      body: JSON.stringify({ status: 'new', tracking: {}, ...lead }),
      signal: AbortSignal.timeout(8000),
    }),
    'insertLead',
  )
  const rows = (await res.json()) as { id: string }[]
  return rows[0].id
}

export async function findRecentLeadByPhone(phoneE164: string, hours: number): Promise<LeadRow | null> {
  const since = new Date(Date.now() - hours * 3600_000).toISOString()
  const q = new URLSearchParams({
    select: 'id,created_at,name,phone_e164,status',
    phone_e164: `eq.${phoneE164}`,
    created_at: `gte.${since}`,
    order: 'created_at.desc',
    limit: '1',
  })
  const res = await ok(
    await fetch(`${base()}/ilift_leads?${q}`, { method: 'GET', headers: headers(), signal: AbortSignal.timeout(8000) }),
    'findRecentLeadByPhone',
  )
  const rows = (await res.json()) as LeadRow[]
  return rows[0] ?? null
}

export async function findLeadByMetaId(metaLeadId: string): Promise<LeadRow | null> {
  const q = new URLSearchParams({ select: 'id', meta_lead_id: `eq.${metaLeadId}`, limit: '1' })
  const res = await ok(
    await fetch(`${base()}/ilift_leads?${q}`, { method: 'GET', headers: headers(), signal: AbortSignal.timeout(8000) }),
    'findLeadByMetaId',
  )
  const rows = (await res.json()) as LeadRow[]
  return rows[0] ?? null
}

export async function updateLead(id: string, patch: Partial<Pick<LeadRow, 'status' | 'notes' | 'called_at'>>): Promise<void> {
  await ok(
    await fetch(`${base()}/ilift_leads?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(patch),
      signal: AbortSignal.timeout(8000),
    }),
    'updateLead',
  )
}

export async function listLeads(limit = 200): Promise<LeadRow[]> {
  const q = new URLSearchParams({ select: '*', order: 'created_at.desc', limit: String(limit) })
  const res = await ok(
    await fetch(`${base()}/ilift_leads?${q}`, { method: 'GET', headers: headers(), signal: AbortSignal.timeout(8000), cache: 'no-store' }),
    'listLeads',
  )
  return (await res.json()) as LeadRow[]
}

export async function getSync(formId: string): Promise<SyncRow> {
  const q = new URLSearchParams({ select: '*', form_id: `eq.${formId}`, limit: '1' })
  const res = await ok(
    await fetch(`${base()}/ilift_lead_sync?${q}`, { method: 'GET', headers: headers(), signal: AbortSignal.timeout(8000) }),
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
      signal: AbortSignal.timeout(8000),
    }),
    'setSync',
  )
}
```

- [ ] **Step 4: Run → passes. Step 5: Commit** `feat(lead-machine): service-role Supabase access`.

---

### Task 5: Side effects — `sms.ts`, `telegram.ts`, `capi.ts`, `email.ts`

**Files:**
- Create the four modules
- Test: `lib/lead-machine/__tests__/side-effects.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildSmsText, sendLeadSms } from '@/lib/lead-machine/sms'
import { sendTelegramPing } from '@/lib/lead-machine/telegram'
import { sendCapiLead, hashPii } from '@/lib/lead-machine/capi'
import { sendConfirmationEmail } from '@/lib/lead-machine/email'

const lead = {
  id: 'lead-1', name: 'Mike Rodriguez', phone_e164: '+15163229380', email: 'mike@example.com',
  company: 'Rodriguez HVAC', pain: 'missed_calls', vertical: 'contractors', source: 'meta_lp' as const,
  tracking: { fbp: 'fb.1.1.1', fbc: 'fb.1.1.abc', utm_campaign: 'nmc' },
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ events_received: 1, fbtrace_id: 't' }), { status: 200 })))
})

describe('sms', () => {
  it('template uses first name and pain label, under 160 chars', () => {
    const t = buildSmsText(lead)
    expect(t).toMatch(/^Hey Mike — Dave from iLift\./)
    expect(t).toContain('missed calls')
    expect(t.length).toBeLessThanOrEqual(160)
  })
  it('does nothing when LEAD_SMS_ENABLED is unset', async () => {
    delete process.env.LEAD_SMS_ENABLED
    const r = await sendLeadSms(lead)
    expect(r).toEqual({ sent: false, reason: 'disabled' })
    expect(fetch).not.toHaveBeenCalled()
  })
  it('posts to Twilio with basic auth when enabled', async () => {
    process.env.LEAD_SMS_ENABLED = '1'
    process.env.TWILIO_ACCOUNT_SID = 'AC1'; process.env.TWILIO_AUTH_TOKEN = 'tok'; process.env.TWILIO_FROM = '+15550001111'
    const r = await sendLeadSms(lead)
    expect(r.sent).toBe(true)
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('https://api.twilio.com/2010-04-01/Accounts/AC1/Messages.json')
    expect((init.headers as Record<string, string>).Authorization).toBe('Basic ' + Buffer.from('AC1:tok').toString('base64'))
    expect(String(init.body)).toContain('To=%2B15163229380')
  })
})

describe('telegram', () => {
  it('sends HTML with tel link and escapes user text', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'b'; process.env.TELEGRAM_CHAT_ID = 'c'
    await sendTelegramPing({ ...lead, company: '<b>x</b>' })
    const body = JSON.parse(String((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body))
    expect(body.text).toContain('tel:+15163229380')
    expect(body.text).toContain('&lt;b&gt;x&lt;/b&gt;')
  })
})

describe('capi', () => {
  it('hashes lowercase trimmed values', () => {
    expect(hashPii(' Mike ')).toBe(hashPii('mike'))
    expect(hashPii('x')).toMatch(/^[a-f0-9]{64}$/)
  })
  it('sends Lead with event_id, fbp/fbc, hashed phone; warns on events_received 0', async () => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = '123'; process.env.META_CAPI_TOKEN = 'tok'
    const r = await sendCapiLead(lead, { eventId: 'evt-1', sourceUrl: 'https://www.ilift.com/lp/contractors', ip: '1.2.3.4', ua: 'UA' })
    expect(r.sent).toBe(true)
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toContain('/123/events')
    const body = JSON.parse(String(init.body))
    expect(body.data[0].event_name).toBe('Lead')
    expect(body.data[0].event_id).toBe('evt-1')
    expect(body.data[0].user_data.ph[0]).toBe(hashPii('15163229380'))
    expect(body.data[0].user_data.fbp).toBe('fb.1.1.1')
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ events_received: 0 }), { status: 200 })))
    const r2 = await sendCapiLead(lead, { eventId: 'evt-2', sourceUrl: 'u' })
    expect(r2).toEqual({ sent: false, reason: 'discarded' })
  })
  it('is a no-op without a token', async () => {
    delete process.env.META_CAPI_TOKEN
    expect(await sendCapiLead(lead, { eventId: 'e', sourceUrl: 'u' })).toEqual({ sent: false, reason: 'disabled' })
  })
})

describe('email', () => {
  it('skips when the lead has no email', async () => {
    expect(await sendConfirmationEmail({ ...lead, email: null })).toEqual({ sent: false, reason: 'no_email' })
  })
})
```

- [ ] **Step 2: Run → fails.**

- [ ] **Step 3: Implement**

`lib/lead-machine/types.ts` (shared shape used by all side effects):
```ts
import type { LeadSourceKind } from './db'

export interface LeadForNotify {
  id: string
  name?: string | null
  email?: string | null
  phone_e164?: string | null
  company?: string | null
  pain?: string | null
  vertical?: string | null
  source: LeadSourceKind
  tracking?: Record<string, unknown>
}

export const PAIN_LABELS: Record<string, string> = {
  missed_calls: 'missed calls',
  no_shows: 'no-shows',
  not_enough_leads: 'not enough leads',
  reviews: 'reviews',
}

export function firstName(name?: string | null): string {
  return (name ?? '').trim().split(/\s+/)[0] || 'there'
}
```

`lib/lead-machine/sms.ts`:
```ts
import { env } from './env'
import { PAIN_LABELS, firstName, type LeadForNotify } from './types'

export type SideEffectResult = { sent: true } | { sent: false; reason: string }

export function buildSmsText(lead: LeadForNotify): string {
  const pain = (lead.pain && PAIN_LABELS[lead.pain]) || 'your business'
  return `Hey ${firstName(lead.name)} — Dave from iLift. Got your note about ${pain}. Want 2 quick ideas by text, or a free 15-min look? ${env.auditUrl()} — Dave`
}

export async function sendLeadSms(lead: LeadForNotify): Promise<SideEffectResult> {
  if (!env.smsEnabled()) return { sent: false, reason: 'disabled' }
  if (!lead.phone_e164) return { sent: false, reason: 'no_phone' }
  const sid = env.twilioSid(), token = env.twilioToken(), from = env.twilioFrom()
  if (!sid || !token || !from) return { sent: false, reason: 'not_configured' }
  const body = new URLSearchParams({ To: lead.phone_e164, From: from, Body: buildSmsText(lead) })
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    console.error('[lead-machine] twilio failed', res.status, await res.text().catch(() => ''))
    return { sent: false, reason: `http_${res.status}` }
  }
  return { sent: true }
}
```

`lib/lead-machine/telegram.ts`:
```ts
import { env } from './env'
import { PAIN_LABELS, type LeadForNotify } from './types'
import type { SideEffectResult } from './sms'

function esc(s: unknown): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildTelegramText(lead: LeadForNotify): string {
  const t = lead.tracking ?? {}
  const ad = [t.campaign_name, t.adset_name, t.ad_name].filter(Boolean).join(' › ')
  const lines = [
    `🔥 <b>New lead</b> (${esc(lead.source === 'meta_form' ? 'Instant Form' : 'Landing page')}${lead.vertical ? ' · ' + esc(lead.vertical) : ''})`,
    `<b>${esc(lead.name || 'No name')}</b>${lead.company ? ' — ' + esc(lead.company) : ''}`,
    lead.phone_e164 ? `📞 <a href="tel:${esc(lead.phone_e164)}">${esc(lead.phone_e164)}</a>` : '📞 no phone',
    lead.email ? `✉️ ${esc(lead.email)}` : '',
    lead.pain ? `Pain: ${esc(PAIN_LABELS[lead.pain] ?? lead.pain)}` : '',
    ad ? `Ad: ${esc(ad)}` : '',
    `${env.siteUrl()}/leads`,
  ]
  return lines.filter(Boolean).join('\n')
}

export async function sendTelegramPing(lead: LeadForNotify): Promise<SideEffectResult> {
  const token = env.telegramToken(), chatId = env.telegramChatId()
  if (!token || !chatId) return { sent: false, reason: 'not_configured' }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: buildTelegramText(lead), parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    console.error('[lead-machine] telegram failed', res.status, await res.text().catch(() => ''))
    return { sent: false, reason: `http_${res.status}` }
  }
  return { sent: true }
}
```

`lib/lead-machine/capi.ts`:
```ts
import { createHash } from 'node:crypto'
import { env } from './env'
import type { LeadForNotify } from './types'
import type { SideEffectResult } from './sms'

export function hashPii(v: string): string {
  return createHash('sha256').update(v.trim().toLowerCase()).digest('hex')
}

export interface CapiContext {
  eventId: string
  sourceUrl: string
  ip?: string | null
  ua?: string | null
}

export async function sendCapiLead(lead: LeadForNotify, ctx: CapiContext): Promise<SideEffectResult> {
  const pixel = env.metaPixelId(), token = env.metaCapiToken()
  if (!pixel || !token) return { sent: false, reason: 'disabled' }
  const t = (lead.tracking ?? {}) as Record<string, string | undefined>
  const [fn, ...rest] = (lead.name ?? '').trim().split(/\s+/)
  const user_data: Record<string, unknown> = {}
  if (lead.phone_e164) user_data.ph = [hashPii(lead.phone_e164.replace(/\D/g, ''))]
  if (lead.email) user_data.em = [hashPii(lead.email)]
  if (fn) user_data.fn = [hashPii(fn)]
  if (rest.length) user_data.ln = [hashPii(rest.join(' '))]
  if (t.fbp) user_data.fbp = t.fbp
  if (t.fbc) user_data.fbc = t.fbc
  if (ctx.ip) user_data.client_ip_address = ctx.ip
  if (ctx.ua) user_data.client_user_agent = ctx.ua
  const payload = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: ctx.eventId,
      action_source: 'website',
      event_source_url: ctx.sourceUrl,
      user_data,
      custom_data: { content_name: lead.vertical ?? 'lp', lead_source: lead.source },
    }],
  }
  const res = await fetch(`https://graph.facebook.com/${env.metaGraphVersion()}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  })
  const json = (await res.json().catch(() => ({}))) as { events_received?: number; fbtrace_id?: string }
  if (!res.ok) {
    console.error('[lead-machine] capi failed', res.status, JSON.stringify(json))
    return { sent: false, reason: `http_${res.status}` }
  }
  // Meta answers 200 with events_received:0 for an event it dropped — treat as not sent.
  if (!json.events_received) {
    console.warn('[lead-machine] capi ACCEPTED BUT DISCARDED', json.fbtrace_id)
    return { sent: false, reason: 'discarded' }
  }
  return { sent: true }
}
```

`lib/lead-machine/email.ts`:
```ts
import { Resend } from 'resend'
import { env } from './env'
import { firstName, type LeadForNotify } from './types'
import type { SideEffectResult } from './sms'

export async function sendConfirmationEmail(lead: LeadForNotify): Promise<SideEffectResult> {
  if (!lead.email) return { sent: false, reason: 'no_email' }
  if (!env.resendKey()) return { sent: false, reason: 'not_configured' }
  const resend = new Resend(env.resendKey())
  const { error } = await resend.emails.send({
    from: 'Dave at iLift <dave@ilift.com>',
    to: lead.email,
    subject: 'Got it — here is the 15-minute look',
    text: `Hi ${firstName(lead.name)},\n\nThanks for reaching out. I'll text you shortly. If you'd rather just grab a time now, here's my calendar for a free 15-minute look:\n${env.auditUrl()}\n\n— Dave\niLift · 516-322-9380`,
  })
  if (error) {
    console.error('[lead-machine] resend failed', error)
    return { sent: false, reason: 'resend_error' }
  }
  return { sent: true }
}
```

- [ ] **Step 4: Run → passes. Step 5: Commit** `feat(lead-machine): sms, telegram, capi, email side effects`.

---

### Task 6: `intake.ts` — `processLead` orchestrator

**Files:**
- Create: `lib/lead-machine/intake.ts`
- Test: `lib/lead-machine/__tests__/intake.test.ts`

- [ ] **Step 1: Failing tests**

```ts
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
vi.mock('@/lib/leads', () => ({ recordLead: vi.fn(async () => undefined) }))

import { processLead } from '@/lib/lead-machine/intake'
import * as db from '@/lib/lead-machine/db'
import * as sms from '@/lib/lead-machine/sms'
import * as tg from '@/lib/lead-machine/telegram'

const input = {
  name: 'Mike Rodriguez', phone: '516-322-9380', company: 'Rodriguez HVAC', pain: 'missed_calls',
  vertical: 'contractors', source: 'meta_lp' as const, tracking: { utm_source: 'meta' },
  context: { eventId: 'evt-1', sourceUrl: 'https://www.ilift.com/lp/contractors' },
}

beforeEach(() => vi.clearAllMocks())

describe('processLead', () => {
  it('inserts, then fans out, and returns the id', async () => {
    const r = await processLead(input)
    expect(r).toMatchObject({ ok: true, id: 'lead-1', deduped: false })
    expect(db.insertLead).toHaveBeenCalledWith(expect.objectContaining({ phone_e164: '+15163229380', source: 'meta_lp', pain: 'missed_calls' }))
    expect(sms.sendLeadSms).toHaveBeenCalled()
    expect(tg.sendTelegramPing).toHaveBeenCalled()
  })
  it('rejects a lead with no usable phone', async () => {
    const r = await processLead({ ...input, phone: 'nope' })
    expect(r).toEqual({ ok: false, error: 'invalid_phone' })
    expect(db.insertLead).not.toHaveBeenCalled()
  })
  it('dedupes within 24h by phone and sends nothing', async () => {
    vi.mocked(db.findRecentLeadByPhone).mockResolvedValueOnce({ id: 'old', created_at: 'x', status: 'new', source: 'meta_lp' })
    const r = await processLead(input)
    expect(r).toMatchObject({ ok: true, id: 'old', deduped: true })
    expect(db.insertLead).not.toHaveBeenCalled()
    expect(sms.sendLeadSms).not.toHaveBeenCalled()
  })
  it('dedupes by meta_lead_id', async () => {
    vi.mocked(db.findLeadByMetaId).mockResolvedValueOnce({ id: 'old', created_at: 'x', status: 'new', source: 'meta_form' })
    const r = await processLead({ ...input, source: 'meta_form', metaLeadId: 'm1' })
    expect(r).toMatchObject({ ok: true, deduped: true })
  })
  it('side-effect failures never fail the request', async () => {
    vi.mocked(sms.sendLeadSms).mockRejectedValueOnce(new Error('twilio down'))
    vi.mocked(tg.sendTelegramPing).mockRejectedValueOnce(new Error('tg down'))
    const r = await processLead(input)
    expect(r.ok).toBe(true)
  })
  it('insert failure propagates (must-succeed)', async () => {
    vi.mocked(db.insertLead).mockRejectedValueOnce(new Error('insertLead failed: 500'))
    await expect(processLead(input)).rejects.toThrow(/insertLead/)
  })
})
```

- [ ] **Step 2: Run → fails.**

- [ ] **Step 3: Implement `lib/lead-machine/intake.ts`**

```ts
import { insertLead, findRecentLeadByPhone, findLeadByMetaId, type LeadSourceKind } from './db'
import { toE164 } from './phone'
import { sendLeadSms } from './sms'
import { sendTelegramPing } from './telegram'
import { sendCapiLead, type CapiContext } from './capi'
import { sendConfirmationEmail } from './email'
import type { LeadForNotify } from './types'

export interface LeadInput {
  name?: string | null
  phone?: string | null
  email?: string | null
  company?: string | null
  pain?: string | null
  vertical?: string | null
  source: LeadSourceKind
  tracking?: Record<string, unknown>
  metaLeadId?: string | null
  context: CapiContext
}

export type ProcessResult =
  | { ok: true; id: string; deduped: boolean }
  | { ok: false; error: 'invalid_phone' }

const DEDUPE_HOURS = 24

export async function processLead(input: LeadInput): Promise<ProcessResult> {
  const phone_e164 = toE164(input.phone)
  if (!phone_e164) return { ok: false, error: 'invalid_phone' }

  if (input.metaLeadId) {
    const existing = await findLeadByMetaId(input.metaLeadId)
    if (existing) return { ok: true, id: existing.id, deduped: true }
  }
  const recent = await findRecentLeadByPhone(phone_e164, DEDUPE_HOURS)
  if (recent) return { ok: true, id: recent.id, deduped: true }

  const tracking = { ...(input.tracking ?? {}), event_id: input.context.eventId }
  // Must succeed. Throws on failure so the caller returns 500 and the form shows an error.
  const id = await insertLead({
    name: input.name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    phone_e164,
    company: input.company ?? null,
    source: input.source,
    service: 'ai-receptionist',
    message: [input.vertical, input.pain].filter(Boolean).join(' / ') || null,
    vertical: input.vertical ?? null,
    pain: input.pain ?? null,
    tracking,
    meta_lead_id: input.metaLeadId ?? null,
  })

  const lead: LeadForNotify = {
    id, name: input.name, email: input.email, phone_e164, company: input.company,
    pain: input.pain, vertical: input.vertical, source: input.source, tracking,
  }
  // Fail-soft fan-out: log, never throw.
  const results = await Promise.allSettled([
    sendLeadSms(lead),
    sendTelegramPing(lead),
    sendCapiLead(lead, input.context),
    sendConfirmationEmail(lead),
  ])
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error('[lead-machine] side effect', ['sms', 'telegram', 'capi', 'email'][i], 'threw', r.reason)
  })
  return { ok: true, id, deduped: false }
}
```

- [ ] **Step 4: Run → passes. Step 5: Commit** `feat(lead-machine): processLead orchestrator`.

---

### Task 7: `POST /api/lead`

**Files:**
- Create: `app/api/lead/route.ts`
- Test: `app/api/lead/__tests__/route.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
vi.mock('@/lib/lead-machine/intake', () => ({ processLead: vi.fn(async () => ({ ok: true, id: 'lead-1', deduped: false })) }))
import { POST } from '@/app/api/lead/route'
import { processLead } from '@/lib/lead-machine/intake'
import { NextRequest } from 'next/server'

function req(body: unknown, ip = '9.9.9.9') {
  return new NextRequest('https://www.ilift.com/api/lead', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, 'user-agent': 'UA' },
    body: JSON.stringify(body),
  })
}
const good = { name: 'Mike', phone: '516-322-9380', company: 'HVAC Co', pain: 'missed_calls', vertical: 'contractors', eventId: 'evt-1', pageUrl: 'https://www.ilift.com/lp/contractors', tracking: { utm_source: 'meta' } }

beforeEach(() => vi.clearAllMocks())

describe('POST /api/lead', () => {
  it('accepts a valid lead', async () => {
    const res = await POST(req(good))
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ ok: true, eid: 'evt-1' })
    expect(processLead).toHaveBeenCalledWith(expect.objectContaining({ source: 'meta_lp', vertical: 'contractors', context: expect.objectContaining({ eventId: 'evt-1', ip: '9.9.9.9', ua: 'UA' }) }))
  })
  it('honeypot → 200 and no processing', async () => {
    const res = await POST(req({ ...good, website: 'http://spam' }))
    expect(res.status).toBe(200)
    expect(processLead).not.toHaveBeenCalled()
  })
  it('400 on missing phone', async () => {
    expect((await POST(req({ ...good, phone: '' }))).status).toBe(400)
  })
  it('400 on unknown vertical / pain values', async () => {
    expect((await POST(req({ ...good, vertical: 'crypto' }))).status).toBe(400)
    expect((await POST(req({ ...good, pain: 'other' }))).status).toBe(400)
  })
  it('429 after the minute cap', async () => {
    for (let i = 0; i < 5; i++) await POST(req(good, '7.7.7.7'))
    expect((await POST(req(good, '7.7.7.7'))).status).toBe(429)
  })
  it('500 when the must-succeed insert throws', async () => {
    vi.mocked(processLead).mockRejectedValueOnce(new Error('insertLead failed'))
    expect((await POST(req(good, '6.6.6.6'))).status).toBe(500)
  })
})
```

- [ ] **Step 2: Run → fails.**

- [ ] **Step 3: Implement `app/api/lead/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { checkChatRateLimit, extractIp } from '@/lib/rate-limit'
import { processLead } from '@/lib/lead-machine/intake'
import { LP_SLUGS } from '@/lib/lp-content'
import { PAIN_LABELS } from '@/lib/lead-machine/types'

export const runtime = 'nodejs'

const TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'fbp', 'fbc', 'referrer', 'slug'] as const

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  // Honeypot: bots fill "website"; humans never see it.
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true })

  const ip = extractIp(request)
  const rl = checkChatRateLimit(`lead:${ip}`, { minuteCap: 5, dayCap: 40 })
  if (!rl.ok) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })

  const str = (k: string, max = 200) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '')
  const name = str('name'), phone = str('phone', 40), company = str('company'), email = str('email')
  const pain = str('pain', 40), vertical = str('vertical', 40), eventId = str('eventId', 80), pageUrl = str('pageUrl', 500)
  if (!phone) return NextResponse.json({ error: 'phone_required' }, { status: 400 })
  if (vertical && !(LP_SLUGS as readonly string[]).includes(vertical)) return NextResponse.json({ error: 'bad_vertical' }, { status: 400 })
  if (pain && !(pain in PAIN_LABELS)) return NextResponse.json({ error: 'bad_pain' }, { status: 400 })
  if (email && !/^[^\s@<>"'\\]+@[^\s@<>"'\\]+\.[^\s@<>"'\\]+$/.test(email)) return NextResponse.json({ error: 'bad_email' }, { status: 400 })

  const rawTracking = (body.tracking && typeof body.tracking === 'object' ? body.tracking : {}) as Record<string, unknown>
  const tracking: Record<string, string> = {}
  for (const k of TRACKING_KEYS) if (typeof rawTracking[k] === 'string') tracking[k] = (rawTracking[k] as string).slice(0, 300)

  const eid = eventId || crypto.randomUUID()
  try {
    const result = await processLead({
      name, phone, email: email || null, company: company || null, pain: pain || null, vertical: vertical || null,
      source: 'meta_lp', tracking,
      context: { eventId: eid, sourceUrl: pageUrl || 'https://www.ilift.com/lp', ip, ua: request.headers.get('user-agent') },
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ ok: true, eid, deduped: result.deduped })
  } catch (err) {
    console.error('[api/lead] failed', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
```

Check `lib/rate-limit.ts` exports `extractIp(request)`; if it does not (the file was only partially read), add:
```ts
export function extractIp(request: { headers: { get(n: string): string | null } }): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',').pop()!.trim()
  return request.headers.get('x-real-ip') ?? 'no-ip'
}
```

- [ ] **Step 4: Run → passes** (Task 8's `LP_SLUGS` must exist first — implement Task 8 Step 3's `lib/lp-content.ts` before running if needed). **Step 5: Commit** `feat(lead-machine): POST /api/lead`.

---

### Task 8: Landing pages

**Files:**
- Create: `lib/lp-content.ts`, `app/lp/layout.tsx`, `app/lp/[slug]/page.tsx`, `app/lp/[slug]/thanks/page.tsx`, `components/lp/LeadForm.tsx`, `components/lp/LeadPixelEvent.tsx`
- Test: `lib/lead-machine/__tests__/lp-content.test.ts`

- [ ] **Step 1: Failing content test**

```ts
import { describe, it, expect } from 'vitest'
import { LP_SLUGS, getLpContent } from '@/lib/lp-content'

describe('lp content', () => {
  it('has the three variants with complete sections', () => {
    expect(LP_SLUGS).toEqual(['contractors', 'dental-medspa', 'restaurants'])
    for (const slug of LP_SLUGS) {
      const c = getLpContent(slug)!
      expect(c.headline.length).toBeGreaterThan(10)
      expect(c.bullets).toHaveLength(3)
      expect(c.faq.length).toBeGreaterThanOrEqual(3)
      expect(c.proof.length).toBeGreaterThanOrEqual(1)
    }
  })
  it('returns null for unknown slug', () => expect(getLpContent('crypto')).toBeNull())
})
```

- [ ] **Step 2: Run → fails.**

- [ ] **Step 3: `lib/lp-content.ts`** (copy adapted from `marketing/ad-briefs.md`; proof only from `OUTCOMES` in `lib/constants.ts`)

```ts
import { OUTCOMES } from '@/lib/constants'

export const LP_SLUGS = ['contractors', 'dental-medspa', 'restaurants'] as const
export type LpSlug = (typeof LP_SLUGS)[number]

export interface LpContent {
  slug: LpSlug
  vertical: string
  eyebrow: string
  headline: string
  subhead: string
  bullets: { title: string; body: string }[]
  proof: { headline: string; body: string }[]
  faq: { q: string; a: string }[]
  formTitle: string
  submitLabel: string
}

const COMMON_FAQ = [
  { q: 'What happens after I submit?', a: 'Dave texts you within minutes. You can also grab a free 15-minute slot on his calendar right away — no pitch, just a look at where calls and leads are leaking.' },
  { q: 'What does it cost?', a: 'The 15-minute look is free. Done-for-you builds like the AI receptionist start at $1,500 and are quoted after the audit — you will always know the number before any work starts.' },
  { q: 'Do I have to change my phone number?', a: 'No. You keep your number. The AI answers what you miss and texts back missed callers.' },
  { q: 'Who is Dave?', a: 'A Long Island business owner turned AI builder. iLift is based in East Meadow, NY — call or text 516-322-9380.' },
]

const CONTENT: Record<LpSlug, LpContent> = {
  contractors: {
    slug: 'contractors', vertical: 'Contractors & home services',
    eyebrow: 'For Long Island trades',
    headline: 'Stop sending jobs to voicemail.',
    subhead: 'While you are on a roof, under a sink, or driving, your AI receptionist answers 24/7, texts back every missed caller in seconds, and books the job to your calendar.',
    bullets: [
      { title: 'Answers every call', body: 'Nights, weekends, mid-job. Every caller gets a real answer instead of a voicemail.' },
      { title: 'Texts back in seconds', body: 'Missed a call anyway? The caller gets a text before they dial your competitor.' },
      { title: 'Books to your calendar', body: 'Estimates land on your schedule with the address and the problem already captured.' },
    ],
    proof: [OUTCOMES[0]],
    faq: COMMON_FAQ,
    formTitle: 'Get a free 15-minute look',
    submitLabel: 'Text me the details',
  },
  'dental-medspa': {
    slug: 'dental-medspa', vertical: 'Dental & med spa',
    eyebrow: 'For Long Island practices',
    headline: 'Keep the chairs full.',
    subhead: 'Empty chairs and no-shows quietly cost practices thousands a month. The AI front desk books appointments, sends smart reminders, fills cancellations, and answers after hours.',
    bullets: [
      { title: 'Never miss a new patient', body: 'Lunch, after hours, and weekends are when new patients call. Every one gets booked.' },
      { title: 'Fewer no-shows', body: 'Smart reminders and instant rebooking keep the schedule full without front-desk chasing.' },
      { title: 'More 5-star reviews', body: 'Happy patients get asked at the right moment, so you climb Google while you work.' },
    ],
    proof: [OUTCOMES[1], OUTCOMES[2]],
    faq: COMMON_FAQ,
    formTitle: 'Get a free 15-minute look',
    submitLabel: 'Text me the details',
  },
  restaurants: {
    slug: 'restaurants', vertical: 'Restaurants & local retail',
    eyebrow: 'For Long Island restaurants',
    headline: 'Answer every call during the rush.',
    subhead: 'Every unanswered call is a table or an order walking away. The AI answers, takes reservations and questions, and texts back missed callers so the dinner rush never costs you covers.',
    bullets: [
      { title: 'Reservations without the phone tag', body: 'Callers get booked or answered while your staff stays on the floor.' },
      { title: 'Texts back missed callers', body: 'Slammed? The caller hears from you in seconds, not never.' },
      { title: 'Get found, get chosen', body: 'Automated review requests and a clean Google presence bring more locals in.' },
    ],
    proof: [OUTCOMES[2]],
    faq: COMMON_FAQ,
    formTitle: 'Get a free 15-minute look',
    submitLabel: 'Text me the details',
  },
}

export function getLpContent(slug: string): LpContent | null {
  return (LP_SLUGS as readonly string[]).includes(slug) ? CONTENT[slug as LpSlug] : null
}
```

- [ ] **Step 4: `app/lp/layout.tsx`**

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-gray-900">{children}</div>
}
```

- [ ] **Step 5: `components/lp/LeadForm.tsx`** (client)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const PAINS = [
  { value: 'missed_calls', label: 'Missed calls' },
  { value: 'no_shows', label: 'No-shows' },
  { value: 'not_enough_leads', label: 'Not enough leads' },
  { value: 'reviews', label: 'Bad or too few reviews' },
]

function readCookie(name: string): string | undefined {
  return document.cookie.split('; ').find((c) => c.startsWith(name + '='))?.split('=')[1]
}

export function LeadForm({ slug, submitLabel }: { slug: string; submitLabel: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventId] = useState(() => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now())))
  const [tracking, setTracking] = useState<Record<string, string>>({})

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const t: Record<string, string> = { slug, referrer: document.referrer.slice(0, 300) }
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']) {
      const v = p.get(k); if (v) t[k] = v
    }
    const fbp = readCookie('_fbp'); if (fbp) t.fbp = fbp
    const fbc = readCookie('_fbc'); if (fbc) t.fbc = fbc
    else if (t.fbclid) t.fbc = `fb.1.${Date.now()}.${t.fbclid}`
    setTracking(t)
  }, [slug])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true); setError(null)
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: fd.get('name'), phone: fd.get('phone'), company: fd.get('company'), pain: fd.get('pain'),
      website: fd.get('website'), vertical: slug, eventId, pageUrl: window.location.href, tracking,
    }
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; eid?: string; error?: string }
      if (!res.ok || !json.ok) {
        setError(json.error === 'invalid_phone' || json.error === 'phone_required' ? 'Please enter a valid phone number.' : 'Something went wrong — call or text 516-322-9380.')
        setBusy(false)
        return
      }
      router.push(`/lp/${slug}/thanks?eid=${encodeURIComponent(json.eid ?? eventId)}`)
    } catch {
      setError('Something went wrong — call or text 516-322-9380.')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="lead-form">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="block">
        <span className="text-sm font-medium">Your name</span>
        <input name="name" required autoComplete="name" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Mobile number</span>
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Business name</span>
        <input name="company" required autoComplete="organization" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">What&apos;s costing you the most right now?</span>
        <select name="pain" required defaultValue="" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 bg-white">
          <option value="" disabled>Pick one</option>
          {PAINS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </label>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-lg bg-primary-600 px-6 py-4 text-lg font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
        {busy ? 'Sending…' : submitLabel}
      </button>
      <p className="text-xs text-gray-500">By submitting you agree to receive a text and a call from iLift about your request. Msg &amp; data rates may apply. Reply STOP to opt out. See our <a href="/privacy" className="underline">privacy policy</a>.</p>
    </form>
  )
}
```
(`bg-primary-600` etc. exist in the Tailwind theme used by `Button.tsx`; if the class names differ, copy the primary classes from `components/ui/Button.tsx` `variantStyles.primary`.)

- [ ] **Step 6: `app/lp/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Phone, CheckCircle2 } from 'lucide-react'
import { LP_SLUGS, getLpContent } from '@/lib/lp-content'
import { LeadForm } from '@/components/lp/LeadForm'
import { COMPANY_INFO } from '@/lib/constants'

export function generateStaticParams() {
  return LP_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = getLpContent(slug)
  return { title: c ? `${c.headline} — iLift` : 'iLift', robots: { index: false, follow: false } }
}

export default async function LpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getLpContent(slug)
  if (!c) notFound()
  const tel = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

  return (
    <main>
      <header className="container-custom flex items-center justify-between py-5">
        <span className="font-heading text-xl font-bold">iLift</span>
        <a href={tel} className="inline-flex items-center gap-2 text-sm font-semibold"><Phone className="h-4 w-4" /> {COMPANY_INFO.phone}</a>
      </header>

      <section className="container-custom grid gap-10 py-10 md:grid-cols-2 md:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">{c.eyebrow}</p>
          <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">{c.headline}</h1>
          <p className="mt-5 text-lg text-gray-600">{c.subhead}</p>
          <ul className="mt-8 space-y-4">
            {c.bullets.map((b) => (
              <li key={b.title} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary-600" />
                <div><p className="font-semibold">{b.title}</p><p className="text-gray-600">{b.body}</p></div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-gray-600">Want to hear it first? <Link href="/demo" className="font-semibold underline">Try the live demo</Link>.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
          <h2 className="font-heading text-2xl font-bold">{c.formTitle}</h2>
          <p className="mt-2 text-gray-600">Dave texts you back within minutes. No pitch.</p>
          <div className="mt-6"><LeadForm slug={c.slug} submitLabel={c.submitLabel} /></div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <h2 className="font-heading text-2xl font-bold">Results we&apos;ve shipped</h2>
          <p className="mt-1 text-sm text-gray-500">Anonymized outcomes from real Long Island businesses.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {c.proof.map((p) => (
              <div key={p.headline} className="rounded-xl bg-white p-5 shadow-sm"><p className="font-semibold">{p.headline}</p><p className="mt-1 text-gray-600">{p.body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-12">
        <h2 className="font-heading text-2xl font-bold">Questions</h2>
        <dl className="mt-6 space-y-6">
          {c.faq.map((f) => (<div key={f.q}><dt className="font-semibold">{f.q}</dt><dd className="mt-1 text-gray-600">{f.a}</dd></div>))}
        </dl>
      </section>

      <footer className="container-custom border-t border-gray-200 py-8 text-sm text-gray-500">
        <p>{COMPANY_INFO.name} · {COMPANY_INFO.address.full} · <a href={tel}>{COMPANY_INFO.phone}</a></p>
        <p className="mt-2"><Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link></p>
      </footer>
    </main>
  )
}
```

- [ ] **Step 7: `components/lp/LeadPixelEvent.tsx` + `app/lp/[slug]/thanks/page.tsx`**

```tsx
'use client'
import { useEffect } from 'react'

/** Fires the browser-side Lead once, with the same eventID the server sent to CAPI (dedup). */
export function LeadPixelEvent({ eventId, source }: { eventId: string; source: string }) {
  useEffect(() => {
    try {
      const key = `lead-fired:${eventId}`
      if (sessionStorage.getItem(key)) return
      window.fbq?.('track', 'Lead', { content_name: source }, { eventID: eventId })
      sessionStorage.setItem(key, '1')
    } catch { /* analytics must never break the page */ }
  }, [eventId, source])
  return null
}
```

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLpContent } from '@/lib/lp-content'
import { LeadPixelEvent } from '@/components/lp/LeadPixelEvent'
import { COMPANY_INFO } from '@/lib/constants'

export const metadata: Metadata = { title: 'Got it — iLift', robots: { index: false, follow: false } }

export default async function ThanksPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ eid?: string }> }) {
  const { slug } = await params
  const { eid } = await searchParams
  const c = getLpContent(slug)
  if (!c) notFound()
  const tel = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`
  return (
    <main className="container-custom py-12 md:py-20">
      {eid && <LeadPixelEvent eventId={eid} source={slug} />}
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Got it — Dave is texting you now.</h1>
      <p className="mt-3 text-lg text-gray-600">Want to skip the back-and-forth? Grab a free 15-minute slot below, or call <a href={tel} className="font-semibold underline">{COMPANY_INFO.phone}</a>.</p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
        <iframe src={`${COMPANY_INFO.links.calcom.audit}?embed=true&layout=month_view`} title="Book a free 15-minute look" className="h-[720px] w-full" loading="lazy" />
      </div>
    </main>
  )
}
```

- [ ] **Step 8: Typecheck + test + build**

Run: `npm run typecheck && npm run test:run && npm run build`
Expected: typecheck clean; tests pass; build lists `/lp/[slug]` (SSG ×3) and `/lp/[slug]/thanks`.

- [ ] **Step 9: Commit** `feat(lp): campaign landing pages for contractors, dental-medspa, restaurants`.

---

### Task 9: Instant-Form poller + cron

**Files:**
- Create: `lib/lead-machine/meta-leads.ts`, `app/api/cron/meta-leads/route.ts`, `vercel.json`
- Test: `lib/lead-machine/__tests__/meta-leads.test.ts`, `app/api/cron/meta-leads/__tests__/route.test.ts`

- [ ] **Step 1: Failing tests**

```ts
// lib/lead-machine/__tests__/meta-leads.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
vi.mock('@/lib/lead-machine/db', () => ({
  getSync: vi.fn(async (form_id: string) => ({ form_id, last_created_time: '2026-08-20T00:00:00Z', consecutive_errors: 0 })),
  setSync: vi.fn(async () => undefined),
}))
vi.mock('@/lib/lead-machine/intake', () => ({ processLead: vi.fn(async () => ({ ok: true, id: 'l', deduped: false })) }))
vi.mock('@/lib/lead-machine/telegram', () => ({ sendTelegramText: vi.fn(async () => ({ sent: true })) }))
import { mapMetaLead, syncMetaLeads } from '@/lib/lead-machine/meta-leads'
import * as db from '@/lib/lead-machine/db'
import { processLead } from '@/lib/lead-machine/intake'

const metaLead = {
  id: '9001', created_time: '2026-08-24T12:00:00+0000', ad_id: '1', ad_name: 'Ad A', adset_name: 'Set 1', campaign_name: 'Camp',
  field_data: [
    { name: 'full_name', values: ['Mike Rodriguez'] },
    { name: 'phone_number', values: ['p:+15163229380'] },
    { name: 'email', values: ['mike@example.com'] },
    { name: 'company_name', values: ['Rodriguez HVAC'] },
    { name: 'what_s_costing_you_the_most_right_now?', values: ['Missed calls'] },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.META_PAGE_TOKEN = 'ptok'; process.env.META_LEAD_FORM_IDS = 'form1'
})

describe('mapMetaLead', () => {
  it('maps standard + custom fields', () => {
    const m = mapMetaLead(metaLead)
    expect(m).toMatchObject({ name: 'Mike Rodriguez', phone: 'p:+15163229380', email: 'mike@example.com', company: 'Rodriguez HVAC', pain: 'missed_calls', metaLeadId: '9001' })
    expect(m.tracking).toMatchObject({ ad_name: 'Ad A', adset_name: 'Set 1', campaign_name: 'Camp', meta_form_id: undefined })
  })
})

describe('syncMetaLeads', () => {
  it('fetches after the watermark, processes, advances watermark', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ data: [metaLead] }), { status: 200 })))
    const r = await syncMetaLeads()
    const url = String((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0])
    expect(url).toContain('/form1/leads')
    expect(url).toContain('time_created')
    expect(processLead).toHaveBeenCalledWith(expect.objectContaining({ source: 'meta_form', metaLeadId: '9001' }))
    expect(db.setSync).toHaveBeenCalledWith(expect.objectContaining({ form_id: 'form1', last_created_time: '2026-08-24T12:00:00.000Z', consecutive_errors: 0 }))
    expect(r).toEqual({ forms: 1, fetched: 1, processed: 1, errors: 0 })
  })
  it('records an error and increments consecutive_errors on a Graph failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { message: 'bad token', code: 190 } }), { status: 400 })))
    const r = await syncMetaLeads()
    expect(r.errors).toBe(1)
    expect(db.setSync).toHaveBeenCalledWith(expect.objectContaining({ consecutive_errors: 1, last_error: expect.stringContaining('190') }))
  })
  it('does nothing without a page token', async () => {
    delete process.env.META_PAGE_TOKEN
    expect(await syncMetaLeads()).toEqual({ forms: 0, fetched: 0, processed: 0, errors: 0, skipped: 'not_configured' })
  })
})
```

```ts
// app/api/cron/meta-leads/__tests__/route.test.ts
import { describe, it, expect, vi } from 'vitest'
vi.mock('@/lib/lead-machine/meta-leads', () => ({ syncMetaLeads: vi.fn(async () => ({ forms: 1, fetched: 0, processed: 0, errors: 0 })) }))
import { GET } from '@/app/api/cron/meta-leads/route'
import { NextRequest } from 'next/server'

describe('GET /api/cron/meta-leads', () => {
  it('401 without the cron secret', async () => {
    process.env.CRON_SECRET = 's3'
    const res = await GET(new NextRequest('https://www.ilift.com/api/cron/meta-leads'))
    expect(res.status).toBe(401)
  })
  it('200 with bearer secret', async () => {
    process.env.CRON_SECRET = 's3'
    const res = await GET(new NextRequest('https://www.ilift.com/api/cron/meta-leads', { headers: { authorization: 'Bearer s3' } }))
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ forms: 1 })
  })
})
```

- [ ] **Step 2: Run → fails.**

- [ ] **Step 3: Add `sendTelegramText` to `telegram.ts`** (alert channel for poller failures)

```ts
export async function sendTelegramText(text: string): Promise<SideEffectResult> {
  const token = env.telegramToken(), chatId = env.telegramChatId()
  if (!token || !chatId) return { sent: false, reason: 'not_configured' }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  })
  return res.ok ? { sent: true } : { sent: false, reason: `http_${res.status}` }
}
```
Refactor `sendTelegramPing` to call `sendTelegramText(buildTelegramText(lead))`.

- [ ] **Step 4: Implement `lib/lead-machine/meta-leads.ts`**

```ts
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
  'missed calls': 'missed_calls', 'no-shows': 'no_shows', 'no shows': 'no_shows',
  'not enough leads': 'not_enough_leads', 'bad/few reviews': 'reviews', 'bad or too few reviews': 'reviews', reviews: 'reviews',
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
  const pain = painRaw ? PAIN_BY_LABEL[painRaw.trim().toLowerCase()] ?? null : null
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
      ad_id: lead.ad_id, ad_name: lead.ad_name, adset_name: lead.adset_name, campaign_name: lead.campaign_name,
      meta_form_id: lead.form_id, meta_created_time: lead.created_time,
    },
  }
}

export interface SyncResult { forms: number; fetched: number; processed: number; errors: number; skipped?: string }

export async function syncMetaLeads(): Promise<SyncResult> {
  const token = env.metaPageToken(), forms = env.metaLeadFormIds()
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
      const res = await fetch(`https://graph.facebook.com/${env.metaGraphVersion()}/${formId}/leads?${q}`, { signal: AbortSignal.timeout(15000) })
      const json = (await res.json().catch(() => ({}))) as { data?: MetaLead[]; error?: { message: string; code: number } }
      if (!res.ok || json.error) throw new Error(`graph ${res.status} code=${json.error?.code ?? '?'} ${json.error?.message ?? ''}`)
      const leads = (json.data ?? []).sort((a, b) => a.created_time.localeCompare(b.created_time))
      out.fetched += leads.length
      let watermark = sync.last_created_time
      for (const lead of leads) {
        const mapped = mapMetaLead(lead)
        const r = await processLead({ ...mapped, context: { eventId: `meta:${lead.id}`, sourceUrl: 'https://www.facebook.com/' } })
        if (r.ok && !r.deduped) out.processed++
        watermark = new Date(lead.created_time).toISOString()
      }
      await setSync({ form_id: formId, last_created_time: watermark, consecutive_errors: 0, last_error: null })
    } catch (err) {
      out.errors++
      const msg = err instanceof Error ? err.message : String(err)
      const n = (sync.consecutive_errors ?? 0) + 1
      console.error('[meta-leads] form', formId, 'failed:', msg)
      await setSync({ form_id: formId, last_created_time: sync.last_created_time, consecutive_errors: n, last_error: msg.slice(0, 500) }).catch(() => undefined)
      if (n === 3) await sendTelegramText(`⚠️ Instant-Form lead sync failing for form ${formId} (3×): ${msg.slice(0, 200)}`).catch(() => undefined)
    }
  }
  return out
}
```

- [ ] **Step 5: `app/api/cron/meta-leads/route.ts` + `vercel.json`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/lead-machine/env'
import { syncMetaLeads } from '@/lib/lead-machine/meta-leads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const secret = env.cronSecret()
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const result = await syncMetaLeads()
  return NextResponse.json(result)
}
```

`vercel.json`:
```json
{
  "crons": [{ "path": "/api/cron/meta-leads", "schedule": "* * * * *" }]
}
```
(Vercel sends `Authorization: Bearer $CRON_SECRET` automatically when the `CRON_SECRET` env var is set.)

- [ ] **Step 6: Run tests → pass. Step 7: Commit** `feat(lead-machine): Instant-Form poller + every-minute cron`.

---

### Task 10: `/leads` page + basic auth

**Files:**
- Create: `lib/lead-machine/basic-auth.ts`, `app/leads/page.tsx`, `app/leads/actions.ts`, `app/leads/LeadRow.tsx`
- Modify: `middleware.ts`
- Test: `lib/lead-machine/__tests__/basic-auth.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest'
import { checkBasicAuth } from '@/lib/lead-machine/basic-auth'

const b64 = (s: string) => Buffer.from(s).toString('base64')
describe('checkBasicAuth', () => {
  it('rejects when creds not configured', () => expect(checkBasicAuth('Basic ' + b64('a:b'), '', '')).toBe(false))
  it('accepts matching creds', () => expect(checkBasicAuth('Basic ' + b64('dave:pw'), 'dave', 'pw')).toBe(true))
  it('rejects wrong password / missing header', () => {
    expect(checkBasicAuth('Basic ' + b64('dave:nope'), 'dave', 'pw')).toBe(false)
    expect(checkBasicAuth(null, 'dave', 'pw')).toBe(false)
  })
})
```

- [ ] **Step 2: Implement `lib/lead-machine/basic-auth.ts`** (edge-safe: no `Buffer` — use `atob`)

```ts
export function checkBasicAuth(header: string | null, user: string, pass: string): boolean {
  if (!user || !pass || !header?.startsWith('Basic ')) return false
  let decoded = ''
  try { decoded = atob(header.slice(6)) } catch { return false }
  const i = decoded.indexOf(':')
  if (i < 0) return false
  return decoded.slice(0, i) === user && decoded.slice(i + 1) === pass
}
```
(In the vitest node env `atob` exists on Node ≥16.)

- [ ] **Step 3: `middleware.ts`** — add before the final `return NextResponse.next()`:

```ts
  if (request.nextUrl.pathname === '/leads' || request.nextUrl.pathname.startsWith('/leads/')) {
    const ok = checkBasicAuth(request.headers.get('authorization'), process.env.LEADS_DASH_USER ?? '', process.env.LEADS_DASH_PASS ?? '')
    if (!ok) {
      return new NextResponse('Authentication required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="iLift leads", charset="UTF-8"' } })
    }
  }
```
with `import { checkBasicAuth } from '@/lib/lead-machine/basic-auth'` at the top. The existing matcher already includes `/leads`.

- [ ] **Step 4: `app/leads/actions.ts`**

```ts
'use server'
import { revalidatePath } from 'next/cache'
import { updateLead, type LeadStatus } from '@/lib/lead-machine/db'

const STATUSES: LeadStatus[] = ['new', 'contacted', 'call_booked', 'won', 'lost']

export async function setStatus(id: string, status: string): Promise<void> {
  if (!STATUSES.includes(status as LeadStatus)) throw new Error('bad status')
  await updateLead(id, { status: status as LeadStatus, ...(status === 'contacted' ? { called_at: new Date().toISOString() } : {}) })
  revalidatePath('/leads')
}

export async function setNotes(id: string, notes: string): Promise<void> {
  await updateLead(id, { notes: notes.slice(0, 2000) })
  revalidatePath('/leads')
}
```

- [ ] **Step 5: `app/leads/LeadRow.tsx`** (client)

```tsx
'use client'
import { useState, useTransition } from 'react'
import { setStatus, setNotes } from './actions'
import type { LeadRow as Row } from '@/lib/lead-machine/db'

const STATUSES = ['new', 'contacted', 'call_booked', 'won', 'lost'] as const

function age(iso: string): string {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (m < 60) return `${m}m`
  if (m < 1440) return `${Math.round(m / 60)}h`
  return `${Math.round(m / 1440)}d`
}

export function LeadRow({ lead }: { lead: Row }) {
  const [pending, start] = useTransition()
  const [notes, setLocalNotes] = useState(lead.notes ?? '')
  const t = (lead.tracking ?? {}) as Record<string, string>
  const src = lead.source === 'meta_form' ? 'Form' : 'LP'
  return (
    <tr className={`border-b align-top ${lead.status === 'new' ? 'bg-yellow-50' : ''}`}>
      <td className="p-3 text-xs text-gray-500 whitespace-nowrap">{age(lead.created_at)}</td>
      <td className="p-3"><div className="font-semibold">{lead.name || '—'}</div><div className="text-sm text-gray-600">{lead.company || ''}</div></td>
      <td className="p-3 whitespace-nowrap">{lead.phone_e164 ? <a className="font-semibold text-primary-700 underline" href={`tel:${lead.phone_e164}`}>{lead.phone_e164}</a> : '—'}<div className="text-xs text-gray-500">{lead.email || ''}</div></td>
      <td className="p-3 text-sm">{lead.pain?.replace(/_/g, ' ') || '—'}<div className="text-xs text-gray-500">{src}{lead.vertical ? ' · ' + lead.vertical : ''}{t.ad_name ? ' · ' + t.ad_name : ''}</div></td>
      <td className="p-3">
        <select defaultValue={lead.status} disabled={pending} onChange={(e) => start(() => setStatus(lead.id, e.target.value))} className="rounded border px-2 py-1 text-sm">
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </td>
      <td className="p-3">
        <textarea defaultValue={notes} rows={2} className="w-56 rounded border px-2 py-1 text-sm" onChange={(e) => setLocalNotes(e.target.value)} onBlur={() => { if (notes !== (lead.notes ?? '')) start(() => setNotes(lead.id, notes)) }} />
      </td>
    </tr>
  )
}
```

- [ ] **Step 6: `app/leads/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { listLeads } from '@/lib/lead-machine/db'
import { LeadRow } from './LeadRow'

export const metadata: Metadata = { title: 'Leads — iLift', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await listLeads(300)
  const fresh = leads.filter((l) => l.status === 'new').length
  return (
    <main className="container-custom py-8">
      <h1 className="font-heading text-2xl font-bold">Leads <span className="ml-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">{fresh} new</span></h1>
      <p className="mt-1 text-sm text-gray-500">Newest first. Tap a number to call. Status and notes save automatically.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Age</th><th className="p-3">Who</th><th className="p-3">Contact</th><th className="p-3">Pain / source</th><th className="p-3">Status</th><th className="p-3">Notes</th></tr></thead>
          <tbody>{leads.map((l) => <LeadRow key={l.id} lead={l} />)}</tbody>
        </table>
      </div>
    </main>
  )
}
```

- [ ] **Step 7: typecheck + test + build → green. Step 8: Commit** `feat(leads): basic-auth pipeline page`.

---

### Task 11: Playwright e2e for the landing page

**Files:**
- Create: `playwright.config.ts`, `e2e/lp.spec.ts`
- Modify: `package.json` (`"test:e2e": "playwright test"`, devDep `@playwright/test`)

- [ ] **Step 1: Install** `npm i -D @playwright/test && npx playwright install chromium`

- [ ] **Step 2: `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  use: { baseURL: 'http://localhost:3111', headless: true },
  webServer: {
    command: 'npx next dev -p 3111',
    url: 'http://localhost:3111/lp/contractors',
    reuseExistingServer: true,
    timeout: 120_000,
    env: { LEADS_SUPABASE_URL: '', LEADS_SUPABASE_SERVICE_KEY: '', NEXT_PUBLIC_META_PIXEL_ID: '1192402142237152' },
  },
})
```

- [ ] **Step 3: `e2e/lp.spec.ts`** — intercept `/api/lead` so no real insert happens; assert the browser Lead call carries the eventID

```ts
import { test, expect } from '@playwright/test'

test('LP form submits and thanks page fires a deduped Lead', async ({ page }) => {
  await page.route('**/api/lead', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, eid: 'e2e-evt-1' }) }))
  const pixelCalls: string[] = []
  await page.route('https://www.facebook.com/tr/**', (route) => { pixelCalls.push(route.request().url()); route.fulfill({ status: 200, body: '' }) })
  await page.route('https://connect.facebook.net/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.fbq=function(){var q=(window.__fbq=window.__fbq||[]);q.push([].slice.call(arguments))}' }))

  await page.goto('/lp/contractors?utm_source=meta&utm_campaign=nmc')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Stop sending jobs to voicemail')
  await page.getByLabel('Your name').fill('Test Lead')
  await page.getByLabel('Mobile number').fill('516-555-0100')
  await page.getByLabel('Business name').fill('E2E HVAC')
  await page.getByLabel(/costing you the most/).selectOption('missed_calls')
  await page.getByRole('button', { name: /Text me the details/ }).click()

  await expect(page).toHaveURL(/\/lp\/contractors\/thanks\?eid=e2e-evt-1/)
  const fired = await page.evaluate(() => (window as unknown as { __fbq?: unknown[][] }).__fbq ?? [])
  expect(JSON.stringify(fired)).toContain('"Lead"')
  expect(JSON.stringify(fired)).toContain('e2e-evt-1')
})

test('honeypot submissions are swallowed', async ({ page }) => {
  let hit = 0
  await page.route('**/api/lead', (route) => { hit++; route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }) })
  await page.goto('/lp/restaurants')
  await page.locator('input[name="website"]').fill('http://spam', { force: true })
  await page.getByLabel('Your name').fill('Bot')
  await page.getByLabel('Mobile number').fill('516-555-0100')
  await page.getByLabel('Business name').fill('Bot Co')
  await page.getByLabel(/costing you the most/).selectOption('reviews')
  await page.getByRole('button', { name: /Text me the details/ }).click()
  expect(hit).toBe(1) // server swallows; the route still receives the POST
})
```

- [ ] **Step 4: Run** `npm run test:e2e` → 2 passed. **Step 5: Commit** `test(e2e): landing page submit → thanks → pixel Lead`.

---

### Task 12: Docs, env example, PR

**Files:**
- Create: `docs/lead-machine/OWNER_CHECKLIST.md`
- Modify: `.env.example`

- [ ] **Step 1: `.env.example`** — append:

```
# Lead machine (see docs/lead-machine/OWNER_CHECKLIST.md)
LEADS_SUPABASE_SERVICE_KEY=
LEADS_DASH_USER=
LEADS_DASH_PASS=
CRON_SECRET=
META_PAGE_TOKEN=
META_LEAD_FORM_IDS=
META_CAPI_TOKEN=
META_GRAPH_VERSION=v21.0
LEAD_SMS_ENABLED=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
```

- [ ] **Step 2: `docs/lead-machine/OWNER_CHECKLIST.md`** — the exact owner steps from the spec §8, with click paths:

```markdown
# Lead machine — owner checklist

## A. Before the PR is merged (5–10 min)
1. Supabase → project `apkiueduxqspzefzybpx` → Settings → API → copy the **service_role** key → Vercel env `LEADS_SUPABASE_SERVICE_KEY` (Production).
2. Pick a username/password for the leads page → `LEADS_DASH_USER`, `LEADS_DASH_PASS`.
3. Generate a random string → `CRON_SECRET` (Vercel uses it to call the cron).
4. Meta Events Manager → Data sources → pixel **1192402142237152** → Settings → Conversions API → *Generate access token* → `META_CAPI_TOKEN`.
5. Page token (Instant Forms): Graph API Explorer → app **NovaAds** → *Get User Access Token* with `pages_show_list, pages_read_engagement, leads_retrieval, pages_manage_ads` → Generate → click ⓘ → *Open in Access Token Tool* → *Extend Access Token* → then `GET /me/accounts` with the extended token → copy `access_token` of "AI Smart Marketing, AI Consulting & Business Systems" → `META_PAGE_TOKEN` (Page tokens from a long-lived user token do not expire).
6. Ads Manager → the July lead form (or a new 3-field form with the one qualifying question) → copy the form id → `META_LEAD_FORM_IDS`.
   Add each with: `printf '%s' 'VALUE' | vercel env add NAME production` (no trailing newline).

## B. Merge + go live
7. Merge the PR into `feature/fable-method-landing` (prod branch) and push — Vercel deploys. Confirm `https://www.ilift.com/lp/contractors` renders and `https://www.ilift.com/leads` asks for the password.
8. Submit one test lead on the LP with your own mobile; confirm Telegram ping, row on /leads, Events Manager shows a server `Lead` (Test Events tab), then set the row to *lost*.
9. Ads Manager → Lead form → *Test lead* → confirm it appears on /leads within ~1 min.

## C. SMS (can lag launch)
10. Twilio → buy a local NY number → Messaging → A2P 10DLC → register a campaign for it (use case: customer care / lead follow-up; sample message = the text in `lib/lead-machine/sms.ts`). 1–7 days.
11. When approved: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM=+1…`, `LEAD_SMS_ENABLED=1` → redeploy (empty commit or Vercel *Redeploy*).

## D. Campaign
12. Ads Manager → campaign **"iLift • Never Miss a Call • Leads"** (created PAUSED by the agent) → review the 6 ads → set the campaign to **Active**. Budget starts at $30/day.
13. Day 5–7: kill any ad set above 2× the target CPL after 50+ clicks; do not judge before day 4.
```

- [ ] **Step 3: Full verification**

Run: `npm run typecheck && npm run test:run && npm run build`
Expected: all green.

- [ ] **Step 4: Commit + push branch + open PR** (branch push only — never the prod branch)

```bash
git add .env.example docs/lead-machine/OWNER_CHECKLIST.md
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -m "docs(lead-machine): owner checklist + env example" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_0165v3vUwcuh5TE8d8MKgqgd"
gh auth switch --user iliftpr
git -c credential.helper="" -c credential.https://github.com.helper="!gh auth git-credential" push -u origin feat/ilift-lead-machine
gh pr create --base feature/fable-method-landing --title "iLift Lead Machine: landing pages, 60-second lead follow-up, Instant-Form sync, /leads" --body-file docs/superpowers/specs/2026-08-24-ilift-lead-machine-design.md
```

---

### Task 13: Build the Meta campaign (PAUSED) — agent runbook, no repo code

Uses the Meta Ads MCP (`mcp__meta-ads__*`) against ad account `1179508710370218`, Page `527833293737471`, pixel `1192402142237152`. Everything created with `status: PAUSED`. Do NOT call `ads_activate_entity`.

- [ ] **Step 1: Creatives** — from the Task 0 image briefs, generate 3 stills per vertical with **GPT Image 2** via Kai (skill `kai-generate`; Dave's standard for images/text), 1080×1080 and 1080×1350: (a) pain scene (tradesperson / front desk / dinner rush with a buzzing phone), (b) clean split graphic "Missed call → $0 vs AI answered → Booked", (c) Dave Soul-character portrait (Higgsfield Soul ID `8d85afeb-5283-4e0f-8940-7a2e05119476`, skill `higgsfield-soul-id`). Text overlays ≤6 words, rendered by GPT Image 2 (it handles text; if any glyph is off, re-roll rather than ship). Generate 2 candidates per brief, keep the best, save under `marketing/creatives/2026-08-nmc/` with the prompt in a sidecar `.txt`. Upload each with `ads_creative_upload_local_image`.
- [ ] **Step 2: Campaign** — `ads_create_campaign`: name `iLift • Never Miss a Call • Leads`, objective `OUTCOME_LEADS`, `special_ad_categories: []`, CBO daily budget 3000 (cents), status PAUSED.
- [ ] **Step 3: Ad set A "Instant Form"** — `ads_create_ad_set`: optimization_goal `LEAD_GENERATION`, billing_event `IMPRESSIONS`, destination `ON_AD`, promoted_object `{page_id: 527833293737471}`, targeting `{geo_locations:{custom_locations:[{latitude:40.7140,longitude:-73.5590,radius:20,distance_unit:"mile"}]}, age_min:30, age_max:60, targeting_automation:{advantage_audience:1}}`, status PAUSED. If the API 400s on a required field, consult `reference_meta_campaign_adset_required_fields` in memory and `ads_get_errors`.
- [ ] **Step 4: Ad set B "Website LP"** — same targeting, optimization_goal `LEAD_GENERATION` is invalid off-Meta → use `OFFSITE_CONVERSIONS` with `promoted_object {pixel_id: 1192402142237152, custom_event_type: "LEAD"}`, destination `WEBSITE`.
- [ ] **Step 5: Creatives + ads** — for each ad set, 3 `ads_create_creative` (object_story_spec with `page_id`, link_data `{image_hash, link, message, name, call_to_action:{type:"LEARN_MORE"}}`; for ad set A the link CTA is `SIGN_UP` with `lead_gen_form_id`; for ad set B links are `https://www.ilift.com/lp/contractors?utm_source=meta&utm_medium=cpc&utm_campaign=nmc&utm_content={{ad.name}}` etc.) then `ads_create_ad` PAUSED. Copy = ad-briefs Ad A/B/C for the contractor set; the LP set rotates `contractors` / `dental-medspa` / `restaurants` links.
- [ ] **Step 6: Retargeting audience** — `ads_create_custom_audience`: website audience, pixel 1192402142237152, rule URL contains `/lp/`, retention 30 days. No ad yet.
- [ ] **Step 7: Verify** — `ads_get_ad_entities` level `ad` filtering campaign id: 6 ads, all PAUSED, previews via `ads_get_ad_preview`. Record ids in `docs/lead-machine/CAMPAIGN.md`.

---

## Self-review

**Spec coverage:** §1 offer/funnel → Tasks 8, 13 · §2 intake → Tasks 3–7 · §3 poller → Task 9 · §4 /leads → Task 10 · §5 campaign → Task 13 · §6 tracking → Tasks 5, 8 (pixel + CAPI, tracking column) · §7 testing → every task + Task 11 · §8 owner actions → Task 12 checklist. Migration → Task 2. ✔

**Placeholders:** none; every code step has full code. The Meta ad-set parameters in Task 13 are best-effort and explicitly point at the error-handling path.

**Type consistency:** `LeadSourceKind` (`db.ts`) is used by `types.ts`, `intake.ts`, `meta-leads.ts`; `SideEffectResult` defined in `sms.ts` and imported by the other side-effect modules; `processLead` signature (`LeadInput` with `context: CapiContext`) matches both callers; `LeadRow` in `db.ts` matches `/leads` usage; `PAIN_LABELS` keys match the form `PAINS` values and `PAIN_BY_LABEL` targets. ✔
