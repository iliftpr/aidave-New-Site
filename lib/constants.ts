import { Service, Review, PortfolioItem, Offer, ServiceType, EngagementType } from '@/types'

export const COMPANY_INFO = {
  name: 'ILift by AI Dave - Smart AI Website Design',
  shortName: 'ILift',
  tagline: 'Smart AI Website Design by AI Dave',
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

export const HERO_TYPING_PHRASES = [
  'AI-Powered Websites That Convert',
  'Voice Agents That Never Sleep',
  'Automation That Scales Your Business',
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

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    business: 'Serenity Spa & Wellness',
    industry: 'Spa & Wellness',
    rating: 5,
    text: 'The AI booking system from ILift increased our appointments by 40% in just 2 months. The voice agent handles calls even when we\'re with clients. Game changer!',
    avatar: '/avatars/sarah-j.jpg',
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    business: 'Rodriguez Plumbing Co.',
    industry: 'Plumbing',
    rating: 5,
    text: 'We used to miss calls all the time on job sites. Now the AI voice agent books appointments 24/7. Our revenue is up 60% and I finally have work-life balance.',
    avatar: '/avatars/mike-r.jpg',
  },
  {
    id: '3',
    name: 'Jennifer Chen',
    business: 'Chen & Associates Law',
    industry: 'Legal',
    rating: 5,
    text: 'The automated lead qualification saves our staff 15 hours per week. Only pre-qualified consultations make it to our calendar. The ROI is incredible.',
    avatar: '/avatars/jennifer-c.jpg',
  },
  {
    id: '4',
    name: 'David Thompson',
    business: 'Thompson Construction',
    industry: 'Construction',
    rating: 5,
    text: 'ILift built us a website that actually generates leads. The automation handles quotes and follow-ups while we focus on building. Best investment we\'ve made.',
    avatar: '/avatars/david-t.jpg',
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    business: 'Elite Fitness Studio',
    industry: 'Fitness',
    rating: 5,
    text: 'The SMS automation is phenomenal. Attendance is up 35% thanks to automated reminders, and the AI chat handles membership questions instantly.',
    avatar: '/avatars/lisa-m.jpg',
  },
  {
    id: '6',
    name: 'Robert Kim',
    business: 'Kim\'s Auto Repair',
    industry: 'Automotive',
    rating: 5,
    text: 'Went from answering calls all day to having an AI assistant do it for me. It even sends service reminders to customers. This technology is the future.',
    avatar: '/avatars/robert-k.jpg',
  },
  {
    id: '7',
    name: 'Amanda Foster',
    business: 'Foster Real Estate Group',
    industry: 'Real Estate',
    rating: 5,
    text: 'The lead nurturing automation is incredible. It follows up with prospects automatically until they\'re ready to buy. Closed 8 more deals this quarter.',
    avatar: '/avatars/amanda-f.jpg',
  },
  {
    id: '8',
    name: 'Carlos Mendez',
    business: 'Mendez Landscaping',
    industry: 'Landscaping',
    rating: 5,
    text: 'Finally, a website that works as hard as I do. The AI voice agent books estimates even when I\'m on a job. My schedule is always full now.',
    avatar: '/avatars/carlos-m.jpg',
  },
]

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'spa-wellness',
    title: 'Serenity Spa & Wellness',
    industry: 'Spa & Wellness',
    description: 'Calming, luxurious website with integrated booking system and service menu.',
    features: [
      'Online booking system',
      'Service menu with pricing',
      'Gift card sales',
      'Customer reviews',
      'Mobile-optimized',
    ],
    imageDesktop: '/images/portfolio/spa-desktop.png',
    imageMobile: '/images/portfolio/spa-mobile.webp',
  },
  {
    id: 'plumbing-services',
    title: 'Rodriguez Plumbing',
    industry: 'Plumbing',
    description: 'Trust-building website with emergency service CTA and service area maps.',
    features: [
      '24/7 emergency service button',
      'Service area mapping',
      'Live chat for quotes',
      'Before/after gallery',
      'Customer testimonials',
    ],
    imageDesktop: '/images/portfolio/plumber-desktop.png',
    imageMobile: '/images/portfolio/plumber-mobile.webp',
  },
  {
    id: 'construction',
    title: 'Thompson Construction',
    industry: 'Construction',
    description: 'Professional portfolio site showcasing projects with automated quote system.',
    features: [
      'Project portfolio gallery',
      'Quote request automation',
      'Client testimonials',
      'Service breakdown',
      'Contact forms',
    ],
    imageDesktop: '/images/portfolio/construction-desktop.png',
    imageMobile: '/images/portfolio/construction-mobile.webp',
  },
  {
    id: 'law-firm',
    title: 'Chen & Associates',
    industry: 'Law Firm',
    description: 'Professional, trustworthy design with consultation booking and practice areas.',
    features: [
      'Consultation booking',
      'Practice area pages',
      'Attorney profiles',
      'Case results',
      'Legal resources',
    ],
    imageDesktop: '/images/portfolio/law-desktop.png',
    imageMobile: '/images/portfolio/law-mobile.webp',
  },
]

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Built by Dave', href: '#built-by-dave' },
  { label: 'Work with Dave', href: '#work-with-dave' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'About', href: '#about-dave' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
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
