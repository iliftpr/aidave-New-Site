import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Phone,
  PhoneMissed,
  MessageSquare,
  Calendar,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Wrench,
  Stethoscope,
  UtensilsCrossed,
  Building2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Footer } from '@/components/layout/Footer'
import { LiveCallDemo } from '@/components/demo/LiveCallDemo'
import { COMPANY_INFO } from '@/lib/constants'

const AUDIT_URL = COMPANY_INFO.links.calcom.audit
const SCORECARD_URL = COMPANY_INFO.links.scorecard
const TEL = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

export const metadata: Metadata = {
  title: 'Never Miss Another Call — AI Receptionist for Long Island Businesses',
  description:
    'Your AI receptionist answers every call 24/7, texts back missed callers in seconds, and books the job to your calendar — so you stop losing work to voicemail. Built for Long Island contractors, dental, medspa, HVAC, and service businesses. Free audit, no pitch.',
  alternates: { canonical: 'https://ilift.com/ai-receptionist' },
  openGraph: {
    title: 'Never Miss Another Call — AI Receptionist by AI Dave (ILift)',
    description:
      'Answer every call 24/7, text back missed callers instantly, and book jobs while you work. Built for Long Island service businesses. Free audit.',
    url: 'https://ilift.com/ai-receptionist',
    type: 'website',
  },
}

// NOTE: Service + FAQPage JSON-LD intentionally omitted here for now (the security
// hook flags dangerouslySetInnerHTML). Add via a sanitized/centralized helper as a
// follow-up — see TODO in the plan. The visible FAQ below is the user-facing source.
const FAQ = [
  {
    q: 'What exactly is an AI receptionist?',
    a: 'A 24/7 voice and text assistant that answers your business line, talks like a real person, answers common questions, captures the caller’s details, and books the appointment straight onto your calendar. When you can’t pick up, it texts the caller back within seconds so the lead never goes cold.',
  },
  {
    q: 'Will it sound robotic to my customers?',
    a: 'No. It uses natural conversational voice and is trained on your services, hours, pricing, and service area. Most callers just experience a friendly, fast, always-available front desk — and you get a clean summary of every call.',
  },
  {
    q: 'Do I have to change my phone number?',
    a: 'No. We forward your existing number so the AI only picks up when you don’t (after hours, on a job, or when the line is busy) — or it can handle every call. You stay in control and can take over any call yourself.',
  },
  {
    q: 'How fast can it go live?',
    a: 'Most setups are live within a week or two. We start with a free audit to map your call flow, then build and test it with you before it ever talks to a real customer.',
  },
  {
    q: 'What does it cost?',
    a: 'Most Never-Miss-a-Call setups start around a one-time build fee plus a small monthly plan to run and improve it. We scope the exact number on your free audit — it’s designed to pay for itself in the first job or two it saves.',
  },
]

export default function AiReceptionistPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHeader />
      <Hero />
      <MissedCallMath />
      <TryItLive />
      <TheSystem />
      <HowItWorks />
      <BuiltFor />
      <Proof />
      <Pricing />
      <FaqSection />
      <FinalCta />
      <Footer />
    </main>
  )
}

