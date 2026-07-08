'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check, AlertTriangle } from 'lucide-react'
import { HABITS, SMELLS } from '@/lib/fable-content'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export function HabitsAndSmells() {
  const reduce = useReducedMotion() ?? false
  const listMotion = reduce
    ? {}
    : { variants: staggerContainer, initial: 'hidden' as const, whileInView: 'visible' as const, viewport: { once: true, margin: '-60px' } }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Habits */}
      <div className="glass-dark rounded-2xl border border-white/10 p-6 md:p-8">
        <h3 className="font-heading text-xl font-bold text-white">Habits that are always on</h3>
        <p className="mt-1 text-sm text-white/50">Small disciplines, every gate, every task.</p>
        <motion.ul {...listMotion} className="mt-5 space-y-3">
          {HABITS.map((h, i) => (
            <motion.li
              key={i}
              variants={reduce ? undefined : fadeInUp}
              className="flex items-start gap-3 text-sm text-white/70"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check size={13} />
              </span>
              <span>{h}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Smells */}
      <div className="glass-dark rounded-2xl border border-white/10 p-6 md:p-8">
        <h3 className="font-heading text-xl font-bold text-white">Smells that mean it skipped a step</h3>
        <p className="mt-1 text-sm text-white/50">Any one of these: stop, and go back to that gate.</p>
        <motion.ul {...listMotion} className="mt-5 space-y-3">
          {SMELLS.map((s, i) => (
            <motion.li
              key={i}
              variants={reduce ? undefined : fadeInUp}
              className="flex items-start gap-3 rounded-lg border border-amber-500/15 bg-amber-500/[0.06] p-3 text-sm text-white/70"
            >
              <AlertTriangle size={15} className="mt-0.5 flex-shrink-0 text-amber-400" />
              <span>
                {s.text} <span className="font-semibold text-amber-400/70">({s.gate})</span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
