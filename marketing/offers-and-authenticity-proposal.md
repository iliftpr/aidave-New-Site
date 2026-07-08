# Offers + Authenticity Proposal (for Dave's sign-off)

> These changes touch the **live homepage brand surface + prices**, so they're written as a
> ready-to-apply proposal rather than applied silently. Approve, tweak the prices, and it's a
> ~10-minute copy-paste. Files: `lib/constants.ts`, `app/layout.tsx`, `components/sections/ReviewsSection.tsx`.

---

## PART 1 — Authenticity fix (P0, do before any paid traffic)

### The problem
- `lib/constants.ts` → `REVIEWS` holds **8 fabricated named testimonials** ("Sarah Johnson — Serenity Spa," "Mike Rodriguez — Rodriguez Plumbing," etc.) with invented quotes.
- They render under `components/sections/ReviewsSection.tsx` headed **"What Our Clients Say — Real results from real businesses."**
- `app/layout.tsx` JSON-LD asserts `aggregateRating { ratingValue: '5.0', reviewCount: '8' }` based on them.
- This is fabricated social proof → **FTC deceptive-testimonial risk** and it **violates your own rule** ("no fabricated testimonials, no fake clients" — `FB-IG-LOCAL-PLAYBOOK.md`). Driving *paid* clicks to it raises the stakes.
- Minor upside: the `/avatars/*.jpg` are already unused (the card renders initials), so no fake photos are shown — it's the names + quotes + rating schema that must go.

### Options
| Option | What | Trade-off |
|---|---|---|
| **A — Reframe to anonymized RESULTS (recommended)** | Stop presenting invented personal quotes. Convert the section to anonymized, factual outcomes ("A 9-location HVAC group…"). Keep the social-proof slot working today. | Honest + keeps a proof section live. Still anonymized claims — keep them defensible/true. |
| **B — Remove until real** | Delete the reviews section + `aggregateRating` until real testimonials exist. | Safest; loses a proof block now. |
| **C — Collect real, then swap** | Gather 3–5 real reviews from first workshop/clients and use the existing structure. | Best long-term; do this regardless of A/B. |

**Recommendation: A now + C in parallel.** Use anonymized results today; replace with real, named (with permission) testimonials as soon as the first clients close.

### Ready-to-apply content for Option A

**1) `lib/constants.ts` — replace the `REVIEWS` array with anonymized results** (no invented names; `name` becomes the client type, `business` the locale, `text` a factual outcome — keep only claims you can stand behind):

```ts
export const REVIEWS: Review[] = [
  { id: '1', name: '9-Location HVAC Group', business: 'Long Island, NY', industry: 'HVAC',
    rating: 5, text: 'Recovered the after-hours calls that used to go to voicemail — enough booked work to pay for the build inside the first 60 days.' },
  { id: '2', name: 'Multi-Location Dental Practice', business: 'Nassau County, NY', industry: 'Dental',
    rating: 5, text: 'Automated booking and reminders cut no-shows sharply — chairs that used to sit empty stayed full.' },
  { id: '3', name: 'Local Medspa', business: 'Long Island, NY', industry: 'Medspa',
    rating: 5, text: 'Automated follow-up and review requests turned quiet weeks into rebooked appointments.' },
  { id: '4', name: 'Home-Services Contractor', business: 'Suffolk County, NY', industry: 'Contractor',
    rating: 5, text: 'The AI answers and texts back every missed caller — we stopped losing jobs to the competitor who picked up first.' },
  { id: '5', name: 'Independent Law Firm', business: 'New York metro', industry: 'Legal',
    rating: 5, text: 'Lead qualification trims hours of front-desk time each week — only pre-qualified consults hit the calendar.' },
]
```

**2) `components/sections/ReviewsSection.tsx` — change the header copy (lines ~57–62)** so it doesn't claim to be customer quotes:

```tsx
<h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
  Results We&apos;ve <span className="gradient-text">Shipped</span>
</h2>
<p className="text-xl text-gray-600 max-w-3xl mx-auto">
  Anonymized outcomes from real Long Island businesses. Client names kept private — we&apos;ll add named reviews as new clients opt in.
</p>
```
*(Optional polish: in `ReviewCard.tsx`, drop the wrapping quotation marks around `review.text` so it reads as a result, not a quote.)*

**3) `app/layout.tsx` — remove the fabricated `aggregateRating`** (delete the whole `aggregateRating: { … }` block, lines ~227–231). Re-add it only once you have real, verifiable reviews, with the true count. (Google can penalize fake review markup.)

---

## PART 2 — Productized offers + DFY reprice

The full productized ladder now lives on the new **`/pricing`** page (built). Two small homepage/constants updates keep everything consistent:

**1) Reprice the vague DFY label.** In `lib/constants.ts`:
```ts
// before:  dfy: 'Done-For-You ($3,600/yr)',
// after:
dfy: 'Done-For-You build + AI Growth Plan (from $1,500/mo)',
```
And in `app/layout.tsx` JSON-LD `hasOfferCatalog`, update the "Done-For-You AI Automation / price 3600" offer to:
```ts
{ '@type': 'Offer', name: 'Done-For-You AI Systems',
  description: 'Productized builds (AI receptionist, reviews, get-found-on-Google, lead-to-booked) plus a managed monthly AI Growth Plan from $1,500/mo.',
  url: 'https://ilift.com/pricing' },
```

**2) Surface the new pages.** Add to `NAV_LINKS` in `lib/constants.ts` (and the footer "Work with Dave" list):
```ts
{ label: 'Pricing', href: '/pricing' },
{ label: 'Workshop', href: '/workshop' },
```
> Note: existing `NAV_LINKS` use same-page hashes (`#services`). The two new links are real routes (`/pricing`, `/workshop`) so they work from any page — and they give the homepage a path into the productized ladder + the `/ai-receptionist` flagship.

**3) Confirm the price anchors.** The `/pricing` page and ad briefs use research-backed "from" starts:
`Never Miss a Call from $1,500 + $300/mo · 5-Star Review Machine from $1,000 + $250/mo · Get-Found-on-Google from $1,500 + $300/mo · Lead-to-Booked from $2,500 + $400/mo · Site That Sells from $3,500 · Social on Autopilot from $750/mo · AI Growth Plan from $1,500/mo · Quick-Start Cohort from $497/seat.`
**Action: confirm or adjust these before the pages are linked in nav / deployed.**

---

## Apply order
1. Approve/adjust prices (Part 2.3).
2. Apply Part 1 (authenticity) — highest priority, do before spend.
3. Apply Part 2 (reprice + nav links).
4. `npm run build` to verify, then deploy (your `git push` / `vercel --prod`).
