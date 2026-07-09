// Single source of truth for the /fable landing page ("The Fable Method").
// All copy is drawn from ~/.claude/skills/fable-mode/SKILL.md (the Five Checkpoints method)
// and paraphrased for a marketing page. Keep the checkpoint MECHANICS faithful to the skill;
// the BENEFIT lines are the plain-English translation for non-technical readers.
// NOTE: the marketing word is "Checkpoint"; the skill file itself still says "gate"
// internally (quality-gate is standard QA vocab). Internal code identifiers below
// (GateId, Gate, GATES, activeGate) are kept as-is on purpose — users never see them.

export type GateId = 'scope' | 'evidence' | 'adversarial' | 'verify' | 'report'

export interface Gate {
  num: number
  id: GateId
  /** e.g. "Scope before work" */
  title: string
  /** one-line tagline of what the checkpoint is */
  short: string
  /** technical one-liner for builders */
  mechanic: string
  /** plain-English business benefit */
  benefit: string
  /** lucide-react icon name (see components/fable/fableIcons.tsx) */
  icon: string
  /** the 3 load-bearing rules of the gate */
  rules: string[]
}

export const GATES: Gate[] = [
  {
    num: 1,
    id: 'scope',
    title: 'Scope before work',
    short: 'State what "done" looks like before touching anything.',
    mechanic: 'Define done + the check that proves it, persist the standard, separate known from assumed.',
    benefit:
      'You decide what "done" means up front — no moving goalposts, no half-finished work called finished.',
    icon: 'Target',
    rules: [
      'Define "done" and the exact check that proves it.',
      'For multi-round work, write the standard down and test every round against it.',
      'Separate what is known from what is assumed — name the load-bearing unknowns.',
    ],
  },
  {
    num: 2,
    id: 'evidence',
    title: 'Evidence before reasoning',
    short: 'Never design from memory — open the real thing.',
    mechanic: 'Ground in real files and primary sources; push one item end-to-end before scaling.',
    benefit:
      'Decisions come from real files and credible primary sources — not confident guessing, not some random blog.',
    icon: 'Search',
    rules: [
      'Open the real file, API, or data — memory is only a hypothesis.',
      'Prefer primary, authoritative sources over blogs and AI summaries; corroborate weak ones.',
      'Push one item through the whole pipeline before scaling to all of them.',
    ],
  },
  {
    num: 3,
    id: 'adversarial',
    title: 'Reason adversarially',
    short: 'Before committing, try to kill your own answer.',
    mechanic: 'Red-team your emerging answer, steelman what survives; two failed fixes = wrong diagnosis.',
    benefit:
      'It attacks its own answer before you have to — so mistakes get caught in-house, not in production.',
    icon: 'Swords',
    rules: [
      'Attack your own answer as a hostile reviewer, then steelman what survives.',
      'Respect why the existing thing was built that way before changing it.',
      'Two failed attempts at the same fix means the diagnosis is wrong.',
    ],
  },
  {
    num: 4,
    id: 'verify',
    title: 'Verify before declaring done',
    short: '"It ran" is not verification.',
    mechanic: "Check at the claim's layer with independent evidence; trust no delegate's \"done.\"",
    benefit:
      '"It ran" isn\'t "it\'s right." Measure twice, ship once — the work is proven before it is called done.',
    icon: 'ShieldCheck',
    rules: [
      'Verify at the layer of the claim — "it ran" isn\'t "it\'s right."',
      "Use evidence you didn't generate; re-fetch web facts from a credible source.",
      'Never accept a subagent\'s "done" — re-run the check yourself.',
    ],
  },
  {
    num: 5,
    id: 'report',
    title: 'Report calibrated',
    short: 'The report is part of the work.',
    mechanic: 'Lead with the answer; state verified vs assumed plainly; never soften a real problem.',
    benefit:
      'Straight answers — what is proven vs assumed is said out loud, and a real problem is never softened to sound agreeable.',
    icon: 'FileText',
    rules: [
      'Lead with the answer, then the evidence behind it.',
      'Say what is verified and what is assumed, out loud.',
      'Never soften a real problem to be agreeable.',
    ],
  },
]

export interface TeamMember {
  name: string
  /** which checkpoint(s) it serves, e.g. "Checkpoint 2 + 4" */
  gates: string
  /** lucide-react icon name */
  icon: string
  /** technical line */
  tech: string
  /** plain-English line */
  plain: string
}

export const TEAM: TeamMember[] = [
  {
    name: 'Firecrawl',
    gates: 'Checkpoint 2 + 4',
    icon: 'Globe',
    tech: 'Checks any web-based claim — versions, pricing, API changes — against the live page, then re-confirms it at verify time.',
    plain: 'Facts get checked against the real web, not the AI’s memory.',
  },
  {
    name: 'Context7',
    gates: 'Checkpoint 2',
    icon: 'BookOpen',
    tech: 'Pulls current library and API docs before coding against them, so it never relies on stale training data.',
    plain: 'It reads the up-to-date manual before it builds.',
  },
  {
    name: 'Sonnet subagents',
    gates: 'Checkpoint 2',
    icon: 'Users',
    tech: 'Fans out broad investigation — file scans, call-path tracing, gap-finding — in parallel while the main thread keeps momentum.',
    plain: 'It sends a research team ahead so nothing gets missed.',
  },
  {
    name: 'Browser automation',
    gates: 'Checkpoint 2 + 4',
    icon: 'MousePointerClick',
    tech: 'Drives a real browser to check rendered state, fill forms, and test flows — screenshots become verification evidence.',
    plain: 'It actually clicks through the site to confirm it works.',
  },
  {
    name: 'Codex second-opinion',
    gates: 'Checkpoint 3',
    icon: 'ScanSearch',
    tech: 'Runs a different AI model family in parallel to review the same change — two lineages catch different classes of bug.',
    plain: 'A second, independent expert double-checks the work.',
  },
  {
    name: 'Workflow fan-out',
    gates: 'Checkpoint 3 + 4',
    icon: 'Workflow',
    tech: 'Spawns parallel worker and checker agents at scale, with adversarial verification, when a task genuinely warrants it.',
    plain: 'It splits a big job across a team that checks each other.',
  },
]

