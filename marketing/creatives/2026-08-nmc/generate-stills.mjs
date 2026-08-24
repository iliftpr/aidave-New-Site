// Generates the six scene / contrast stills for the Missed-Call Audit campaign with GPT Image 2
// via Kai (kie.ai). Founder portraits (C3/D3/R3) are made separately with Dave's Higgsfield Soul
// character. Briefs: marketing/research/2026-08-24-hooks-offers-research.md §5.
// Run from this folder: node generate-stills.mjs   (needs KIE_API_KEY resolvable by kai.mjs)
import { spawnSync } from 'node:child_process'
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const KAI = 'C:/Users/admin/.claude/skills/kai-generate/kai.mjs'
const OUT = path.resolve('.')
const NEG =
  'No logos, no brand names, no star ratings or reviews, no readable phone-screen UI or app text, no extra words anywhere except the single overlay line, no stock-photo gloss, natural skin, correct hands, photorealistic editorial photography.'

const BRIEFS = [
  {
    id: 'C1-contractor-ladder',
    text: "Who's answering right now?",
    prompt:
      "Photorealistic editorial photo, vertical 2:3. A roofer in his mid-40s on an aluminum ladder against a gray-shingled Levittown cape-cod house, chain-link fence, late-afternoon golden hour, muted blues. His phone glows lit in a tool-belt pocket, unanswered; he is absorbed in the work, not looking at it. Low angle, ladder as a diagonal, phone lower-left, open sky at the top for text. Clean bold sans-serif overlay text in the sky reading exactly: \"Who's answering right now?\"",
  },
  {
    id: 'C2-contractor-split',
    text: 'Voicemail. Or a text.',
    prompt:
      'Photorealistic split-frame image with a hard vertical center seam, vertical 2:3. LEFT half: a dim contractor garage office at night, cordless phone off its cradle on a cluttered desk, a small red missed-call glow, navy tones, dread. RIGHT half: the same desk bright and tidy in warm white morning light, one large clean green chat-bubble icon with a check mark floating above the desk, relief. Mirrored props on both sides. Bold sans-serif overlay text across the top reading exactly: "Voicemail. Or a text."',
  },
  {
    id: 'D1-dental-frontdesk',
    text: 'Weekend voicemails, Monday problem',
    prompt:
      'Photorealistic editorial photo, vertical 2:3. A dental office front desk in a Long Island strip-plaza practice, Monday 8:05 am. A receptionist holds a landline handset on her shoulder while a patient waits at the counter and a second line blinks; polite but overwhelmed. Over-the-shoulder view from the waiting area, counter running diagonally, clean ceiling space at the top for text. Clinical white with one warm wood accent. Bold sans-serif overlay text at the top reading exactly: "Weekend voicemails, Monday problem"',
  },
  {
    id: 'D2-medspa-split',
    text: 'Closed at 6. Booked anyway.',
    prompt:
      'Photorealistic split-frame image with a hard vertical center seam, vertical 2:3. LEFT half: a small med-spa storefront in Garden City at dusk, lights off, a single door sign reading CLOSED, a phone screen glowing inside a parked car out front, dusk blue, shut-out feeling. RIGHT half: the identical storefront with one glowing text-message bubble icon above the door, warm amber, welcomed feeling. Mirrored storefront framing. Bold sans-serif overlay text across the top reading exactly: "Closed at 6. Booked anyway."',
  },
  {
    id: 'R1-restaurant-rush',
    text: 'Party of 12 just hung up',
    prompt:
      'Photorealistic editorial photo, vertical 2:3. Friday 7:40 pm inside a busy Italian restaurant on Long Island: a ringing wall phone at the host stand in sharp focus in the left foreground, nobody able to reach it, the packed dining room and servers blurred with motion behind, controlled chaos. Warm tungsten light, high contrast, a clear dark band at the top for text. Bold sans-serif overlay text at the top reading exactly: "Party of 12 just hung up"',
  },
  {
    id: 'R2-restaurant-split',
    text: 'Hold music, or a text?',
    prompt:
      'Photorealistic split-frame image with a hard vertical center seam and identical framing on both halves, vertical 2:3. LEFT half: a man in his 30s sitting in a parked car outside a neon-lit pizzeria at night, phone pressed to his ear, annoyed on-hold body language, neon red tones. RIGHT half: the same man relaxed and smiling, glancing at a plain phone silhouette showing one simple text-message bubble icon, soft green tones. Bold sans-serif overlay text across the top reading exactly: "Hold music, or a text?"',
  },
]

const CANDIDATES = 2
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
const log = []
for (const b of BRIEFS) {
  for (let i = 1; i <= CANDIDATES; i++) {
    const out = path.join(OUT, `${b.id}-v${i}.png`)
    if (existsSync(out)) { log.push(`${out} exists, skip`); continue }
    const prompt = `${b.prompt} ${NEG}`
    writeFileSync(path.join(OUT, `${b.id}-v${i}.prompt.txt`), prompt)
    const r = spawnSync('node', [KAI, 'text-to-image', '--model', 'gpt-image-2-text-to-image', '--prompt', prompt, '--aspect', '2:3', '--out', out, '--poll-timeout', '300'], { encoding: 'utf8' })
    const line = `${b.id}-v${i}: exit=${r.status} ${(r.stdout || '').trim().split('\n').slice(-2).join(' | ')} ${(r.stderr || '').trim().split('\n').slice(-1)[0] || ''}`
    console.log(line)
    log.push(line)
  }
}
writeFileSync(path.join(OUT, 'generate-log.txt'), log.join('\n') + '\n')
