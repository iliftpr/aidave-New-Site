# iLift Lead Machine — design spec (2026-08-24)

Approved by Dave 2026-08-24 (Approach A, sections 1–8). Repo: `AI Dave Website`
(ilift.com, Next.js 16 App Router, Vercel Pro, prod branch `feature/fable-method-landing`).
Work branch: `feat/ilift-lead-machine` (worktree `.worktrees/ilift-lead-machine`, based on prod
commit `3bcf70f`).

## Goal

Dave can log in, flip a Meta campaign on, and have every lead texted back within 60 seconds,
pinged to his phone, and visible in one pipeline view — with nothing to build or configure on
the day he starts spending. Least new work; everything already proven on ilift.com is reused.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Offer | "Never Miss a Call" AI receptionist → free 15-min AI Automation Audit (`cal.com/ilift/automation-audit`) |
| Audience | Local LI/NYC business owners, 20 mi around East Meadow NY, 30–60; verticals: contractors, dental/med-spa, restaurants |
| Follow-up | Auto-SMS to lead + Telegram ping to Dave + confirmation email; no CRM |
| Ad destination | Both: Instant Form (proven, $2.18/lead July) and landing pages `/lp/*` |
| Budget | $30/day to start; campaign created PAUSED, Dave flips ACTIVE |
| Platform | ilift.com + iLift ad account `1179508710370218` + Page `527833293737471`; NOT NovaAds |

## Components

### 1. Landing pages — `app/lp/[slug]/page.tsx`
- Static, `noindex,nofollow`, no global nav (campaign page). Content-driven from
  `lib/lp-content.ts` with three slugs: `contractors`, `dental-medspa`, `restaurants`.
- Sections: hook (headline/subhead), 3-bullet mechanism, "try the live demo" link to `/demo`,
  proof (only the anonymized results already on the site — nothing invented), FAQ (4),
  form, footer (privacy/terms links, consent line).
- Form (`components/lp/LeadForm.tsx`, client): name, phone, business name, one qualifying
  select "What's costing you the most?" [Missed calls / No-shows / Not enough leads / Reviews].
  Honeypot field. Captures `utm_*`, `fbclid`, `_fbp`, `_fbc`, referrer, slug.
- On submit → `POST /api/lead` → redirect `/lp/[slug]/thanks?eid=…`.
- `thanks` page: fires pixel `Lead` with `eventID = eid` (CAPI dedup), embeds cal.com audit
  booking, shows "Dave is texting you now" + tap-to-call.
- Pixel `PageView` via the existing `MetaPixel` component in layout.

### 2. Lead intake — `POST /api/lead` (`app/api/lead/route.ts`, `lib/lead-machine/*`)
Shared by the LP form and the Instant-Form poller. Steps, in order:
1. Validate + rate-limit (`lib/rate-limit.ts`, namespace `lead:`), honeypot → 204.
2. Normalize phone to E.164 (default US). Dedupe: same phone within 24 h → return 200
   `{deduped:true}`, no messages.
3. **Must succeed:** insert into Supabase `ilift_leads` (existing `recordLead`, source
   `meta_lp` | `meta_form`; `message` carries vertical + pain + UTM JSON).
4. Fail-soft, in parallel: Twilio SMS to lead (`LEAD_SMS_ENABLED=1` + `TWILIO_*`),
   Telegram ping to Dave (existing `TELEGRAM_BOT_TOKEN/CHAT_ID`, message has `tel:` link +
   pain + source), Meta CAPI `Lead` (`META_CAPI_TOKEN`, pixel `1192402142237152`, same
   `event_id` as the browser pixel, `fbp/fbc/fbclid`, hashed phone/name), Resend confirmation
   email to the lead if email present, Resend audience add (existing).
5. Response `{ok:true, eid}`.
SMS template (from ad briefs): "Hey {first} — Dave from iLift. Got your note about {pain}.
Want me to text you 2 quick ideas, or grab a free 15-min look? {cal link} — Dave". Reply
STOP handling is Twilio-native.

### 3. Instant-Form ingestion — `GET /api/cron/meta-leads`
- Vercel cron every minute (`vercel.json`), guarded by `CRON_SECRET`.
- For each form id in `META_LEAD_FORM_IDS`: `GET /{form_id}/leads?fields=created_time,
  field_data,ad_id,ad_name,adset_name,campaign_name&filtering=[{field:"time_created",
  operator:"GREATER_THAN",value:<watermark>}]` with `META_PAGE_TOKEN` (long-lived Page token
  from the NovaAds Meta app `4520887008151659`, which holds `leads_retrieval` Advanced Access).
- Watermark per form in Supabase table `ilift_lead_sync` (`form_id`, `last_created_time`,
  `last_run_at`, `last_error`); dedupe additionally by `meta_lead_id` column on `ilift_leads`.
