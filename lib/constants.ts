import { Service, Offer, ServiceType, EngagementType } from '@/types'

export const COMPANY_INFO = {
  name: 'ILift by AI Dave - Smart AI Website Design',
  shortName: 'ILift',
  tagline: 'Custom AI systems for Long Island business owners',
  phone: '516-322-9380',
  email: 'dave@ilift.com',
  address: {
    street: '1738 Bard Lane',
    city: 'East Meadow',
    state: 'NY',
    zip: '11554',
    full: '1738 Bard Lane, East Meadow, NY 11554',
  },
  links: {
    app: 'https://app.ilift.com',
    calendly: 'https://calendly.com/aiconsultantpro/digital-marketing-strategy-kickoff-clone',
    auditForm: 'https://api.leadconnectorhq.com/widget/form/6YjBqsVd2ttrRvAtvu83',
    calcom: {
      strategy: 'https://cal.com/ilift/ai-strategy-session',
      mastery: 'https://cal.com/ilift/ai-mastery-intensive',
      audit: 'https://cal.com/ilift/automation-audit',
      engagement: 'https://cal.com/ilift/fractional-ai-intro',
      discovery: 'https://cal.com/ilift/automation-audit',
      // 15-min website fit call — reuses the audit event until Dave creates a dedicated one
      websiteFit: 'https://cal.com/ilift/automation-audit',
    },
    scorecard: 'https://ilift.com/scorecard',
  },
  social: {
    facebook: '#',
    linkedin: 'https://www.linkedin.com/in/aiautomationpro/',
    twitter: '#',
    instagram: 'https://www.instagram.com/aiconsultantpro/',
  },
}

// Anonymized, verified client outcomes — never attach invented names or businesses.
// Owner verifies every claim before adding a new entry.
export const OUTCOMES: { headline: string; body: string }[] = [
  {
    headline: 'A 9-location HVAC group',
    body: 'recovered the after-hours calls it used to lose to voicemail — enough booked work to pay for the build inside the first 60 days.',
  },
  {
    headline: 'A multi-location dental practice',
    body: 'cut no-shows sharply with automated booking and reminders — chairs that used to sit empty stayed full.',
  },
  {
    headline: 'A local medspa',
    body: 'turned quiet weeks into rebooked appointments with automated follow-up and review requests.',
  },
]

