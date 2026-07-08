'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, animate } from 'framer-motion'
import { BEFORE_AFTER } from '@/lib/fable-content'

function CountUp({ to, play, reduce }: { to: number; play: boolean; reduce: boolean }) {
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce) {
      setVal(to)
      return
    }
    if (!play) return
    const controls = animate(0, to, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [play, to, reduce])
  return <>{val}</>
}

// Illustrative before/after: two animated bars + count-up. Honestly labeled as a
// discipline, not a benchmark (Gate 5 applied to our own marketing).
export function BeforeAfterGraph() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="mx-auto max-w-2xl">
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-white/50">
        {BEFORE_AFTER.metric} <span className="text-white/30">· {BEFORE_AFTER.unit}</span>
      </p>
      <div className="flex h-64 items-end justify-center gap-10 sm:gap-20">
        {BEFORE_AFTER.bars.map((bar, i) => {
          const pct = (bar.value / BEFORE_AFTER.max) * 100
          const good = bar.tone === 'good'
          return (
            <div key={bar.label} className="flex h-full w-full max-w-[9rem] flex-col items-center justify-end">
              <div
                className="mb-3 font-heading text-4xl font-extrabold md:text-5xl"
                style={{ color: good ? '#34d399' : '#f87171' }}
              >
                <CountUp to={bar.value} play={inView} reduce={reduce} />
                <span className="text-lg text-white/30">/{BEFORE_AFTER.max}</span>
              </div>
              <div className="flex w-full flex-1 items-end overflow-hidden rounded-t-xl bg-white/5">
                <motion.div
                  className={`w-full rounded-t-xl ${
                    good
                      ? 'bg-gradient-to-t from-emerald-500 to-emerald-300'
                      : 'bg-gradient-to-t from-red-600 to-red-400'
                  }`}
                  initial={reduce ? false : { height: 0 }}
                  animate={reduce ? undefined : { height: inView ? `${pct}%` : 0 }}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.15 }}
                  style={reduce ? { height: `${pct}%` } : undefined}
                />
              </div>
              <div className="mt-4 text-center text-sm font-medium text-white/60">{bar.label}</div>
            </div>
          )
        })}
      </div>
      <p className="mt-8 text-center text-xs italic leading-relaxed text-white/40">{BEFORE_AFTER.caption}</p>
    </div>
  )
}
