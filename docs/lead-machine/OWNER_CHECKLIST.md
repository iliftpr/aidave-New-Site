# Lead machine — owner checklist

Everything the agent could not do for you, in order. Each item says where to click and which
env var it feeds. Add each Production env var with **no trailing newline**:

```
printf '%s' 'VALUE' | vercel env add NAME production
```

## A. Before the PR is merged (≈10 minutes)

1. **Supabase service key** → `LEADS_SUPABASE_SERVICE_KEY`
   Supabase → project `apkiueduxqspzefzybpx` → Settings → API Keys → either the legacy *service_role*
   JWT or a new `sb_secret_…` key (both verified to work with the `apikey` + `Bearer` headers the code
   sends). Server-only; never goes in a `NEXT_PUBLIC_` var.
   ⚠ 2026-08-24 release: the stored value was rejected by Supabase (`401 Invalid API key` on every
   cron run — wrong project or truncated paste). **Validate the key in a terminal before storing it:**
   ```
   K='paste-key-here'; curl -s -o /dev/null -w '%{http_code}\n' -H "apikey: $K" -H "Authorization: Bearer $K" \
     'https://apkiueduxqspzefzybpx.supabase.co/rest/v1/ilift_lead_sync?select=form_id&limit=1'
   ```
   `200` = good; `401` = wrong key. Then `printf '%s' "$K" | vercel env add LEADS_SUPABASE_SERVICE_KEY production --force`
   and redeploy (env changes need a real deploy). Proof it took: a row in `ilift_lead_sync` within a minute.
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
6. **Which Instant Form(s) to poll** → `META_LEAD_FORM_IDS` = `4103248023306565`
   ✅ Form built 2026-08-24 ("iLift - Missed-Call Audit LI owners (Aug 2026)", see CAMPAIGN.md).
   Comma-separate if you ever add the July "NSBCC" form (id in Business Suite → Lead ads forms).

Status 2026-08-24 PM: **all seven are set** on the live target (verified with `vercel env ls`; values are stored
as sensitive, so they cannot be read back — the cron row in `ilift_lead_sync` is the first real proof of the Page token).
DB: the original `ilift_leads_source_check` rejected `meta_lp`/`meta_form` — widened by
`supabase/migrations/20260824202452_lead_machine_source_check.sql` (applied + probe-verified 2026-08-24). Without it every
landing-page submission would have returned 500 and the poller would have failed every minute.

## B. Merge and go live

7. Merge the PR into `feature/fable-method-landing` and push. ⚠ **That push does NOT deploy
   ilift.com**: the Pro project `ai-dave-website` (owns ilift.com) is not Git-linked — every prod
   deploy since July has been a CLI `vercel --prod` from this branch. After merging, from a clean
   checkout of `feature/fable-method-landing` run `vercel --prod` (or link the project: Vercel →
   ai-dave-website → Settings → Git → connect `iliftpr/aidave-New-Site`, production branch
   `feature/fable-method-landing`, so pushes deploy from then on). The red "Vercel — Deployment
   failed" check on the PR comes from a *different* project, `aidaves-projects/aidave-new-site`
   (Hobby plan, rejects the every-minute cron); it does not serve ilift.com — disconnect or delete
   that stale project to silence it. The worktree `.worktrees/ilift-lead-machine` is already
   `vercel link`ed to `ai-dave-website`, so the one-command path after the merge is
   `vercel --prod --cwd "<repo>/.worktrees/ilift-lead-machine"` (the checkout there is the PR head).
   Confirm after deploy — run `bash docs/lead-machine/verify-live.sh` (read-only except one
   honeypot POST; prints the `data-dpl-id` www is serving and 19 PASS/FAIL probes; before the
   release it fails on every lead-machine route, which is the expected negative result), then:
   - `https://www.ilift.com/lp/contractors` renders (also `/lp/dental-medspa`, `/lp/restaurants`)
   - `https://www.ilift.com/leads` asks for the password, then shows the table
8. Submit one **test lead** on the LP with your own mobile → expect: Telegram ping with a tap-to-call
   link, the row on `/leads` (yellow = new), Events Manager → Test events shows a server `Lead`.
   Set the row to *lost* afterwards.
9. **Ads Manager → All Tools → Instant Forms → "iLift - Missed-Call Audit LI owners (Aug 2026)" → Test Form** — type real
   values and use a **different phone number than step 8** (the intake dedupes by phone for 24 h, so the same mobile
   yields no new row and no ping — it looks like a failure but is not). It should appear on `/leads` within ~1 minute.
   The developer tool at developers.facebook.com/tools/lead-ads-testing → *Create Lead* sends dummy data instead
   (email `test@fb.com`; a placeholder phone may be skipped as `invalid_phone`), and its *Preview Form* button is
   disabled by Meta in 2026. Only one test lead can exist per form — delete it in that tool afterwards.
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

12. ✅ **Ad set A exists** — `120250132160990337`, Instant form `4103248023306565`, $30/day, 9 ads
    (ids in CAMPAIGN.md), all PAUSED / pending review, built in Ads Manager on 2026-08-24. The
    Marketing API still says `leadgen_tos_accepted:false` for the Page even though the ToS page
    shows "Accepted" — Ads Manager works regardless; only API-created lead ads are blocked.
    Before activating: open 2–3 ads in set A → preview → *Destination* tab shows the iLift form;
    and confirm the "AI info" (AI-generated content) declaration on each — set B's creatives were
    OPT_IN, the copies should have inherited it.
13. Ads Manager → campaign **"iLift • Missed-Call Audit • Leads"** (id `120250129011790337`,
    created PAUSED by the agent; ad set "B • Landing pages" is the website/LP path) → open each
    ad preview → when happy, set the **campaign** to Active. Start the Instant-Form ad set at
    $30/day; leave the landing-page ad set paused for the first week unless you want the A/B.
13. Do not judge before day 4. On day 5–7 pause any ad set above 2× the target CPL after 50+
    clicks. Target: ≤$25/lead on the Instant Form, ≤$60/lead on the landing page.
14. Every lead: call within 5 minutes of the Telegram ping. Mark *contacted* on `/leads` — that
    timestamp is how we measure speed-to-lead later.
