'use client'

import { TypeAnimation } from 'react-type-animation'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO, HERO_TYPING_PHRASES } from '@/lib/constants'
import Image from 'next/image'

export function HeroSection() {
  const typingSequence = HERO_TYPING_PHRASES.flatMap((phrase) => [phrase, 2000])

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 hero-grid-pattern pt-32 lg:pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
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
              <span className="text-primary-600 font-semibold text-sm">✨ AI-Powered Digital Transformation</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
              <span className="block text-gray-900">We Build</span>
              <TypeAnimation
                sequence={typingSequence}
                wrapper="span"
                speed={50}
                className="gradient-text"
                repeat={Infinity}
              />
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform your business with AI-powered websites, 24/7 voice agents, and marketing
              automation that works while you sleep.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button href={COMPANY_INFO.links.calendly} size="lg" className="w-full sm:w-auto shadow-lg shadow-primary-500/20">
                <Calendar size={20} />
                Schedule Strategy Call
                <ArrowRight size={20} />
              </Button>
              <Button href="#audit" variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                <FileText size={20} />
                Get Free Audit
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-200 pt-8">
              {[
                { value: '24/7', label: 'Availability' },
                { value: '+40%', label: 'Leads' },
                { value: '15h+', label: 'Saved/Week' },
                { value: '100+', label: 'Clients' },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[600px] mx-auto animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl transform scale-90" />
              <Image
                src="/images/hero-illustration.png"
                alt="AI Technology Illustration"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
