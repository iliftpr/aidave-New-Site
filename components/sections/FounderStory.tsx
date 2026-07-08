'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO, DAVE_BIO } from '@/lib/constants'

export function FounderStory() {
  return (
    <section
      id="about-dave"
      className="section-padding relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30"
    >
      {/* Decorative blobs */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Floating headshot */}
          <ScrollReveal animation="fadeInUp">
            <div className="relative w-full max-w-[480px] mx-auto">
              <motion.div
                className="relative w-full aspect-square"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Animated gradient halo */}
                <motion.div
                  className="absolute -inset-6 rounded-3xl"
                  animate={{
                    background: [
                      'linear-gradient(135deg, rgba(2,132,199,0.45) 0%, rgba(147,51,234,0.25) 100%)',
                      'linear-gradient(135deg, rgba(147,51,234,0.45) 0%, rgba(2,132,199,0.25) 100%)',
                      'linear-gradient(135deg, rgba(2,132,199,0.45) 0%, rgba(147,51,234,0.25) 100%)',
                    ],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ filter: 'blur(28px)' }}
                />
                {/* Headshot */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden ring-4 ring-white shadow-2xl">
                  <Image
                    src="/images/dave-headshot.jpeg"
                    alt="Dave Gakshteyn, Founder of ILift"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Floating badge: Since */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-primary-100 hidden md:block"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Since</div>
                      <div className="text-lg font-black text-gray-900">2020</div>
                    </div>
                  </div>
                </motion.div>
                {/* Floating badge: Shipped */}
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-secondary-100 hidden md:block"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={18} />
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Shipped</div>
                      <div className="text-lg font-black text-gray-900">100+</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Right: Bio */}
          <ScrollReveal animation="fadeInUp" delay={0.15}>
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-bold uppercase tracking-wider">
                Meet Dave
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                Built by an <span className="gradient-text">operator</span>, not a consultant
              </h2>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                {DAVE_BIO.intro}
              </p>
              {DAVE_BIO.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
              ))}
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Button href={COMPANY_INFO.links.calcom.strategy} variant="accent" size="lg">
                  Book a Strategy Session
                  <ArrowRight size={20} />
                </Button>
                <Button href={COMPANY_INFO.links.calcom.audit} variant="outline" size="lg">
                  Free Audit First
                </Button>
              </div>
              <p className="text-sm text-gray-500 italic pt-2">— {DAVE_BIO.signature}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
