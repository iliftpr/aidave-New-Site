import { OUTCOMES } from '@/lib/constants'

// Copy is grounded in marketing/research/2026-08-24-hooks-offers-research.md:
// lead with text-back (not "AI voice"), name the beneficiary of a missed call, avoid the
// fatigued "never miss a call" / "stop losing" / "never sleeps" family, keep dollar results
// out of the ads (FTC 255.2), and make the offer specific: the Missed-Call Audit.

export const LP_SLUGS = ['contractors', 'dental-medspa', 'restaurants'] as const
export type LpSlug = (typeof LP_SLUGS)[number]

export interface LpContent {
  slug: LpSlug
  vertical: string
  eyebrow: string
  headline: string
  subhead: string
  bullets: { title: string; body: string }[]
  proof: { headline: string; body: string }[]
  faq: { q: string; a: string }[]
  formTitle: string
  formSub: string
  submitLabel: string
}

export const OFFER_NAME = 'Missed-Call Audit'
const FORM_TITLE = `Get your free ${OFFER_NAME}`
const FORM_SUB = 'I call your line after hours, record what a customer hears, and show you the fix in 15 minutes. Dave texts you within minutes — no pitch.'
const SUBMIT = 'Get my free audit'

const COMMON_FAQ: LpContent['faq'] = [
  {
    q: 'What actually happens in the audit?',
    a: 'Dave calls your business line after you have closed, records what a customer gets (voicemail, a menu, a dropped call), and walks you through the fix on a 15-minute call. You keep the recording either way.',
  },
  {
    q: 'What does it cost?',
    a: 'The audit is free. Done-for-you builds like the AI receptionist start at $1,500 and are quoted after the audit — you always know the number before any work starts. Month to month, no contract.',
  },
  {
    q: 'Do I have to change my phone number?',
    a: 'No. You keep your number. Missed callers get a text back within 60 seconds, and the AI answers what you miss.',
  },
  {
    q: 'Who is Dave?',
    a: 'A Long Island business owner turned AI builder. iLift is based in East Meadow, NY — call or text 516-322-9380.',
  },
]

const CONTENT: Record<LpSlug, LpContent> = {
  contractors: {
    slug: 'contractors',
    vertical: 'Contractors & home services',
    eyebrow: 'For Long Island trades',
    headline: "Who's answering while you're on the roof?",
    subhead:
      "You're 30 feet up in Levittown. The phone buzzes twice. By the time you're down, that homeowner booked whoever answered. Your line should text them back before you fold the ladder.",
    bullets: [
      { title: 'A text back in 60 seconds', body: 'Every missed caller hears from you before they dial the next name on the list.' },
      { title: 'Answered while you work', body: 'Nights, weekends, mid-job — a real answer instead of your voicemail hiring your competitor.' },
      { title: 'Booked to your calendar', body: 'Estimates land on your schedule with the address and the problem already captured.' },
    ],
    proof: [OUTCOMES[0]],
    faq: COMMON_FAQ,
    formTitle: FORM_TITLE,
    formSub: FORM_SUB,
    submitLabel: SUBMIT,
  },
  'dental-medspa': {
    slug: 'dental-medspa',
    vertical: 'Dental & med spa',
    eyebrow: 'For Long Island practices',
    headline: "Weekend voicemails don't rebook themselves.",
    subhead:
      "Monday 8am, Garden City. Your front desk is returning Saturday's calls while today's patients wait. A text within 60 seconds on Saturday would have booked half of them already.",
    bullets: [
      { title: 'New patients booked after close', body: 'The 7:15pm caller gets a text and a booking link instead of the office-hours recording.' },
      { title: 'Front desk, un-buried', body: 'Reminders, rebooking, and text-backs run automatically so your team can look up from the phone.' },
      { title: 'Your ad spend stays yours', body: 'You paid for the click. The patient should not end up booking the practice that texted back first.' },
    ],
    proof: [OUTCOMES[1], OUTCOMES[2]],
    faq: COMMON_FAQ,
    formTitle: FORM_TITLE,
    formSub: FORM_SUB,
    submitLabel: SUBMIT,
  },
  restaurants: {
    slug: 'restaurants',
    vertical: 'Restaurants & local retail',
    eyebrow: 'For Long Island restaurants',
    headline: 'The party of 12 called during the rush.',
    subhead:
      'Friday, 7:40, Merrick Road. The phone rings, nobody can grab it, and that catering order goes to the place that picked up. A text back with your menu link would have held them.',
    bullets: [
      { title: 'Hold music, or a text in 60 seconds?', body: 'Missed callers get hours, menu, and a reservation link automatically — while your host seats the four-top.' },
      { title: 'Big orders stop slipping', body: 'Catering and large parties are the calls that die on hold. Now they get an answer.' },
      { title: 'Found and chosen', body: 'Automated review requests and a clean Google presence bring more locals in.' },
    ],
    proof: [OUTCOMES[2]],
    faq: COMMON_FAQ,
    formTitle: FORM_TITLE,
    formSub: FORM_SUB,
    submitLabel: SUBMIT,
  },
}

export function getLpContent(slug: string): LpContent | null {
  return (LP_SLUGS as readonly string[]).includes(slug) ? CONTENT[slug as LpSlug] : null
}
