'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { FileText, TrendingUp, Target, Zap } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

export function AuditFormSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Revenue Opportunities',
      description: 'Discover untapped revenue streams',
    },
    {
      icon: Target,
      title: 'Marketing Gaps',
      description: 'Identify where you\'re losing leads',
    },
    {
      icon: Zap,
      title: 'Automation Potential',
      description: 'Find tasks you can automate today',
    },
  ]

  return (
    <section id="audit" className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container-custom">
        {/* Section Header */}
        <ScrollReveal animation="fadeInUp" className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-primary-500/20 rounded-full text-primary-300 text-sm font-medium mb-4">
            Free Website & Business Audit
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Get Your Free <span className="gradient-text">AI Readiness Assessment</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We'll analyze your current website and business processes, then show you exactly how AI automation can increase your revenue.
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={index} animation="scaleIn" delay={index * 0.1}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <benefit.icon className="w-10 h-10 text-primary-400 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal animation="fadeInUp" className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-2">
            {isMounted ? (
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/6YjBqsVd2ttrRvAtvu83"
                style={{
                  width: '100%',
                  height: '800px',
                  border: 'none',
                  borderRadius: '12px',
                }}
                id="inline-6YjBqsVd2ttrRvAtvu83"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Website Application Form"
                data-height="854"
                data-layout-iframe-id="inline-6YjBqsVd2ttrRvAtvu83"
                data-form-id="6YjBqsVd2ttrRvAtvu83"
                title="Website Application Form"
                loading="lazy"
              />
            ) : (
              <div className="h-[800px] w-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
                Loading form...
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Load form script */}
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
    </section>
  )
}
