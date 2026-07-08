import type { Metadata } from 'next'
import { ArrowRight, Calendar, ExternalLink } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { TalkToAIButton } from '@/components/work/TalkToAIButton'
import { BUILT_BY_DAVE } from '@/lib/projects'
import { COMPANY_INFO } from '@/lib/constants'

const AUDIT_URL = COMPANY_INFO.links.calcom.audit
const CASES = BUILT_BY_DAVE.filter((p) => p.caseStudy)

export const metadata: Metadata = {
  title: 'Work & Case Studies — Real Systems Dave Has Shipped',
  description:
    'Proof, not pitch decks. The apps, stores, and systems Dave has actually built and operates — OpenWPAgent (live SaaS), Tennis Buddy, Organic Skincare, and more. The same person and approach that builds AI systems inside Long Island businesses.',
  alternates: { canonical: 'https://ilift.com/work' },
  openGraph: {
    title: 'Work & Case Studies — AI Dave (ILift)',
    description:
      'The real, live products Dave has shipped — proof he builds AI, not just talks about it.',
    url: 'https://ilift.com/work',
    type: 'website',
  },
}

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <div className="bg-white">
        {CASES.map((project, i) => (
          <CaseStudy key={project.id} project={project} flip={i % 2 === 1} />
        ))}
      </div>
      <FinalCta />
      <Footer />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-950 text-white pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('/videos/hero-professional-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/50" />
      </div>
      <div className="container-custom relative z-10 max-w-3xl">
        <div className="inline-block px-4 py-2 bg-white/10 rounded-full border border-white/15 mb-6">
          <span className="text-amber-400 font-semibold text-sm">Proof, not pitch decks</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight mb-6">
          I ship AI. <span className="text-amber-400">Here&apos;s the receipts.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed mb-8">
          Most AI &ldquo;consultants&rdquo; have never shipped a system that real people use. These
          are the apps, stores, and tools I&apos;ve actually built and operate — the same person
          and approach that goes to work inside your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href={AUDIT_URL} variant="accent" size="lg" className="w-full sm:w-auto">
            <Calendar size={20} />
            Book a discovery call
            <ArrowRight size={20} />
          </Button>
          <TalkToAIButton className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  )
}

function CaseStudy({
  project,
  flip,
}: {
  project: (typeof BUILT_BY_DAVE)[number]
  flip: boolean
}) {
  const cs = project.caseStudy!
  return (
    <section className="section-padding border-b border-gray-100">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Media */}
          <ScrollReveal className={flip ? 'lg:order-2' : ''}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-900 aspect-video">
              {project.videoSrc ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={project.imageDesktop}
                  aria-label={`${project.title} preview`}
                >
                  <source src={project.videoSrc} type="video/mp4" />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.imageDesktop} alt={project.title} className="w-full h-full object-cover" />
              )}
            </div>
          </ScrollReveal>

          {/* Narrative */}
          <ScrollReveal className={flip ? 'lg:order-1' : ''}>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-600 mb-2">
              {cs.kicker}
            </p>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">
                {project.title}
              </h2>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  project.status === 'Live'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'Beta'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                  The challenge
                </h3>
                <p className="text-gray-700 leading-relaxed">{cs.challenge}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                  What I built
                </h3>
                <p className="text-gray-700 leading-relaxed">{cs.build}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                  The result
                </h3>
                <p className="text-gray-700 leading-relaxed">{cs.outcome}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
              {cs.deepDiveUrl && (
                <a
                  href={cs.deepDiveUrl}
                  className="inline-flex items-center gap-2 font-semibold text-amber-600 hover:text-amber-700"
                >
                  {cs.deepDiveLabel ?? 'See how I did it'}
                  <ArrowRight size={16} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-primary-700 hover:text-primary-800"
                >
                  See it live
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden gradient-bg py-20 md:py-28">
      <div className="container-custom relative z-10 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 max-w-3xl mx-auto leading-tight">
            Want one of these built inside your business?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Same builder, same approach — pointed at your busywork. Thirty minutes, no pitch, a
            straight read on what to build first.
          </p>
          <Button href={AUDIT_URL} variant="accent" size="lg">
            <Calendar size={20} />
            Book a discovery call
            <ArrowRight size={20} />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
