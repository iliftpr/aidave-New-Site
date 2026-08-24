/** Normalize a user-typed or Meta-exported phone to E.164. US default. Null when unusable. */
export function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null
  const s = String(raw).trim().replace(/^p:/i, '')
  const hasPlus = s.startsWith('+')
  const digits = s.replace(/\D/g, '')
  if (hasPlus && digits.length >= 8 && digits.length <= 15) return `+${digits}`
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}
