import { describe, it, expect } from 'vitest'
import { checkBasicAuth } from '@/lib/lead-machine/basic-auth'

const b64 = (s: string) => Buffer.from(s).toString('base64')

describe('checkBasicAuth', () => {
  it('rejects when creds are not configured', () => expect(checkBasicAuth('Basic ' + b64('a:b'), '', '')).toBe(false))
  it('accepts matching creds', () => expect(checkBasicAuth('Basic ' + b64('dave:pw'), 'dave', 'pw')).toBe(true))
  it('allows a colon in the password', () => expect(checkBasicAuth('Basic ' + b64('dave:p:w'), 'dave', 'p:w')).toBe(true))
  it('rejects wrong password / missing or malformed header', () => {
    expect(checkBasicAuth('Basic ' + b64('dave:nope'), 'dave', 'pw')).toBe(false)
    expect(checkBasicAuth(null, 'dave', 'pw')).toBe(false)
    expect(checkBasicAuth('Bearer x', 'dave', 'pw')).toBe(false)
    expect(checkBasicAuth('Basic !!!', 'dave', 'pw')).toBe(false)
  })
})