/** Standing habits — always on, every checkpoint. */
export const HABITS: string[] = [
  'Convert relative to absolute — "tomorrow" becomes a date, "latest" becomes a version.',
  'Surface constraints and trade-offs before they bite.',
  'Chase the cheapest probe of the biggest unknown first.',
  'Sort actions by reversibility — reversible: just do it; irreversible: confirm first.',
  'Unblock yourself before escalating; bundle the questions the user truly owns.',
  'Anything mechanical repeating 3+ times gets a script, not per-instance reasoning.',
  'Preserve by default — touch only what the task requires.',
]

export interface Smell {
  text: string
  gate: string
}

/** Smells that mean a checkpoint got skipped. */
export const SMELLS: Smell[] = [
  { text: 'Building something without opening the real data it depends on.', gate: 'Checkpoint 2' },
  { text: 'You just said "should work" about something you can test right now.', gate: 'Checkpoint 4' },
  { text: 'You’re on attempt three of the same fix.', gate: 'Checkpoint 3' },
  { text: 'Your last three actions came from the plan with no check against results.', gate: 'Checkpoint 3' },
  { text: 'About to report done, and the evidence is your intention, not an observation.', gate: 'Checkpoint 4' },
  { text: 'A result came back suspiciously clean and you moved on.', gate: 'Checkpoint 4' },
  { text: 'You can’t say in one sentence what "done" looks like.', gate: 'Checkpoint 1' },
  { text: 'You marked a delegate’s work done on the strength of their own report.', gate: 'Checkpoint 4' },
  { text: 'Your only source is a blog or AI summary, not the primary source.', gate: 'Checkpoint 2' },
]

/** The three pain chips in the "stakes" section. */
export const STAKES: string[] = [
  'Hallucinated facts, stated with confidence',
  '"Done" that was never actually checked',
  'Unverified claims shipped to production',
]

export interface GraphBar {
  label: string
  /** 0..max */
  value: number
  tone: 'bad' | 'good'
}

export const BEFORE_AFTER: {
  metric: string
  unit: string
  max: number
  caption: string
  bars: GraphBar[]
} = {
  metric: 'Unverified "done" that slips through',
  unit: 'per 10 claims',
  max: 10,
  caption:
    'Illustrative — the Fable Method is a working discipline, not a benchmark. The shape is the point, not the exact numbers.',
  bars: [
    { label: 'A fast, unchecked agent', value: 9, tone: 'bad' },
    { label: 'With the Five Checkpoints', value: 1, tone: 'good' },
  ],
}

export const AUDIENCES: {
  builders: { title: string; kicker: string; points: string[] }
  operators: { title: string; kicker: string; points: string[] }
} = {
  builders: {
    title: 'If you build with Claude Code',
    kicker: 'For AI builders',
    points: [
      'Drop one file into ~/.claude/skills/ — no install, no API key, no dependency.',
      'Works on Opus or Sonnet; triggers on "fable mode" or automatically on hard tasks.',
      'Turns a fast-but-sloppy agent into one that grounds, verifies, and reports honestly.',
      'Stacks with your existing skills and tools — it’s discipline, not a framework.',
    ],
  },
  operators: {
    title: 'If you run a business on AI',
    kicker: 'For operators',
    points: [
      'AI that doesn’t hallucinate facts into a customer’s inbox or your dispatch board.',
      '"Measure twice, ship once" — work is proven before anyone calls it done.',
      'Straight reporting: what’s confirmed vs assumed, never dressed up.',
      'Boring tech that works — the discipline behind systems that actually hold up.',
    ],
  },
}

/** 3-step install shown in the download section. */
export const INSTALL_STEPS: string[] = [
  'Unzip and drop the fable-mode folder into ~/.claude/skills/',
  'Restart Claude Code (or reload your skills).',
  'Say "fable mode" — or let it trigger itself on any task worth doing right.',
]

export interface DownloadItem {
  file: string
  desc: string
}

export const DOWNLOAD_CONTENTS: DownloadItem[] = [
  {
    file: 'fable-mode/SKILL.md',
    desc: 'The full method — five checkpoints, standing habits, and the team — ready to drop into ~/.claude/skills/.',
  },
  { file: 'INSTALL.md', desc: '30-second setup and how to trigger it.' },
  { file: 'README.md', desc: 'Plain-English overview of what it does and who it’s for.' },
]

export const FABLE_LINKS = {
  skillPath: '~/.claude/skills/fable-mode/SKILL.md',
  downloadZip: '/downloads/fable-method.zip',
  rawSkill: '/downloads/SKILL.md',
  // TODO(owner): replace with the specific YouTube walkthrough URL once published.
  youtube: 'https://www.youtube.com/@iliftmarketing',
}