- Each new lead → same handler as §2 (source `meta_form`, ad names into `message`).
- Migration: `supabase/migrations/20260824120000_lead_machine.sql` (kept in this repo, applied
  with the Supabase MCP `apply_migration`) on project `apkiueduxqspzefzybpx`
  (adds `meta_lead_id`, `stage`, `notes`, `called_at`, `tracking jsonb` to `ilift_leads`
  + the `ilift_lead_sync` table). ⚠ that project is shared with OrganicSpa — additive only.

### 4. `/leads` pipeline page — `app/leads/page.tsx`
- HTTP basic auth via `middleware.ts` (`LEADS_DASH_USER/PASS`); server-rendered from
  Supabase with the **service-role key** (`LEADS_SUPABASE_SERVICE_KEY`, server-only).
- Table newest-first: name, tap-to-call phone, business, pain, source/ad, age, stage select
  (new / contacted / booked / won / lost), notes. Stage + notes save via server action.
- No Google Sheet by default (flag `LEADS_SHEET_ID` + service-account JSON adds a mirror later).

### 5. Campaign (built via Meta Marketing API, all PAUSED)
- Campaign "iLift • Never Miss a Call • Leads" objective `OUTCOME_LEADS`, CBO $30/day.
- Ad set A "Instant Form": lead form (reuse the July NSBCC form or a new 3-field form Dave
  picks), geo 20 mi East Meadow, age 30–60, Advantage+ audience with interest seeds
  (contractor/HVAC/dental practice/restaurant owner), Advantage+ placements.
- Ad set B "Website": conversion `LEAD` on pixel `1192402142237152` → `/lp/contractors`
  (+ `dental-medspa`, `restaurants` as separate ads), same targeting.
- 3 ads per ad set (pain / ROI / "Long Island AI guy" with Dave's Soul character), copy from
  `marketing/ad-briefs.md`, 1:1 + 4:5 statics generated with Kai GPT Image 2.
- Custom audience "LP visitors 30d" created for later retargeting (no ad yet).

### 6. Tracking
- Browser pixel: PageView on LP, Lead on thanks. CAPI Lead server-side with shared event_id.
- Lead row stores source, slug, utm, ad/adset/campaign names, fbclid.

### 7. Testing
- Unit (vitest, new): phone normalize/dedupe, SMS text, CAPI payload shape, fail-soft (each
  side effect throwing does not fail the insert), cron watermark advance, honeypot.
- Playwright (new, `e2e/`): LP renders, form submit → thanks page → pixel Lead call observed →
  row present via service key (then deleted).
- Prove-can-fail: disable `LEAD_SMS_ENABLED` and assert no Twilio call; break the Supabase key
  and assert 500 (the must-succeed step).
- Live: one real lead through LP and one through the Instant Form (test lead tool), verified
  in `/leads`, Telegram, and Events Manager; then deleted.

### 8. Owner actions (Dave)
1. Twilio: buy an iLift local number; register an A2P campaign for it (existing Tennis
   Buddy brand; 1–7 days). Until approved, `LEAD_SMS_ENABLED` stays unset — Telegram + email
   run from day 1.
2. Meta Page token: Graph API Explorer → app NovaAds → user token with
   `pages_show_list,pages_read_engagement,leads_retrieval,pages_manage_ads` → exchange for
   long-lived → `GET /me/accounts` → copy the Page's `access_token` → `META_PAGE_TOKEN`.
3. CAPI token: Events Manager → pixel 1192402142237152 → Settings → Generate access token →
   `META_CAPI_TOKEN`.
4. Vercel env (Production): `LEADS_SUPABASE_SERVICE_KEY`, `LEADS_DASH_USER`, `LEADS_DASH_PASS`,
   `CRON_SECRET`, `META_PAGE_TOKEN`, `META_LEAD_FORM_IDS`, `META_CAPI_TOKEN`, later
   `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`, `LEAD_SMS_ENABLED=1`.
5. Pick/confirm the Instant Form; approve creatives; flip the campaign ACTIVE in Ads Manager.
6. Merge the PR and push to the prod branch (the agent is blocked from prod deploys).

## Out of scope
Google Ads, any CRM, video ads, mid-market ad set, NovaAds product changes, blog/SEO, Sheet
mirror (flag-gated stub only).

## Risks
- Twilio A2P timing → SMS may lag launch by days; design runs without it.
- Page token expiry: long-lived Page tokens don't expire, but a password change or app
  removal kills it → cron records `last_error`, Telegram alert on 3 consecutive failures.
- Shared Supabase project (OrganicSpa): additive migration only, RLS untouched for `anon`.
- Main checkout has 30 uncommitted files from another session; this branch is based on the
  committed prod tree, so the PR must be reviewed for the `middleware.ts` → `proxy.ts`
  rename that session is doing (we add basic-auth in whichever file prod ships).
