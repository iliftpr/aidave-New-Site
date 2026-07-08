'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Phone,
  MessageSquare,
  Calendar,
  Star,
  Users,
  Zap,
  Code2,
  Shield,
  Headphones,
  ArrowRight,
  Sparkles,
  Compass,
  BookOpen,
  Briefcase,
  AlertCircle,
} from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO } from '@/lib/constants'

interface PricingTier {
  name: string
  description: string
  price: string
  priceDetail: string
  noPrice?: boolean
  availabilityChip?: string
  benefits: {
    icon: React.ElementType
    title: string
    description: string
    variant?: 'warning'
  }[]
  cta: string
  ctaAction: 'stripe' | 'contact' | 'fractional'
  secondaryCta?: {
    label: string
    href: string
  }
  featured?: boolean
  badge?: string
}

const STRIPE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || ''

const pricingTiers: PricingTier[] = [
  {
    name: 'Small Business',
    description: 'Everything you need to automate your business and never miss an opportunity',
    price: '$3,600',
    priceDetail: '/year',
    badge: 'Most Popular',
    featured: true,
    benefits: [
      {
        icon: Phone,
        title: 'Never Miss a Lead Again',
        description: 'AI answers calls 24/7, captures every opportunity even at 3am',
      },
      {
        icon: Zap,
        title: 'Automated Follow-Up That Converts',
        description: 'Smart SMS & email sequences that nurture leads to customers',
      },
      {
        icon: Calendar,
        title: 'AI Voice Agent Booking',
        description: 'Natural conversations that schedule appointments instantly',
      },
      {
        icon: MessageSquare,
        title: 'Unified Inbox for All Channels',
        description: 'Messages, calls, texts, and social DMs in one place',
      },
      {
        icon: Star,
        title: 'Review & Reputation Automation',
        description: 'Get more 5-star reviews on autopilot, boost your rankings',
      },
      {
        icon: Users,
        title: 'Complete CRM & Pipeline',
        description: 'Track every customer journey from first touch to closed deal',
      },
    ],
    cta: 'Get Started Now',
    ctaAction: 'stripe',
  },
  {
    name: 'Your Embedded AI Growth Partner',
    description: 'Long-term, hands-on partnership for mid-market & enterprise teams. Training, builds, AI strategy — 3 to 12+ months.',
    price: '',
    priceDetail: '',
    noPrice: true,
    availabilityChip: 'By application · Booking Q3 2026',
    benefits: [
      {
        icon: Compass,
        title: 'AI Strategy + 90-Day Roadmap',
        description: 'Built jointly — not a deck, a real plan we ship against together.',
      },
      {
        icon: Code2,
        title: 'Custom App Builds',
        description: 'Next.js, Supabase, Stripe, AI APIs. Same stack as OpenWPAgent and Tennis Buddy.',
      },
      {
        icon: BookOpen,
        title: 'Team Training + AI Playbooks',
        description: 'Your team leaves knowing what to do without me in the room.',
      },
      {
        icon: Briefcase,
        title: 'Part-Time or Full-Time Embed',
        description: 'Fractional CTO, AI lead, or hands-on builder — depending on what you need.',
      },
      {
        icon: AlertCircle,
        title: 'Built for mid-market & enterprise',
        description: "If you're a single-location small business or want a short demo, the Strategy Session above is the right starting point — same Dave, less commitment.",
        variant: 'warning',
      },
    ],
    cta: 'Apply for a Conversation',
    ctaAction: 'fractional',
    secondaryCta: {
      label: 'Or grab a 45-min intro on Cal.com →',
      href: COMPANY_INFO.links.calcom.engagement,
    },
  },
]

