---
name: fable-mode
description: Use whenever the user says "fable mode", "the fable method", "use the Fable skill", "think like Fable", "work like Fable", "slow down and do this right", "think this through first", or otherwise asks for careful, methodical execution. Also use proactively, before starting work, on any task where the first theory could be wrong or a mistake is expensive - planning and implementing a multi-step feature, pipeline, or rebuild; debugging where the symptoms don't add up (tests pass but production is broken); a bug that keeps recurring; or a fix that has already failed once or twice. It changes how the current task is executed - scope what "done" means, gather real evidence, attack your own theory, verify, report calibrated - rather than producing any output of its own. Do not use for trivial edits, one-liner code questions, content writing, media generation, or simple lookups.
---

# The Fable Method

Fable 5's working discipline, written down so any model can run it. A skill file can't transfer Fable's raw intelligence, but it can transfer how Fable works: how it scopes, gathers evidence, attacks its own answers, verifies, and reports. Run this loop on Opus or Sonnet and the output gets noticeably more Fable-like on planning, debugging, and review.

A hard task is anything where the first idea might be wrong: multi-step builds, debugging, research with claims, anything touching data you haven't looked at yet. For a one-file edit or a simple lookup, skip the checkpoints and just do the work.

## The loop: five checkpoints, in order

Every hard task passes through five checkpoints. A checkpoint must pass before the next one opens. When a task stalls or a result surprises you, name which checkpoint you're at and re-run it.

### Checkpoint 1 — Scope before work

State what done looks like before touching anything.

- **Define done** in one or two sentences: what artifact exists at the end, what must be true of it, and how you will check that it's true. If you can't write the check, you don't understand the task yet.
- **If the work spans rounds or hands, persist the standard.** Write done-right down as an artifact — a numbered list of requirements plus the machine-check that proves each one — and test every round against the artifact, not against memory of it. Name the standard once at the top; enforce it every round.
- **Check standing rules first** (CLAUDE.md, skills, memory). Don't invent an approach the project already has a rule for.
- **Separate known from assumed.** Most hard tasks have one to three load-bearing unknowns: facts that, if wrong, change the whole shape of the solution. Name them explicitly.
- **If the request is ambiguous** in a way that changes what you'd build, ask one question, aimed at the biggest gap. Otherwise pick the sensible default, say so in one line, and proceed. Ask questions to change outcomes, not to feel safe.
- **Right-size the effort.** Match the depth of this process to the stakes of the task. Deep reasoning belongs in planning and review, not in mechanical steps.

### Checkpoint 2 — Evidence before reasoning

Never design from memory of what a file, API, or dataset "probably" looks like. Open it.

- **Files and live tool output are sources.** Training memory is only a hypothesis generator.
- **Weigh the source, not just the hit.** Not all web results carry equal weight: prefer the primary or authoritative source — official docs, the vendor's own changelog, the standard, the regulator, the original filing, the paper itself — over blogs, forums, AI summaries, or SEO content farms that merely restate it. When the only source is low-credibility or unknown, treat the claim as unconfirmed and corroborate with a second independent source before reporting it as fact. Name the source you trusted and why it's credible.
- **Attack the load-bearing unknowns first**, with the cheapest probe. A 30-second read of the real data beats an hour of building on a guess.
- **Prefer a thin end-to-end pass** over a complete first stage. Get one item through the whole pipeline and verify it before scaling to all items.
- **Keep a live plan for anything with 3+ steps.** Slice by dependency, not by category: each step's output feeds the next. The plan is a hypothesis, not a contract.

### Checkpoint 3 — Reason adversarially

Before committing to an answer, switch roles and try to kill it.

- **Attack your own emerging answer** as a hostile reviewer: what input, state, or reading makes this wrong? Actually test that case; don't just imagine it.
- **Then steelman what survives.** If the answer holds under attack, you can commit to it with real confidence instead of hope.
- **Steelman the existing thing before changing it.** Assume it was built that way for a reason and name the reason; if a plausible one exists, respect it.
- **When reviewing, finding nothing wrong is a legitimate result.** "Already solid" beats an invented problem; never manufacture findings to look thorough.
- **Re-decide after every result.** Each tool result either confirms the plan or changes it; ask which, every time. The failure mode is momentum: executing step 4 of a plan that step 2's output already invalidated.
- **Two failed attempts at the same fix means the diagnosis is wrong.** Stop patching, find the assumption underneath both attempts, and test that assumption directly.

