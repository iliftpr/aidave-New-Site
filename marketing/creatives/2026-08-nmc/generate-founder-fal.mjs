// Founder portraits on Fal AI (owner directive 2026-08-24: Fal, not Higgsfield), using Dave's real
// headshot as the identity reference. Model: fal-ai/nano-banana-pro-2/edit (reference-guided).
// Key: FAL_AI_KEY from env, or --env <file> (KEY=VALUE lines). Never printed.
// Run from this folder: node generate-founder-fal.mjs --env <path>
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const envPath = args[args.indexOf('--env') + 1]
if (args.includes('--env') && envPath && existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}
const KEY = process.env.FAL_AI_KEY || process.env.FAL_KEY
if (!KEY) { console.error('no FAL key'); process.exit(1) }
const H = { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' }

const REF = 'C:/Users/admin/Documents/AI Dave Website/public/images/dave-headshot.jpeg'
const OUT = path.resolve('.')

async function uploadRef() {
  const init = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST', headers: H, body: JSON.stringify({ file_name: 'dave-headshot.jpeg', content_type: 'image/jpeg' }),
  })
  if (!init.ok) throw new Error(`initiate ${init.status} ${await init.text()}`)
  const { file_url, upload_url } = await init.json()
  const put = await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: readFileSync(REF) })
  if (!put.ok) throw new Error(`upload ${put.status}`)
  return file_url
}

const IDENTITY = 'The man in the reference photo — keep his exact face, head shape, skin tone and features faithfully; he is the subject.'
const NEG = 'No text, no logos, no brand names, natural skin, correct hands, photorealistic editorial photography, not a stock-photo look.'

const BRIEFS = [
  { id: 'C3-founder-yard', prompt: `${IDENTITY} Editorial portrait, vertical 4:5. He wears a navy quarter-zip and stands in a Long Island contractor-supply yard on an overcast morning, pickup trucks and stacked pallets softly out of focus behind him. Approachable, not salesy — a small confident half-smile, relaxed shoulders. Waist-up, subject on the right third, shallow depth of field, generous empty sky at the top. Flat overcast light, slightly desaturated. Clean bold white sans-serif overlay text in the sky reading exactly: "The Long Island AI guy". ${NEG.replace('No text, ','')}` },
  { id: 'D3-founder-dental', prompt: `${IDENTITY} Editorial portrait, vertical 4:5. He sits on a stool beside an empty dental treatment chair in a bright modern practice, sleeves rolled, a closed laptop on his knee, listening attentively as if mid-consultation. Calm, consultative. Three-quarter view at eye level, subject on the left, soft window light from the right, open space in the upper right. Clean neutrals with one teal accent. Clean bold sans-serif overlay text in that open space reading exactly: "15 minutes. No pitch.". ${NEG.replace('No text, ','')}` },
  { id: 'R3-founder-diner', prompt: `${IDENTITY} Editorial portrait, vertical 4:5. He sits at the counter of a classic Long Island diner in the morning — chrome trim, red vinyl booths, a coffee mug and an open notebook in front of him. Local, unhurried, warm. Waist-up, slight low angle, the counter as a leading line, headroom at the top. Warm diner light, faded reds, subtle film grain. Clean bold white sans-serif overlay text at the top reading exactly: "I'll call your place Friday". ${NEG.replace('No text, ','')}` },
]

const refUrl = await uploadRef()
console.log('ref uploaded:', refUrl.replace(/^(https:\/\/[^/]+\/).*$/, '$1…'))
const log = []
for (const b of BRIEFS) {
  const out = path.join(OUT, `${b.id}-fal.png`)
  writeFileSync(path.join(OUT, `${b.id}-fal.prompt.txt`), b.prompt)
  const res = await fetch('https://fal.run/fal-ai/gpt-image-2/edit', {
    method: 'POST', headers: H,
    body: JSON.stringify({ prompt: b.prompt, image_urls: [refUrl], image_size: 'portrait_4_3' }),
  })
  const text = await res.text()
  if (!res.ok) { const line = `${b.id}: HTTP ${res.status} ${text.slice(0, 400)}`; console.log(line); log.push(line); continue }
  const json = JSON.parse(text)
  const url = json.images?.[0]?.url
  if (!url) { const line = `${b.id}: no image in response ${text.slice(0, 200)}`; console.log(line); log.push(line); continue }
  const img = await fetch(url)
  writeFileSync(out, Buffer.from(await img.arrayBuffer()))
  const line = `${b.id}: ok ${json.images[0].width}x${json.images[0].height} -> ${path.basename(out)}`
  console.log(line); log.push(line)
}
writeFileSync(path.join(OUT, 'generate-founder-log.txt'), log.join('\n') + '\n')