function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (tier.ctaAction === 'stripe') {
      setIsLoading(true)
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: STRIPE_PRICE_ID }),
        })
        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        } else if (data.error) {
          alert(`Checkout error: ${data.error}`)
        }
      } catch (error) {
        console.error('Checkout error:', error)
        alert('Failed to start checkout. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else if (tier.ctaAction === 'fractional') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('ilift:contactPrefill', { detail: { service: 'fractional' } })
        )
      }
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <ScrollReveal animation="scaleIn" delay={index * 0.15}>
      <motion.div
        className={`relative h-full rounded-3xl overflow-hidden ${
          tier.featured
            ? 'bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700'
            : 'bg-slate-900'
        }`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {tier.featured ? (
            <>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full" />
            </>
          ) : (
            <>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
            </>
          )}
        </div>

        {/* Badge */}
        {tier.badge && (
          <div className="absolute top-6 right-6 z-10">
            <motion.div
              className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg"
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              <Sparkles size={14} />
              {tier.badge}
            </motion.div>
          </div>
        )}

        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
          {/* Header */}
          <div className="mb-8">
            <h3 className={`text-2xl md:text-3xl font-bold font-heading mb-3 ${
              tier.featured ? 'text-white' : 'text-white'
            }`}>
              {tier.name}
            </h3>
            <p className={`text-lg ${
              tier.featured ? 'text-white/80' : 'text-slate-400'
            }`}>
              {tier.description}
            </p>
          </div>

          {/* Price block — replaced by availability chip when noPrice */}
          {tier.noPrice ? (
            tier.availabilityChip && (
              <div className="mb-8 pb-8 border-b border-white/20">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={12} />
                  {tier.availabilityChip}
                </span>
              </div>
            )
          ) : (
            <div className="mb-8 pb-8 border-b border-white/20">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl md:text-6xl font-black font-heading tracking-tight ${
                  tier.featured ? 'text-white' : 'text-white'
                }`}>
                  {tier.price}
                </span>
                <span className={`text-xl ${
                  tier.featured ? 'text-white/70' : 'text-slate-500'
                }`}>
                  {tier.priceDetail}
                </span>
              </div>
              {tier.featured && (
                <p className="mt-2 text-white/60 text-sm">
                  That's only $300/month for complete business automation
                </p>
              )}
            </div>
          )}

          {/* Benefits */}
          <div className="flex-grow mb-8">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-6 ${
              tier.featured ? 'text-white/60' : 'text-slate-500'
            }`}>
              What You Get
            </h4>
            <ul className="space-y-5">
              {tier.benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  viewport={{ once: true }}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    benefit.variant === 'warning'
                      ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40'
                      : tier.featured
                        ? 'bg-white/20 text-white'
                        : 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                  }`}>
                    <benefit.icon size={20} />
                  </div>
                  <div>
                    <h5 className={`font-bold mb-0.5 ${
                      benefit.variant === 'warning' ? 'text-amber-300' : 'text-white'
                    }`}>
                      {benefit.title}
                    </h5>
                    <p className={`text-sm leading-relaxed ${
                      benefit.variant === 'warning'
                        ? 'text-amber-100/80'
                        : tier.featured ? 'text-white/70' : 'text-slate-400'
                    }`}>
                      {benefit.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={handleClick}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait ${
              tier.featured
                ? 'bg-white text-primary-700 hover:bg-amber-400 hover:text-amber-950 shadow-xl shadow-black/20'
                : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-400 hover:to-secondary-400 shadow-xl shadow-primary-500/30'
            }`}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? 'Processing...' : tier.cta}
            {!isLoading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
          </motion.button>
          {tier.secondaryCta && tier.secondaryCta.href && (
            <a
              href={tier.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 block text-center text-sm font-medium underline-offset-4 hover:underline transition-colors ${
                tier.featured ? 'text-white/80 hover:text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {tier.secondaryCta.label}
            </a>
          )}
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

export function PricingSection() {
  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 hero-grid-pattern opacity-50" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <motion.span
            className="inline-block text-primary-600 font-bold text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Long-Term Engagements
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Done-For-You & <span className="gradient-text">Growth Partner</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For operators who want us running their AI stack end-to-end. Need something shorter?{' '}
            <a href="#work-with-dave" className="text-primary-600 underline hover:text-primary-700 font-semibold">
              Check the Strategy Session ($297) and AI Mastery Intensive ($997) above.
            </a>
          </p>
        </ScrollReveal>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        {/* Trust badges */}
        <ScrollReveal animation="fadeInUp" className="mt-16">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-green-500" />
              <span className="text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={20} className="text-green-500" />
              <span className="text-sm font-medium">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones size={20} className="text-green-500" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
