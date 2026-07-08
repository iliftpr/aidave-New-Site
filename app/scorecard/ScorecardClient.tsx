'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Calendar, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LEVERS, type ScoreMap } from '@/lib/scorecard-content'
import { submitScorecard, type SubmissionResult } from './actions'

type Step = 'lead' | 'questions' | 'submitting' | 'results'

export function ScorecardClient() {
  const [step, setStep] = useState<Step>('lead')
  const [lead, setLead] = useState({ name: '', email: '', company: '', role: '' })
  const [scores, setScores] = useState<ScoreMap>({})
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const allQuestionsAnswered = LEVERS.every((lever) =>
    lever.questions.every((q) => typeof scores[q.id] === 'number')
  )

  function pickScore(questionId: number, score: number) {
    setScores((prev) => ({ ...prev, [questionId]: score }))
  }

  async function handleSubmit() {
    if (!allQuestionsAnswered) {
      setError('Please answer every question before submitting.')
      return
    }
    setError(null)
    setStep('submitting')
    const r = await submitScorecard({
      name: lead.name.trim(),
      email: lead.email.trim(),
      company: lead.company.trim() || undefined,
      role: lead.role.trim() || undefined,
      scores,
    })
    setResult(r)
    if (!r.ok) {
      setError(r.error ?? 'Something went wrong. Try again.')
      setStep('questions')
    } else {
      setStep('results')
    }
  }

  if (step === 'lead') {
    return <LeadCapture lead={lead} setLead={setLead} onNext={() => setStep('questions')} />
  }
  if (step === 'submitting') {
    return <SubmittingState />
  }
  if (step === 'results' && result) {
    return <ResultsView result={result} leadName={lead.name} />
  }
  return (
    <QuestionsForm
      scores={scores}
      pickScore={pickScore}
      onSubmit={handleSubmit}
      allAnswered={allQuestionsAnswered}
      error={error}
    />
  )
}

function LeadCapture({
  lead,
  setLead,
  onNext,
}: {
  lead: { name: string; email: string; company: string; role: string }
  setLead: (l: { name: string; email: string; company: string; role: string }) => void
  onNext: () => void
}) {
  const canProceed =
    lead.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
        <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">
          Step 1 of 2
        </p>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
          Quick — who is this for?
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Two fields are required so I can email your scored results. The other two help me
          give better follow-up suggestions. Nothing is shared.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Field
            label="Your name"
            value={lead.name}
            onChange={(v) => setLead({ ...lead, name: v })}
            placeholder="Jamie Operator"
            required
          />
          <Field
            label="Work email"
            value={lead.email}
            onChange={(v) => setLead({ ...lead, email: v })}
            placeholder="jamie@yourcompany.com"
            type="email"
            required
          />
          <Field
            label="Company"
            value={lead.company}
            onChange={(v) => setLead({ ...lead, company: v })}
            placeholder="Regional HVAC Group"
          />
          <Field
            label="Your role"
            value={lead.role}
            onChange={(v) => setLead({ ...lead, role: v })}
            placeholder="COO / Dir. of Ops / Founder"
          />
        </div>
        <Button
          onClick={onNext}
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!canProceed}
        >
          Start the 12-question audit
          <ArrowRight size={20} />
        </Button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          ~5 minutes. We email your scored results immediately. No spam, ever.
        </p>
      </div>
    </motion.div>
  )
}

function QuestionsForm({
  scores,
  pickScore,
  onSubmit,
  allAnswered,
  error,
}: {
  scores: ScoreMap
  pickScore: (q: number, s: number) => void
  onSubmit: () => void
  allAnswered: boolean
  error: string | null
}) {
  const completed = Object.keys(scores).length
  const total = LEVERS.reduce((acc, l) => acc + l.questions.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="sticky top-20 z-20 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm px-4 py-3 mb-8 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          Step 2 of 2 — {completed} of {total} answered
        </span>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-12">
        {LEVERS.map((lever) => (
          <section key={lever.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">
                Lever {lever.id}
              </span>
              <h3 className="text-2xl font-bold font-heading text-gray-900">{lever.name}</h3>
            </div>
            <p className="text-gray-600 mb-6">{lever.description}</p>

            <div className="space-y-6">
              {lever.questions.map((q) => (
                <div key={q.id}>
                  <p className="font-semibold text-gray-900 mb-3">
                    {q.id}. {q.text}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selected = scores[q.id] === opt.score
                      return (
                        <label
                          key={opt.score}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selected
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${q.id}`}
                            value={opt.score}
                            checked={selected}
                            onChange={() => pickScore(q.id, opt.score)}
                            className="w-4 h-4 accent-primary-600"
                          />
                          <span className="text-sm font-semibold text-gray-500 w-6">{opt.score}</span>
                          <span className="text-gray-800">{opt.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button onClick={onSubmit} variant="accent" size="lg" disabled={!allAnswered}>
          See my results
          <ArrowRight size={20} />
        </Button>
      </div>
      {!allAnswered && (
        <p className="text-center text-sm text-gray-500 mt-3">
          Answer all 12 questions to see your scored audit.
        </p>
      )}
    </motion.div>
  )
}

function SubmittingState() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-600"
      />
      <p className="text-lg font-semibold text-gray-700">Scoring your audit…</p>
    </div>
  )
}

function ResultsView({ result, leadName }: { result: SubmissionResult; leadName: string }) {
  const firstName = leadName.split(' ')[0] || 'there'
  const lowest = result.lowestLeverId ? LEVERS.find((l) => l.id === result.lowestLeverId) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border-2 border-primary-200 p-8 md:p-10 mb-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-3">
          {firstName}, here are your scores
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto">
          {result.emailSent
            ? "A copy is on its way to your inbox."
            : "Your audit has been logged. Dave will be in touch with your results within 24 hours."}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
        <table className="w-full">
          <tbody>
            {LEVERS.map((lever) => {
              const total = result.totals[lever.id]
              const isLowest = lever.id === result.lowestLeverId
              return (
                <tr
                  key={lever.id}
                  className={`border-b border-gray-100 last:border-b-0 ${
                    isLowest ? 'bg-amber-50' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">
                      Lever {lever.id} — {lever.name}
                    </div>
                    {isLowest && (
                      <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">
                        ← Your first sprint
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`text-2xl font-bold font-heading ${
                        isLowest ? 'text-amber-700' : 'text-gray-900'
                      }`}
                    >
                      {total}
                    </span>
                    <span className="text-gray-400 text-sm"> / 15</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {lowest && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
            What we'd ship first
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">{lowest.firstSprint.diagnosis}</p>
          <div className="mb-4">
            <p className="font-semibold text-gray-900 mb-2">Typical 4–6 week scope:</p>
            <ul className="space-y-2">
              {lowest.firstSprint.scope.map((s) => (
                <li key={s} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Typical investment
              </p>
              <p className="font-semibold text-gray-900">{lowest.firstSprint.investment}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Typical return
              </p>
              <p className="font-semibold text-gray-900">{lowest.firstSprint.typicalReturn}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 md:p-10 text-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold font-heading mb-3">
          Want a 30-min outside read on your results?
        </h3>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Free Automation Audit call with Dave. No pitch deck, no proposal afterwards unless you ask.
          You leave with a 3-option roadmap.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            href="https://cal.com/ilift/automation-audit"
            variant="accent"
            size="lg"
          >
            <Calendar size={20} />
            Book the free 30-min audit
          </Button>
          <Button href="mailto:dave@ilift.com" variant="secondary" size="lg">
            <Mail size={20} />
            Email Dave directly
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700 mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900"
      />
    </label>
  )
}
