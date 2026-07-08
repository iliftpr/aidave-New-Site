export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface Offer {
  id: string
  name: string
  price: string
  priceDetail: string
  noPrice?: boolean
  tagline: string
  bullets: string[]
  ctaLabel: string
  ctaHref?: string
  ctaKind: 'calcom' | 'stripe' | 'contact' | 'fractional'
  secondaryCta?: {
    label: string
    href: string
  }
  featured?: boolean
}

export type ServiceType = 'general' | 'strategy' | 'mastery' | 'dfy' | 'fractional'

export type EngagementType =
  | 'training'
  | 'app-build'
  | 'ai-strategy'
  | 'fractional-embed'
  | 'multiple'

export type EngagementTimeframe = '3-6mo' | '6-12mo' | '12mo+' | 'ongoing'

export interface ContactFormPayload {
  name: string
  email: string
  phone?: string
  message: string
  service: ServiceType
  company?: string
  engagementTypes?: EngagementType[]
  timeframe?: EngagementTimeframe
  website?: string
}

export type ProjectStatus = 'Live' | 'Beta' | 'Personal Lab'

export interface ProjectItem {
  id: string
  title: string
  description: string
  status: ProjectStatus
  techStack: string[]
  imageDesktop: string
  videoSrc?: string
  liveUrl?: string
  // Long-form case study for /work. Every claim must be verifiably true.
  caseStudy?: {
    kicker: string
    challenge: string
    build: string
    outcome: string
    // Optional deep-dive: a dedicated case-study page (e.g. /8-billion-clone)
    deepDiveUrl?: string
    deepDiveLabel?: string
  }
}