/* ---------------------------------------------------------------- */
/* Light, conversion-focused header (no escape-route nav)           */
/* ---------------------------------------------------------------- */
function LandingHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <a href="#top" className="flex items-center gap-3" aria-label={COMPANY_INFO.name}>
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary-500/40">
              <Image src="/images/dave-headshot.jpeg" alt="AI Dave" fill sizes="44px" className="object-cover" priority />
            </div>
            <span className="font-heading font-extrabold text-lg text-gray-900">
              ILift <span className="text-gray-400 font-semibold">by AI Dave</span>
            </span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={TEL}
              className="hidden sm:inline-flex items-center gap-2 text-gray-700 hover:text-primary-700 font-semibold"
            >
              <Phone size={18} />
              {COMPANY_INFO.phone}
            </a>
            <Button href={AUDIT_URL} variant="accent" size="sm">
              Free Audit
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ---------------------------------------------------------------- */
/* Hero                                                             */
/* ---------------------------------------------------------------- */
function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-br from-primary-100 via-secondary-50 to-secondary-200 hero-grid-pattern pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-100 shadow-sm mb-6">
            <Sparkles size={16} className="text-primary-600" />
            <span className="text-primary-700 font-semibold text-sm">
              For Long Island service businesses
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-heading text-gray-900 leading-tight mb-6">
            Never Miss <span className="gradient-text">Another Call.</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-700 leading-relaxed mb-8">
            Every missed call is a job that went to your competitor. Your{' '}
            <strong className="text-gray-900">AI receptionist</strong> answers 24/7, texts back missed
            callers in seconds, and books the appointment &mdash; while you&apos;re on the job, asleep,
            or slammed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button href={AUDIT_URL} variant="accent" size="lg" className="w-full sm:w-auto">
              <Calendar size={20} />
              Book Your Free Audit
              <ArrowRight size={20} />
            </Button>
            <Button href={TEL} variant="primary" size="lg" className="w-full sm:w-auto">
              <Phone size={20} />
              Call or Text {COMPANY_INFO.phone}
            </Button>
          </div>

          <a
            href="#try-it"
            className="inline-flex items-center gap-2 mb-10 font-semibold text-primary-700 hover:text-primary-900"
          >
            <span aria-hidden>&darr;</span> Or try the live AI receptionist yourself
          </a>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {[
              { icon: Clock, value: '24/7', label: 'Answered' },
              { icon: MessageSquare, value: '<60s', label: 'Text-back' },
              { icon: Calendar, value: 'Auto', label: 'Booked' },
              { icon: Star, value: '5★', label: 'Reviews asked' },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4 text-center">
                <s.icon size={20} className="text-primary-600 mx-auto mb-1.5" />
                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs uppercase tracking-wide font-bold text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* The cost of a missed call                                        */
/* ---------------------------------------------------------------- */
function MissedCallMath() {
  const stats = [
    { stat: '6 in 10', label: 'calls to small businesses go unanswered during busy hours' },
    { stat: '85%', label: 'of customers whose call isn’t answered will not call back' },
    { stat: '$1,200+', label: 'the value of a single booked job you let slip to voicemail' },
  ]
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            The quiet math of a <span className="gradient-text">missed call</span>
          </h2>
          <p className="text-lg text-gray-600">
            You don&apos;t see the jobs you lose. They just call the next name on Google. Here&apos;s what
            the silence actually costs.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <ScrollReveal key={s.stat} delay={i * 0.1}>
              <div className="h-full bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-gray-100">
                <PhoneMissed size={28} className="text-secondary-600 mb-4" />
                <div className="text-4xl font-black gradient-text mb-2">{s.stat}</div>
                <p className="text-gray-700 font-medium leading-relaxed">{s.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Try it live (interactive AI demo)                                */
/* ---------------------------------------------------------------- */
function TryItLive() {
  return (
    <section
      id="try-it"
      className="section-padding bg-gradient-to-b from-secondary-50/60 to-white scroll-mt-24"
    >
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-5">
            <Sparkles size={16} className="text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Live demo &mdash; not a video</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Don&apos;t take our word for it &mdash; <span className="gradient-text">text it yourself</span>
          </h2>
          <p className="text-lg text-gray-600">
            Pick a business type and message it exactly like a customer would after a missed call.
            This is the same AI that would answer your phone &mdash; live, right now.
          </p>
        </ScrollReveal>
        <ScrollReveal>
          <LiveCallDemo />
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* The system / features                                            */
/* ---------------------------------------------------------------- */
function TheSystem() {
  const features = [
    {
      icon: Phone,
      title: 'Answers every call, 24/7',
      body: 'A natural-sounding AI picks up on the first ring — after hours, weekends, or when you’re elbow-deep in a job. It knows your services, hours, and service area.',
    },
    {
      icon: MessageSquare,
      title: 'Texts back missed callers instantly',
      body: 'If a call ever slips through, the caller gets a friendly text within seconds: “Sorry we missed you — how can we help?” The conversation keeps going so the lead never dies.',
    },
    {
      icon: Calendar,
      title: 'Books the job to your calendar',
      body: 'It qualifies the caller, checks your availability, and books the appointment straight onto your calendar with reminders — no phone tag, no double-bookings.',
    },
    {
      icon: Star,
      title: 'Asks for the 5-star review',
      body: 'After the job, it automatically texts happy customers a one-tap link to leave a Google review — so you climb the local rankings while you work.',
    },
  ]
  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary-50/40">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Meet your <span className="gradient-text">AI receptionist</span>
          </h2>
          <p className="text-lg text-gray-600">
            One system that turns every call into a booked job &mdash; and every booked job into a
            5-star review.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="h-full bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5">
                  <f.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* How it works                                                     */
/* ---------------------------------------------------------------- */
function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Free 30-minute audit',
      body: 'We map how calls come in today and where jobs slip through. You leave with a clear plan — even if you never hire us.',
    },
    {
      n: '2',
      title: 'We build it with you',
      body: 'We train the AI on your business, connect your number and calendar, and test it together until it sounds exactly right.',
    },
    {
      n: '3',
      title: 'It runs while you work',
      body: 'Go live in a week or two. We monitor and tune it monthly — you just watch the booked jobs and reviews roll in.',
    },
  ]
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Live in <span className="gradient-text">two weeks</span>, not two quarters
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 0.1}>
              <div className="h-full relative bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 border border-gray-100">
                <div className="text-6xl font-black text-primary-200 mb-2">{s.n}</div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Built for [verticals]                                            */
/* ---------------------------------------------------------------- */
function BuiltFor() {
  const verticals = [
    { icon: Wrench, name: 'Contractors & Home Services' },
    { icon: Zap, name: 'HVAC & Plumbing' },
    { icon: Stethoscope, name: 'Dental & Medspa' },
    { icon: UtensilsCrossed, name: 'Restaurants' },
    { icon: Building2, name: 'Real Estate' },
    { icon: ShieldCheck, name: 'Auto & Repair' },
  ]
  return (
    <section className="section-padding bg-gradient-to-b from-primary-50/40 to-white">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Built for <span className="gradient-text">Long Island</span> service businesses
          </h2>
          <p className="text-lg text-gray-600">
            Nassau and Suffolk owners who live and die by the phone. If you book jobs by call, this is
            for you.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {verticals.map((v, i) => (
            <ScrollReveal key={v.name} delay={i * 0.05}>
              <div className="flex items-center gap-3 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <v.icon size={20} className="text-primary-700" />
                </div>
                <span className="font-semibold text-gray-800">{v.name}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Proof (anonymized + builder proof, no fabricated names)          */
/* ---------------------------------------------------------------- */
function Proof() {
  const results = [
    {
      icon: TrendingUp,
      headline: 'A 9-location HVAC group',
      body: 'recovered the after-hours calls it used to lose to voicemail — enough booked work to pay for the build inside the first 60 days.',
    },
    {
      icon: Calendar,
      headline: 'A multi-location dental practice',
      body: 'cut no-shows sharply with automated booking and reminders — chairs that used to sit empty stayed full.',
    },
    {
      icon: Star,
      headline: 'A local medspa',
      body: 'turned quiet weeks into rebooked appointments with automated follow-up and review requests.',
    },
  ]
  return (
    <section className="section-padding bg-gray-900 text-white">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <CheckCircle2 size={16} className="text-accent-400" />
            <span className="text-sm font-semibold text-gray-200">
              100+ AI automations shipped across 8 verticals
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Boring tech that just <span className="accent-gradient-text">works</span>
          </h2>
          <p className="text-lg text-gray-300">
            No slick decks, no &ldquo;AI transformation.&rdquo; Just systems that book jobs and pay for
            themselves. (Client names kept private &mdash; results are real and anonymized.)
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {results.map((r, i) => (
            <ScrollReveal key={r.headline} delay={i * 0.1}>
              <div className="h-full bg-white/5 rounded-2xl p-8 border border-white/10">
                <r.icon size={28} className="text-accent-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{r.headline}</h3>
                <p className="text-gray-300 leading-relaxed">{r.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/5 rounded-2xl p-8 border border-white/10">
            <div>
              <p className="text-gray-300 mb-1">Want to see what Dave builds?</p>
              <p className="text-xl font-bold">
                Live demo &mdash; an AI-built site for a local boiler company.
              </p>
            </div>
            <Button
              href="https://boiler-demo-seven.vercel.app"
              variant="accent"
              size="lg"
              className="flex-shrink-0"
            >
              See a live build
              <ArrowRight size={20} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Pricing (soft, scoped on the audit)                              */
/* ---------------------------------------------------------------- */
function Pricing() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            What it <span className="gradient-text">costs</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Most Never-Miss-a-Call setups are a one-time build plus a small monthly plan to run and
            improve it. We scope the exact number on your free audit &mdash; and it&apos;s built to pay
            for itself in the first job or two it saves you.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10">
            {['No long-term lock-in', 'Keep your current number', 'Cancel anytime'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-gray-700 font-semibold">
                <CheckCircle2 size={20} className="text-primary-600" />
                {item}
              </div>
            ))}
          </div>
          <div>
            <Button href={AUDIT_URL} variant="accent" size="lg">
              <Calendar size={20} />
              Get my number on a free audit
              <ArrowRight size={20} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* FAQ                                                              */
/* ---------------------------------------------------------------- */
function FaqSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary-50/40">
      <div className="container-custom max-w-3xl">
        <ScrollReveal className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">
            Questions, <span className="gradient-text">answered</span>
          </h2>
        </ScrollReveal>
        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <ScrollReveal key={item.q} delay={i * 0.05}>
              <details className="group bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-gray-900 text-lg">
                  {item.q}
                  <span className="text-primary-600 transition-transform group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Final CTA                                                        */
/* ---------------------------------------------------------------- */
function FinalCta() {
  return (
    <section className="relative overflow-hidden gradient-bg py-20 md:py-28">
      <div className="container-custom relative z-10 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 max-w-3xl mx-auto leading-tight">
            Stop sending your next job to voicemail.
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Book a free 30-minute audit. We&apos;ll show you exactly where calls are slipping &mdash; and
            what it&apos;s worth to fix it. No pitch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={AUDIT_URL} variant="accent" size="lg" className="w-full sm:w-auto">
              <Calendar size={20} />
              Book Your Free Audit
              <ArrowRight size={20} />
            </Button>
            <Button href={SCORECARD_URL} variant="secondary" size="lg" className="w-full sm:w-auto">
              Take the 2-min Scorecard
            </Button>
          </div>
          <p className="mt-8 text-white/80 font-medium">
            Or call/text Dave directly:{' '}
            <a href={TEL} className="underline font-bold">
              {COMPANY_INFO.phone}
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
