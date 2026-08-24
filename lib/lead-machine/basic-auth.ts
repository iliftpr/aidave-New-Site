/** Edge-safe HTTP Basic check (no Buffer). Fails closed when creds are not configured. */
export function checkBasicAuth(header: string | null, user: string, pass: string): boolean {
  if (!user || !pass || !header?.startsWith('Basic ')) return false
  let decoded = ''
  try {
    decoded = atob(header.slice(6))
  } catch {
    return false
  }
  const i = decoded.indexOf(':')
  if (i < 0) return false
  return decoded.slice(0, i) === user && decoded.slice(i + 1) === pass
}
