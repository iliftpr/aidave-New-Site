import type { Metadata } from 'next'
import {
  GraduationCap,
  Users,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { COMPANY_INFO } from '@/lib/constants'

// NOTE: prices below are research-backed STARTING anchors ("from") for the local-SMB
// market. Dave to confirm final numbers before this page is linked in nav / deployed.
const L = COMPANY_INFO.links
const AUDIT_URL = L.calcom.audit
const TEL = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

export const metadata: Metadata = {
  title: 'Pricing & Services — Learn It, Build It Together, or Done For You',
  description:
    'Three ways to put AI to work in your business: teach me (workshops + strategy), do it with me (hands-on intensives), or done-for-you builds and managed plans — AI receptionist, review machine, get-found-on-Google, and more. Long Island & NYC.',
  alternates: { canonical: 'https://ilift.com/pricing' },
  openGraph: {
    title: 'Pricing & Services — AI Dave (ILift)',
    description: 'Learn it, build it together, or have it done for you. Productized AI for local businesses.',
    url: 'https://ilift.com/pricing',
    type: 'website',
  },
}

type Tier = {
  key: string
  icon: typeof Wrench
  eyebrow: string
  title: string
  blurb: string
  items: {
    name: string
    price: string
    note?: string
    desc: string
    href: string
    cta: string
  }[]
}

const TIERS: Tier[] = [
  {
    key: 'teach',
    icon: GraduationCap,
    eyebrow: 'Teach me',
    title: 'Learn it yourself',
    blurb: 'Get the map and the plan. Great if you (or your team) want to drive.',
    items: [
      {
        name: 'Automation Scorecard',
        price: 'Free',
        desc: '12 questions, 5 minutes. Find the one lever costing you the most.',
        href: L.scorecard,
        cta: 'Take the scorecard',
      },
      {
        name: 'AI for Owners Workshop',
        price: 'Free',
        note: 'in person or online',
        desc: 'The 5 boring automations that pay for themselves — in plain English.',
        href: '/workshop',
        cta: 'Save a spot',
      },
      {
        name: 'AI Strategy Session',
        price: '$297',
        note: '1-hour, recorded',
        desc: 'A custom 90-day AI roadmap for your business. Refunded if it’s not a fit.',
        href: L.calcom.strategy,
        cta: 'Book a session',
      },
    ],
  },
  {
    key: 'with',
    icon: Users,
    eyebrow: 'Do it with me',
    title: 'Build it together',
    blurb: 'Hands-on, side by side. You leave with something real and the know-how to run it.',
    items: [
      {
        name: 'AI Mastery Intensive',
        price: '$997',
        note: 'full day, 1-on-1',
        desc: 'One focused day — set up your AI stack and ship a working app you built yourself.',
        href: L.calcom.mastery,
        cta: 'Book a day',
      },
      {
        name: 'AI Quick-Start Cohort',
        price: 'from $497',
        note: 'per seat · small group',
        desc: 'A small group of owners, guided through their first automation over a few weeks.',
        href: AUDIT_URL,
        cta: 'Ask about the next cohort',
      },
    ],
  },
  {
    key: 'dfy',
    icon: Wrench,
    eyebrow: 'Done for you',
    title: 'Have it built for you',
    blurb: 'We build, connect, and run it. Outcome-named systems that pay for themselves.',
    items: [
      {
        name: 'Never Miss a Call',
        price: 'from $1,500',
        note: '+ from $300/mo',
        desc: 'AI receptionist: answers 24/7, texts back missed callers, books the job.',
        href: '/ai-receptionist',
        cta: 'See how it works',
      },
      {
        name: '5-Star Review Machine',
        price: 'from $1,000',
        note: '+ from $250/mo',
        desc: 'Automatically asks happy customers for the Google review — and climbs your ranking.',
        href: AUDIT_URL,
        cta: 'Get a quote',
      },
      {
        name: 'Get-Found-on-Google',
        price: 'from $1,500',
        note: '+ from $300/mo',
        desc: 'Google Business Profile + local SEO + AI-search (AEO). For trades, LSA setup too.',
        href: AUDIT_URL,
        cta: 'Get a quote',
      },
      {
        name: 'Lead-to-Booked',
        price: 'from $2,500',
        note: '+ from $400/mo',
        desc: 'Lead form to CRM to instant SMS follow-up to a booked slot on your calendar.',
        href: AUDIT_URL,
        cta: 'Get a quote',
      },
      {
        name: 'Site That Sells',
        price: 'from $3,500',
        desc: 'A fast, conversion-built website (with cinematic options) that turns clicks into calls.',
        href: AUDIT_URL,
        cta: 'Get a quote',
      },
      {
        name: 'Social on Autopilot',
        price: 'from $750/mo',
        desc: 'Done-for-you content + social posting that keeps you visible without the time sink.',
        href: AUDIT_URL,
        cta: 'Get a quote',
      },
    ],
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Tiers />
      <Retainer />
      <MidMarket />
      <FinalCta />
      <Footer />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-100 via-secondary-50 to-secondary-200 hero-grid-pattern pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="container-custom relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-gray-900 leading-tight mb-6">
          Three ways to <span className="gradient-text">work with Dave</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 leading-relaxed mb-8">
          Learn it yourself, build it together, or have it done for you. Start with a free audit and
          we&apos;ll point you to the cheapest path that actually works.
        </p>
        <Button href={AUDIT_URL} variant="accent" size="lg">
          <Calendar size={20} />
          Book a Free Audit
          <ArrowRight size={20} />
        </Button>
      </div>
    </section>
  )
}

function Tiers() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom space-y-16">
        {TIERS.map((tier) => (
          <ScrollReveal key={tier.key}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center">
                  <tier.icon size={22} className="text-white" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide text-primary-700">
                  {tier.eyebrow}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-1">
                {tier.title}
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl">{tier.blurb}</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tier.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col h-full bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-bold font-heading text-gray-900 mb-1">{item.name}</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-black gradient-text">{item.price}</span>
                      {item.note && <span className="text-sm text-gray-500 font-medium">{item.note}</span>}
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{item.desc}</p>
                    <Button href={item.href} variant="secondary" size="sm" className="self-start">
                      {item.cta}
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

function Retainer() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary-50/40">
      <div className="container-custom">
        <ScrollReveal>
          <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-sm font-bold uppercase tracking-wide text-accent-400">
                  Best value
                </span>
                <h2 className="text-2xl md:text-4xl font-bold font-heading mt-2 mb-4">
                  The AI Growth Plan
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Bundle two or three done-for-you systems into one managed monthly plan &mdash; we run
                  it, watch it, and improve it every month so the results compound.
                </p>
                <div className="text-3xl font-black accent-gradient-text mb-6">from $1,500/mo</div>
                <Button href={AUDIT_URL} variant="accent" size="lg">
                  Scope my plan
                  <ArrowRight size={20} />
                </Button>
              </div>
              <ul className="space-y-3">
                {[
                  'Pick 2–3 systems (calls, reviews, get-found, lead follow-up, social)',
                  'We build, connect, and maintain everything',
                  'Monthly tuning + a plain-English results report',
                  'No long-term lock-in — cancel anytime',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-accent-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function MidMarket() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl text-center">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
            Bigger team? <span className="gradient-text">Embedded AI Growth Partner</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            For multi-location and mid-market teams that want Dave embedded for 3 to 12+ months &mdash;
            strategy, custom builds, and team training. By application.
          </p>
          <Button href={L.calcom.engagement} variant="primary" size="lg">
            Apply for a conversation
            <ArrowRight size={20} />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden gradient-bg py-20 md:py-28">
      <div className="container-custom relative z-10 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 max-w-3xl mx-auto leading-tight">
            Not sure which one you need?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            That&apos;s what the free audit is for. 30 minutes, no pitch &mdash; you leave knowing exactly
            where to start and what it&apos;s worth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={AUDIT_URL} variant="accent" size="lg" className="w-full sm:w-auto">
              <Calendar size={20} />
              Book a Free Audit
              <ArrowRight size={20} />
            </Button>
            <Button href={TEL} variant="secondary" size="lg" className="w-full sm:w-auto">
              <Phone size={20} />
              Call/Text {COMPANY_INFO.phone}
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
