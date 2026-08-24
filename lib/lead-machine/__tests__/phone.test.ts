import { describe, it, expect } from 'vitest'
import { toE164 } from '@/lib/lead-machine/phone'

describe('toE164', () => {
  it('normalizes US 10-digit', () => expect(toE164('(516) 322-9380')).toBe('+15163229380'))
  it('normalizes 11-digit with leading 1', () => expect(toE164('1 516 322 9380')).toBe('+15163229380'))
  it('keeps an existing + intl number', () => expect(toE164('+44 20 7946 0958')).toBe('+442079460958'))
  it('strips the Meta "p:" prefix', () => expect(toE164('p:+15163229380')).toBe('+15163229380'))
  it('returns null for junk', () => {
    expect(toE164('call me')).toBeNull()
    expect(toE164('123')).toBeNull()
    expect(toE164('')).toBeNull()
    expect(toE164(null)).toBeNull()
  })
})
