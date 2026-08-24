# Meta campaign — iLift • Missed-Call Audit • Leads (created 2026-08-24, all PAUSED)

Ad account `1179508710370218` (iLift.com) · Page `527833293737471` · Pixel `1192402142237152`.
Ads Manager: https://www.facebook.com/adsmanager/manage/campaigns/edit?act=1179508710370218&selected_campaign_ids=120250129011790337

| Level | Name | ID | Notes |
|---|---|---|---|
| Campaign | iLift • Missed-Call Audit • Leads | `120250129011790337` | OUTCOME_LEADS, ABO, PAUSED |
| Ad set A | Instant Form • LI owners 20mi | — | **not created yet** (ToS accepted 2026-08-24; the agent's create call was blocked by the Claude Code permission classifier — owner runs it or approves). Spec: LEAD_GENERATION, `destination_type=ON_AD`, `promoted_object={page_id:527833293737471}`, $30/day, targeting = same as B (East Meadow +20 mi, living there; 30–60 as A+ suggestion). Ads = 9 new creatives: same `image_hash` + copy as B, `call_to_action={type:SIGN_UP,value:{lead_gen_form_id:4103248023306565}}`, AI disclosure OPT_IN |
| Ad set B | Landing pages • LI owners 20mi | `120250129035250337` | OFFSITE_CONVERSIONS on pixel event LEAD, WEBSITE, $20/day, East Meadow +20 mi (people living there), 30–60 as Advantage+ suggestion, PAUSED |

## Instant Form (created 2026-08-24 in Business Suite → Lead ads forms)

**"iLift - Missed-Call Audit LI owners (Aug 2026)" — form id `4103248023306565`** (= `META_LEAD_FORM_IDS`).
Higher intent (review screen, no SMS passcode yet) · Intro "Free 15-Minute Missed-Call Audit" · fields
Full name, Phone number, Company name (prefilled) · required multiple-choice *"What's costing you the most
right now?"* → Missed calls / No-shows / Not enough leads / Reviews (labels match `PAIN_BY_LABEL` in
`lib/lead-machine/meta-leads.ts`) · privacy https://www.ilift.com/privacy · ending "You're in. Here's what
happens next." with "See how it works" → https://www.ilift.com. Sharing: Restricted. Swap the ending CTA to
*Call business* once the iLift AI-receptionist line exists (research §3).

## Ads in ad set B (all PAUSED, AI-disclosure OPT_IN)

| Ad | Ad ID | Creative ID | Destination |
|---|---|---|---|
| C1 • contractors • ladder | `120250129219430337` | `889236747346627` | /lp/contractors?utm_content=C1 |
| C2 • contractors • voicemail split | `120250129220900337` | `1695691545059287` | /lp/contractors?utm_content=C2 |
| C3 • contractors • founder yard | `120250129221360337` | `27873445652306853` | /lp/contractors?utm_content=C3 |
| D1 • dental • front desk | `120250129222720337` | `926729473207708` | /lp/dental-medspa?utm_content=D1 |
| D2 • medspa • closed split | `120250129223440337` | `1057368773605362` | /lp/dental-medspa?utm_content=D2 |
| D3 • dental • founder | `120250129224880337` | `1050841127682907` | /lp/dental-medspa?utm_content=D3 |
| R1 • restaurants • rush | `120250129225730337` | `1712735763113640` | /lp/restaurants?utm_content=R1 |
| R2 • restaurants • hold split | `120250129226730337` | `1439750484667613` | /lp/restaurants?utm_content=R2 |
| R3 • restaurants • founder diner | `120250129227480337` | `1849688619084421` | /lp/restaurants?utm_content=R3 |

Copy per ad: `marketing/creatives/2026-08-nmc/ads.json`. Images: `marketing/creatives/2026-08-nmc/final/`
(4:5 used in the creatives; 1:1 available). Image hosting for the creatives: Fal CDN URLs in
`final/urls.json` (Meta copies the image on creative creation).

## Run rules (from the research)
- Do not touch anything for 72 h after activation; judge on day 7 by cost per **booked audit**.
- Pause an ad at frequency > 3 or CTR < 0.5 %. Scale ≤ 20 % every 3–4 days.
- Retargeting audience (LP visitors 30 d) — create after the first 50 visits.
