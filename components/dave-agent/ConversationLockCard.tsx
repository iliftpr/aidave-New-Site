'use client'

import { motion } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'

type Props = {
  href: string
  onReset: () => void
}

export function ConversationLockCard({ href, onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="border-t border-gray-200/70 bg-white/95 px-4 py-4"
    >
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 p-4 text-white shadow-lg">
        <p className="text-sm font-semibold leading-snug">
          You&rsquo;ve covered a lot.
        </p>
        <p className="mt-1 text-xs text-white/90 leading-relaxed">
          The next step is grabbing 30 free minutes with Dave so you can talk specifics.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-purple-700 shadow-md hover:bg-amber-50 hover:text-purple-800 transition-colors"
        >
          Schedule Discovery Call
          <ArrowRight size={16} />
        </a>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <RotateCcw size={12} />
        or start a new chat
      </button>
    </motion.div>
  )
}
