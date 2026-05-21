# HANDOFF — AI Dave Blog Launch — 2026-05-21 PM → next session

**Project:** `C:\Users\admin\Documents\AI Dave Website` → deployed to **ilift.com** (Vercel CLI)
**Status:** Blog system LIVE. 2 posts in production, 2 posts staged for week 1 finish.

---

## 1. Where we are right now

### Posts LIVE on www.ilift.com

| # | Slug | Format | Lever | Live since |
|---|---|---|---|---|
| 1 | `kpmg-claude-pe-portfolio-pipeline` | News brief | 4 — Reporting | Thu 5/21 AM |
| 2 | `dispatcher-bottleneck-no-ai-saves-you` | Take | 2 — Dispatch | Thu 5/21 PM |

### Posts STAGED on Vercel preview (not yet live on canonical prod)

| # | Slug | Format | Lever | Scheduled live | Status |
|---|---|---|---|---|---|
| 3 | `ship-intake-first-ai-workflow-this-quarter` | Framework + diagram | 1 — Intake | Wed 5/27 | needs prod deploy after 8 PM ET Tue 5/26 |
| 4 | `ship-the-confirmation-sms-first` | Take | 3 — Customer Comms | Fri 5/22 | needs prod deploy after 8 PM ET Thu 5/21 |

By Friday 5/22 night, all 4 levers will be covered in the first week. That is the launch story.

---

## 2. What you need to run tomorrow (Fri 5/22)

### One command, anytime after 8 PM ET tonight (Thu 5/21)

```powershell
cd "C:\Users\admin\Documents\AI Dave Website"; vercel --prod --yes
```

That single command:
- Picks up the latest committed state (posts 1, 2, 3, 4)
- Build runs at the moment you execute → `new Date('2026-05-22') > new Date()` evaluates false → post #4 passes the canonical-prod date filter
- Post #4 (the confirmation-SMS Take) appears on ilift.com immediately after build completes (~35–40 seconds)
- Post #3 remains filtered out until Tue 5/26 8 PM ET (it's dated 5/27)

**Why 8 PM ET specifically:** the `lib/posts.ts` filter compares `new Date(publishedAt)` to `new Date()`. ISO date strings without time are interpreted as UTC midnight, so `new Date('2026-05-22')` = 2026-05-22 00:00 UTC = 8 PM ET on 5/21 (during EDT). Run the deploy any time after that and post #4 ships.

### One more command for Wed 5/27

Same command, anytime after 8 PM ET on Tue 5/26:

```powershell
cd "C:\Users\admin\Documents\AI Dave Website"; vercel --prod --yes
```

That picks up post #3 (the Framework with the intake diagram). It will already be on the branch — just needs a build run past the date threshold.

---

## 3. What got built today (3 posts in one session)

**Code & infrastructure (already shipped, no further action):**
- Blog system live: `/blog`, `/blog/[slug]`, `/blog/[slug]/opengraph-image`, `/blog/rss.xml`, sitemap inclusion
- Homepage `LatestPostsSection` between ScorecardCTA and Contact (3 cards, opens in new tab)
- `~/.claude/skills/aidaveweb-blog/` editorial engine (BRAND.md, VOICE.md, 3 templates, scripts)

**Content shipped today (4 posts drafted across 2 sessions):**
- Post #1: KPMG news brief
- Post #2: Dispatcher Take
- Post #3: Intake Framework (with Higgsfield-generated hand-drawn diagram — genuinely publish-quality, replace with real Excalidraw export anytime)
- Post #4: Confirmation SMS Take (tomorrow)

