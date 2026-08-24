// Uploads final/*.jpg to Fal's CDN (long-lived public URLs) so Meta creatives can be created with
// image_url. Writes final/urls.json. Run: node upload-finals.mjs --env <file-with-FAL_AI_KEY>
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
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

const DIR = path.resolve('final')
const out = {}
for (const f of readdirSync(DIR).filter((n) => n.endsWith('.jpg')).sort()) {
  const init = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST', headers: H, body: JSON.stringify({ file_name: f, content_type: 'image/jpeg' }),
  })
  if (!init.ok) { console.log(`${f}: initiate ${init.status}`); continue }
  const { file_url, upload_url } = await init.json()
  const put = await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: readFileSync(path.join(DIR, f)) })
  if (!put.ok) { console.log(`${f}: put ${put.status}`); continue }
  out[f] = file_url
  console.log(`${f}: ok`)
}
writeFileSync(path.join(DIR, 'urls.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`wrote ${Object.keys(out).length} urls`)
