'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X, GaugeCircle } from 'lucide-react'

const SHOWN_KEY = 'ilift-exit-intent-shown'
// Don't arm until the visitor has actually engaged with the page
const ARM_DELAY_MS = 12_000

/**
 * Desktop exit-intent modal: when the cursor leaves through the top of the
 * viewport (heading for the tab bar), offer the free scorecard once per
 * session. Never shown on /scorecard itself, on touch devices, or twice.
 */
export function ExitIntentScorecard() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const dismiss = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (pathname === '/scorecard') return
    try {
      if (sessionStorage.getItem(SHOWN_KEY) === '1') return
    } catch {
      return // no storage → don't risk nagging on every page
    }

    let armed = false
    const armTimer = window.setTimeout(() => {
      armed = true
    }, ARM_DELAY_MS)

    const onMouseOut = (e: MouseEvent) => {
      if (!armed || e.relatedTarget !== null || e.clientY > 0) return
      try {
        if (sessionStorage.getItem(SHOWN_KEY) === '1') return
        sessionStorage.setItem(SHOWN_KEY, '1')
      } catch {
        // ignore
      }
      setOpen(true)
    }

    document.addEventListener('mouseout', onMouseOut)
    return () => {
      window.clearTimeout(armTimer)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] hidden lg:flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-6"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5">
              <GaugeCircle size={24} className="text-white" />
            </div>
            <h2 id="exit-intent-title" className="text-2xl font-bold font-heading text-gray-900 mb-3">
              Before you go — find the leak.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              12 questions, 5 minutes. The free 4-Lever Scorecard shows which part of your
              operation — intake, dispatch, customer comms, or reporting — is quietly costing
              you the most, and what fixing it first is worth.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/scorecard"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl px-6 py-3 shadow-lg shadow-amber-500/40 border-2 border-amber-600"
              >
                Take the free scorecard
                <ArrowRight size={18} />
              </a>
              <button
                type="button"
                onClick={dismiss}
                className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
              >
                No thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
