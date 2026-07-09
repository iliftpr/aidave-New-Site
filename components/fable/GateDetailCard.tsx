'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Check, PenTool } from 'lucide-react'
import { type Gate } from '@/lib/fable-content'
import { FABLE_ICONS } from './fableIcons'
import { CheckpointSketch } from './CheckpointSketch'

// One gate, expanded: a builder-facing "mechanic" line and an operator-facing
// "what you get" line, plus the gate's three rules. Reports itself as the
// active gate when it scrolls through the viewport center, driving the diagram.
export function GateDetailCard({
  gate,
  active,
  onActive,
}: {
  gate: Gate
  active: boolean
  onActive: (n: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const centered = useInView(ref, { margin: '-45% 0px -45% 0px' })
  const reduce = useReducedMotion() ?? false
  const Icon = FABLE_ICONS[gate.icon]

  useEffect(() => {
    if (centered) onActive(gate.num)
  }, [centered, gate.num, onActive])

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`glass-dark rounded-2xl border p-6 transition-all duration-500 md:p-8 ${
        active
          ? 'border-secondary-400/60 shadow-[0_0_44px_-8px_rgba(168,85,247,0.5)]'
          : 'border-white/10'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
            active ? 'bg-gradient-to-br from-primary-500/30 to-secondary-500/30 text-white' : 'bg-white/5 text-white/60'
          }`}
        >
          {Icon ? <Icon size={22} /> : null}
        </div>
        <div className="min-w-0">
          <span className="text-sm font-bold uppercase tracking-wider text-amber-400">Checkpoint {gate.num}</span>
          <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">{gate.title}</h3>
          <p className="mt-1.5 text-lg leading-relaxed text-white/60">{gate.short}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary-300">For builders</div>
          <p className="text-base leading-relaxed text-white/75">{gate.mechanic}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-secondary-300">What you get</div>
          <p className="text-base leading-relaxed text-white/75">{gate.benefit}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {gate.rules.map((rule, i) => (
          <li key={i} className="flex items-start gap-2.5 text-base leading-relaxed text-white/65">
            <Check size={18} className="mt-0.5 flex-shrink-0 text-amber-400" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>

      {/* Hand-drawn analogy: paints the checkpoint as a plain-English picture. */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
          <PenTool size={14} className="text-white/40" />
          Picture it
        </div>
        <CheckpointSketch id={gate.id} />
      </div>
    </motion.div>
  )
}
