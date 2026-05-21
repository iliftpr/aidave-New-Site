import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScorecardClient } from './ScorecardClient'

export const metadata: Metadata = {
  title: 'The 4-Lever Automation Audit — Free Scorecard for Multi-Location Ops Teams',
  description:
    '12 questions, 5 minutes. Find the one Lever costing your multi-location ops team the most. Score 1–5 on Intake, Dispatch, Comms, and Reporting — the lowest number is your first sprint.',
  alternates: { canonical: 'https://ilift.com/scorecard' },
  openGraph: {
    title: 'The 4-Lever Automation Audit — Free Scorecard',
    description:
      'Find the one operational Lever costing your multi-location business the most. 12 questions. 5 minutes. No pitch.',
    url: 'https://ilift.com/scorecard',
    type: 'website',
  },
}

export default function ScorecardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50/40 via-white to-secondary-50/30">
      <Header />
      <ScorecardIntro />
      <section className="container-custom py-12 md:py-16">
        <ScorecardClient />
      </section>
      <Footer />
    </main>
  )
}

function ScorecardIntro() {
  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="container-custom max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-2 bg-primary-100 rounded-full border border-primary-200 mb-6">
          <span className="text-primary-700 font-semibold text-sm">Free · 12 questions · 5 minutes</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-gray-900 mb-6 leading-tight">
          The 4-Lever <span className="gradient-text">Automation Audit</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4">
          For COOs and operators running multi-location service businesses.
        </p>
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Score yourself 1&ndash;5 on each of the four operational levers — Intake, Dispatch, Customer Comms, and Cross-Location Reporting. The lowest-scoring lever is your first sprint. <strong>One workflow live this quarter, not a 90-day discovery phase.</strong>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-10">
          {[
            { lever: '1', name: 'Intake & Routing' },
            { lever: '2', name: 'Dispatch & Coordination' },
            { lever: '3', name: 'Customer Comms' },
            { lever: '4', name: 'Cross-Location Reporting' },
          ].map((l) => (
            <div
              key={l.lever}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="text-3xl font-bold gradient-text mb-1">{l.lever}</div>
              <div className="text-sm font-semibold text-gray-700">{l.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
