'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useElevenLabsAgent } from './hooks/useElevenLabsAgent'
import type { VoiceStatus } from './types'

const STATUS_LABEL: Record<VoiceStatus, string> = {
  idle: 'Tap to start',
  connecting: 'Connecting…',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
  error: 'Voice unavailable',
}

const STATUS_COLOR: Record<VoiceStatus, string> = {
  idle: 'from-gray-400 to-gray-500',
  connecting: 'from-sky-400 to-indigo-500',
  listening: 'from-emerald-400 to-sky-500',
  thinking: 'from-purple-500 to-pink-500',
  speaking: 'from-sky-500 to-purple-600',
  error: 'from-rose-500 to-orange-500',
}

type Props = {
  onExit: () => void
}

function WaveBars({ active }: { active: boolean }) {
  return (
    <div className="flex h-16 items-center justify-center gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.span
          key={i}
          className="block w-1.5 rounded-full bg-gradient-to-b from-sky-400 via-purple-500 to-pink-500"
          animate={
            active
              ? { height: ['18%', '90%', '40%', '70%', '25%'] }
              : { height: '24%' }
          }
          transition={
            active
              ? {
                  duration: 1.1 + i * 0.07,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.04,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  )
}

export function VoiceMode({ onExit }: Props) {
  const { status, transcript, error, start, stop } = useElevenLabsAgent()

  useEffect(() => {
    void start()
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const active = status === 'listening' || status === 'thinking' || status === 'speaking'

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-white via-sky-50/40 to-purple-50/40">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-4">
        <div className="relative">
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${STATUS_COLOR[status]} blur-2xl opacity-40`}
            animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${STATUS_COLOR[status]} text-white shadow-xl`}
          >
            {status === 'connecting' ? (
              <Loader2 size={36} className="animate-spin" />
            ) : (
              <Mic size={36} />
            )}
          </div>
        </div>

        <WaveBars active={active} />

        <p className="mt-2 text-sm font-semibold text-gray-900">{STATUS_LABEL[status]}</p>
        {error ? (
          <p className="mt-1 max-w-[260px] text-center text-xs text-rose-600">{error}</p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">
            Tap the mic to end. We&rsquo;ll keep the convo on screen.
          </p>
        )}
      </div>

      {transcript.length > 0 && (
        <div className="max-h-32 overflow-y-auto border-t border-gray-200/70 bg-white/70 px-4 py-3 text-xs">
          {transcript.slice(-6).map((t) => (
            <p
              key={t.id}
              className={`mb-1 last:mb-0 ${
                t.role === 'user' ? 'text-gray-700' : 'text-purple-700 font-medium'
              }`}
            >
              <span className="text-gray-400">
                {t.role === 'user' ? 'You: ' : 'Dave: '}
              </span>
              {t.text}
            </p>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200/70 bg-white/85 px-4 py-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          aria-label="End voice and return to text"
        >
          <MicOff size={16} />
          End voice & back to text
        </button>
      </div>
    </div>
  )
}
