'use client'

import { motion, useReducedMotion, type Variants, type MotionProps } from 'framer-motion'
import { type GateId } from '@/lib/fable-content'

/**
 * Hand-drawn "napkin sketch" analogy diagrams — one per checkpoint. Each scene is
 * a two-beat picture: the WRONG way (✕, red) on the left, the RIGHT way (✓, accent)
 * on the right, drawn in a loose Excalidraw style (SVG roughen filter + the Kalam
 * hand-lettered font from the /fable layout). Every stroke draws itself in on scroll;
 * reduced motion renders the finished drawing, static. The whole picture is exposed
 * to screen readers as a plain-English analogy via role="img" + aria-label.
 */

// --- palette ---------------------------------------------------------------
const STROKE = 'rgba(226,232,240,0.82)' // chalk
const DIM = 'rgba(148,163,184,0.4)'
const RED = '#f87171'
const AMBER = '#fbbf24'
const INK_FONT = 'var(--font-sketch), ui-rounded, "Comic Sans MS", cursive'

// --- animation -------------------------------------------------------------
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}
const drawV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}
const fadeV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

// --- primitives (all inherit the parent svg's variant state via context) ---
type DrawProps = { d: string; sw?: number; color?: string; fid: string } & MotionProps
function Draw({ d, sw = 2.6, color = STROKE, fid, ...rest }: DrawProps) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter={`url(#${fid})`}
      variants={drawV}
      {...rest}
    />
  )
}

type BoxProps = { x: number; y: number; w: number; h: number; rx?: number; sw?: number; color?: string; fid: string }
function Box({ x, y, w, h, rx = 5, sw = 2.6, color = STROKE, fid }: BoxProps) {
  return (
    <motion.rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      filter={`url(#${fid})`}
      variants={drawV}
    />
  )
}

function Ring({ cx, cy, r, sw = 2.6, color = STROKE, fid }: { cx: number; cy: number; r: number; sw?: number; color?: string; fid: string }) {
  return (
    <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} filter={`url(#${fid})`} variants={drawV} />
  )
}

function Dot({ cx, cy, r = 2.5, color = STROKE }: { cx: number; cy: number; r?: number; color?: string }) {
  return <motion.circle cx={cx} cy={cy} r={r} fill={color} variants={fadeV} />
}

type InkProps = {
  x: number
  y: number
  children: React.ReactNode
  size?: number
  color?: string
  anchor?: 'start' | 'middle' | 'end'
  weight?: number
}
function Ink({ x, y, children, size = 13, color = STROKE, anchor = 'middle', weight = 400 }: InkProps) {
  return (
    <motion.text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
      fill={color}
      style={{ fontFamily: INK_FONT }}
      variants={fadeV}
    >
      {children}
    </motion.text>
  )
}

function Check({ x, y, color = AMBER, fid, sw = 2.8 }: { x: number; y: number; color?: string; fid: string; sw?: number }) {
  return <Draw d={`M${x} ${y} l4 5 l8 -11`} color={color} sw={sw} fid={fid} />
}
function Cross({ x, y, s = 9, color = RED, fid, sw = 2.6 }: { x: number; y: number; s?: number; color?: string; fid: string; sw?: number }) {
  return (
    <>
      <Draw d={`M${x} ${y} l${s} ${s}`} color={color} sw={sw} fid={fid} />
      <Draw d={`M${x + s} ${y} l-${s} ${s}`} color={color} sw={sw} fid={fid} />
    </>
  )
}

