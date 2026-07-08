import type { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { FableHeader } from '@/components/fable/FableHeader'
import { FableClient } from './FableClient'

export const metadata: Metadata = {
  title: 'The Fable Method — a Claude Code skill that verifies before it says done',
  description:
    'A discipline for AI coding agents: scope the work, ground every claim in real evidence, attack its own answer, verify before declaring done, and report straight. Fewer hallucinations, less unverified "done." One free skill file for Claude Code — for builders and the operators who run on their work.',
  keywords: [
    'Claude Code skill',
    'AI coding agent discipline',
    'reduce AI hallucinations',
    'AI verification',
    'Fable Method',
    'Fable mode',
    'agent reliability',
    'Opus',
    'Sonnet',
  ],
  alternates: { canonical: 'https://ilift.com/fable' },
  openGraph: {
    title: 'The Fable Method — AI that doesn’t call it done until it checked',
    description:
      'A five-gate discipline that makes an AI coding agent scope, gather evidence, attack its own answer, verify, and report straight. Free skill file for Claude Code.',
    url: 'https://ilift.com/fable',
    type: 'website',
  },
}

// Static, author-controlled structured data. Rendered as script text content
// (not dangerouslySetInnerHTML) — the payload contains no HTML metacharacters.
const SOFTWARE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'The Fable Method',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Claude Code (Opus or Sonnet)',
  description:
    'A Claude Code skill that enforces a five-gate working discipline — scope, evidence, adversarial reasoning, verification, and calibrated reporting — so AI coding agents hallucinate less and stop declaring unverified work done.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: 'https://ilift.com/fable',
  author: { '@type': 'Person', name: 'Dave Gakshteyn', url: 'https://ilift.com' },
}

export default function FablePage() {
  return (
    <>
      <FableHeader />
      <FableClient />
      <Footer />
      <script type="application/ld+json">{JSON.stringify(SOFTWARE_JSON_LD)}</script>
    </>
  )
}
