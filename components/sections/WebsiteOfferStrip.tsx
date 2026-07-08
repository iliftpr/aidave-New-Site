import { ArrowRight, BadgeDollarSign } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Button } from '@/components/ui/Button'

export function WebsiteOfferStrip() {
  return (
    <section id="website-offer" className="bg-gray-900 text-white">
      <div className="container-custom py-14">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <BadgeDollarSign size={26} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-1">
                  Need the website first?
                </p>
                <h3 className="text-2xl font-bold font-heading mb-1">
                  The $10,000 website &mdash; for $1,200.
                </h3>
                <p className="text-gray-300">
                  Fixed scope, fixed price, live in 14 days. The same agency line items,
                  built by the guy who builds AI systems.
                </p>
              </div>
            </div>
            <Button href="/websites" variant="accent" size="lg" className="flex-shrink-0">
              See what&apos;s included
              <ArrowRight size={20} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
