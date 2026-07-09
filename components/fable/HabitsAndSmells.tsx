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
        <h3 className="font-heading text-2xl font-bold text-white">Habits that are always on</h3>
        <p className="mt-1.5 text-base text-white/55">Small disciplines, every checkpoint, every task.</p>
        <motion.ul {...listMotion} className="mt-5 space-y-3.5">
          {HABITS.map((h, i) => (
            <motion.li
              key={i}
              variants={reduce ? undefined : fadeInUp}
              className="flex items-start gap-3 text-base leading-relaxed text-white/75"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check size={15} />
              </span>
              <span>{h}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Smells */}
      <div className="glass-dark rounded-2xl border border-white/10 p-6 md:p-8">
        <h3 className="font-heading text-2xl font-bold text-white">Smells that mean it skipped a step</h3>
        <p className="mt-1.5 text-base text-white/55">Any one of these: stop, and go back to that checkpoint.</p>
        <motion.ul {...listMotion} className="mt-5 space-y-3.5">
          {SMELLS.map((s, i) => (
            <motion.li
              key={i}
              variants={reduce ? undefined : fadeInUp}
              className="flex items-start gap-3 rounded-lg border border-amber-500/15 bg-amber-500/[0.06] p-3.5 text-base leading-relaxed text-white/75"
            >
              <AlertTriangle size={17} className="mt-0.5 flex-shrink-0 text-amber-400" />
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