// --- frame: shared shell (roughen filter, headers, divider) ----------------
function Frame({
  id,
  seed,
  label,
  wrongTitle,
  rightTitle,
  accent,
  children,
}: {
  id: string
  seed: number
  label: string
  wrongTitle: string
  rightTitle: string
  accent: string
  children: (fid: string) => React.ReactNode
}) {
  const reduce = useReducedMotion() ?? false
  const fid = `sketch-rough-${id}`
  const parentAnim: MotionProps = reduce
    ? { initial: false, animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-15%' } }

  return (
    <motion.svg
      viewBox="0 0 360 210"
      role="img"
      aria-label={label}
      className="mx-auto block h-auto w-full max-w-md"
      variants={container}
      {...parentAnim}
    >
      <defs>
        <filter id={fid} x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={2.1} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* headers */}
      <Cross x={13} y={12} s={9} fid={fid} />
      <Ink x={30} y={22} anchor="start" size={12.5} weight={700} color={RED}>
        {wrongTitle}
      </Ink>
      <Check x={196} y={14} fid={fid} color={accent} />
      <Ink x={214} y={22} anchor="start" size={12.5} weight={700} color={accent}>
        {rightTitle}
      </Ink>

      {/* divider (opacity only — keeps the dash intact) */}
      <motion.line x1={180} y1={32} x2={180} y2={196} stroke={DIM} strokeWidth={1.5} strokeDasharray="2 7" variants={fadeV} />

      {children(fid)}
    </motion.svg>
  )
}

// =====================================================================
// Scene 1 — SCOPE: they built one thing, you expected another → agree first
// =====================================================================
function ScopeScene() {
  return (
    <Frame
      id="scope"
      seed={2}
      accent="#60a5fa"
      wrongTitle="NO SCOPE"
      rightTitle="SCOPED"
      label="Analogy: hiring a contractor to renovate your kitchen without first agreeing what finished looks like. They replace the cabinets, but you expected new countertops. Scope before work means everyone agrees on the finished result before anyone picks up a tool."
    >
      {(fid) => (
        <>
          {/* two mismatched "pictures" */}
          <Box x={22} y={64} w={44} h={40} rx={4} fid={fid} />
          <Draw d="M34 72 v24 M52 72 v24" fid={fid} sw={2.2} />
          <Ink x={44} y={118} size={11} color={DIM}>
            cabinets
          </Ink>

          <Box x={104} y={64} w={44} h={40} rx={4} fid={fid} />
          <Draw d="M112 90 h28" fid={fid} sw={4} />
          <Draw d="M126 90 q0 -9 7 -9" fid={fid} sw={2.2} />
          <Ink x={126} y={118} size={11} color={DIM}>
            counters
          </Ink>

          {/* mismatch */}
          <Ink x={85} y={92} size={30} weight={700} color={RED}>
            ≠
          </Ink>
          <Ink x={85} y={150} size={12.5} weight={700} color={RED}>
            built ≠ asked
          </Ink>

          {/* agreed blueprint + checklist */}
          <Box x={206} y={56} w={128} h={104} rx={6} fid={fid} />
          <Draw d="M320 56 l0 12 l12 0" fid={fid} sw={2} color={DIM} />
          <Draw d="M206 92 h128" fid={fid} sw={1.3} color={DIM} />
          <Draw d="M270 56 v104" fid={fid} sw={1.3} color={DIM} />
          <Ink x={270} y={78} size={12} weight={700} color="#60a5fa">
            THE PLAN
          </Ink>
          {[
            { y: 108, w: 'cabinets' },
            { y: 128, w: 'counters' },
            { y: 148, w: 'paint' },
          ].map((r) => (
            <g key={r.w}>
              <Check x={220} y={r.y - 4} fid={fid} />
              <Ink x={240} y={r.y} anchor="start" size={12}>
                {r.w}
              </Ink>
            </g>
          ))}
        </>
      )}
    </Frame>
  )
}

// =====================================================================
// Scene 2 — EVIDENCE: don't remodel from memory → measure the real room
// =====================================================================
function EvidenceScene() {
  return (
    <Frame
      id="evidence"
      seed={3}
      accent="#818cf8"
      wrongTitle="FROM MEMORY"
      rightTitle="MEASURED"
      label="Analogy: a contractor never remodels from memory. They visit the house, measure the room, and inspect the layout before making a plan. Evidence before reasoning means grounding in the real thing, not a confident guess."
    >
      {(fid) => (
        <>
          {/* guessing head, crossed out */}
          <motion.ellipse cx={80} cy={100} rx={36} ry={30} fill="none" stroke={STROKE} strokeWidth={2.6} filter={`url(#${fid})`} variants={drawV} />
          <Ink x={80} y={112} size={34} weight={700} color={RED}>
            ?
          </Ink>
          <Draw d="M50 72 l60 54" fid={fid} sw={2.6} color={RED} />
          <Ink x={80} y={158} size={12.5} weight={700} color={RED}>
            guessing
          </Ink>

          {/* wall corner + tape + magnifier */}
          <Draw d="M212 62 L212 152 L332 152" fid={fid} sw={3} />
          <Draw d="M212 88 h8 M212 110 h8 M212 132 h8" fid={fid} sw={1.6} color={DIM} />
          <Draw d="M226 128 v12 M322 128 v12 M226 134 h96" fid={fid} sw={2.2} />
          <Ink x={274} y={124} size={13} weight={700} color="#818cf8">
            12 ft
          </Ink>
          <Ring cx={300} cy={86} r={12} fid={fid} />
          <Draw d="M309 95 l12 12" fid={fid} sw={2.8} />
        </>
      )}
    </Frame>
  )
}

