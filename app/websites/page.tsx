import type { Metadata } from 'next'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Hammer,
  MessageCircle,
  Rocket,
  Phone,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { COMPANY_INFO } from '@/lib/constants'

const FIT_CALL_URL = COMPANY_INFO.links.calcom.websiteFit

export const metadata: Metadata = {
  title: 'The $10,000 Website for $1,200 — Built in a Day, Fixed Scope',
  description:
    'The same line items an agency bills ~$10,000 for — custom 5-page design, conversion copy polish, SEO basics, forms, booking, analytics — for $1,200 flat, built in a one-day sprint. For Long Island law firms, accountants, contractors, med spas, dentists, restaurants, and local businesses.',
  alternates: { canonical: 'https://ilift.com/websites' },
  openGraph: {
    title: 'The $10,000 Website for $1,200 — AI Dave (ILift)',
    description:
      'Agency-grade website, $1,200 flat, built in a day. By the guy who builds AI systems for Long Island firms.',
    url: 'https://ilift.com/websites',
    type: 'website',
  },
}

/* Itemized agency-vs-here anchor. "Typical agency rates" keeps the $10k claim honest. */
const ANCHOR_ROWS = [
  { item: 'Discovery & positioning workshop', agency: '$1,500' },
  { item: 'Custom design, 5 pages', agency: '$3,000' },
  { item: 'Conversion copywriting polish', agency: '$1,500' },
  { item: 'Development, responsive build', agency: '$2,500' },
  { item: 'Speed & mobile optimization', agency: '$750' },
  { item: 'SEO foundations (schema, sitemap, metadata)', agency: '$500' },
  { item: 'Analytics + lead tracking install', agency: '$250' },
]

const INCLUDED = [
  '5 pages — Home, Services, About, Contact, plus one of your choice',
  'Custom design (not a template skin) matched to your brand',
  'Conversion polish of your copy — clear offer, clear next step',
  'Mobile-responsive build that passes Core Web Vitals',
  'Contact form wired to your email',
  'Cal.com / Calendly booking embed',
  'Google Business Profile link-up',
  'On-page SEO: metadata, JSON-LD structured data, sitemap',
  'Analytics installed and verified',
  'One revision round',
  'Built in a one-day sprint — live within days, guaranteed inside 14',
  '30 days of bug fixes after launch',
]

const ADD_ONS = [
  'Extra pages beyond the five',
  'Copywriting from scratch',
  'Logo / brand identity design',
  'Blog or CMS setup',
  'E-commerce',
  'CRM & custom integrations',
  'Additional revision rounds',
  'Ongoing care plan',
]

const FAQS = [
  {
    q: 'Why is it $1,200 if agencies charge $10,000?',
    a: 'No agency overhead: no project-manager layer, no outsourced dev shop, no six-week discovery theater. Dave builds with the same AI-assisted workflows he sells to clients, so the build happens in a one-day sprint instead of months. And the scope is fixed, which removes the number-one driver of agency invoices: change-order churn.',
  },
  {
    q: 'Really — built in a day?',
    a: 'Yes. Once your content is in, the design-and-build sprint happens in one focused day and you get a live preview link that evening — not a PDF mockup in three weeks. Your revision round and the domain/launch step add a few days on top, and the whole thing is guaranteed live inside 14 days.',
  },
  {
    q: "What's the catch?",
    a: 'The scope is genuinely fixed. Five pages, one revision round, the included list above — nothing less, nothing more. Anything outside the list is a paid add-on, quoted flat before any work starts. If you need something fully bespoke, the custom tier starts at $3,500.',
  },
  {
    q: 'Who is this for?',
    a: 'Long Island businesses that need a real site fast: law firms, accountants, contractors, med spas, dentists, restaurants, local shops, and service businesses. If your current site embarrasses you or does not bring in work, this is the fix.',
  },
  {
    q: 'What do you need from me?',
    a: 'Your logo (if you have one), brand colors or a site whose look you like, your services list, and your existing copy or bullet points — the build includes polishing what you provide, not writing from a blank page. One 15-minute kickoff call and a shared folder, and your build day gets scheduled.',
  },
  {
    q: 'What if I need more than 5 pages, or e-commerce?',
    a: 'Extra pages are a flat per-page add-on. E-commerce, booking systems, and custom integrations are quoted separately — or handled in the custom tier (from $3,500) if the whole project is bigger than the fixed scope.',
  },
  {
    q: 'Do I own the site?',
    a: 'Completely. Code, domain, hosting, and analytics all live in accounts you own, handed over at launch. No hostage-taking, no proprietary builder lock-in.',
  },
  {
    q: 'What happens after launch?',
    a: 'Thirty days of bug fixes are included. After that, an optional care plan covers updates, backups, and small changes — or you take the keys and run it yourself.',
  },
  {
    q: 'Can the site answer its own phone?',
    a: "That's the real point. Dave's core business is custom AI systems — AI receptionists that answer and book 24/7, intake agents, document automation. The $1,200 website is step one; most clients add an AI system once the site is live. Try the AI assistant on this page to see what that feels like.",
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

export default function WebsitesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AnchorTable />
      <Scope />
      <HowItWorks />
      <Faq />
      <Ascension />
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
            $1,200 flat · Fixed scope · Built in a day
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight mb-6">
          The $10,000 website. <span className="text-amber-400">Yours for $1,200.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed mb-4">
          Not a template. A real, custom, mobile-ready site with copy, SEO basics, forms,
          booking, and analytics &mdash; built in a one-day sprint by the guy who builds AI
          systems for Long Island firms.
        </p>
        <p className="text-base text-gray-400 mb-8">
          A few build slots open each month &mdash; booking a fit call locks the $1,200 rate.
        </p>
        <Button href={FIT_CALL_URL} variant="accent" size="lg">
          <Calendar size={20} />
          Book a 15-min fit call
          <ArrowRight size={20} />
        </Button>
      </div>
    </section>
  )
}

