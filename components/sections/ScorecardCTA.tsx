'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ClipboardCheck, Phone, Calendar, BarChart3, MessageSquare } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

const LEVERS = [
  { id: 1, name: 'Intake & Routing', tagline: '24/7 capture, qualify, route', Icon: Phone },
  { id: 2, name: 'Dispatch & Coordination', tagline: 'Right job, right tech, right time', Icon: Calendar },
  { id: 3, name: 'Customer Comms', tagline: 'Confirms, reviews, win-back', Icon: MessageSquare },
  { id: 4, name: 'Cross-Location Reporting', tagline: 'Same-week anomaly alerts', Icon: BarChart3 },
] as const

export function ScorecardCTA() {
  return (
    <section
      id="scorecard-cta"
      className="section-padding relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50"
    >
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <ScrollReveal animation="fadeInUp" className="text-center mb-12">
          <motion.span
            className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ClipboardCheck size={16} />
            The 4-Lever Audit
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
            Where is your ops team <span className="gradient-text">leaking the most</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            12 questions. 5 minutes. The lowest-scoring lever is your first sprint &mdash; one workflow live this quarter, not a 90-day discovery phase.
          </p>
          <p className="text-sm text-gray-500">
            Built for multi-location service businesses, $5M&ndash;$25M revenue. No pitch. No signup wall after.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
          {LEVERS.map((lever, index) => (
            <ScrollReveal key={lever.id} animation="scaleIn" delay={index * 0.08}>
              <motion.div
                className="h-full bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold font-heading gradient-text">{lever.id}</span>
                  <lever.Icon size={18} className="text-primary-600" />
                </div>
                <div className="text-sm font-bold font-heading text-gray-900 mb-1 leading-tight">
                  {lever.name}
                </div>
                <div className="text-xs text-gray-500 leading-snug">{lever.tagline}</div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fadeInUp" delay={0.4} className="text-center">
          <Link
            href="/scorecard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all"
          >
            Take the free 4-Lever Audit
            <ArrowRight size={20} />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Free &middot; 12 questions &middot; Scored results emailed to you
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