// =====================================================================
// Scene 3 — ADVERSARIAL: ship it blind vs. attack your own answer first
// =====================================================================
function AdversarialScene() {
  return (
    <Frame
      id="adversarial"
      seed={1}
      accent="#c084fc"
      wrongTitle="SHIP IT BLIND"
      rightTitle="ATTACK IT"
      label="Analogy: a lawyer prepares for court by arguing against their own case first — probing where it is weak and what the other side would attack — so the argument that reaches the courtroom is already battle-tested. Reason adversarially means trying to kill your own answer before anyone else can."
    >
      {(fid) => (
        <>
          {/* untested answer with a hidden crack, shipping straight out */}
          <Box x={22} y={70} w={94} h={50} rx={6} fid={fid} />
          <Ink x={69} y={100} size={13} weight={700}>
            ANSWER
          </Ink>
          <Draw d="M58 72 l-4 10 l8 5 l-5 11" fid={fid} sw={2} color={RED} />
          <Draw d="M34 142 h74 l-9 -6 m9 6 l-9 6" fid={fid} sw={2.4} color={RED} />
          <Ink x={118} y={158} anchor="end" size={12} weight={700} color={RED}>
            shipped
          </Ink>

          {/* stress-tested answer: shield takes the arrows */}
          <Box x={236} y={78} w={82} h={46} rx={6} fid={fid} />
          <Ink x={277} y={106} size={13} weight={700}>
            ANSWER
          </Ink>
          <Draw d="M277 60 l19 7 v15 q0 17 -19 25 q-19 -8 -19 -25 v-15 z" fid={fid} sw={2.6} color="#c084fc" />
          <Draw d="M205 66 l34 12 l-9 0 m9 0 l-4 -8" fid={fid} sw={2.2} color={RED} />
          <Draw d="M205 118 l34 -12 l-9 0 m9 0 l-4 8" fid={fid} sw={2.2} color={RED} />
          {/* the answer survives the attack — parallels "shipped" on the left */}
          <Ink x={277} y={150} size={12} weight={700} color="#c084fc">
            holds up
          </Ink>
        </>
      )}
    </Frame>
  )
}

// =====================================================================
// Scene 4 — VERIFY: "it was filed" (sent) vs. confirm the outcome
// =====================================================================
function VerifyScene() {
  return (
    <Frame
      id="verify"
      seed={4}
      accent="#e879f9"
      wrongTitle='"IT RAN"'
      rightTitle="VERIFIED"
      label="Analogy: a lawyer who says 'I filed the document, so the case is handled' has only proven the filing happened — not that the court accepted it, the deadline was met, or the parties were served. Verify before declaring done means checking the outcome, not just that the action ran."
    >
      {(fid) => (
        <>
          {/* document dropped in a tray — "sent", but is it handled? */}
          <Box x={34} y={56} w={58} h={70} rx={5} fid={fid} />
          <Draw d="M45 74 h36 M45 86 h36 M45 98 h24" fid={fid} sw={1.6} color={DIM} />
          <Ink x={63} y={116} size={13} weight={700} color={RED}>
            SENT
          </Ink>
          <Draw d="M63 130 v13 l-5 -6 m5 6 l5 -6" fid={fid} sw={2.4} />
          <Draw d="M40 150 l7 16 h32 l7 -16" fid={fid} sw={2.6} />
          <Ink x={63} y={188} size={12} weight={700} color={RED}>
            ran = done?
          </Ink>

          {/* outcome, actually confirmed */}
          <Box x={200} y={50} w={140} h={120} rx={6} fid={fid} />
          <Ink x={270} y={70} size={12} weight={700} color="#e879f9">
            OUTCOME
          </Ink>
          {[
            { y: 92, w: 'accepted' },
            { y: 114, w: 'on time' },
            { y: 136, w: 'served' },
            { y: 158, w: 'not rejected' },
          ].map((r) => (
            <g key={r.w}>
              <Check x={216} y={r.y - 4} fid={fid} />
              <Ink x={236} y={r.y} anchor="start" size={12.5}>
                {r.w}
              </Ink>
            </g>
          ))}
        </>
      )}
    </Frame>
  )
}

