'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { GATES, type Gate } from '@/lib/fable-content'
import { FABLE_ICONS } from './fableIcons'

// A glowing rail of five checkpoints. The gradient connector draws once on scroll-in;
// nodes pop in sequence; every node up to `activeGate` is lit, and the active
// node gets an extra pulsing glow. Reduced motion → everything lit and static.
export function GateFlowDiagram({ activeGate }: { activeGate: number }) {
  const reduce = useReducedMotion() ?? false
  const label =
    'The Five Checkpoints, run in order: ' + GATES.map((g) => `${g.num}. ${g.title}`).join('; ') + '.'

  return (
    <div role="img" aria-label={label}>
      {/* Desktop: horizontal rail */}
      <div className="relative hidden md:block">
        <Connector orientation="horizontal" reduce={reduce} />
        <div className="relative flex items-start justify-between">
          {GATES.map((g) => (
            <div key={g.id} className="flex w-1/5 flex-col items-center gap-3 text-center">
              <GateNode gate={g} lit={g.num <= activeGate} active={g.num === activeGate} reduce={reduce} />
              <div
                className={`px-1 font-heading text-base font-bold leading-tight transition-colors duration-500 ${
                  g.num <= activeGate ? 'text-white' : 'text-white/40'
                }`}
              >
                {g.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical rail */}
      <div className="relative md:hidden">
        <Connector orientation="vertical" reduce={reduce} />
        <div className="relative flex flex-col gap-6">
          {GATES.map((g) => (
            <div key={g.id} className="flex items-center gap-4">
              <GateNode gate={g} lit={g.num <= activeGate} active={g.num === activeGate} reduce={reduce} />
              <div>
                <div
                  className={`font-heading text-lg font-bold leading-tight transition-colors duration-500 ${
                    g.num <= activeGate ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {g.title}
                </div>
                <div className="text-sm text-white/50">{g.short}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen-reader ordered list (belt-and-suspenders with aria-label) */}
      <ol className="sr-only">
        {GATES.map((g) => (
          <li key={g.id}>
            Checkpoint {g.num}: {g.title}. {g.benefit}
          </li>
        ))}
      </ol>
    </div>
  )
}

function GateNode({ gate, lit, active, reduce }: { gate: Gate; lit: boolean; active: boolean; reduce: boolean }) {
  const Icon = FABLE_ICONS[gate.icon]
  return (
    <div className="relative">
      {/* Pulsing glow behind the active node */}
      {active && !reduce && (
        <motion.span
          aria-hidden
          className="absolute -inset-2 rounded-2xl bg-secondary-500/30 blur-xl"
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      )}
      <motion.div
        initial={reduce ? false : { scale: 0.5, opacity: 0 }}
        whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 0.45, delay: reduce ? 0 : gate.num * 0.12, ease: 'easeOut' }}
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 ${
          lit
            ? 'border-white/20 bg-gradient-to-br from-primary-500/25 to-secondary-500/25 text-white'
            : 'border-white/10 bg-white/5 text-white/30'
        }`}
        style={{
          boxShadow: lit
            ? active
              ? '0 0 32px rgba(168,85,247,0.55)'
              : '0 0 16px rgba(59,130,246,0.30)'
            : 'none',
        }}
      >
        {Icon ? <Icon size={26} strokeWidth={1.75} /> : null}
        <span
          className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500 ${
            lit ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/40'
          }`}
        >
          {gate.num}
        </span>
      </motion.div>
    </div>
  )
}

function Connector({ orientation, reduce }: { orientation: 'horizontal' | 'vertical'; reduce: boolean }) {
  const gradId = `fableGate-${orientation}`
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: '-12%' },
        transition: { duration: 1.2, ease: 'easeInOut' as const },
      }

  if (orientation === 'horizontal') {
    return (
      <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 -translate-y-1/2">
        <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="h-1 w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="55%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <line x1="0" y1="2" x2="1000" y2="2" stroke="rgba(255,255,255,0.09)" strokeWidth="2" />
          <motion.line x1="0" y1="2" x2="1000" y2="2" stroke={`url(#${gradId})`} strokeWidth="2.5" {...draw} />
        </svg>
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute bottom-8 left-8 top-8 -translate-x-1/2">
      <svg viewBox="0 0 4 1000" preserveAspectRatio="none" className="h-full w-1 overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="55%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <line x1="2" y1="0" x2="2" y2="1000" stroke="rgba(255,255,255,0.09)" strokeWidth="2" />
        <motion.line x1="2" y1="0" x2="2" y2="1000" stroke={`url(#${gradId})`} strokeWidth="2.5" {...draw} />
      </svg>
    </div>
  )
}
