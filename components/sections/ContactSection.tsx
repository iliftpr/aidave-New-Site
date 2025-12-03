'use client'

import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO } from '@/lib/constants'

export function ContactSection() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      detail: COMPANY_INFO.phone,
      link: `tel:${COMPANY_INFO.phone}`,
      description: 'Mon-Fri, 9AM-6PM EST',
    },
    {
      icon: Mail,
      title: 'Email Us',
      detail: COMPANY_INFO.email,
      link: `mailto:${COMPANY_INFO.email}`,
      description: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      detail: COMPANY_INFO.address.full,
      link: `https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address.full)}`,
      description: 'East Meadow, NY',
    },
  ]

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Let's <span className="gradient-text">Get Started</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your business with AI? Get in touch and let's discuss how we can help you grow.
          </p>
        </ScrollReveal>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <ScrollReveal key={index} animation="scaleIn" delay={index * 0.1}>
              <a
                href={method.link}
                target={method.icon === MapPin ? '_blank' : undefined}
                rel={method.icon === MapPin ? 'noopener noreferrer' : undefined}
                className="block bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">{method.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{method.detail}</p>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Section */}
        <ScrollReveal animation="fadeInUp">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white shadow-2xl">
            <Clock className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold font-heading mb-4">
              Book Your Free Strategy Call
            </h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get a personalized roadmap showing exactly how AI can increase your revenue in the next 90 days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href={COMPANY_INFO.links.calendly}
                variant="outline"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 border-white"
              >
                Schedule Now
              </Button>
              <Button
                href={`tel:${COMPANY_INFO.phone}`}
                variant="secondary"
                size="lg"
                className="bg-white/20 hover:bg-white/30 border-white/50"
              >
                <Phone size={20} />
                Call {COMPANY_INFO.phone}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
