import type { Metadata } from 'next'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  PhoneMissed,
  FileText,
  MessageSquare,
  Bot,
  FileSignature,
  BellRing,
  Star,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { TalkToAIButton } from '@/components/TalkToAIButton'
import { COMPANY_INFO } from '@/lib/constants'

const AUDIT_URL = COMPANY_INFO.links.calcom.audit

export const metadata: Metadata = {
  title: 'AI for Long Island Law Firms — Intake, Documents, Follow-Up',
  description:
    'Custom AI systems for Long Island law firms: 24/7 intake that answers and books consults, document automation for engagement letters and discovery drafts, and proactive client updates. Built in your accounts, reviewed by your attorneys.',
  alternates: { canonical: 'https://ilift.com/law' },
  openGraph: {
    title: 'AI for Long Island Law Firms — AI Dave (ILift)',
    description:
      'Intake that never misses a call, drafting that does not need a J.D., and clients who stop calling for updates.',
    url: 'https://ilift.com/law',
    type: 'website',
  },
}

const PAINS = [
  {
    icon: PhoneMissed,
    title: 'The 6 PM consult call goes to voicemail',
    body: 'Someone with a real matter calls three firms in a row. The first one that answers and books the consult usually signs them. After hours, weekends, mid-deposition — those calls are walking to your competitors.',
  },
  {
    icon: FileText,
    title: 'Drafting that does not need a J.D.',
    body: 'Engagement letters, discovery requests, demand letters, routine motions, status memos — billable people spending unbillable hours assembling documents from the same templates, matter after matter.',
  },
  {
    icon: MessageSquare,
    title: '"Any update on my case?"',
    body: 'Clients call because nobody proactively tells them anything. Every call interrupts staff, and the silence in between is what turns into bad reviews and bar complaints.',
  },
]

const SYSTEMS = [
  {
    icon: Bot,
    title: '24/7 AI intake receptionist',
    body: 'Answers every call and web chat, screens the matter type, collects the facts your intake sheet needs, and books the consult straight onto the right calendar. Missed-call text-back included.',
    outcome: 'No consult-ready caller ever hits voicemail again.',
  },
  {
    icon: FileSignature,
    title: 'Document automation',
    body: 'Engagement letters, discovery drafts, and routine correspondence generated from matter data in seconds — always attorney-reviewed before anything goes out.',
    outcome: 'Hours of assembly become minutes of review.',
  },
  {
    icon: BellRing,
    title: 'Proactive client updates',
    body: 'Automated status emails and texts at every case milestone, in plain English, so clients hear from the firm before they think to call.',
    outcome: 'The "any update?" calls mostly stop.',
  },
  {
    icon: Star,
    title: 'Review & referral engine',
    body: 'Closed matters trigger a well-timed, personal review request — and happy clients get gently reminded the firm takes referrals.',
    outcome: 'Your Google profile starts compounding.',
  },
]

