'use client'

import { ReactNode, useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Download, Youtube, AlertTriangle } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { GATES, STAKES, AUDIENCES, FABLE_LINKS } from '@/lib/fable-content'
import { GateFlowDiagram } from '@/components/fable/GateFlowDiagram'
import { GateDetailCard } from '@/components/fable/GateDetailCard'
import { BeforeAfterGraph } from '@/components/fable/BeforeAfterGraph'
import { TeamCards } from '@/components/fable/TeamCards'
import { HabitsAndSmells } from '@/components/fable/HabitsAndSmells'
import { AmbientVideo } from '@/components/fable/AmbientVideo'
import { DownloadCTA } from '@/components/fable/DownloadCTA'

function SectionHeading({ kicker, children, sub }: { kicker: string; children: ReactNode; sub?: string }) {
  return (
    <ScrollReveal className="mx-auto max-w-3xl text-center">
      <div className="text-sm font-bold uppercase tracking-widest text-amber-400 md:text-base">{kicker}</div>
      <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
        {children}
      </h2>
      {sub && <p className="mt-5 text-lg leading-relaxed text-white/75 md:text-xl">{sub}</p>}
    </ScrollReveal>
  )
}

export function FableClient() {
  const reduce = useReducedMotion() ?? false
  const [activeGate, setActiveGate] = useState(1)
  const handleActive = useCallback((n: number) => setActiveGate(n), [])

  return (
    <main className="min-h-screen bg-gray-950">
      {/* ============================ 1. HERO ============================ */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gray-950 pt-32 pb-20">
        <AmbientVideo
          mp4="/videos/fable-hero.mp4"
          webm="/videos/fable-hero.webm"
          poster="/videos/fable-hero.jpg"
          opacityClass="opacity-60"
          eager
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/55 to-gray-950" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950 to-transparent" />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 inline-block rounded-full border border-white/15 bg-white/10 px-5 py-2 backdrop-blur-sm">
              <span className="text-base font-semibold text-amber-400">A Claude Code skill · one file · free</span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              AI that doesn&apos;t call it <span className="gradient-text">done</span> until it checked.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-white/80 md:text-2xl">
              The Fable Method is a discipline for AI coding agents: scope the work, ground every claim in real
              evidence, attack its own answer, verify before declaring done, and report straight. Fewer
              hallucinations. Less &ldquo;done&rdquo; that wasn&apos;t.
            </p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="#download"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-amber-600 bg-amber-500 px-8 py-4 text-lg font-extrabold text-white shadow-xl shadow-amber-500/40 transition-colors hover:bg-amber-600 sm:w-auto"
              >
                <Download size={20} />
                Download the skill
              </a>
              <a
                href={FABLE_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white/20 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                <Youtube size={20} />
                Watch the walkthrough
              </a>
            </motion.div>
            <p className="mt-8 text-base font-medium tracking-wide text-white/50">
              Five checkpoints · works on Opus or Sonnet · no install, no API key
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================ 2. STAKES ============================ */}
      <section className="section-padding bg-gray-950">
        <div className="container-custom">
          <SectionHeading
            kicker="The problem"
            sub="It says &ldquo;done.&rdquo; It didn&apos;t check. It states a fact it never verified. On a demo that&apos;s a shrug — in your business it&apos;s a wrong number in a customer&apos;s inbox."
          >
            AI&apos;s most expensive habit is <span className="gradient-text">confidence</span>.
          </SectionHeading>
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {STAKES.map((s, i) => (
              <ScrollReveal key={s} delay={i * 0.1}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6">
                  <AlertTriangle size={24} className="mt-0.5 flex-shrink-0 text-red-400" />
                  <span className="text-base font-medium leading-relaxed text-white/85 md:text-lg">{s}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 3. WHAT IT IS ============================ */}
      <section className="section-padding bg-gray-950">
        <div className="container-custom">
          <SectionHeading
            kicker="What it is"
            sub="A single skill file. No install, no API key, no framework to learn. Drop it in and your agent starts working like an engineer who measures twice."
          >
            One file. A <span className="gradient-text">discipline</span>, not a dependency.
          </SectionHeading>
          <ScrollReveal className="mx-auto mt-10 max-w-2xl">
            <div className="glass-dark overflow-hidden rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/70" />
                <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                <span className="ml-2 font-mono text-sm text-white/40">claude-code</span>
              </div>
              <div className="p-5 font-mono text-base leading-relaxed">
                <div className="text-white/50">
                  <span className="text-emerald-400">$</span> cp -r fable-mode ~/.claude/skills/
                </div>
                <div className="mt-2 text-emerald-400">
                  ✓ skill installed — say &ldquo;fable mode&rdquo; to run it
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================ 4. FIVE GATES ============================ */}
      <section className="section-padding bg-gray-950">
        <div className="container-custom">
          <SectionHeading
            kicker="The method"
            sub="Five checkpoints, run in order. Each one must pass before the next opens. Scroll through them — the rail lights up as you go."
          >
            The <span className="gradient-text">Five Checkpoints</span>.
          </SectionHeading>

          {/* Sticky rail (desktop) — stays visible and lights up while the cards scroll */}
          <div className="mt-12 md:sticky md:top-24 md:z-20">
            <div className="md:rounded-2xl md:border md:border-white/5 md:bg-gray-950/70 md:px-6 md:py-6 md:backdrop-blur-md">
              <GateFlowDiagram activeGate={activeGate} />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            {GATES.map((g) => (
              <GateDetailCard key={g.id} gate={g} active={activeGate === g.num} onActive={handleActive} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 5. BEFORE / AFTER ============================ */}
      <section className="section-padding bg-gray-950">
        <div className="container-custom">
          <SectionHeading
            kicker="The payoff"
            sub="Every checkpoint exists to catch the same failure: work that looks done but was never checked. Here&apos;s the shape of the difference."
          >
            Measure twice, <span className="gradient-text">ship once</span>.
          </SectionHeading>
          <div className="mt-12">
            <BeforeAfterGraph />
          </div>
        </div>
      </section>

      {/* ============================ 6. THE TEAM ============================ */}
      <section className="section-padding bg-gray-950">
        <div className="container-custom">
          <SectionHeading
            kicker="Force-multipliers"
            sub="The method doesn&apos;t just tell the agent to be careful — it wires in real tools at the exact checkpoint where they pay off."
          >
            It brings a <span className="gradient-text">team</span>.
          </SectionHeading>
          <div className="mt-12">
            <TeamCards />
          </div>
        </div>
      </section>

      {/* ============================ 7. HABITS + SMELLS ============================ */}
      <section className="section-padding bg-gray-950">
        <div className="container-custom">
          <SectionHeading kicker="Under the hood">
            The habits that make it <span className="gradient-text">hold up</span>.
          </SectionHeading>
          <div className="mx-auto mt-12 max-w-5xl">
            <HabitsAndSmells />
          </div>
        </div>
      </section>

      {/* ============================ 8. WHO IT'S FOR ============================ */}
      {/* overflow-hidden clips the cards' ±40px slide-in offset so it can't create
          horizontal scroll on mobile. Scoped to this section only — NOT on <main>,
          which would break the sticky checkpoint rail. */}
      <section className="section-padding overflow-hidden bg-gray-950">
        <div className="container-custom">
          <SectionHeading kicker="Who it's for">
            Built for <span className="gradient-text">two kinds</span> of people.
          </SectionHeading>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
            {[AUDIENCES.builders, AUDIENCES.operators].map((aud, idx) => (
              <motion.div
                key={aud.title}
                initial={reduce ? false : { opacity: 0, x: idx === 0 ? -40 : 40 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="glass-dark rounded-2xl border border-white/10 p-6 md:p-8"
              >
                <div className="text-sm font-bold uppercase tracking-wider text-amber-400">{aud.kicker}</div>
                <h3 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">{aud.title}</h3>
                <ul className="mt-6 space-y-4">
                  {aud.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-white/80 md:text-lg">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 9. DOWNLOAD ============================ */}
      <section id="download" className="relative section-padding overflow-hidden bg-gray-950">
        <AmbientVideo
          mp4="/videos/fable-gates-ambient.mp4"
          webm="/videos/fable-gates-ambient.webm"
          poster="/videos/fable-gates-ambient.jpg"
          opacityClass="opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/80 to-gray-950" />
        <div className="container-custom relative z-10">
          <SectionHeading
            kicker="Get it"
            sub="Free. One file. Drop it into Claude Code and let your agent work like it actually checked."
          >
            Get the <span className="gradient-text">skill</span>.
          </SectionHeading>
          <div className="mt-12">
            <DownloadCTA />
          </div>
        </div>
      </section>
    </main>
  )
}
