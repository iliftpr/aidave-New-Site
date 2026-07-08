import { PhoneMissed, FileStack, HourglassIcon, Calendar } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO } from '@/lib/constants'

const PAINS = [
  {
    icon: PhoneMissed,
    title: 'Manual intake',
    body: 'Every new customer means phone tag, a form, and staff re-typing the same details into three systems. The callers who reach voicemail call the next business on the list.',
  },
  {
    icon: FileStack,
    title: 'Repetitive paperwork',
    body: 'Quotes, invoices, intake forms, follow-up emails — your best people spending hours assembling the same documents a system should produce in seconds.',
  },
  {
    icon: HourglassIcon,
    title: 'No time to evaluate AI',
    body: 'You know AI matters. But nobody on the team has the hours to vet tools, test vendors, and separate real systems from slideware — so nothing ever ships.',
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="section-padding bg-white">
      <div className="container-custom">
        <ScrollReveal animation="fadeInUp" className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            You and your people are doing work a{' '}
            <span className="gradient-text">machine should be doing</span>
          </h2>
          <p className="text-lg text-gray-600">
            The pattern inside almost every Long Island business we talk to:
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PAINS.map((pain, i) => (
            <ScrollReveal key={pain.title} delay={i * 0.1}>
              <div className="h-full bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-5">
                  <pain.icon size={24} className="text-primary-700" />
                </div>
                <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pain.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center">
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            None of this is a headcount problem. It is a systems problem — and it is exactly
            what Dave builds custom AI apps and agents to run.
          </p>
          <Button href={COMPANY_INFO.links.calcom.audit} variant="accent" size="lg">
            <Calendar size={20} />
            Book a discovery call
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
