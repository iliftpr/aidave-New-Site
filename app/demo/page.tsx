import type { Metadata } from 'next'
import Image from 'next/image'
import { Phone, Zap, Calendar, MessageSquare, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'
import { LiveCallDemo } from '@/components/demo/LiveCallDemo'
import { COMPANY_INFO } from '@/lib/constants'

const AUDIT_URL = COMPANY_INFO.links.calcom.audit
const TEL = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

export const metadata: Metadata = {
  title: 'Try a Live AI Receptionist — Never Miss a Call Demo',
  description:
    'Text a live AI receptionist right now and see exactly what your missed callers would experience: instant replies, smart questions, and a booked appointment — 24/7. Built for Long Island service businesses by AI Dave (ILift).',
  alternates: { canonical: 'https://ilift.com/demo' },
  openGraph: {
    title: 'Try a Live AI Receptionist — Never Miss a Call Demo',
    description:
      'Text a live AI receptionist right now. See what your missed callers would get: instant replies and a booked job, 24/7.',
    url: 'https://ilift.com/demo',
    type: 'website',
  },
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHeader />
      <Hero />
      <HowReal />
      <FinalCta />
      <Footer />
    </main>
  )
}

function LandingHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label={COMPANY_INFO.name}>
            <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-primary-500/40">
              <Image src="/images/dave-headshot.jpeg" alt="AI Dave" fill sizes="44px" className="object-cover" priority />
            </div>
            <span className="font-heading text-lg font-extrabold text-gray-900">
              ILift <span className="font-semibold text-gray-400">by AI Dave</span>
            </span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={TEL}
              className="hidden items-center gap-2 font-semibold text-gray-700 hover:text-primary-700 sm:inline-flex"
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

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-br from-primary-100 via-secondary-50 to-secondary-200 hero-grid-pattern pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="container-custom relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <Sparkles size={16} className="text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Live demo — talk to it now</span>
            </div>
            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Text a live <span className="gradient-text">AI receptionist</span> right now
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              This is exactly what your missed callers would get &mdash; an instant, friendly reply
              that answers questions and books the job. Pick a business, then text it like a customer
              would. No sign-up.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={AUDIT_URL} variant="accent" size="lg" className="w-full sm:w-auto">
                <Calendar size={20} />
                Get this for my business
                <ArrowRight size={20} />
              </Button>
              <Button href={TEL} variant="primary" size="lg" className="w-full sm:w-auto">
                <Phone size={20} />
                Call or Text {COMPANY_INFO.phone}
              </Button>
            </div>
          </div>

          {/* Demo */}
          <div className="lg:pl-4">
            <LiveCallDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

function HowReal() {
  const points = [
    {
      icon: Zap,
      title: 'Answers in seconds',
      body: 'The moment a call is missed, the caller gets a real, helpful text back — before they dial your competitor.',
    },
    {
      icon: Calendar,
      title: 'Books the job',
      body: 'It qualifies the lead, checks availability, and drops the appointment straight onto your calendar.',
    },
    {
      icon: MessageSquare,
      title: 'You get the lead',
      body: 'Every conversation lands in your inbox and CRM with the caller’s details — nothing slips through.',
    },
  ]
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-gray-900 md:text-4xl">
            In real life, it does <span className="gradient-text">more than text</span>
          </h2>
          <p className="text-lg text-gray-600">
            The demo above is the conversation. The live system you&apos;d get is wired into your phone,
            calendar, and CRM.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-gray-100 bg-gradient-to-br from-primary-50 to-secondary-50 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl gradient-bg">
                <p.icon size={24} className="text-white" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-gray-900">{p.title}</h3>
              <p className="leading-relaxed text-gray-600">{p.body}</p>
            </div>
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
        <h2 className="mx-auto mb-6 max-w-3xl font-heading text-3xl font-bold leading-tight text-white md:text-5xl">
          Like what you just texted with?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
          Book a free 30-minute audit. We&apos;ll set this up for your business, in your voice, wired to
          your calendar &mdash; usually live within a week or two. No pitch.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button href={AUDIT_URL} variant="accent" size="lg" className="w-full sm:w-auto">
            <Calendar size={20} />
            Book Your Free Audit
            <ArrowRight size={20} />
          </Button>
          <Button href={TEL} variant="secondary" size="lg" className="w-full sm:w-auto">
            <Phone size={20} />
            Call/Text {COMPANY_INFO.phone}
          </Button>
        </div>
      </div>
    </section>
  )
}