const FAQS = [
  {
    q: 'What about confidentiality and privilege?',
    a: 'Every system is built inside accounts your firm owns and controls — your phone lines, your calendars, your document storage, your API keys. Client data is not used to train public AI models, access is scoped to the workflow at hand, and everything is handed over with documentation. Your attorneys review anything a system drafts before it leaves the building.',
  },
  {
    q: 'Will the AI give legal advice?',
    a: 'No. Intake systems are hard-scoped: they collect facts, screen matter types, and book consultations — they are explicitly instructed not to advise, quote outcomes, or form engagements. The lawyering stays with lawyers.',
  },
  {
    q: 'Our partners are skeptical of AI.',
    a: 'Reasonable. That is why engagements start with one narrow workflow — usually intake — with a working prototype in one to two weeks. Partners judge a live system handling real calls, not a slide deck. If it does not earn its keep, you have lost two weeks, not a transformation budget.',
  },
  {
    q: 'We already have a case management system.',
    a: 'Good — these systems sit alongside whatever you run (Clio, MyCase, PracticePanther, or spreadsheets). What connects to what gets scoped on the discovery call; nothing assumes you rip anything out.',
  },
  {
    q: 'What does it cost?',
    a: 'The discovery call is free and the AI Strategy Session is $297 with a custom 90-day roadmap. Builds are scoped fixed-price after discovery — typical intake systems start around the cost of one signed matter. The honest answer for your firm specifically is exactly what the discovery call is for.',
  },
  {
    q: 'How fast is a build?',
    a: 'Working prototypes in one to two weeks; production systems in three to eight weeks depending on integrations. You see it running on real inputs before it ever touches a real client.',
  },
]

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function LawPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Pains />
      <Systems />
      <Proof />
      <Faq />
      <FinalCta />
      <Footer />
      {/* Static compile-time FAQPage JSON-LD — no user input flows in here */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-950 text-white pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('/videos/hero-professional-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/50" />
      </div>
      <div className="container-custom relative z-10 max-w-3xl">
        <div className="inline-block px-4 py-2 bg-white/10 rounded-full border border-white/15 mb-6">
          <span className="text-amber-400 font-semibold text-sm">
            For Law Firms · Long Island &amp; NYC
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight mb-6">
          Your firm bills hours.{' '}
          <span className="text-amber-400">Your best people do busywork.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed mb-8">
          Custom AI systems that run intake, draft the routine documents, and keep clients
          updated — built inside your firm&apos;s accounts, reviewed by your attorneys.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href={AUDIT_URL} variant="accent" size="lg" className="w-full sm:w-auto">
            <Calendar size={20} />
            Book a discovery call
            <ArrowRight size={20} />
          </Button>
          <TalkToAIButton className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  )
}

function Pains() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal animation="fadeInUp" className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Three leaks in almost every <span className="gradient-text">law firm</span>
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {PAINS.map((pain, i) => (
            <ScrollReveal key={pain.title} delay={i * 0.1}>
              <div className="h-full bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-5">
                  <pain.icon size={24} className="text-primary-700" />
                </div>
                <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pain.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Systems() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <ScrollReveal className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            What Dave builds for <span className="gradient-text">law firms</span>
          </h2>
          <p className="text-lg text-gray-600">
            Concrete systems, each tied to an outcome — not &ldquo;AI transformation.&rdquo;
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {SYSTEMS.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.05}>
              <div className="h-full bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5">
                  <s.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{s.body}</p>
                <p className="flex items-start gap-2 text-sm font-semibold text-primary-700">
                  <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                  {s.outcome}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section className="section-padding bg-gray-900 text-white">
      <div className="container-custom max-w-3xl text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            The proof is answering questions on this page
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            The AI assistant in the corner of this site — the one that answers, qualifies, and
            books 24/7 — is the same technology Dave installs inside firms. 100+ systems shipped
            across 8 industries, results real and anonymized because client names stay private.
            The way your firm would want yours handled.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TalkToAIButton className="w-full sm:w-auto" />
            <Button href="/demo" variant="outline" size="lg" className="w-full sm:w-auto !bg-transparent !text-white !border-white/40 hover:!bg-white/10">
              Try the receptionist demo
              <ArrowRight size={20} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom max-w-3xl">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">
            The questions partners <span className="gradient-text">actually ask</span>
          </h2>
        </ScrollReveal>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <ScrollReveal key={f.q} delay={i * 0.03}>
              <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm">
                <summary className="cursor-pointer list-none px-6 py-5 font-bold text-gray-900 flex items-center justify-between gap-4">
                  {f.q}
                  <ArrowRight
                    size={18}
                    className="text-primary-500 flex-shrink-0 transition-transform group-open:rotate-90"
                  />
                </summary>
                <p className="px-6 pb-6 text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
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
            Thirty minutes. No pitch. A straight answer.
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Walk me through how intake and drafting work at your firm today. You leave with a
            clear read on where AI pays for itself first — whether or not we ever work together.
          </p>
          <Button href={AUDIT_URL} variant="accent" size="lg">
            <Calendar size={20} />
            Book a discovery call
            <ArrowRight size={20} />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
