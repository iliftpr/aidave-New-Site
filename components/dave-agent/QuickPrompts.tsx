'use client'

import { motion } from 'framer-motion'

const PROMPTS = [
  { emoji: '🤖', text: 'What kind of AI projects do you actually build?' },
  { emoji: '💼', text: 'How does an engagement with you work?' },
  { emoji: '⏱️', text: 'How fast can I get a working system live?' },
  { emoji: '📞', text: 'Can I book a quick call with Dave?' },
]

type Props = {
  onPick: (text: string) => void
}

export function QuickPrompts({ onPick }: Props) {
  return (
    <div className="px-4 pb-3">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        Try asking
      </p>
      <div className="grid grid-cols-1 gap-2">
        {PROMPTS.map((p, i) => (
          <motion.button
            key={p.text}
            type="button"
            onClick={() => onPick(p.text)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.25 }}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
            className="group flex items-center gap-2.5 rounded-xl bg-white/90 px-3.5 py-2.5 text-left text-sm text-gray-700 ring-1 ring-gray-200 shadow-sm hover:ring-sky-300 hover:bg-white hover:text-gray-900 transition-colors"
          >
            <span className="text-base">{p.emoji}</span>
            <span className="flex-1 leading-snug">{p.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
