// Shared data for the "Never Miss a Call" live demo (client + server safe — no
// secrets, no server-only imports). The receptionist persona/system prompt lives
// separately in lib/demo-receptionist-prompt.ts so the prompt text never ships to
// the browser bundle.

// Keep the demo snappy: lock the conversation after this many customer turns and
// surface the "get this for your business" CTA. Used by both the API route and the
// client hook so the cap can never drift between them.
export const DEMO_MAX_USER_TURNS = 8

export type DemoVertical = {
  id: string
  /** Label on the chooser chip. */
  label: string
  /** Fictional sample business the visitor "called". */
  businessName: string
  /** Single emoji used in the greeting + chip. */
  emoji: string
  /** Deterministic first text-back. Shown instantly (no API call) and echoed into
   *  the system prompt for continuity. */
  greeting: string
  /** Suggested first customer messages (tap-to-send) so nobody faces a blank box. */
  openers: string[]
}

export const DEMO_VERTICALS: DemoVertical[] = [
  {
    id: 'hvac',
    label: 'HVAC / Plumbing',
    businessName: 'Apex Heating & Cooling',
    emoji: '🔧',
    greeting:
      "Hi! Sorry we missed your call — this is the desk at Apex Heating & Cooling 🔧 What's going on, how can we help?",
    openers: ['My AC just died', 'Need a quote for a new furnace', 'Water heater is leaking'],
  },
  {
    id: 'dental',
    label: 'Dental / Medspa',
    businessName: 'Bright Smile Dental',
    emoji: '🦷',
    greeting:
      "Hi! Sorry we missed you — this is the front desk at Bright Smile Dental 🦷 How can we help today?",
    openers: ['I need a cleaning appointment', 'Do you take my insurance?', 'I have a toothache'],
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    businessName: 'Trattoria Bella',
    emoji: '🍝',
    greeting:
      "Hi! Sorry we couldn't grab the phone — this is Trattoria Bella 🍝 Looking to book a table or have a question?",
    openers: ['Table for 4 tonight', 'Do you have outdoor seating?', 'Are you open Mondays?'],
  },
  {
    id: 'contractor',
    label: 'Contractor / Home Services',
    businessName: 'Summit Home Services',
    emoji: '🛠️',
    greeting:
      "Hey! Sorry we missed your call — this is Summit Home Services 🛠️ What can we help you with?",
    openers: ['Need a kitchen remodel quote', 'My deck needs repair', 'Looking for a free estimate'],
  },
  {
    id: 'auto',
    label: 'Auto Repair',
    businessName: 'Island Auto Care',
    emoji: '🚗',
    greeting:
      "Hi! Sorry we missed you — this is Island Auto Care 🚗 What's going on with the vehicle?",
    openers: ['Check engine light is on', 'Need an oil change', 'Brakes are squeaking'],
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    businessName: 'Shoreline Realty',
    emoji: '🏠',
    greeting:
      "Hi! Sorry we missed your call — this is Shoreline Realty 🏠 Buying, selling, or have a question?",
    openers: ["I'd like to see a listing", 'Thinking of selling my house', "What's my home worth?"],
  },
  {
    id: 'other',
    label: 'Other / My Business',
    businessName: 'your business',
    emoji: '📞',
    greeting:
      "Hi! Sorry we missed your call — thanks for reaching out 📞 How can we help you today?",
    openers: ['I have a question', "I'd like to book a time", 'What are your hours?'],
  },
]

// The generic vertical doubles as the safe fallback for any unknown id.
export const FALLBACK_VERTICAL: DemoVertical =
  DEMO_VERTICALS.find((v) => v.id === 'other') ?? DEMO_VERTICALS[0]!

export const DEMO_VERTICAL_IDS: string[] = DEMO_VERTICALS.map((v) => v.id)

export function getDemoVertical(id: string): DemoVertical {
  return DEMO_VERTICALS.find((v) => v.id === id) ?? FALLBACK_VERTICAL
}
