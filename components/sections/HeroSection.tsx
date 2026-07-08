'use client'

import { Calendar, MessageCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO } from '@/lib/constants'
import Image from 'next/image'

export function HeroSection() {
  const openAgent = () => {
    window.dispatchEvent(new CustomEvent('ilift:openDaveAgent'))
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-gray-950 pt-32 lg:pt-20"
    >
      {/* Kai-generated looping background — poster covers reduced-motion + slow connections */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          className="w-full h-full object-cover opacity-70 motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/hero-professional-bg.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero-professional-bg.webm" type="video/webm" />
          <source src="/videos/hero-professional-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/35" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left pt-8 lg:pt-0"
          >
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 mb-6">
              <span className="text-amber-400 font-semibold text-sm">
                Long Island · Law &amp; Accounting
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight text-white">
              Custom AI systems for Long Island{' '}
              <span className="text-amber-400">law and accounting firms</span>.
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              I build custom AI apps and agents that run the busywork inside your firm —
              intake, documents, follow-up — so your team bills hours instead of pushing paper.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Button
                href={COMPANY_INFO.links.calcom.audit}
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Calendar size={20} />
                Book a discovery call
                <ArrowRight size={20} />
              </Button>
              <Button onClick={openAgent} variant="secondary" size="lg" className="w-full sm:w-auto">
                <MessageCircle size={20} />
                Talk to the AI on this page &rarr;
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-gray-400 font-medium tracking-wide"
            >
              100+ systems shipped &middot; 8 industries &middot; Built in East Meadow, NY
            </motion.p>
          </motion.div>

          {/* Dave's headshot — restrained, real face builds local trust */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[380px] mx-auto">
              <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-white/20 shadow-2xl">
                <Image
                  src="/images/dave-headshot.jpeg"
                  alt="Dave Gakshteyn, Founder of ILift"
                  fill
                  sizes="(min-width: 1024px) 380px, 0px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl px-4 py-2 whitespace-nowrap">
                <span className="text-sm font-bold text-gray-900">Dave Gakshteyn</span>
                <span className="text-sm text-gray-500"> · Founder, ILift</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
