import { TrendingUp, Calendar, Star, CheckCircle2 } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { OUTCOMES } from '@/lib/constants'

const ICONS = [TrendingUp, Calendar, Star]

export function OutcomesSection() {
  return (
    <section id="outcomes" className="section-padding bg-gray-900 text-white">
      <div className="container-custom">
        <ScrollReveal className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <CheckCircle2 size={16} className="text-accent-400" />
            <span className="text-sm font-semibold text-gray-200">
              100+ AI automations shipped across 8 verticals
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Real results, names kept <span className="accent-gradient-text">private</span>
          </h2>
          <p className="text-lg text-gray-300">
            No slick decks, no invented testimonials. These outcomes are real and anonymized
            &mdash; client names stay confidential, the way your firm would want yours handled.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {OUTCOMES.map((r, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <ScrollReveal key={r.headline} delay={i * 0.1}>
                <div className="h-full bg-white/5 rounded-2xl p-8 border border-white/10">
                  <Icon size={28} className="text-accent-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2">{r.headline}</h3>
                  <p className="text-gray-300 leading-relaxed">{r.body}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
