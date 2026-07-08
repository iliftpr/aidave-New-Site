// The 4-Lever Automation Audit — source data
// Shared between /scorecard page, server action, and email template.

export interface Question {
  id: number
  text: string
  options: { score: number; label: string }[]
}

export interface Lever {
  id: 1 | 2 | 3 | 4
  name: string
  shortName: string
  description: string
  questions: Question[]
  firstSprint: {
    diagnosis: string
    scope: string[]
    investment: string
    typicalReturn: string
  }
}

export const LEVERS: Lever[] = [
  {
    id: 1,
    name: 'Intake & Routing',
    shortName: 'Intake',
    description: '24/7 call capture, web lead capture, qualification, routing.',
    questions: [
      {
        id: 1,
        text: 'If a customer calls at 7:30pm, what happens?',
        options: [
          { score: 1, label: 'Voicemail' },
          { score: 2, label: 'Voicemail, someone listens next morning' },
          { score: 3, label: 'After-hours service that takes a message' },
          { score: 4, label: 'Live answering service' },
          { score: 5, label: 'AI captures, qualifies, texts the on-call human' },
        ],
      },
      {
        id: 2,
        text: 'When a web lead comes in, how long until a human responds?',
        options: [
          { score: 1, label: 'Next business day' },
          { score: 2, label: 'Same day, late afternoon' },
          { score: 3, label: 'Within 2–3 hours, business hours' },
          { score: 4, label: 'Within 30 min, business hours' },
          { score: 5, label: 'Under 5 min, 24/7, automated qualification' },
        ],
      },
      {
        id: 3,
        text: 'Can you tell me, right now, how many leads came in yesterday across all locations?',
        options: [
          { score: 1, label: 'No idea' },
          { score: 2, label: 'Could probably find out by end of day' },
          { score: 3, label: 'Total number, no breakdown' },
          { score: 4, label: 'Total + by location, manual lookup' },
          { score: 5, label: 'Exact number, by source, by location, on a dashboard' },
        ],
      },
    ],
    firstSprint: {
      diagnosis: "You're losing leads at the door. Every after-hours call, every web form sitting for 4 hours, every lead bouncing the wrong queue is leaving money on the table.",
      scope: [
        '24/7 AI receptionist for after-hours calls',
        'Web form auto-qualification + routing',
        'CRM integration so nothing falls through',
      ],
      investment: '$5K–$12K build + monthly hosting',
      typicalReturn: '15–40% lift in captured leads, paid back within 90 days for most operators',
    },
  },
  {
    id: 2,
    name: 'Dispatch & Coordination',
    shortName: 'Dispatch',
    description: 'Right job → right tech → right time across locations.',
    questions: [
      {
        id: 4,
        text: 'How is today\'s job board built?',
        options: [
          { score: 1, label: 'Whiteboard / shared spreadsheet' },
          { score: 2, label: 'Calendar app, manually filled in' },
          { score: 3, label: 'FSM software, manually assigned' },
          { score: 4, label: 'FSM software with some auto-routing' },
          { score: 5, label: 'System assigns by skill + location + ETA in real time' },
        ],
      },
      {
        id: 5,
        text: 'What % of dispatch decisions involve a phone call between dispatcher and tech?',
        options: [
          { score: 1, label: 'Nearly all of them' },
          { score: 2, label: 'More than half' },
          { score: 3, label: 'Roughly half' },
          { score: 4, label: 'Maybe 20%' },
          { score: 5, label: 'Nearly none' },
        ],
      },
      {
        id: 6,
        text: 'When a tech finishes early, how do they get the next job?',
        options: [
          { score: 1, label: 'Call dispatch and wait' },
          { score: 2, label: 'Wait for dispatch to call them' },
          { score: 3, label: 'Check the schedule app and self-assign' },
          { score: 4, label: 'Auto-suggested by their app, they confirm' },
          { score: 5, label: 'Pushed to their phone automatically' },
        ],
      },
    ],
    firstSprint: {
      diagnosis: "Your dispatchers are doing work a system should do. Travel time is eating margin. Techs are calling in instead of getting pushed the next job.",
      scope: [
        'Real-time dispatch by skill + location + ETA',
        'Tech-app push for next-job assignment',
        'Reschedule self-service for customers',
      ],
      investment: '$8K–$15K build + monthly hosting',
      typicalReturn: '1.5–2.5 extra jobs per tech per week',
    },
  },
  {
    id: 3,
    name: 'Customer Comms',
    shortName: 'Comms',
    description: 'Confirmations, reminders, reviews, follow-ups, win-back.',
    questions: [
      {
        id: 7,
        text: 'What\'s your no-show / no-confirmation rate?',
        options: [
          { score: 1, label: 'Above 20%' },
          { score: 2, label: '15–20%' },
          { score: 3, label: '10–15%' },
          { score: 4, label: '5–10%' },
          { score: 5, label: 'Under 5%' },
        ],
      },
      {
        id: 8,
        text: 'After a job completes, when does the review request go out?',
        options: [
          { score: 1, label: 'It doesn\'t' },
          { score: 2, label: 'Days later, by an admin manually' },
          { score: 3, label: 'Same day, automated' },
          { score: 4, label: 'Within an hour, automated' },
          { score: 5, label: 'Within 30 min, with the tech\'s name baked in' },
        ],
      },
      {
        id: 9,
        text: 'How many touches does a quiet customer get before you call them dead?',
        options: [
          { score: 1, label: 'Zero' },
          { score: 2, label: 'One, manual' },
          { score: 3, label: 'One, automated' },
          { score: 4, label: 'A 2-touch nurture, automated' },
          { score: 5, label: 'A 3-touch nurture runs automatically' },
        ],
      },
    ],
    firstSprint: {
      diagnosis: "You're leaking revenue at every customer touchpoint after booking: no-shows, missing reviews, no follow-ups, no win-back.",
      scope: [
        'Confirm + remind sequence (SMS + voice)',
        'No-show recovery automation',
        'Review request automation, tech-named',
        'Win-back nurture for dormant customers',
      ],
      investment: '$5K–$10K build + monthly hosting',
      typicalReturn: '50–80% reduction in no-shows. 3–5x review volume. ~10–15% reactivation lift on dormant customers.',
    },
  },
  {
    id: 4,
    name: 'Cross-Location Reporting',
    shortName: 'Reporting',
    description: 'KPI dashboards rolled up, weekly snapshots, anomaly detection.',
    questions: [
      {
        id: 10,
        text: 'When can you see yesterday\'s revenue across all locations?',
        options: [
          { score: 1, label: 'End of month' },
          { score: 2, label: 'End of week' },
          { score: 3, label: 'Sometime the next day, after manual gathering' },
          { score: 4, label: 'Same morning, manual rollup' },
          { score: 5, label: 'By 8am the next morning, in one dashboard' },
        ],
      },
      {
        id: 11,
        text: 'If one location\'s bookings dropped 30% last week, who knows and how?',
        options: [
          { score: 1, label: 'Nobody' },
          { score: 2, label: 'The location manager, if they look' },
          { score: 3, label: 'Discovered in weekly review meeting' },
          { score: 4, label: 'Email alert to the COO' },
          { score: 5, label: 'Automated anomaly alert in Slack/email same week' },
        ],
      },
      {
        id: 12,
        text: 'How long does building the weekly report take?',
        options: [
          { score: 1, label: '4+ hours, someone hates Mondays for it' },
          { score: 2, label: '2–3 hours' },
          { score: 3, label: '1 hour' },
          { score: 4, label: '15–30 min' },
          { score: 5, label: 'It builds itself, lands in your inbox Monday morning' },
        ],
      },
    ],
    firstSprint: {
      diagnosis: "You're flying blind across locations. Problems compound before anyone sees them. The COO is the bottleneck for every weekly report.",
      scope: [
        'Unified dashboard across all locations',
        'Monday-morning snapshot to leadership',
        'Automated anomaly alerts in Slack/email',
      ],
      investment: '$6K–$14K build + monthly hosting',
      typicalReturn: '4–8 hours/week back for the COO. Faster problem detection (catch issues in the same week, not end of quarter).',
    },
  },
]

export type ScoreMap = Record<number, number>  // questionId → score (1-5)

export function leverTotals(scores: ScoreMap): Record<1 | 2 | 3 | 4, number> {
  const totals = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<1 | 2 | 3 | 4, number>
  for (const lever of LEVERS) {
    for (const q of lever.questions) {
      totals[lever.id] += scores[q.id] ?? 0
    }
  }
  return totals
}

export function lowestLever(scores: ScoreMap): Lever | null {
  const totals = leverTotals(scores)
  let lowest: Lever | null = null
  let lowestScore = Infinity
  for (const lever of LEVERS) {
    const total = totals[lever.id]
    if (total > 0 && total < lowestScore) {
      lowestScore = total
      lowest = lever
    }
  }
  return lowest
}
