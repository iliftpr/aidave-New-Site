# Editorial Roadmap — ilift.com Blog — 2026

Cadence: **3x/week** Mon/Wed/Fri at 09:00 ET. Upgradable to daily on news-heavy weeks once the rhythm is proven.

Voice anchor: `~/.claude/skills/aidaveweb-blog/VOICE.md`. Anti-drift rule = every 4th post Dave rewrites ≥1 paragraph in his own voice before publish.

---

## Format mix (the 3x/week formula)

| Day | Type | Length | Image | Diagram | Time-to-write |
|---|---|---|---|---|---|
| **Mon** "The Brief" | News-analysis | 600–900w | Higgsfield concept | No | 30–45 min |
| **Wed** "The Framework" | 4-Lever deep-dive | 1,200–1,800w | Higgsfield concept | Excalidraw PNG (or Higgsfield hand-drawn) | 60–90 min |
| **Fri** "The Take" | Sharp opinion | 800–1,200w | Higgsfield concept or Soul | No | 30–45 min |

Quarterly anchor pieces (every 8-12 weeks): a 2,500–3,500w deep-dive synthesis — a "state of mid-market AI" or "the year in operations" piece — sits between cadence posts as a tentpole.

---

## Week 1 — Launch (5/21 → 5/29)

| # | Date | Format | Lever | Slug | Status |
|---|---|---|---|---|---|
| 1 | Thu 5/21 AM | News | 4 — Reporting | `kpmg-claude-pe-portfolio-pipeline` | LIVE |
| 2 | Thu 5/21 PM | Take | 2 — Dispatch | `dispatcher-bottleneck-no-ai-saves-you` | LIVE |
| 3 | Wed 5/27 AM | Framework | 1 — Intake | `ship-intake-first-ai-workflow-this-quarter` | STAGED for Wed prod cutover |
| 4 | Fri 5/22 AM | Take | 3 — Customer Comms | `ship-the-confirmation-sms-first` | STAGED for Fri prod cutover |

**Launch achievement:** All 4 levers covered in week 1. Sets the brand promise.

---

## Week 2 — Cadence settles (5/25 → 5/31)