export const SERVICES: Service[] = [
  {
    id: 'ai-websites',
    title: 'AI Website Development',
    description: 'Intelligent websites that adapt to your visitors and convert them into customers automatically.',
    icon: 'Globe',
    features: [
      'Responsive design that works on all devices',
      'AI-powered personalization',
      'Built-in SEO optimization',
      'Lightning-fast page speeds',
    ],
  },
  {
    id: 'voice-agents',
    title: 'Voice Agent Automation',
    description: '24/7 AI phone assistants that answer calls, qualify leads, and book appointments while you sleep.',
    icon: 'Phone',
    features: [
      'Natural conversation AI',
      'Appointment scheduling',
      'Lead qualification',
      'Multi-language support',
    ],
  },
  {
    id: 'appointment-booking',
    title: 'Appointment Booking Systems',
    description: 'Automated scheduling that syncs with your calendar and sends reminders to reduce no-shows.',
    icon: 'Calendar',
    features: [
      'Calendar integration',
      'Automated reminders',
      'Online payment processing',
      'Cancellation management',
    ],
  },
  {
    id: 'customer-service',
    title: 'Reputation and Review Management System',
    description: 'Boost your online presence and get more 5-star reviews on Google My Business automatically.',
    icon: 'MessageSquare',
    features: [
      'Instant response times',
      'FAQ automation',
      'Ticket routing',
      'Sentiment analysis',
    ],
  },
  {
    id: 'lead-generation',
    title: 'Lead Generation & CRM',
    description: 'Capture, nurture, and convert leads automatically with intelligent workflows.',
    icon: 'Users',
    features: [
      'Smart lead capture forms',
      'Automated follow-ups',
      'Lead scoring',
      'Pipeline management',
    ],
  },
  {
    id: 'email-sms',
    title: 'Email/SMS Marketing',
    description: 'Personalized automated campaigns that engage customers at the perfect moment.',
    icon: 'Mail',
    features: [
      'Behavior-triggered campaigns',
      'A/B testing',
      'Segmentation',
      'Analytics dashboard',
    ],
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description: 'Connect your tools and automate repetitive tasks to save hours every day.',
    icon: 'Zap',
    features: [
      'App integrations',
      'Custom workflows',
      'Task automation',
      'Process optimization',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    description: 'Data-driven insights dashboard that shows what\'s working and what\'s not.',
    icon: 'BarChart3',
    features: [
      'Real-time analytics',
      'Custom reports',
      'Performance tracking',
      'ROI measurement',
    ],
  },
]

// Root-relative hashes (/#...) so nav works from /websites, /pricing, /blog, etc.
export const NAV_LINKS = [
  { label: 'Websites', href: '/websites' },
  { label: 'AI Receptionist', href: '/ai-receptionist' },
  { label: 'Demo', href: '/demo' },
  { label: 'Built by Dave', href: '/#built-by-dave' },
  { label: 'About', href: '/#about-dave' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

export const OFFERS: Offer[] = [
  {
    id: 'strategy',
    name: 'AI Strategy Session',
    price: '$297',
    priceDetail: '1-hour intensive',
    tagline: 'Walk away with a 90-day AI roadmap tailored to your business — even if you never work with us after.',
    bullets: [
      '60-min 1-on-1 with Dave (recorded)',
      'Custom 90-day AI implementation plan',
      'Honest assessment: build, buy, or skip',
      'Refunded if we agree it\'s not a fit',
    ],
    ctaLabel: 'Book Strategy Session',
    ctaKind: 'calcom',
    ctaHref: 'https://cal.com/ilift/ai-strategy-session',
  },
  {
    id: 'mastery',
    name: 'AI Mastery Intensive',
    price: '$997',
    priceDetail: 'Full-day intensive · 9 AM – 2 PM',
    tagline: 'One day with Dave — power through setup, signups, discovery, and building. You leave with your AI stack live and a working app you built yourself.',
    bullets: [
      'Single 5-hour day, 9 AM – 2 PM, one-on-one with Dave',
      'AI subscription signup walkthrough — the right tools for your use case',
      'Discovery + mini consulting: what you should build first and why',
      'Hands-on app build during the session — you ship something real',
    ],
    ctaLabel: 'Book Mastery Day',
    ctaKind: 'calcom',
    ctaHref: 'https://cal.com/ilift/ai-mastery-intensive',
    featured: true,
  },
  {
    id: 'growth-partner',
    name: 'Embedded AI Growth Partner',
    price: '',
    priceDetail: '',
    noPrice: true,
    tagline: 'Long-term, hands-on partnership for mid-market & enterprise teams. 3 to 12+ months.',
    bullets: [
      'AI strategy + custom app builds',
      'Team training + AI playbooks',
      'Part-time or full-time embed',
      'Built for mid-market & enterprise',
    ],
    ctaLabel: 'Apply for a Conversation',
    ctaKind: 'fractional',
    secondaryCta: {
      label: 'Or grab a 45-min intro on Cal.com →',
      href: 'https://cal.com/ilift/fractional-ai-intro',
    },
  },
]

export const SERVICE_TYPES = ['general', 'strategy', 'mastery', 'dfy', 'fractional'] as const

export const SERVICE_LABELS: Record<ServiceType, string> = {
  general: 'General inquiry',
  strategy: 'AI Strategy Session ($297)',
  mastery: 'AI Mastery Intensive ($997)',
  dfy: 'Done-For-You ($3,600/yr)',
  fractional: 'Embedded AI Growth Partner (long-term)',
}

export const ENGAGEMENT_TYPE_LABELS: Record<EngagementType, string> = {
  training: 'Training',
  'app-build': 'App Build',
  'ai-strategy': 'AI Strategy',
  'fractional-embed': 'Fractional Embed',
  multiple: 'Multiple',
}

export const ENGAGEMENT_TYPES: readonly EngagementType[] = [
  'training',
  'app-build',
  'ai-strategy',
  'fractional-embed',
  'multiple',
] as const

export const TIMEFRAME_OPTIONS: ReadonlyArray<{ value: '3-6mo' | '6-12mo' | '12mo+' | 'ongoing'; label: string }> = [
  { value: '3-6mo', label: '3–6 months' },
  { value: '6-12mo', label: '6–12 months' },
  { value: '12mo+', label: '12+ months' },
  { value: 'ongoing', label: 'Ongoing' },
] as const

export const DAVE_BIO = {
  intro: 'I\'m Dave Gakshteyn. I\'ve built and shipped AI automation for 100+ businesses across 8 verticals — medspas, plumbers, dentists, law firms, retail, fitness, real estate, landscaping. Same playbook, same outcomes: more leads, fewer missed calls, less owner time spent on busywork.',
  paragraphs: [
    'I started ILift because every operator I talked to was being sold "AI" by people who had never actually shipped it. Slick decks, no working systems. I wanted the opposite — boring tech that just works, ships fast, and pays for itself in the first quarter.',
    'I don\'t pitch enterprise transformations. I build systems that book appointments while you sleep, qualify leads before you wake up, and remind customers to leave reviews before they forget. The work is unsexy. The results compound.',
    '100+ implementations in, the pattern is clear: businesses that stop talking about AI and start shipping it pull away fast. If that sounds like a fit, the Strategy Session is the cheapest way to find out — worst case, you leave with a free 90-day plan.',
  ],
  signature: 'Dave Gakshteyn, Founder',
}
