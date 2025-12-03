'use client'

import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { SERVICES } from '@/lib/constants'

export function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            <span className="gradient-text">AI-Powered Solutions</span> That Drive Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to automate, scale, and dominate your market with cutting-edge AI technology.
          </p>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