**Imagery (all via Higgsfield):**
- 4 hero images, all 2688×1520 PNG, 7–9 MB each
- 1 diagram (post #3), 2688×1520 PNG, hand-drawn aesthetic, readable labels
- Cost: ~4 credits total

---

## 4. Open follow-ups (ranked by priority)

### HIGH — Run the two `vercel --prod` commands above

The whole launch flow depends on these. Set a calendar reminder for tomorrow morning and Tue 5/26 evening.

### HIGH — Refresh Codex CLI auth

Codex CLI's ChatGPT OAuth token expired (`TokenRefreshFailed`). The codex-reviewer agent has been offline since post #3. Multi-lineage Checkpoint 2 review is currently Sonnet-only.

**Fix (run in an interactive terminal):**

```
codex logout
codex login
```

Complete the ChatGPT OAuth flow. Or use an OpenAI API key:

```
codex login --with-api-key
```

Once auth is back, future post CP2 reviews regain the second-lineage second opinion.

### MEDIUM — Newsletter wiring (PR 6 from original plan)

Beehiiv API key is pending Stripe Identity Verification (per memory). When the key lands on Vercel:

- Add `/api/newsletter` POST route → forwards to Beehiiv `/v2/publications/{id}/subscriptions`
- Add footer signup field in `Footer.tsx`
- The `ForwardedBar` and `NewsletterInline` components are already deployed and pointing at `/scorecard` — when the API is wired, they can flip to the newsletter endpoint

### MEDIUM — Vercel Analytics (PR 7)

One-line install:

```
npm i @vercel/analytics
```

Then `<Analytics />` in `app/layout.tsx`. Defer until ~post #6 when there's meaningful traffic to measure.

### LOW — Cosmetic file rename

Post #2's file is `2026-05-22-dispatcher-bottleneck-no-ai-saves-you.mdx` but `publishedAt` is `2026-05-21`. Slug + frontmatter are what drive routing — the date prefix on the filename is a label mismatch only. Rename when convenient:

```
git mv content/posts/2026-05-22-dispatcher-bottleneck-no-ai-saves-you.mdx content/posts/2026-05-21-dispatcher-bottleneck-no-ai-saves-you.mdx
```

### LOW — RSS enclosure type detection

`app/blog/rss.xml/route.ts` hardcodes `<enclosure type="image/jpeg">` but all hero images are PNG. RSS readers handle both, but cosmetically wrong. Quick fix: detect extension dynamically.

### LOW — Delete or fix the broken GitHub-integrated Vercel project

`aidaves-projects/aidave-new-site` is broken and unused. We ship via CLI from `metspagmailcoms-projects/ai-dave-website`. Decide later — not blocking anything.

---

## 5. 5 open Dave decisions

1. **Daily vs 3x/week cadence.** Current plan is Mon/Wed/Fri. After week 1 ships, you'll know if daily is sustainable. The voice-quality bar matters more than volume — never publish a post you haven't read end-to-end.

2. **LinkedIn syndication timing.** linkedinaidave strategy is locked. Week 2 (5/25 onward) is the natural moment to start cross-posting blog content to LinkedIn via Postiz. Recommend 1 LinkedIn post per blog post, 24-48 hours after blog goes live.

3. **Newsletter Issue #4.** Per the linkedinaidave HANDOFF, Issue #4 is the next newsletter. The blog now feeds it naturally. Issue #4 should reference 3-4 of the launch-week posts as the lead story.

4. **Diagram authoring strategy.** Post #3's diagram is Higgsfield-generated. It's genuinely publish-quality. Decide whether you want to author Wednesday Framework diagrams in real Excalidraw Desktop (20-30 min each) or keep Higgsfield as the default. Brand-pure says Excalidraw. Operationally-efficient says Higgsfield.

5. **Scorecard funnel measurement.** Need Vercel Analytics or PostHog to know what % of blog readers click through to `/scorecard`. Without that data, the funnel optimization is guessing.

---

## 6. Default next-session opener

Two natural openers, depending on time:

**A. "Ship post #4 to prod"** — Single `vercel --prod --yes` command. 35 seconds. Verifies post #4 live on ilift.com/blog/ship-the-confirmation-sms-first.

**B. "Draft post #5 for Fri 5/29"** — Next week's Take or another Framework. Topic seeds in the Roadmap doc (sibling file).

If you want to maximize launch momentum: open with A in the morning, queue B for the same session, then plan post #6 (Mon 6/1 brief) for Sunday evening.

---

## 7. Files of note

```
content/posts/
  2026-05-21-kpmg-claude-pe-portfolio-pipeline.mdx        — Post #1 (LIVE)
  2026-05-22-dispatcher-bottleneck-no-ai-saves-you.mdx    — Post #2 (LIVE, file dated 5/22 but publishedAt is 5/21)
  2026-05-22-ship-the-confirmation-sms-first.mdx          — Post #4 (PREVIEW, ships tomorrow)
  2026-05-27-ship-intake-first-ai-workflow-this-quarter.mdx — Post #3 (PREVIEW, ships Wed 5/27)

public/blog/<slug>/
  hero.png       — Higgsfield gpt_image_2 generated, 2688x1520
  diagram.png    — Post #3 only

~/.claude/skills/aidaveweb-blog/
  SKILL.md, BRAND.md, VOICE.md, templates/, scripts/, README.md

C:\Users\admin\Documents\AI Dave Website\
  HANDOFF-2026-05-21-pm-blog-launch.md   — this file
  ROADMAP-blog-2026.md                    — editorial roadmap (sibling file)
```

---

## 8. Vercel + domain map (so future-Dave doesn't get confused)

- **Project that serves ilift.com:** `metspagmailcoms-projects/ai-dave-website`
- **Deploy method:** Vercel CLI (`vercel --prod --yes` from local working tree)
- **Custom domains:** `ilift.com` → 307 redirect → `www.ilift.com` (canonical)
- **Broken GitHub-integrated project:** `aidaves-projects/aidave-new-site` (ignore)
- **Git branch in use:** `feature/blog-system-launch` (committed locally; not yet merged to main)

Current branch state: 4 commits ahead of `main` (`c64ad84`):
1. `c167ea0` — feat: launch blog system + post #1 + ship accumulated site work
2. `5420bcd` — blog: post #2 (dispatcher Take)
3. `bc50a68` — blog: post #3 (intake Framework + diagram)
4. (next commit, after Sonnet review applied to post #4) — blog: post #4 (confirmation SMS Take)

Whenever it makes sense, fast-forward merge `feature/blog-system-launch` → `main`. No rush — CLI deploys ship from working tree, not main.
