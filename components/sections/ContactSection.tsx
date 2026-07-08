'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Button } from '@/components/ui/Button'
import {
  COMPANY_INFO,
  SERVICE_TYPES,
  SERVICE_LABELS,
  ENGAGEMENT_TYPES,
  ENGAGEMENT_TYPE_LABELS,
  TIMEFRAME_OPTIONS,
} from '@/lib/constants'
import type { ServiceType, EngagementType, EngagementTimeframe } from '@/types'
import { trackLead } from '@/lib/tracking'

export function ContactSection() {
  const [formData, setFormData] = useState<{
    name: string
    email: string
    phone: string
    message: string
    service: ServiceType
    company: string
    engagementTypes: EngagementType[]
    timeframe: '' | EngagementTimeframe
    website: string
  }>({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: 'general',
    company: '',
    engagementTypes: [],
    timeframe: '',
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-select service from query string (?service=mastery)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('service')
    if (requested && (SERVICE_TYPES as readonly string[]).includes(requested)) {
      setFormData((prev) => ({ ...prev, service: requested as ServiceType }))
    }
  }, [])

  // Listen for tile clicks that want to prefill the form (e.g. Growth Partner CTA)
  useEffect(() => {
    if (typeof window === 'undefined') return
    let timerId: ReturnType<typeof setTimeout> | undefined
    const handlePrefill = (e: Event) => {
      const detail = (e as CustomEvent).detail as { service?: ServiceType } | undefined
      const requested = detail?.service
      if (requested && (SERVICE_TYPES as readonly string[]).includes(requested)) {
        setFormData((prev) => ({ ...prev, service: requested as ServiceType }))
        timerId = setTimeout(() => {
          const el = document.getElementById('company')
          if (el instanceof HTMLInputElement) el.focus()
        }, 250)
      }
    }
    window.addEventListener('ilift:contactPrefill', handlePrefill as EventListener)
    return () => {
      window.removeEventListener('ilift:contactPrefill', handlePrefill as EventListener)
      if (timerId !== undefined) clearTimeout(timerId)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.service === 'fractional') {
      if (!formData.company.trim()) {
        setError('Please tell us your company name.')
        return
      }
      if (formData.engagementTypes.length === 0) {
        setError('Pick at least one engagement type.')
        return
      }
      if (!formData.timeframe) {
        setError('Pick a timeframe.')
        return
      }
    }

    setIsSubmitting(true)
    setError(null)

    const payload: Record<string, unknown> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      service: formData.service,
      website: formData.website,
    }
    if (formData.service === 'fractional') {
      payload.company = formData.company
      payload.engagementTypes = formData.engagementTypes
      payload.timeframe = formData.timeframe
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }

      trackLead('contact_form')
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        service: 'general',
        company: '',
        engagementTypes: [],
        timeframe: '',
        website: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleEngagementType = (t: EngagementType) => {
    setFormData((prev) => ({
      ...prev,
      engagementTypes: prev.engagementTypes.includes(t)
        ? prev.engagementTypes.filter((x) => x !== t)
        : [...prev.engagementTypes, t],
    }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Clear stale error when the user pivots to a different service path
    if (e.target.name === 'service' && error) setError(null)
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-3">
            Serving <strong className="text-gray-700 font-semibold">Long Island, NYC, and the New York metro</strong> · Remote engagements available across the U.S.
          </p>
        </ScrollReveal>

        {/* Two Column Layout: Form + Contact Methods */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Quick Contact Form */}
          <ScrollReveal animation="fadeInUp">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold font-heading mb-2">Send Us a Message</h3>
              <p className="text-gray-600 mb-6">Get a response within 24 hours</p>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      What are you interested in? *
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                    >
                      {SERVICE_TYPES.map((s) => (
                        <option key={s} value={s}>{SERVICE_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>

                  {formData.service === 'fractional' && (
                    <div className="space-y-4 p-4 bg-primary-50/60 border border-primary-100 rounded-lg">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company *
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                          placeholder="Acme Robotics"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Engagement type * <span className="text-gray-500 font-normal">(pick one or more)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {ENGAGEMENT_TYPES.map((t) => {
                            const active = formData.engagementTypes.includes(t)
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => toggleEngagementType(t)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                  active
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                                }`}
                                aria-pressed={active}
                              >
                                {ENGAGEMENT_TYPE_LABELS[t]}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe *</label>
                        <div className="grid grid-cols-2 gap-2">
                          {TIMEFRAME_OPTIONS.map((opt) => {
                            const active = formData.timeframe === opt.value
                            return (
                              <label
                                key={opt.value}
                                className={`flex items-center justify-center px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                                  active
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="timeframe"
                                  value={opt.value}
                                  checked={active}
                                  onChange={() =>
                                    setFormData((prev) => ({ ...prev, timeframe: opt.value }))
                                  }
                                  className="sr-only"
                                />
                                <span className="text-sm font-medium">{opt.label}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      How Can We Help? *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder={
                        formData.service === 'fractional'
                          ? "What's the outcome we'd celebrate in 6 months? What's blocking you today?"
                          : 'Tell us about your project or ask a question...'
                      }
                    />
                  </div>
                  {/* Honeypot — non-semantic name so browser autofill heuristics ignore it */}
                  <input
                    type="text"
                    name="ilift_check"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, website: e.target.value }))
                    }
                    className="absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none"
                    aria-hidden="true"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gradient-bg text-white font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Contact Methods */}
          <div className="flex flex-col gap-6">
            {contactMethods.map((method, index) => (
              <ScrollReveal key={index} animation="scaleIn" delay={index * 0.1}>
                <a
                  href={method.link}
                  target={method.icon === MapPin ? '_blank' : undefined}
                  rel={method.icon === MapPin ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading mb-1">{method.title}</h3>
                    <p className="text-gray-900 font-medium">{method.detail}</p>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <ScrollReveal animation="fadeInUp">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white shadow-2xl">
            <Clock className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold font-heading mb-4">
              Book Your Strategy Session
            </h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              60 minutes 1-on-1 with Dave. Walk away with a 90-day AI roadmap tailored to your business —
              refunded if we agree it's not a fit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href={COMPANY_INFO.links.calcom.strategy}
                variant="outline"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 border-white"
              >
                Book $297 Session
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