// =====================================================================
// Scene 5 — REPORT: keys tossed with no word vs. a real walkthrough
// =====================================================================
function ReportScene() {
  return (
    <Frame
      id="report"
      seed={5}
      accent="#fbbf24"
      wrongTitle="KEYS TOSSED"
      rightTitle="WALKTHROUGH"
      label="Analogy: a contractor who hands over the keys without a final walkthrough hasn't finished the job — the walkthrough that explains what was done, what changed, and what's still open is part of the work. Report calibrated means the clear, honest report is part of completing the task, not an optional extra."
    >
      {(fid) => (
        <>
          {/* house, keys tossed, owner left guessing */}
          <Draw d="M32 152 v-46 l36 -26 l36 26 v46" fid={fid} sw={2.6} />
          <Box x={58} y={126} w={20} h={26} rx={2} fid={fid} />
          <Ring cx={98} cy={58} r={7} fid={fid} />
          <Draw d="M105 58 h15 m-6 0 v5 m6 -5 v6" fid={fid} sw={2.2} />
          <motion.line x1={96} y1={70} x2={96} y2={86} stroke={DIM} strokeWidth={1.5} strokeDasharray="2 5" variants={fadeV} />
          <Ink x={68} y={116} size={28} weight={700} color={RED}>
            ?
          </Ink>
          <Ink x={68} y={176} size={12} weight={700} color={RED}>
            no walkthrough
          </Ink>

          {/* the report / walkthrough */}
          <Box x={210} y={54} w={104} h={120} rx={6} fid={fid} />
          <Box x={246} y={47} w={32} h={13} rx={3} fid={fid} sw={2.2} />
          <Ink x={262} y={78} size={12} weight={700} color="#d97706">
            REPORT
          </Ink>
          <Check x={222} y={90} fid={fid} />
          <Ink x={242} y={98} anchor="start" size={12}>
            done
          </Ink>
          <Draw d="M228 114 l-6 10 h12 z" fid={fid} sw={2.2} color={AMBER} />
          <Ink x={242} y={124} anchor="start" size={12}>
            changed
          </Ink>
          <Dot cx={225} cy={144} r={2.6} />
          <Ink x={242} y={148} anchor="start" size={12}>
            still open
          </Ink>
          <Check x={222} y={164} fid={fid} />
          <Ink x={242} y={172} anchor="start" size={12}>
            matches plan
          </Ink>
        </>
      )}
    </Frame>
  )
}

// --- dispatcher + captions -------------------------------------------------
const SCENES: Record<GateId, () => React.ReactElement> = {
  scope: ScopeScene,
  evidence: EvidenceScene,
  adversarial: AdversarialScene,
  verify: VerifyScene,
  report: ReportScene,
}

const CAPTIONS: Record<GateId, string> = {
  scope: 'Agree on the finished kitchen before anyone picks up a tool.',
  evidence: 'Measure the real room before you draw the plan.',
  adversarial: 'Argue against your own answer before the other side does.',
  verify: '“It was filed” isn’t “the case is handled.” Confirm the outcome.',
  report: 'The walkthrough is part of the job — so is the report.',
}

export function CheckpointSketch({ id }: { id: GateId }) {
  const Scene = SCENES[id]
  return (
    <figure className="m-0">
      <Scene />
      <figcaption className="mt-3 text-center text-sm italic leading-relaxed text-white/60">{CAPTIONS[id]}</figcaption>
    </figure>
  )
}
