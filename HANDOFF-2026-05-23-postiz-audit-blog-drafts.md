# HANDOFF — 2026-05-23 (Sat) — Postiz audit + Week 2 blog drafts + ilift.com redeploy

## What this session covered

1. Audited content structure across `AI Dave Website/`, `linkedinaidave/`, `fbaidave/`.
2. Verified Postiz live queue via Playwright (the MCP doesn't expose `getScheduledPosts`).
3. Drafted Mon 5/25 + Fri 5/29 blog MDX.
4. Redeployed `ilift.com` to push the staged 5/22 + 5/27 posts live.
5. Investigated a suspected duplicate-`postiz_id` + template-glob bug — turned out NOT to exist.

## Headline status

**Postiz LinkedIn queue is healthy through 2026-06-30.** The gap is everything after 6/30 — July is empty. Dave's reaction ("I don't see any future social updates and posts") most likely came from one of:

- Day view on Sat 5/23 (newsletter is manual-paste, nothing scheduled for today)
- Filtering by an X account (both X integrations are `disabled: true` in Postiz)
- Looking at July or later (genuinely empty after 6/30)

There IS a true content gap: nothing scheduled past 6/30. That's the next planning task.

## What's actually in Postiz (verified via Playwright 2026-05-23)

### May 2026 (LinkedIn / IG / FB combined, mixed Dave + OSC)

| Date | Post |
|---|---|
| 5/8 | "Most small businesses do not need another AI tool…" (Dave) |
| 5/9 | Variant of 5/8 (Dave) |
| 5/15-17 | OSC organic skincare posts |
| 5/21 | Dave — "Your company doesn't need an AI strategy. It needs one workflow live this quarter…" |
| 5/22 | Dave — "$468/mo. Six narrow tools…" (openwpagent launch) |
| 5/25 | Dave — "11 AI agents I shipped to production…" (openwpagent listicle) |
| 5/26 | Dave — "7-location dental group. 31% no-show rate…" (Lever 3) |
| 5/27 | OSC — Oat Bran Extract |
| 5/28 | Dave — "The 'CTO of AI' job posting is a trap…" |

### June 2026 — packed (Scorecard Storm campaign + 4-Lever weekly cadence)

18 posts total. Dave content 6/2, 6/4, 6/9, 6/11, then the **Scorecard Storm campaign 6/13-6/27** (14 posts — not in `linkedinaidave/posts/` locally; submitted via `scripts/schedule-campaign-1.mjs`), then 6/30 Q2 listicle.

### July 2026 — ZERO scheduled posts

Confirmed via `https://platform.postiz.com/launches?startDate=2026-07-01&endDate=2026-07-31&display=month`. Calendar returns empty grid.

## The "duplicate postiz_id bug" was a false alarm

My initial PowerShell extraction reported all 19 LinkedIn draft files sharing 9 postiz_ids — including 3 `_template-*.md` and 1 `2026-06-30-*.md` file all stamped with the same id as the 6/11 post. This was wrong.

Root cause: my PowerShell script used `$pid` as a variable name. `$PID` is auto-reserved (current process ID, ~23984). The `.Matches[0].Groups[1].Value` failures (which fired for files with NO frontmatter) leaked the previous iteration's `$sched`/`$status`/`$pzid` values into the printed row.

Verified by direct file reads + Codex investigation:

- Three `_template-*.md` files: pure markdown, NO frontmatter at all. Never entered the pipeline.
- Newsletter files (5/30, 6/6, 6/13): pure markdown, NO frontmatter — designed for manual paste.
- `2026-06-30-tue-q2-projects-listicle.md`: pure markdown, NO frontmatter, but its content IS scheduled in Postiz (visible on the calendar). Likely submitted via a different script that didn't write back.
- `2026-05-27-wed-carousel-lever1-intake.md`: HAS frontmatter — `status: "native_only"`, correctly marked.
- `social-push-watcher.mjs` already has `f.startsWith('_')` filter at line 496.

Codex-implementer confirmed no fixes needed. No edits to scripts or post files. Single artifact written: `linkedinaidave/posts/audit-cleanup-2026-05-23.md`.

## X accounts (real finding — separate from above)

Both X integrations are `disabled: true` in Postiz per `linkedinaidave/posts/audit-postiz-state-2026-05-21.json`:

- `cmox92660034hl70yb0u0hkrl` — X — OrganicSkinCare.com (`organicskinshop`)
- `cmox4yai602i1ns0yqi2jngca` — X — David Gakshteyn (`iliftmarketing`)

If Dave's UI defaulted to either X account, he'd see nothing scheduled. Recommend: either reconnect them or remove them so the calendar isn't misleading. Note: X migrated to pay-per-use credits in 2026 (per memory `reference_x_api_credit_pricing_2026`) — the old $100/mo Basic tier is dead. Reconnecting requires credit purchase at console.x.com.

## New blog drafts (Week 2)

Both written, neither committed yet (Dave should review before commit).

### Mon 5/25 — `2026-05-25-avoca-billion-dollar-churn-data-operators-need.mdx`

- Category: news. Lever 1 (Intake).
- News anchor: Avoca co-founders interview on homepros.news, published 2026-05-19. $1B valuation on $125M raised.
- Angle: the churn data the founders volunteered (ops not ready / dispatch logic wrong at go-live / ownership change) is more useful than the funding story.
- Hero image: NOT generated — path `/blog/avoca-billion-dollar-churn-data-operators-need/hero.png` is staged but file doesn't exist. Needs Higgsfield generation before Mon 9am ET. heroImageAlt prompt is in the frontmatter.

### Fri 5/29 — `2026-05-29-sold-ai-by-people-who-never-shipped-it.mdx`

- Category: take. Lever 2 (Dispatch).
- News anchor: Same Avoca interview (used as supporting evidence, not the lead).
- Angle: Six tells separate planners from shippers in AI consulting. Anchored on dispatch failures.
- Hero image: NOT generated — same situation as above.

Voice precedent: matched `dispatcher-bottleneck-no-ai-saves-you.mdx` + `ship-the-confirmation-sms-first.mdx` for tone/length/structure.

## What was redeployed to ilift.com

Ran `vercel --prod --yes` from `AI Dave Website/`. Project: `ai-dave-website` (orgId `team_cQ1RJlkwLR8YIAFrnDXdAl6E`). Deploy ran in background; check final URL in the Vercel CLI output. Build target: all posts in `content/posts/` with the date filter active (future-dated posts won't show until their date).

Visible on ilift.com after this deploy:
- 5/21 KPMG (was already live)
- 5/22 Confirmation SMS take ← NEW VISIBLE
- 5/22 Dispatcher Bottleneck take (was already live)

Not yet visible (gated by publishedAt date):
- 5/25 Avoca brief — needs Higgsfield hero + Mon redeploy
- 5/27 Ship Intake First framework — needs Wed redeploy
- 5/29 Sold AI by Planners take — needs Higgsfield hero + Fri redeploy

## Open items for Dave

1. **PASTE newsletter Issue #1 manually into LinkedIn today (Sat 5/23).** File at `linkedinaidave/posts/2026-05-23-sat-newsletter-issue-01.md`. Postiz can't post LinkedIn newsletters — design choice, not a bug.
2. **Generate Higgsfield heroes for 5/25 + 5/29 posts** before each respective publish date. Image prompts are in the MDX frontmatter `heroImageAlt` field. Costs: GPT Image 2 high-quality ≈ 7 credits each.
3. **Plan Q3 content past 6/30.** July is empty. Editorial calendar needs Week 6+ posts authored + scheduled. Dave's Scorecard Storm campaign ends 6/27 — natural reset point.
4. **Re-enable or remove the two X accounts.** Currently disabled and confusing the calendar view.
5. **Redeploy ilift.com on 5/25, 5/27, 5/29** (or just on Wed 5/27 + Sun 5/31 — bundled redeploys) to make the future-dated posts visible. Alternatively, switch the blog to ISR/revalidation so date-based reveals happen without redeploy.
6. **Commit the 2 new MDX files** (`git add content/posts/2026-05-25-* content/posts/2026-05-29-*` then commit) once reviewed.
7. **news-alert Trigger.dev Day 5 still unbuilt.** The pipeline that would auto-write Monday news briefs.

## Helper contributions this session

- **Sonnet (3 streams)** mapped the 3-dir content pipeline (Part A/B/C audit) + researched + recommended news angles for both new blog posts.
- **Playwright** opened `platform.postiz.com`, navigated May/June/July calendars, extracted all 27 scheduled posts via DOM walking.
- **Codex (codex-implementer)** investigated the suspected duplicate-id / template-glob bug, confirmed it didn't exist, saved time vs. me trying to "fix" healthy files.
- **Direct file reads** caught the PowerShell `$PID` bug + the disabled X accounts.
- **Memory** loaded: `[[feedback_codex_does_all_coding]]` (locked preference shaped the dispatch), `[[reference_x_api_credit_pricing_2026]]` (X pricing context), `[[reference_vercel_monorepo_dotvercel_path_collision]]` (deploy safety check).
