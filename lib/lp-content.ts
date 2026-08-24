import { OUTCOMES } from '@/lib/constants'

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

const COMMON_FAQ: LpContent['faq'] = [
  {
    q: 'What happens after I submit?',
    a: 'Dave texts you within minutes. You can also grab a free 15-minute slot on his calendar right away — no pitch, just a look at where calls and leads are leaking.',
  },
  {
    q: 'What does it cost?',
    a: 'The 15-minute look is free. Done-for-you builds like the AI receptionist start at $1,500 and are quoted after the audit — you always know the number before any work starts.',
  },
  {
    q: 'Do I have to change my phone number?',
    a: 'No. You keep your number. The AI answers what you miss and texts back missed callers.',
  },
  {
    q: 'Who is Dave?',
    a: 'A Long Island business owner turned AI builder. iLift is based in East Meadow, NY — call or text 516-322-9380.',
  },
]

const FORM_TITLE = 'Get a free 15-minute look'
const FORM_SUB = 'Dave texts you back within minutes. No pitch.'
const SUBMIT = 'Text me the details'

const CONTENT: Record<LpSlug, LpContent> = {
  contractors: {
    slug: 'contractors',
    vertical: 'Contractors & home services',
    eyebrow: 'For Long Island trades',
    headline: 'Stop sending jobs to voicemail.',
    subhead:
      'While you are on a roof, under a sink, or driving, your AI receptionist answers 24/7, texts back every missed caller in seconds, and books the job to your calendar.',
    bullets: [
      { title: 'Answers every call', body: 'Nights, weekends, mid-job. Every caller gets a real answer instead of a voicemail.' },
      { title: 'Texts back in seconds', body: 'Missed a call anyway? The caller gets a text before they dial your competitor.' },
      { title: 'Books to your calendar', body: 'Estimates land on your schedule with the address and the problem already captured.' },
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
    headline: 'Keep the chairs full.',
    subhead:
      'Empty chairs and no-shows quietly cost practices thousands a month. The AI front desk books appointments, sends smart reminders, fills cancellations, and answers after hours.',
    bullets: [
      { title: 'Never miss a new patient', body: 'Lunch, after hours, and weekends are when new patients call. Every one gets booked.' },
      { title: 'Fewer no-shows', body: 'Smart reminders and instant rebooking keep the schedule full without front-desk chasing.' },
      { title: 'More 5-star reviews', body: 'Happy patients get asked at the right moment, so you climb Google while you work.' },
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
    headline: 'Answer every call during the rush.',
    subhead:
      'Every unanswered call is a table or an order walking away. The AI answers, takes reservations and questions, and texts back missed callers so the dinner rush never costs you covers.',
    bullets: [
      { title: 'Reservations without the phone tag', body: 'Callers get booked or answered while your staff stays on the floor.' },
      { title: 'Texts back missed callers', body: 'Slammed? The caller hears from you in seconds, not never.' },
      { title: 'Get found, get chosen', body: 'Automated review requests and a clean Google presence bring more locals in.' },
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
