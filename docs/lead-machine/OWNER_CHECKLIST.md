# Lead machine — owner checklist

Everything the agent could not do for you, in order. Each item says where to click and which
env var it feeds. Add each Production env var with **no trailing newline**:

```
printf '%s' 'VALUE' | vercel env add NAME production
```

## A. Before the PR is merged (≈10 minutes)

1. **Supabase service key** → `LEADS_SUPABASE_SERVICE_KEY`
   Supabase → project `apkiueduxqspzefzybpx` → Settings → API → *service_role* (secret). Server-only;
   never goes in a `NEXT_PUBLIC_` var.
2. **Leads page login** → `LEADS_DASH_USER`, `LEADS_DASH_PASS`
   Any username + a long password. The page fails closed until both exist.
3. **Cron secret** → `CRON_SECRET`
   Any random string (e.g. `openssl rand -hex 24`). Vercel sends it as `Authorization: Bearer …`
   to `/api/cron/meta-leads` every minute.
4. **Conversions API token** → `META_CAPI_TOKEN`
   Events Manager → Data sources → pixel **1192402142237152** ("ilift.com Home") → Settings →
   Conversions API → *Generate access token*.
5. **Page token for Instant-Form leads** → `META_PAGE_TOKEN`
   Graph API Explorer → Meta App: **NovaAds** → *User or Page*: "Get User Access Token" →
   permissions `pages_show_list`, `pages_read_engagement`, `leads_retrieval`, `pages_manage_ads` →
   Generate → click ⓘ next to the token → *Open in Access Token Tool* → *Extend Access Token* →
   back in the Explorer paste the extended token and run `GET /me/accounts` → copy the
   `access_token` of **"AI Smart Marketing, AI Consulting & Business Systems"** (Page
   `527833293737471`). Page tokens derived from a long-lived user token do not expire.
6. **Which Instant Form(s) to poll** → `META_LEAD_FORM_IDS`
   Ads Manager → the July "NSBCC" lead form (or a new 3-field form: name, phone, business + the
   one qualifying question *"What's costing you the most right now?"* with answers
   Missed calls / No-shows / Not enough leads / Reviews). Copy the form id; comma-separate several.

## B. Merge and go live

7. Merge the PR into `feature/fable-method-landing` (the branch Vercel deploys as production)
   and push. Confirm:
   - `https://www.ilift.com/lp/contractors` renders (also `/lp/dental-medspa`, `/lp/restaurants`)
   - `https://www.ilift.com/leads` asks for the password, then shows the table
8. Submit one **test lead** on the LP with your own mobile → expect: Telegram ping with a tap-to-call
   link, the row on `/leads` (yellow = new), Events Manager → Test events shows a server `Lead`.
   Set the row to *lost* afterwards.
9. Ads Manager → Lead form → *Create test lead* → it should appear on `/leads` within ~1 minute.
   The poller deliberately starts each form at "now minus 10 minutes" the first time it sees it,
   so the 59 July leads are **not** re-texted. If you want them in `/leads`, export the CSV from
   Ads Manager and ask the agent to import it as `source=meta_form`, status `contacted`.
   If not: Vercel → project → Cron Jobs shows the last run; the `ilift_lead_sync` row holds
   `last_error`.

## C. SMS text-back (can lag launch by days — the rest runs without it)

10. Twilio → buy a local NY number → Messaging → Regulatory compliance → A2P 10DLC → register a
    **campaign** for it under your existing brand (use case: customer care / lead follow-up;
    sample message = the text in `lib/lead-machine/sms.ts`). Approval takes 1–7 days.
11. When approved: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM=+1…`, then
    `LEAD_SMS_ENABLED=1` → redeploy (Vercel *Redeploy* or an empty commit). Until then leads get
    the email + you get the Telegram ping; **you** text them.

## D. Campaign

12. **Accept the Lead Ads Terms of Service for the Page (blocks the Instant-Form ad set):**
    https://www.facebook.com/legal/leadgen/tos → choose "AI Smart Marketing, AI Consulting &
    Business Systems" → Accept. Meta returned `leadgen_tos_accepted: false` for this Page on
    2026-08-24, so the "A • Instant Form" ad set could not be created by the agent — tell the
    agent once accepted and it will finish it, or create it yourself (Leads → Instant form,
    East Meadow +20 mi, 30–60, $30/day, the 3 vertical ads).
13. Ads Manager → campaign **"iLift • Missed-Call Audit • Leads"** (id `120250129011790337`,
    created PAUSED by the agent; ad set "B • Landing pages" is the website/LP path) → open each
    ad preview → when happy, set the **campaign** to Active. Start the Instant-Form ad set at
    $30/day; leave the landing-page ad set paused for the first week unless you want the A/B.
13. Do not judge before day 4. On day 5–7 pause any ad set above 2× the target CPL after 50+
    clicks. Target: ≤$25/lead on the Instant Form, ≤$60/lead on the landing page.
14. Every lead: call within 5 minutes of the Telegram ping. Mark *contacted* on `/leads` — that
    timestamp is how we measure speed-to-lead later.
