'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

type Props = {
  onOpen: () => void
  visited: boolean
  showNudge: boolean
  onDismissNudge: () => void
}

export function ChatBubble({ onOpen, visited, showNudge, onDismissNudge }: Props) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 pointer-events-none"
      style={{
        paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
        paddingRight: 'max(0px, env(safe-area-inset-right))',
      }}
    >
      {showNudge && (
        <motion.button
          type="button"
          onClick={onDismissNudge}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="pointer-events-auto absolute right-0 bottom-20 mb-1 max-w-[260px] rounded-2xl bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-xl ring-1 ring-black/5 hover:ring-black/10"
          aria-label="Dismiss greeting"
        >
          <span className="font-semibold text-gray-900">Hey 👋</span>{' '}
          I can answer questions about working with Dave — try me.
          <span
            aria-hidden="true"
            className="absolute -bottom-1 right-6 h-3 w-3 rotate-45 bg-white ring-1 ring-black/5"
          />
        </motion.button>
      )}

      <motion.button
        type="button"
        onClick={onOpen}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: visited ? 0.6 : 1, scale: 1 }}
        whileHover={{ scale: 1.08, opacity: 1 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_8px_32px_rgba(14,165,233,0.45)] focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/60"
        style={{
          background:
            'conic-gradient(from 220deg at 50% 50%, #0ea5e9, #6366f1, #a855f7, #ec4899, #0ea5e9)',
        }}
        aria-label="Open Dave's AI Assistant"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent mix-blend-overlay"
        />
        {!visited && (
          <motion.span
            aria-hidden="true"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'easeOut',
            }}
            className="absolute inset-0 rounded-full bg-sky-400/40"
          />
        )}
        <Sparkles size={24} className="relative z-10 drop-shadow" />
        {!visited && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-pink-400 ring-2 ring-white animate-pulse"
          />
        )}
      </motion.button>
    </div>
  )
}
