'use client'

import { TypeAnimation } from 'react-type-animation'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO, HERO_TYPING_PHRASES } from '@/lib/constants'
import Image from 'next/image'

export function HeroSection() {
  // Longer pause (3500ms) between phrases for better readability
  const typingSequence = HERO_TYPING_PHRASES.flatMap((phrase) => [phrase, 3500])

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-primary-100 via-secondary-50 to-secondary-200 hero-grid-pattern pt-32 lg:pt-20"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-400/40 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/40 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-primary-300/25 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left pt-8 lg:pt-0"
          >
            <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-100 shadow-sm mb-6">
              <span className="text-primary-600 font-semibold text-sm">Smart AI Website Design by AI Dave</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
              <span className="block text-gray-900">We Build</span>
              <TypeAnimation
                sequence={typingSequence}
                wrapper="span"
                speed={20}
                className="gradient-text underline decoration-primary-500 decoration-4 underline-offset-8"
                repeat={Infinity}
                cursor={true}
              />
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              AI consultant for <strong className="text-gray-800 font-semibold">Long Island, NYC, and the New York metro</strong>. 100+ AI automation implementations across 8 verticals — for businesses that actually want to ship.
              Book a strategy session, get a 90-day plan, or work directly with Dave.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Button href={COMPANY_INFO.links.calcom.strategy} variant="accent" size="lg" className="w-full sm:w-auto">
                <Calendar size={20} />
                Book $297 Strategy Session
                <ArrowRight size={20} />
              </Button>
              <Button href={COMPANY_INFO.links.calcom.audit} variant="primary" size="lg" className="w-full sm:w-auto">
                <FileText size={20} />
                Free Audit
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white/95 backdrop-blur-md rounded-xl p-6 -mx-2 shadow-lg border border-gray-200"
            >
              {[
                { value: '24/7', label: 'Availability' },
                { value: '+40%', label: 'Leads' },
                { value: '15h+', label: 'Saved/Week' },
                { value: '100+', label: 'Clients' },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-700 text-sm uppercase tracking-wide font-bold">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dave's Headshot — floating + glowing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <motion.div
              className="relative w-full aspect-square max-w-[500px] mx-auto"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Animated glow halo */}
              <motion.div
                className="absolute -inset-8 rounded-full blur-3xl"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(2,132,199,0.45) 0%, transparent 65%)',
                    'radial-gradient(circle, rgba(147,51,234,0.45) 0%, transparent 65%)',
                    'radial-gradient(circle, rgba(2,132,199,0.45) 0%, transparent 65%)',
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Rotating gradient ring */}
              <motion.div
                className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary-500 via-secondary-500 to-primary-500 opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              {/* Headshot */}
              <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
                <Image
                  src="/images/dave-headshot.jpeg"
                  alt="Dave Gakshteyn, Founder of ILift"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating stat: Clients */}
              <motion.div
                className="absolute -top-4 -right-4 lg:-right-10 bg-white rounded-2xl shadow-xl px-4 py-3 border border-primary-100"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Clients</div>
                <div className="text-2xl font-black gradient-text">100+</div>
              </motion.div>
              {/* Floating stat: Verticals */}
              <motion.div
                className="absolute -bottom-4 -left-4 lg:-left-10 bg-white rounded-2xl shadow-xl px-4 py-3 border border-secondary-100"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              >
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Verticals</div>
                <div className="text-2xl font-black gradient-text">8</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
