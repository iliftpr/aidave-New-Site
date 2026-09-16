import { describe, it, expect } from 'vitest'
import { containsGibberish, detectSpam, isGibberishToken, MIN_FILL_MS } from '@/lib/spam'

const human = {
  name: 'Maria Lopez',
  message: 'We miss calls after hours and want to see what an AI receptionist would cost.',
  elapsedMs: 30_000,
  origin: 'https://www.ilift.com',
  host: 'www.ilift.com',
}

// Verbatim contact-form bot values: ilift.com (commit f6f9082), ShoutCMS KB 134, wordpress.org "suddenly more form spam"
const REAL_BOT_VALUES = [
  'XJDBGUngExAjCXFXWps',
  'SugVjXrLoXlRgzLN',
  'cJmNcAfCSxcD',
  'RzdPGfrC',
  'bZZalRjCgnwyRira',
  'teNHehPVGDdsjw',
  'HTihaaAoaRxFPH',
  'lbXxOgUj',
  'OoBMtTMUiF',
  'qtNPeIFRxMdUXUCupoyA',
]

describe('detectSpam request checks', () => {
  it('passes a normal same-origin submission', () => {
    expect(detectSpam(human)).toBeNull()
  })

  it('flags a missing or foreign origin', () => {
    expect(detectSpam({ ...human, origin: null })).toBe('missing-origin')
    expect(detectSpam({ ...human, host: null })).toBe('missing-origin')
    expect(detectSpam({ ...human, origin: 'https://evil.example' })).toBe('cross-origin')
    expect(detectSpam({ ...human, origin: 'null' })).toBe('bad-origin')
  })

  it('compares origin and host case-insensitively, port included', () => {
    expect(detectSpam({ ...human, origin: 'https://WWW.ilift.com', host: 'www.ILIFT.com' })).toBeNull()
    expect(detectSpam({ ...human, origin: 'http://localhost:3000', host: 'localhost:3000' })).toBeNull()
    expect(detectSpam({ ...human, origin: 'http://localhost:3001', host: 'localhost:3000' })).toBe('cross-origin')
  })

  it('requires a numeric fill time at or above the floor', () => {
    expect(detectSpam({ ...human, elapsedMs: undefined })).toBe('no-timer')
    expect(detectSpam({ ...human, elapsedMs: '9000' })).toBe('no-timer')
    expect(detectSpam({ ...human, elapsedMs: Number.NaN })).toBe('no-timer')
    expect(detectSpam({ ...human, elapsedMs: Number.POSITIVE_INFINITY })).toBe('no-timer')
    expect(detectSpam({ ...human, elapsedMs: MIN_FILL_MS - 1 })).toBe('too-fast')
    expect(detectSpam({ ...human, elapsedMs: MIN_FILL_MS })).toBeNull()
  })

  it('names the field that looks random', () => {
    expect(detectSpam({ ...human, name: 'XJDBGUngExAjCXFXWps' })).toBe('gibberish-name')
    expect(detectSpam({ ...human, message: 'qtNPeIFRxMdUXUCupoyA' })).toBe('gibberish-message')
  })

  it('passes the fixed payload the AI chat card sends', () => {
    expect(
      detectSpam({
        ...human,
        name: 'AI chat visitor',
        message:
          'Lead captured from the AI assistant on ilift.com — the visitor asked Dave to reach out instead of booking directly.',
      }),
    ).toBeNull()
  })
})

describe('random-string detector', () => {
  it.each(REAL_BOT_VALUES)('catches the real bot value %s', (value) => {
    expect(isGibberishToken(value)).toBe(true)
    expect(containsGibberish(value)).toBe(true)
  })

  it('catches bot strings mixed into otherwise spaced text', () => {
    expect(containsGibberish('Hello XJDBGUngExAjCXFXWps')).toBe(true)
    expect(containsGibberish('SugVjXrLoXlRgzLN lbXxOgUj')).toBe(true)
    expect(containsGibberish('"XJDBGUngExAjCXFXWps."')).toBe(true)
  })

  it.each([
    // names, spaced and run together
    'DeShawn McDonald',
    'JohnPaulMcDonald',
    'DeShawnMcDonald',
    'MaryBethMcGillicuddy',
    'AnnaVanDerBerg',
    "Siobhan O'Brien-FitzGerald",
    'José García',
    // business names typed as one word
    'LongIslandHomeServices',
    'EastMeadowFamilyDental',
    'LongIslandPlumbingLtd',
    'SmithAndJonesLlp',
    'CohenKleinBrownLlp',
    'CarlyleCapitalPartnersLp',
    'LloydsBankingGroupPlc',
    'BigApplePhysicalTherapyPc',
    'TheLawOfficesOfJohnSmith',
    'BestHvacNyc',
    // brands, hashtags and code a prospect might type
    'We use GoHighLevel, ServiceTitan, HubSpot and QuickBooksOnline.',
    'Looking at LinkedInSalesNavigator for outreach #SmallBusinessOwnerLife',
    'Our getServerSideProps call is slow and getElementsByClassName returns nothing',
    'iPhone15ProMax, ChatGPT and OpenAI',
    'HVAC LLC NYC',
    // domains, emails and share links with random IDs
    'Our site is LongIslandHomeServices.com — can you help?',
    'Reach me at JohnPaulMcDonald@BestChoiceRoofingNY.com',
    'Saw this video of yours https://youtu.be/rHQr-chvSZY?si=Q_uXueiIyxVrajY0',
    'Join: https://us06web.zoom.us/j/88235731786?pwd=JuXTka0J9AnMfNvOZqhRHy4q7Oige8ge.1',
    'Current form: https://forms.gle/ikySpepLdSPSIOOta',
    'See https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2F&data=05%7C02%7Cjohn%40example.com%7C638373642751052339%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&sdata=abc&reserved=0',
  ])('leaves real input alone: %s', (value) => {
    expect(containsGibberish(value)).toBe(false)
  })

  it('treats non-strings and empty values as clean', () => {
    expect(containsGibberish(undefined)).toBe(false)
    expect(containsGibberish(null)).toBe(false)
    expect(containsGibberish('')).toBe(false)
    expect(containsGibberish({ toString: () => 'x' })).toBe(false)
  })

  it('stays fast on pathological input', () => {
    const start = performance.now()
    containsGibberish('.'.repeat(200_000) + 'x')
    containsGibberish(`${'a'.repeat(100_000)}${'!'.repeat(100_000)}b ${'Ab'.repeat(50_000)}`)
    expect(performance.now() - start).toBeLessThan(1000)
  })
})
