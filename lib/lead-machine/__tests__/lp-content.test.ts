import { describe, it, expect } from 'vitest'
import { LP_SLUGS, getLpContent } from '@/lib/lp-content'

describe('lp content', () => {
  it('has the three variants with complete sections', () => {
    expect(LP_SLUGS).toEqual(['contractors', 'dental-medspa', 'restaurants'])
    for (const slug of LP_SLUGS) {
      const c = getLpContent(slug)!
      expect(c.slug).toBe(slug)
      expect(c.headline.length).toBeGreaterThan(10)
      expect(c.bullets).toHaveLength(3)
      expect(c.faq.length).toBeGreaterThanOrEqual(3)
      expect(c.proof.length).toBeGreaterThanOrEqual(1)
      for (const p of c.proof) expect(p.headline).toBeTruthy()
    }
  })
  it('returns null for an unknown slug', () => expect(getLpContent('crypto')).toBeNull())
  it('never invents named testimonials', () => {
    for (const slug of LP_SLUGS) {
      for (const p of getLpContent(slug)!.proof) expect(p.headline).toMatch(/^An? /)
    }
  })
})