| # | Date | Format | Lever | Working title |
|---|---|---|---|---|
| 5 | Mon 5/25 | Brief | TBD | News from the weekend cycle — Firecrawl Sunday night, top 3 stories, pick most operator-relevant |
| 6 | Wed 5/27 | (post #3 ships) | 1 | — |
| 7 | Fri 5/29 | Take | TBD | Strong candidate: *"Every operator I talk to is being sold AI by people who have never shipped it."* (the Dave exemplar, expanded — anti-hype, naming names) |

---

## Week 3 — Authority cycle (6/1 → 6/7)

| # | Date | Format | Lever | Working title |
|---|---|---|---|---|
| 8 | Mon 6/1 | Brief | TBD | Weekend news cycle |
| 9 | Wed 6/3 | Framework | 4 — Reporting | *"Cross-Location Reporting: how AI cut our HVAC client's close cycle from 12 days to 4"* |
| 10 | Fri 6/5 | Take | 3 — Customer Comms | *"Review automation is the easiest AI win in your business. Most operators won't ship it because it embarrasses them."* |

**Milestone #10:** First 10-post review. Audit voice drift. Audit category mix. Run Lighthouse + Google Rich Results on the 10 posts. Add `@vercel/analytics` if not already in.

---

## Week 4 — Sustainable rhythm (6/8 → 6/14)

| # | Date | Format | Lever | Working title |
|---|---|---|---|---|
| 11 | Mon 6/8 | Brief | TBD | News cycle |
| 12 | Wed 6/10 | Framework | 2 — Dispatch | *"The Dispatch Lever: 3 workflows for multi-location coordination"* (the framework deep-dive complement to post #2's Take) |
| 13 | Fri 6/12 | Take | 1 — Intake | *"AI receptionists are the wrong place to start. Lead-scoring is the right place. Here's why."* |

---

## Topic seed bank (drawn down as weeks fill)

### News-brief candidates (Mon format — refresh weekly via Firecrawl)
- Anthropic + Big-4 next partnership announcement (PwC/EY/Deloitte cycle)
- OpenAI consulting business updates ($4B move follow-up)
- Vercel / AI SDK platform updates that affect ops automation
- Vapi/Retell pricing changes (voice AI affordability cycle)
- New AI dispatch platform funding rounds (target market signal)
- HCLTech / Gartner AI-failure stats releases (43% fail rate cycle)
- Microsoft Copilot for SMB / Frontline workers updates
- Google AI for service-business GMB / Maps integrations
- HIPAA-voice compliance progress milestones (when they happen)

### Framework deep-dives (Wed format — 4 per quarter, one per lever)
- **Lever 1:** Intake — SHIPPED (post #3)
- **Lever 2:** Dispatch — DRAFT due week 4 (post #12)
- **Lever 3:** Customer Comms — DRAFT due week 6
- **Lever 4:** Cross-Location Reporting — DRAFT due week 3 (post #9)

Each gets re-deepened every 6-9 months as the tooling landscape shifts.

### Take candidates (Fri format — sharp claims, LinkedIn-shareable)
- *"Stop hiring AI consultants. Hire one operator who's shipped 10 implementations."*
- *"The 2026 AI race in mid-market is being lost in vendor evaluation, not implementation."*
- *"Voice agents will commoditize the receptionist within 18 months. Here's what you do with the receptionist."*
- *"Don't measure your AI by what it automated. Measure it by what it stopped you from hiring."*
- *"Your AI strategy is a hiring strategy. You just haven't written it down yet."*
- *"43% of enterprise AI initiatives fail in year one. Here are the four reasons every COO needs to hear."*
- *"AI dispatch platforms are the new SAP implementations. Don't buy one."*
- *"The cheapest AI workflow you're not running is a confirmation SMS"* — SHIPPED (post #4 variant)
- *"If your dispatcher is the bottleneck, no AI in the world will save you"* — SHIPPED (post #2)

### Personal posts (rare — once a month max, with Soul Character image)
- *"What I got wrong on my first 10 implementations."*
- *"100 implementations in, here's what AI consulting looks like from the operator's side."*
- *"How I price an AI engagement (and why I changed my mind on Done-For-You)."*

---

## Quarterly anchor pieces (tentpoles)

**Q3 2026 (publish week of 8/3):** *"The 4-Lever Audit, 2026 edition: how mid-market service businesses are actually adopting AI."* 3,000-word synthesis of all four levers across 12+ shipped client examples (anonymized). Becomes the canonical scorecard reference and a major SEO asset. Drives newsletter subscribes and scorecard funnel.

**Q4 2026 (publish week of 11/9):** *"State of AI in Mid-Market Operations, Year 1 in Review."* Year-end retrospective. Stats from 50+ blog posts of audience data. Predictions for 2027.

---

## Milestones + KPIs

| Milestone | Target | Measurement |
|---|---|---|
| Post #10 | 6/5 | Voice audit + Lighthouse + Rich Results review |
| Post #20 | 7/3 | Add PostHog for scroll depth + session replay + `blog_post_view` events |
| Post #50 | ~10/15 | 250+ newsletter subscribers; first organic search traffic from ChatGPT/Perplexity citations |
| Post #100 | ~2027-02 | 1,500+ newsletter subscribers; ranking page-1 for ≥10 long-tail "AI for [vertical] operations" queries |

KPI ladder (per-post baseline + 6-week trend):
- Time on page > 2 minutes (target — McKinsey-style framework posts should exceed 4 min)
- /scorecard click-through > 3% from blog post pages
- Newsletter signup > 0.8% conversion on `<NewsletterInline>` and footer
- LinkedIn engagement ratio > 2% on syndicated posts

---

## Voice-drift checkpoints (anti-drift discipline)

- **Every 4th post:** Dave rewrites ≥1 paragraph in his own voice before publish. Re-anchors VOICE.md exemplars.
- **Every 10 posts:** read all 10 in one sitting. Flag any sentence that drifts toward consultant-speak. Rewrite or rephrase.
- **Every 30 posts:** refresh VOICE.md exemplars with the strongest 3-5 sentences from the latest batch. The voice should evolve with shipping experience, not stagnate.

---

## Syndication strategy (downstream of blog)

Blog ships first. LinkedIn + newsletter consume blog output. Order matters — never write the LinkedIn post first.

**LinkedIn (via Postiz):**
- 1 LinkedIn post per blog post, 24-48 hours after live
- Soul Character image if the post is personal; concept image otherwise
- Hook = LinkedIn-quote-tweet candidate from the blog post (codex-reviewer / Sonnet voice-audit flags this in every CP2 review)
- Link in first comment, not in the post body

**Newsletter (Beehiiv when wired):**
- 1 newsletter issue per week, Fridays
- Hero story = the Wednesday Framework post
- 2-3 secondary stories = the Mon Brief + Fri Take
- 1-2 short takes from the comment thread on LinkedIn (audience signal)

**Twitter/X:** Parked — too expensive ($100/mo) per the locked social posting policy. May revisit at Q4 if LinkedIn ROI is proven.

---

## Cost model

Per-post costs (drafting + imagery via Higgsfield):
- Sonnet voice audit + (codex-reviewer when auth fixed): negligible API cost
- Higgsfield gpt_image_2 hero: ~1-2 credits (~$0.15)
- Higgsfield diagram (Wednesday only): ~1-2 credits (~$0.15)
- Per-post total: under $0.50

Monthly at 3x/week cadence: ~$6 in imagery + negligible API. The binding constraint is your review time, not cost.

---

## "Things to add later" backlog

- A `/blog/category/[category]` archive page (currently the index groups posts visually; explicit category pages would help SEO)
- Author bio page at `/about` cross-linked from every post
- "Related posts" component using tag overlap (currently the related grid is hand-curated in `[slug]/page.tsx`)
- AMP version (probably skip — modern Lighthouse on the SSG'd posts is already strong)
- A `/blog/llms.txt` deep-dive listing every post + its lever + its key takeaway, for AI-crawler citation surface
- A scorecard scoring algorithm that uses the FourLeverBlock symptoms from the framework posts as the actual audit questions
