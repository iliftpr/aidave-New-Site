'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/constants'

export function ServicesSection() {
  const reduceMotion = useReducedMotion()

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : 0.12 * i,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  }

  return (
    <section
      id="services"
      className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-gray-950 text-white md:min-h-[80vh]"
      aria-label="What I do as an AI consultant"
    >
      {/* Background video */}
      <div className="absolute inset-0 -z-20">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/dave-headshot.jpeg"
          aria-hidden="true"
        >
          <source src="/videos/ai-growth-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Left-to-right gradient overlay for readability of the left-aligned text block */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/40"
        aria-hidden="true"
      />
      {/* Vertical fade for top + bottom edge polish */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950/60 via-transparent to-gray-950/80"
        aria-hidden="true"
      />
      {/* Subtle blue glow accent */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(59,130,246,0.18)_0%,_transparent_55%)]"
        aria-hidden="true"
      />

      <div className="container-custom relative w-full py-20 md:py-24 lg:py-28">
        <div className="mx-auto max-w-[700px] text-center md:mx-0 md:text-left">
          {/* Trust label */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-300 backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-primary-300" />
            AI Training · Automation · Business Growth
          </motion.div>

          {/* Headline */}
          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-[3.5rem] lg:text-6xl xl:text-[4.25rem]"
          >
            <span className="bg-gradient-to-br from-white via-white to-primary-200 bg-clip-text text-transparent">
              Stop Losing Time to Work{' '}
            </span>
            <span className="bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
              AI Can Do.
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mt-7 text-lg leading-relaxed text-gray-200 sm:text-xl"
          >
            Learn how to use AI to automate workflows, follow up with leads, create better marketing, clean up paperwork, and grow your business without drowning in manual tasks.
          </motion.p>

          {/* Supporting hook */}
          <motion.p
            custom={3}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mt-4 text-base leading-relaxed text-gray-400"
          >
            I help business owners and ambitious professionals turn AI from confusing hype into real systems that save time, drive revenue, and make work easier.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center md:justify-start"
          >
            <motion.a
              href={COMPANY_INFO.links.calcom.strategy}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-400 px-8 py-4 text-base font-semibold text-gray-950 shadow-[0_10px_40px_-12px_rgba(245,158,11,0.6)] transition-shadow hover:shadow-[0_20px_50px_-12px_rgba(245,158,11,0.85)]"
            >
              Book an AI Strategy Call
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="#portfolio"
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
            >
              See What I Can Build
              <ArrowRight size={18} className="opacity-60 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
            </motion.a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            custom={5}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest text-gray-400 md:justify-start"
          >
            <span>100+ Implementations</span>
            <span className="text-gray-700">·</span>
            <span>8 Verticals</span>
            <span className="text-gray-700">·</span>
            <span>Since 2020</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade-out into the next section (which is white bg) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white"
        aria-hidden="true"
      />
    </section>
  )
}
