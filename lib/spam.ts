// Server-side spam screen for /api/contact. The DOM honeypot only catches bots
// that render the form; scripted bots POST JSON straight at the endpoint, so
// these checks run on the request itself. A flagged submission is dropped
// silently (200 OK) so the bot gets no signal to adapt to.

// Minimum time between form mount and submit. Humans can't fill a form faster.
export const MIN_FILL_MS = 2500

// Random mixed-case strings like "XJDBGUngExAjCXFXWps": a long letters-only run
// that flips from lowercase to uppercase mid-word 3+ times. Real words top out
// at ~2 (McDonald, GoHighLevel, WooCommerce).
export function isGibberishToken(token: string): boolean {
  if (token.length < 10 || !/^[A-Za-z]+$/.test(token)) return false
  const flips = token.match(/[a-z](?=[A-Z])/g)?.length ?? 0
  return flips >= 3
}

export function containsGibberish(text: unknown): boolean {
  return String(text ?? '')
    .split(/[^A-Za-z]+/)
    .some(isGibberishToken)
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
