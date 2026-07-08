'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { TEAM } from '@/lib/fable-content'
import { FABLE_ICONS } from './fableIcons'
import { staggerContainer, fadeInUp } from '@/lib/animations'

// The "team" — real tools wired in at the gate where they pay off.
export function TeamCards() {
  const reduce = useReducedMotion() ?? false
  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, margin: '-80px' }}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {TEAM.map((m) => {
        const Icon = FABLE_ICONS[m.icon]
        return (
          <motion.div
            key={m.name}
            variants={reduce ? undefined : fadeInUp}
            whileHover={reduce ? undefined : { scale: 1.03 }}
            className="glass-dark rounded-2xl border border-white/10 p-6 transition-colors duration-300 hover:border-secondary-400/50 hover:shadow-[0_0_36px_-10px_rgba(168,85,247,0.5)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 text-white">
                {Icon ? <Icon size={20} /> : null}
              </div>
              <div>
                <div className="font-heading font-bold text-white">{m.name}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">{m.gates}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{m.tech}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/45">{m.plain}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
