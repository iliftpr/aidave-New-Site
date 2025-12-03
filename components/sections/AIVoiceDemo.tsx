'use client'

import { Phone, Clock, MessageCircle, CheckCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { motion } from 'framer-motion'

export function AIVoiceDemo() {
  const features = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Never miss a call or lead again, even outside business hours',
    },
    {
      icon: Phone,
      title: 'Appointment Booking',
      description: 'Automatically schedule appointments and sync with your calendar',
    },
    {
      icon: MessageCircle,
      title: 'Customer FAQ',
      description: 'Answer common questions instantly with natural conversation',
    },
    {
      icon: CheckCircle,
      title: 'Lead Qualification',
      description: 'Pre-screen leads so you only talk to serious prospects',
    },
  ]

  return (
    <section id="ai-voice" className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Experience Our <span className="gradient-text">AI Voice Assistant</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our AI voice agents handle calls, book appointments, and qualify leads automatically.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} animation="fadeInUp" delay={index * 0.1}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Demo/Chat Widget Placeholder */}
          <ScrollReveal animation="scaleIn" className="lg:order-first">
            <motion.div
              className="relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 min-h-[500px] flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Chat Widget Active</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  The AI chat widget is loaded on this page. Look for the chat icon in the bottom right corner to interact with our AI assistant!
                </p>
                <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Live & Ready
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-primary-200/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-secondary-200/30 rounded-full blur-2xl"></div>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '10sec', label: 'Average Response Time' },
            { value: '95%', label: 'Customer Satisfaction' },
            { value: '60%', label: 'More Appointments Booked' },
            { value: '$0', label: 'After-Hours Staff Cost' },
          ].map((stat, index) => (
            <ScrollReveal key={index} animation="fadeInUp" delay={index * 0.1}>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
