'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { OFFERS } from '@/lib/constants'
import type { Offer } from '@/types'

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCTA = async () => {
    if (offer.ctaKind === 'stripe') {
      setIsLoading(true)
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID }),
        })
        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        } else if (data.error) {
          alert(`Checkout error: ${data.error}`)
        }
      } catch {
        alert('Failed to start checkout. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else if (offer.ctaKind === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else if (offer.ctaKind === 'fractional') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('ilift:contactPrefill', { detail: { service: 'fractional' } })
        )
      }
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else if (offer.ctaKind === 'calcom' && offer.ctaHref) {
      window.open(offer.ctaHref, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <ScrollReveal animation="scaleIn" delay={index * 0.15}>
      {/* Wrapper holds both the glow halo (below) and the card itself; pt-4 leaves room for the ribbon */}
      <div className="group relative h-full pt-4">
        {/* Hover glow halo — sits behind the card, fades in on hover */}
        <div
          className={`pointer-events-none absolute -inset-1 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
            offer.featured
              ? 'bg-gradient-to-br from-amber-400/60 via-primary-500/50 to-secondary-500/60'
              : 'bg-gradient-to-br from-primary-400/40 via-secondary-400/30 to-primary-400/40'
          }`}
          aria-hidden="true"
        />

        {/* Floating "Most Popular" ribbon — centered above the card, no title overlap */}
        {offer.featured && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={14} />
            Most Popular
          </motion.div>
        )}

        <motion.div
          className={`relative h-full rounded-3xl overflow-hidden transition-shadow duration-300 ${
            offer.featured
              ? 'bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white shadow-2xl ring-4 ring-amber-400/40'
              : 'bg-white text-gray-900 shadow-xl ring-1 ring-gray-200'
          }`}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative glows inside the card (featured only) */}
          {offer.featured && (
            <>
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
            <h3 className="text-2xl font-bold font-heading mb-3">{offer.name}</h3>

          <div className="mb-6 pb-6 border-b border-current/20">
            {!offer.noPrice && (
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-black font-heading tracking-tight">{offer.price}</span>
                <span className={`text-sm ${offer.featured ? 'text-white/70' : 'text-gray-500'}`}>
                  {offer.priceDetail}
                </span>
              </div>
            )}
            <p className={`text-sm leading-relaxed ${offer.featured ? 'text-white/90' : 'text-gray-600'}`}>
              {offer.tagline}
            </p>
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {offer.bullets.map((bullet, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
              >
                <Check
                  size={18}
                  className={`flex-shrink-0 mt-0.5 ${offer.featured ? 'text-amber-300' : 'text-primary-600'}`}
                />
                <span className={`text-sm ${offer.featured ? 'text-white/95' : 'text-gray-700'}`}>
                  {bullet}
                </span>
              </motion.li>
            ))}
          </ul>

          <motion.button
            onClick={handleCTA}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait ${
              offer.featured
                ? 'bg-white text-primary-700 hover:bg-amber-400 hover:text-amber-950 shadow-xl shadow-black/20'
                : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 shadow-xl shadow-primary-500/30'
            }`}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? 'Loading...' : offer.ctaLabel}
            {!isLoading && <ArrowRight size={18} />}
          </motion.button>
          {offer.secondaryCta && offer.secondaryCta.href && (
            <a
              href={offer.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 block text-center text-sm font-medium underline-offset-4 hover:underline transition-colors ${
                offer.featured ? 'text-white/80 hover:text-white' : 'text-primary-600 hover:text-primary-700'
              }`}
            >
              {offer.secondaryCta.label}
            </a>
          )}
        </div>
      </motion.div>
      </div>
    </ScrollReveal>
  )
}

export function WorkWithDave() {
  return (
    <section
      id="work-with-dave"
      className="section-padding relative overflow-hidden bg-gradient-to-b from-white to-slate-50"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <motion.span
            className="inline-block text-primary-600 font-bold text-sm uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Work with Dave
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Three ways to <span className="gradient-text">level up</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you need a quick roadmap, hands-on training, or a fully-managed AI stack —
            pick your level.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {OFFERS.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