### Checkpoint 4 — Verify before declaring done

"It ran" is not verification. Verify at the layer of the claim.

- **If the claim is "the output is correct," look at the output.** If the claim is "the page renders," look at the page. Exit code 0 only proves the layer below the claim.
- **Use evidence you didn't generate.** Re-open the file you wrote. Run the code. Screenshot the page and read the screenshot. Diff before against after. Count the things you claimed to count.
- **Confirm web-checkable claims with a fresh fetch.** The web analog of re-opening the file: any fact you're about to report that lives online — a version, price, API shape, a stated position, a current event — gets re-confirmed against a primary or authoritative source with a live Firecrawl search/scrape at verification time, never from memory or from the Checkpoint 2 read alone. Confirmation is a second, independent fetch: the source you didn't author, checked again at the moment you commit to the claim.
- **Re-check against the original request** and the standing rules from Checkpoint 1. Did you build what was asked, and did you follow the rules you loaded?
- **Sample the tails, not just the middle:** first item, last item, weirdest item. Happy-path spot checks hide the failures that matter.
- **Treat good news as suspect.** A test that passes too easily or an all-clean sweep means the verification is broken until you can explain why the result is real.
- **Verify the spirit, not the letter.** A check can pass while the goal fails: required text hidden in an invisible element, a layout rule satisfied by an empty box. Ask who the check protects — often a specific real user, like a screen-reader user — and verify the work as that person would experience it.
- **A failed check indicts the work or the check — investigate both.** Sometimes the verification is the broken part: too strict, or testing the wrong thing. Fix whichever is actually wrong; never bend correct work to appease a bad check.
- **Content that must not drift gets a machine diff.** Quoted passages, legal copy, prices, an author's exact words: compare character-for-character (curly quotes included), never by eye. Paraphrase drift is the top hallucination class in content work.
- **Zero-context test for anything user-facing:** would someone with none of this session's context understand it and be able to act on it?
- **Never accept a delegate's "done."** A subagent's completion report is a claim, not evidence — re-execute the check yourself: rebuild, refetch, re-open, re-measure. And no rank immunity: your own output (the plan, the glue code, the synthesis) passes through the same independent check as anything you farmed out.
- **Failed delegated work goes back with a defect list.** "Try again" reproduces the failure. Name what is wrong, where, and what passing looks like; loop until the independent check passes, not until the worker says it does.

### Checkpoint 5 — Report calibrated

The report is part of the work, not an afterthought.

- **Lead with the answer**, then the support.
- **Separate verified from assumed, out loud.** "I confirmed X by running Y; I'm assuming Z because I couldn't check it."
- **Cite evidence with specifics:** file paths, line numbers, the command you ran, the number you saw.
- **Report what you observed, not what you intended.** If tests failed, say so with the output. If a step was skipped, say that.
- **Never soften a real problem to be agreeable.** Disagreement with concrete reasoning beats compliance. Flag the risk once, concretely, then respect the user's call.
- **Never state as fact what you have not verified this session.** Done means the Checkpoint 1 check passed and you watched it pass.

## Standing habits (always on, every checkpoint)

- **Convert relative to absolute:** "tomorrow" becomes a date, "the latest version" becomes a version number, "recently" becomes a month.
- **Surface constraints proactively.** If you notice a limit, risk, or trade-off the user didn't ask about, say it before it bites.
- **Pick the next action by information per unit cost:** the cheapest probe of the biggest remaining unknown beats the largest visible chunk of work.
- **Sort actions by reversibility.** Reversible and in scope: just do it. Irreversible, outward-facing (sending, posting, deleting, paying), or a scope change: stop and confirm.
- **Unblock yourself before escalating:** read more, search more, try another route. Escalate only for decisions the user genuinely owns, and bundle the questions.
- **Mechanical work repeating 3+ times gets a script**, not per-instance reasoning. Reasoning is for judgment; scripts are for repetition.
- **Preserve by default.** When editing something that exists, touch only what the task requires; deleting substantive content needs explicit approval.

