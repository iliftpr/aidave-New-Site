import type { Metadata } from 'next'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  FolderOpen,
  Keyboard,
  PhoneCall,
  Bot,
  FileStack,
  BellRing,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { TalkToAIButton } from '@/components/TalkToAIButton'
import { COMPANY_INFO } from '@/lib/constants'

const AUDIT_URL = COMPANY_INFO.links.calcom.audit

export const metadata: Metadata = {
  title: 'AI for Long Island Accounting Firms — Document Chasing, Onboarding, Client Comms',
  description:
    'Custom AI systems for Long Island accounting and tax firms: automated document collection that ends organizer-chasing, client onboarding without re-typing, an AI receptionist for tax-season call overflow, and proactive status updates.',
  alternates: { canonical: 'https://ilift.com/accounting' },
  openGraph: {
    title: 'AI for Long Island Accounting Firms — AI Dave (ILift)',
    description:
      'End organizer-chasing, survive tax-season phones, and stop re-typing client data. Built in your accounts.',
    url: 'https://ilift.com/accounting',
    type: 'website',
  },
}

const PAINS = [
  {
    icon: FolderOpen,
    title: 'The organizer chase',
    body: 'Every January the same ritual: send organizers, wait, remind, call, wait, remind again. Half your season is spent chasing documents instead of preparing returns — and the stragglers land in the two worst weeks.',
  },
  {
    icon: Keyboard,
    title: 'Onboarding by re-typing',
    body: 'A new client means the same data keyed into the tax software, the portal, the engagement letter, and the billing system. Four entries, one typo away from a wrong return.',
  },
  {
    icon: PhoneCall,
    title: '"Is my return done yet?"',
    body: 'From February to April the phones do not stop — and most calls are status checks your software could answer. Every interruption costs a preparer twenty minutes of focus at the worst possible time of year.',
  },
]

const SYSTEMS = [
  {
    icon: FileStack,
    title: 'Document-collection chaser',
    body: 'Automated, personalized organizer and document requests with polite persistent follow-up — email and text — that escalates until the file is complete, and tells you exactly who is still missing what.',
    outcome: 'The January chase runs itself.',
  },
  {
    icon: Bot,
    title: 'AI receptionist for season overflow',
    body: 'Answers every call 24/7, handles the status-check and "what do I bring" questions, books appointments, and texts back missed callers — so preparers prepare.',
    outcome: 'Tax-season phones stop eating preparer hours.',
  },
  {
    icon: Keyboard,
    title: 'Client onboarding automation',
    body: 'One intake collects everything once; engagement letters generate for signature and client data lands where it belongs without re-typing.',
    outcome: 'New clients set up in minutes, not afternoons.',
  },
  {
    icon: BellRing,
    title: 'Status & deadline comms',
    body: 'Proactive "we received your docs / your return is in review / ready for signature" updates, plus extension and estimated-payment reminders that go out on time, every time.',
    outcome: 'The status-call flood slows to a trickle.',
  },
]

const FAQS = [
  {
    q: 'How is client data protected?',
    a: 'Every system is built inside accounts your firm owns and controls — your email domain, your portal, your storage, your API keys — with access scoped to the specific workflow. Client data is not used to train public AI models, and everything is documented and handed over. You know exactly where every piece of data lives, which is more than most firms can say about their current stack.',
  },
  {
    q: 'Does it work with our tax software?',
    a: 'These systems sit alongside whatever you run — Drake, Lacerte, UltraTax, ProConnect, QuickBooks. What integrates directly versus what hands off cleanly gets scoped on the discovery call; nothing assumes you change platforms.',
  },
  {
    q: 'We only really hurt during tax season.',
    a: 'Then build in the off-season and let it earn its keep year-round: document chasing works for extensions, monthly bookkeeping clients, and audit support requests too. Firms that wire this up in the fall walk into January with the chase already automated.',
  },
  {
    q: 'Nobody at our firm is technical.',
    a: 'You do not need to be. Systems are delivered working, your staff gets trained on them in plain English, and the AI Mastery Intensive ($997, one day) exists if someone on your team wants to genuinely own the tooling.',
  },
  {
    q: 'What does it cost?',
    a: 'The discovery call is free and the AI Strategy Session is $297 with a custom 90-day roadmap. Builds are scoped fixed-price after discovery — a document-chaser typically costs less than the staff hours it replaces in a single season. The honest number for your firm is what the discovery call is for.',
  },
  {
    q: 'How fast is a build?',
    a: 'Working prototypes in one to two weeks; production systems in three to eight weeks depending on integrations. Off-season is the ideal build window — live and tested before the January wave.',
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

export default function AccountingPage() {
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
            For Accounting &amp; Tax Firms · Long Island &amp; NYC
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight mb-6">
          Tax season shouldn&apos;t run on{' '}
          <span className="text-amber-400">chasing and re-typing.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed mb-8">
          Custom AI systems that chase the documents, answer the status calls, and onboard
          clients without triple entry — built inside your firm&apos;s accounts, live before
          January.
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
            Where accounting firms <span className="gradient-text">bleed hours</span>
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
            What Dave builds for <span className="gradient-text">accounting firms</span>
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
            Build it in the off-season. Feel it in April.
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Thirty minutes, no pitch. Walk me through how documents and status calls work at
            your firm today, and leave with a clear read on where AI pays for itself first.
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
