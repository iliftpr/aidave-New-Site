// Server-side spam screen for /api/contact. The DOM honeypot only catches bots
// that render the form; scripted bots POST JSON straight at the endpoint, so
// these checks run on the request itself. A flagged submission is dropped
// silently (200 OK) so the bot gets no signal to adapt to — which also means a
// false positive silently loses a real lead, so every check errs permissive.

// Minimum time between page load and submit. Humans can't fill a form faster.
export const MIN_FILL_MS = 2500

// Random-string detector. Bots fill fields with random mixed-case strings
// ("XJDBGUngExAjCXFXWps", "lbXxOgUj"). When people run words together
// (JohnPaulMcDonald, LongIslandHomeServices, LinkedInSalesNavigator) the pieces
// between capitals are still word-like, so each piece is scored by how
// un-word-like it is: vowel-less chunks ("Vj", "Rgz") and odd 2-letter chunks
// ("Ex", "Aj") add up, real words score 0.
const MIN_WORD = 6
// Longer words are never judged: no bot sample comes close, and the cap keeps
// the edge-punctuation trim linear on pathological input.
const MAX_WORD = 64
const FLAG_SCORE = 2

// 2-letter chunks that are real words, name particles, initials or common
// abbreviations when run together: LaToya, McDonald, LinkedIn, EdWu, SmithPc.
const OK_2 = new Set(
  'mc de di da du do la le lo al el ja jo ed ty bo wu ng li xu yu hu lu ho ko oh ma my go in on of to up at by is it or an as be us we me no so if ai ok re ez st dr mr ms jr sr co pc lp ny nj ct pa md dc tx va fl ca'.split(' '),
)
// Vowel-less chunks of 3+ letters that are common abbreviations: SmithLlc, CohenLlp, BestHvacNyc.
const OK_NO_VOWEL = new Set(
  'llc pllc llp lllp plc ltd nyc dds dmd crm sms mfg mgmt bldg blvd hwy pkwy ctr svc svcs cpa pdf html css xml sql php bbq http https sdk'.split(' '),
)

// 0 = word-like, 0.5 = odd, 1 = not a word
function segmentScore(seg: string, index: number, prev: string | undefined): number {
  if (/^[A-Z]+$/.test(seg)) return seg.length === 1 ? 0.5 : 0 // stray capital vs acronym (HVAC)
  const lower = seg.toLowerCase()
  if (lower.length <= 2) {
    if (index === 0 && lower.length === 1) return 0 // iPhone, eBay
    if (OK_2.has(lower)) return 0
    if (lower.length === 2 && lower[1] === 's' && prev && /^[A-Z]+$/.test(prev)) return 0 // CDs
    return /[aeiouy]/.test(lower) ? 0.5 : 1 // "Ex" vs "Vj"
  }
  if (!/[aeiouy]/.test(lower)) return OK_NO_VOWEL.has(lower) ? 0 : 1 // "Rgz", "Wps"
  if (!/[^aeiouy]/.test(lower)) return 0.5 // all vowels: "Aoa"
  // y as the only vowel inside 4+ consonants: "Cgnwy" (Lynch, Flynn stay 0)
  if (!/[aeiou]/.test(lower) && /[^aeiouy]{4,}/.test(lower)) return 0.5
  return 0
}

export function isGibberishToken(word: string): boolean {
  if (word.length < MIN_WORD || word.length > MAX_WORD || !/^[A-Za-z]+$/.test(word)) return false
  // Plain words, ALLCAPS and Titlecase have no inner capital to split on
  if (!/[a-z]/.test(word) || !/[A-Z]/.test(word.slice(1))) return false
  const segs = word.match(/[A-Z]{2,}(?![a-z])|[A-Z]?[a-z]+|[A-Z]/g) ?? []
  const score = segs.reduce((sum, seg, i) => sum + segmentScore(seg, i, segs[i - 1]), 0)
  const flips = word.match(/[a-z](?=[A-Z])/g)?.length ?? 0
  return score >= FLAG_SCORE || (score >= 1 && flips >= 3)
}

// Judges each whitespace-separated word with edge punctuation trimmed. A word
// with an inner non-letter — URL, email, domain, #hashtag, code call — is never
// judged: random IDs in share links look exactly like bot strings.
export function containsGibberish(text: unknown): boolean {
  return String(text ?? '')
    .split(/\s+/)
    .some((raw) => raw.length <= MAX_WORD && isGibberishToken(raw.replace(/^[("'[]+|[.,!?;:)"'\]]+$/g, '')))
}

export interface SpamInput {
  name?: string
  message?: string
  elapsedMs?: unknown
  origin?: string | null
  host?: string | null
}

// Returns a short reason when the submission looks automated, otherwise null.
export function detectSpam({ name, message, elapsedMs, origin, host }: SpamInput): string | null {
  // Browsers always send Origin on a POST fetch; scripts often don't
  if (!origin || !host) return 'missing-origin'
  try {
    if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) return 'cross-origin'
  } catch {
    return 'bad-origin'
  }

  if (typeof elapsedMs !== 'number' || !Number.isFinite(elapsedMs)) return 'no-timer'
  if (elapsedMs < MIN_FILL_MS) return 'too-fast'

  if (containsGibberish(name)) return 'gibberish-name'
  if (containsGibberish(message)) return 'gibberish-message'

  return null
}
