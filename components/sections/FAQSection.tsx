'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'Who is Dave Gakshteyn (AI Dave)?',
    answer:
      'Dave Gakshteyn is the AI consultant and founder behind AI Dave (ILift). He has shipped 100+ AI automation implementations across 8 verticals (medspas, plumbers, dentists, law firms, retail, fitness, real estate, landscaping) and is based in East Meadow, NY (Long Island) — serving the entire New York metro area.',
  },
  {
    question: 'Where in New York do you serve clients?',
    answer:
      'I serve clients throughout Long Island (Nassau and Suffolk Counties), New York City (Manhattan, Brooklyn, Queens, Bronx, Staten Island), and the broader New York metro area. Remote engagements available across the U.S.',
  },
  {
    question: 'What AI consulting services do you offer?',
    answer:
      'Four engagement types: (1) AI Strategy Session — $297, 60-min 1-on-1 with a custom 90-day roadmap; (2) AI Mastery Intensive — $997, 5-hour intensive with hands-on app build; (3) Done-For-You — $3,600/year, full automation suite; (4) Embedded AI Growth Partner — long-term hands-on partnership for mid-market & enterprise teams (3 to 12+ months, by application).',
  },
  {
    question: 'How much does an AI consultant in New York cost?',
    answer:
      'Pricing depends on engagement type. A single AI Strategy Session is $297 (refunded if not a fit). A full-day Mastery Intensive is $997. Done-For-You annual automation is $3,600/year. Long-term Embedded Growth Partner engagements for mid-market & enterprise are by application and depend on scope, team size, and timeframe.',
  },
  {
    question: "What's the difference between an AI consultant and a fractional CTO?",
    answer:
      'An AI consultant typically advises and ships specific AI projects. A fractional CTO (or fractional AI officer) is embedded in your team part- or full-time, owning AI strategy AND execution across multiple initiatives. I offer both modes — short-term consulting via the Strategy Session and Mastery Intensive, or long-term fractional / embedded work via the Embedded AI Growth Partner engagement.',
  },
  {
    question: 'Do you work with mid-market or enterprise companies?',
    answer:
      'Yes. The Embedded AI Growth Partner engagement is built specifically for mid-market (50–1,000 employees) and enterprise teams that need an experienced AI operator inside their team for 3 to 12+ months — training, custom builds, AI strategy, fractional embed.',
  },
  {
    question: 'What AI tools, platforms, and stacks do you specialize in?',
    answer:
      'Production AI implementations using OpenAI, Anthropic Claude, Vercel, Supabase, Stripe, Next.js, Cal.com, Resend, Trigger.dev, WordPress + WooCommerce, plus voice agents (LeadConnector, Retell), CRM automation, marketing automation, and custom app builds. Same stack I use in my own products (OpenWPAgent — live SaaS, Tennis Buddy — beta).',
  },
  {
    question: 'How fast can you implement an AI solution for my business?',
    answer:
      'A 90-day roadmap typically ships first-value within 30 days. Single-feature builds (voice agent, lead capture, CRM automation) usually ship in 1–2 weeks. Mid-market embed engagements ramp in the first 30 days, with measurable outcomes by day 60. I prioritize boring tech that works over slick demos.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <ScrollReveal animation="fadeInUp" className="text-center mb-12">
          <span className="inline-block text-primary-600 font-bold text-sm uppercase tracking-widest mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            <span className="gradient-text">AI Consultant</span> Questions, Answered
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Common questions about AI consulting in Long Island, NYC, and the New York metro area.
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <ScrollReveal key={i} animation="fadeInUp" delay={i * 0.04}>
                <div
                  className={`rounded-xl border transition-all ${
                    isOpen
                      ? 'border-primary-200 bg-primary-50/40 shadow-md'
                      : 'border-gray-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-gray-900 text-base sm:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 text-primary-600 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 text-gray-700 leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* JSON-LD FAQPage schema — AI / search engine discovery */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
