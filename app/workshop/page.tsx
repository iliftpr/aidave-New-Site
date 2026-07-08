import type { Metadata } from 'next'
import {
  Calendar,
  MapPin,
  Video,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  PhoneMissed,
  Star,
  Search,
  Bot,
  Users,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { COMPANY_INFO } from '@/lib/constants'

// TODO: when a real workshop date is booked, swap REGISTER_URL to the Eventbrite/
// cal.com event link. For now the "save your spot" CTA captures the lead via the
// scorecard opt-in so no interest is lost between scheduled dates.
const REGISTER_URL = COMPANY_INFO.links.scorecard
const AUDIT_URL = COMPANY_INFO.links.calcom.audit
const TEL = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

export const metadata: Metadata = {
  title: 'AI for Local Business Owners — Free Long Island Workshop',
  description:
    'A plain-English workshop for Long Island business owners: the 5 boring AI automations that pay for themselves — answering calls, booking jobs, follow-ups, and reviews. In-person on Long Island or on-demand online. No tech background needed.',
  alternates: { canonical: 'https://ilift.com/workshop' },
  openGraph: {
    title: 'AI for Local Business Owners — Free Workshop with AI Dave',
    description:
      'The 5 boring AI automations that pay for themselves. In-person on Long Island or on-demand online. No pitch, no jargon.',
    url: 'https://ilift.com/workshop',
    type: 'website',
  },
}

const LEARN = [
  { icon: Phone, title: 'Answer every call', body: 'How an AI receptionist catches the calls you miss — after hours, on the job, or slammed at the front desk.' },
  { icon: PhoneMissed, title: 'Rescue dead leads', body: 'The missed-call text-back that turns voicemails into booked jobs in under a minute.' },
  { icon: Calendar, title: 'Fill the calendar', body: 'Automated booking + reminders that cut no-shows and stop the phone-tag.' },
  { icon: Star, title: 'Win the reviews', body: 'A simple system that asks happy customers for the 5-star Google review automatically.' },
  { icon: Search, title: 'Get found on Google', body: 'What actually moves you up in local search and AI answers (ChatGPT, Google AI) in 2026.' },
  { icon: Bot, title: 'Skip the hype', body: 'Which AI tools are worth paying for, which are a waste, and where to start — honestly.' },
]

export default function WorkshopPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <WhoFor />
      <Learn />
      <Formats />
      <Instructor />
      <FinalCta />
      <Footer />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-100 via-secondary-50 to-secondary-200 hero-grid-pattern pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container-custom relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-100 shadow-sm mb-6">
          <Users size={16} className="text-primary-600" />
          <span className="text-primary-700 font-semibold text-sm">Free workshop for Long Island owners</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-gray-900 leading-tight mb-6">
          AI for <span className="gradient-text">Local Business Owners</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 leading-relaxed mb-8">
          The 5 boring AI automations that actually pay for themselves &mdash; in plain English, from
          someone who&apos;s shipped them 100+ times. No tech background needed. No pitch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button href={REGISTER_URL} variant="accent" size="lg" className="w-full sm:w-auto">
            <Calendar size={20} />
            Save Your Spot
            <ArrowRight size={20} />
          </Button>
          <Button href={AUDIT_URL} variant="primary" size="lg" className="w-full sm:w-auto">
            Prefer 1-on-1? Book a Free Audit
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-700 font-semibold">
          <span className="inline-flex items-center gap-2"><MapPin size={18} className="text-primary-600" /> In-person on Long Island</span>
          <span className="inline-flex items-center gap-2"><Video size={18} className="text-primary-600" /> Or on-demand online</span>
          <span className="inline-flex items-center gap-2"><Clock size={18} className="text-primary-600" /> ~60 minutes</span>
        </div>
      </div>
    </section>
  )
}

function WhoFor() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            For owners who live by the <span className="gradient-text">phone</span>
          </h2>
          <p className="text-lg text-gray-600">
            Contractors, HVAC and plumbing, dental and medspa, restaurants, real estate, auto &mdash; if
            you book jobs by call and you&apos;re tired of being sold &ldquo;AI&rdquo; by people who&apos;ve
            never run a business, this hour is for you.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Learn() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary-50/40">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            What you&apos;ll <span className="gradient-text">walk away with</span>
          </h2>
          <p className="text-lg text-gray-600">
            Six things you can act on the same week &mdash; not a sales deck.
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARN.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.06}>
              <div className="h-full bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5">
                  <item.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Formats() {
  const formats = [
    {
      icon: MapPin,
      title: 'In person, on Long Island',
      body: 'A live session hosted with a local partner (Chamber of Commerce, library, or co-working space). See it work, ask anything, and meet other owners. Seats are limited.',
      cta: 'Save my seat',
    },
    {
      icon: Video,
      title: 'On demand, online',
      body: 'Can’t make a date? Watch the same workshop on your own time, then book a free audit if you want help putting it to work.',
      cta: 'Watch online',
    },
  ]
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Two ways to <span className="gradient-text">attend</span>
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {formats.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="h-full flex flex-col bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-gray-100">
                <f.icon size={28} className="text-primary-700 mb-4" />
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{f.body}</p>
                <Button href={REGISTER_URL} variant="primary" size="md" className="self-start">
                  {f.cta}
                  <ArrowRight size={18} />
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Instructor() {
  return (
    <section className="section-padding bg-gradient-to-b from-primary-50/40 to-white">
      <div className="container-custom max-w-3xl">
        <ScrollReveal>
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
              Taught by <span className="gradient-text">Dave Gakshteyn</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dave ran a day spa in the city for years &mdash; he knows the operator grind, the phone
              that won&apos;t stop, the lead that slips because nobody called back. Now he builds AI
              automation for Long Island businesses: 100+ implementations across 8 verticals.
            </p>
            <p className="text-gray-600 leading-relaxed">
              No jargon, no hype &mdash; just the boring systems that book jobs and pay for themselves.
            </p>
          </div>
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
            Grab a seat at the next workshop.
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Drop your email and we&apos;ll send you the next date &mdash; in person or online. No spam, no
            pitch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={REGISTER_URL} variant="accent" size="lg" className="w-full sm:w-auto">
              <Calendar size={20} />
              Save Your Spot
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
