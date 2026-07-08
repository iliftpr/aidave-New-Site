'use client'

import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Button } from '@/components/ui/Button'
import { BUILT_BY_DAVE } from '@/lib/projects'

export function BuiltByDave() {
  return (
    <section
      id="built-by-dave"
      className="section-padding relative overflow-hidden bg-gradient-to-b from-white to-slate-50"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <ScrollReveal animation="fadeInUp" className="text-center mb-16">
          <span className="inline-block text-primary-600 font-bold text-sm uppercase tracking-widest mb-4">
            Built by Dave
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            Proof, not <span className="gradient-text">pitch decks</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I don&apos;t just pitch AI &mdash; I ship it. These are the projects I&apos;m
            building and operating right now. Live projects open in a new tab.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUILT_BY_DAVE.map((item, index) => (
            <ProjectCard key={item.id} item={item} index={index} />
          ))}
        </div>

        <ScrollReveal className="text-center mt-12">
          <Button href="/work" variant="secondary" size="lg">
            Read the full case studies
            <ArrowRight size={20} />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