function AnchorTable() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-3 text-center">
            What an agency itemizes. <span className="gradient-text">What you pay here.</span>
          </h2>
          <p className="text-gray-500 text-center mb-10 text-sm">
            Line items at typical agency rates for a custom small-business site.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4 font-semibold">Line item</th>
                  <th className="px-6 py-4 font-semibold text-right">Agency</th>
                  <th className="px-6 py-4 font-semibold text-right">Here</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ANCHOR_ROWS.map((row) => (
                  <tr key={row.item}>
                    <td className="px-6 py-4 text-gray-800">{row.item}</td>
                    <td className="px-6 py-4 text-right text-gray-500 line-through decoration-gray-300">
                      {row.agency}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-primary-700">
                      Included
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-900 text-white">
                  <td className="px-6 py-5 font-bold text-lg">Total</td>
                  <td className="px-6 py-5 text-right font-bold text-lg text-gray-400 line-through decoration-gray-500">
                    ~$10,000
                  </td>
                  <td className="px-6 py-5 text-right font-black text-2xl text-amber-400">
                    $1,200 flat
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Scope() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <ScrollReveal className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            The scope is <span className="gradient-text">fixed</span>. That&apos;s the whole trick.
          </h2>
          <p className="text-lg text-gray-600">
            You know exactly what you get and exactly what it costs. Everything outside the
            list is a paid add-on, quoted flat before any work starts &mdash; no surprise
            invoices, ever.
          </p>
        </ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="h-full bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 size={22} className="text-primary-600" />
                Included in the $1,200
              </h3>
              <ul className="space-y-3">
                {INCLUDED.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="h-full bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <XCircle size={22} className="text-gray-400" />
                Paid add-ons (quoted flat, up front)
              </h3>
              <ul className="space-y-3">
                {ADD_ONS.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <XCircle size={18} className="text-gray-300 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{line}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-6">
                Bigger project? The fully custom tier &mdash;{' '}
                <span className="font-semibold text-gray-700">Custom Site That Sells, from $3,500</span>{' '}
                &mdash; drops the fixed scope entirely.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    icon: Phone,
    title: '15-min fit call',
    body: 'We confirm the fixed scope fits what you need — and lock your $1,200 rate. If it is not a fit, you hear that on the call. No hard sell.',
  },
  {
    icon: FileText,
    title: 'Invoice + intake',
    body: 'You get a Stripe payment link after the call. Once paid, a short intake form and a shared folder collect your content, and your build day goes on the calendar.',
  },
  {
    icon: Hammer,
    title: 'The one-day build sprint',
    body: 'Design and build happen in a single focused day. You get a live preview link that evening — not a PDF mockup in three weeks.',
  },
  {
    icon: MessageCircle,
    title: 'One revision round',
    body: 'You gather all feedback in one pass, we apply it in one pass. That single round is what keeps the price at $1,200.',
  },
  {
    icon: Rocket,
    title: 'Launch + handover',
    body: 'Live on your domain, analytics verified, everything in accounts you own. 30 days of bug fixes included.',
  },
]

function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">
            How it <span className="gradient-text">works</span>
          </h2>
        </ScrollReveal>
        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.05}>
              <div className="flex items-start gap-5 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                  <step.icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">
                    <span className="text-primary-600 mr-2">{i + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
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
            Fair <span className="gradient-text">questions</span>
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

function Ascension() {
  return (
    <section className="relative overflow-hidden gradient-bg py-20 md:py-28">
      <div className="container-custom relative z-10 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 max-w-3xl mx-auto leading-tight">
            The website is step one.
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            The same firms that start with the $1,200 site add an AI receptionist that answers
            24/7, intake agents, and document automation next. That&apos;s Dave&apos;s real
            specialty &mdash; the website just gets you in the door for less than a month of
            agency retainer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={FIT_CALL_URL} variant="accent" size="lg" className="w-full sm:w-auto">
              <Calendar size={20} />
              Book a 15-min fit call
              <ArrowRight size={20} />
            </Button>
            <Button href="/ai-receptionist" variant="secondary" size="lg" className="w-full sm:w-auto">
              See the AI Receptionist
              <ArrowRight size={20} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
