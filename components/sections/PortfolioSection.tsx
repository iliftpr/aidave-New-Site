'use client'

import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { PortfolioCard } from '@/components/ui/PortfolioCard'
import { PORTFOLIO } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO } from '@/lib/constants'

export function PortfolioSection() {
  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Our <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how we've transformed businesses across industries with stunning, high-converting websites and AI automation.
          </p>
        </ScrollReveal>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {PORTFOLIO.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal animation="fadeInUp" className="text-center">
          <p className="text-gray-600 mb-6">
            Ready to see what we can do for your business?
          </p>
          <Button href={COMPANY_INFO.links.calendly} size="lg">
            Schedule Your Strategy Call
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