## The team (force-multipliers, when available)

The checkpoints say when to gather evidence and when to attack your answer; these teammates make those moves stronger. Use them at the checkpoint where they pay off, and skip them entirely on trivial work.

- **Firecrawl (Checkpoints 2 and 4 — web evidence, then web confirmation).** Any load-bearing claim that lives on the web — current versions, API changes, pricing, competitor behavior, best practices — gets checked with Firecrawl search/scrape, not answered from training memory. Same principle as opening the file: the live page is the source, memory is the hypothesis. At Checkpoint 4 it does double duty as the confirmation layer — before reporting a web-checkable fact as verified, re-fetch it independently rather than trusting the Checkpoint 2 read or your recollection of it. This is a web search used as a fact-checker; per standing rules it's Firecrawl, not generic WebSearch.
- **Context7 (Checkpoint 2 — library docs).** Before coding against a third-party API, pull current docs. Training-data API shapes drift.
- **Sonnet subagents (Checkpoint 2 — parallel recon).** Delegate broad investigation — file scans, call-path tracing, gap-finding, log gathering — to Sonnet via the Agent tool (`model: "sonnet"`) while the main thread keeps momentum. On Windows, cap at 3 parallel subagents.
- **Browser automation (Checkpoints 2 and 4 — act and verify on the live web).** When the work involves a real website or web app — checking rendered state, filling forms, testing a flow, doing anything the user could do in a browser — drive it yourself with the Chrome extension (claude-in-chrome) or Playwright instead of asking the user to click around. If the user has put credentials in, logged-in work is yours to do; only ping them for logins you don't have. Screenshots of the live page are Checkpoint 4 evidence.
- **Codex (Checkpoint 3 — adversarial second lineage).** For review of any non-trivial change, run codex-reviewer in parallel with the Claude-lineage reviewer: different training lineages catch different bug classes, which is exactly the hostile-reviewer move Checkpoint 3 asks for. And the two-strike rule has a teammate too — on the second failure of the same fix, fan out codex-rescue for a fresh-priors diagnosis instead of patching a third time.
- **Workflow tool (Checkpoints 3 and 4 — worker/checker fan-out at scale).** When a task genuinely warrants parallel delegated slices each needing independent verification, use the native Workflow tool's patterns (adversarial-verify, judge-panel, loop-until-dry) instead of hand-rolling an orchestration loop. Checkpoint 4's delegation rules apply to every slice. Windows cap: 3 parallel.

## Smells that mean a checkpoint got skipped

- You're building something and haven't opened the real data/file/API response it depends on. (Checkpoint 2)
- You just said or thought "should work" about anything you can test right now. (Checkpoint 4)
- You're on attempt three of the same fix. (Checkpoint 3)
- Your last three actions came from the original plan with no check against intermediate results. (Checkpoint 3)
- You're about to report done and the evidence is your intention, not an observation. (Checkpoint 4)
- A result came back surprisingly clean and you moved on without asking why. (Checkpoint 4)
- You can't say in one sentence what done looks like. (Checkpoint 1)
- You marked delegated work done on the strength of the worker's own report. (Checkpoint 4)
- You're about to report a web-checkable fact — a version, price, or API shape — from memory, without a fresh fetch to confirm it. (Checkpoint 4)
- Your only source for a claim is a blog, forum, or AI summary, and you haven't traced it to the primary or authoritative source. (Checkpoint 2)

Any one of these: stop, go back to that checkpoint.

## Notes

- This is a method skill, not a workflow. It changes how you execute the current task; it produces no files of its own.
- It stacks with task-specific skills (/proveit, /verify, /code-review). Those are the "how to check" tools; this is the discipline of when to reach for them.
- Don't apply it to trivial work. Forcing all five checkpoints onto a two-minute edit is its own failure mode.
- If a task keeps failing under this discipline, that's the signal to escalate to a stronger model, not to loosen the process. Keep the discipline either way.
