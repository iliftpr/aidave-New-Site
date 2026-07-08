'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  Stethoscope,
  UtensilsCrossed,
  Hammer,
  Car,
  Home,
  Building2,
  Send,
  RotateCcw,
  Calendar,
  Phone,
  ArrowRight,
  PhoneMissed,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { COMPANY_INFO } from '@/lib/constants'
import { DEMO_VERTICALS, getDemoVertical } from '@/lib/demo-verticals'
import { useReceptionistDemo } from './useReceptionistDemo'

const AUDIT_URL = COMPANY_INFO.links.calcom.audit
const TEL = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

const ICONS: Record<string, LucideIcon> = {
  hvac: Wrench,
  dental: Stethoscope,
  restaurant: UtensilsCrossed,
  contractor: Hammer,
  auto: Car,
  realestate: Home,
  other: Building2,
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="typing">
      <span className="block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
      <span className="block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
      <span className="block h-2 w-2 animate-bounce rounded-full bg-gray-400" />
    </span>
  )
}

export function LiveCallDemo() {
  const { messages, send, start, reset, streaming, complete, error, userTurns } = useReceptionistDemo()
  const [chosenId, setChosenId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the latest message in view as the conversation grows.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, complete])

  function choose(id: string) {
    setChosenId(id)
    setInput('')
    start(id)
  }

  function tryAnother() {
    reset()
    setChosenId(null)
    setInput('')
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || streaming || complete) return
    setInput('')
    void send(text)
  }

  const vertical = chosenId ? getDemoVertical(chosenId) : null
  const showOpeners = !!vertical && userTurns === 0 && !streaming && !complete

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Phone frame */}
      <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl shadow-primary-900/10 ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary-700 to-secondary-700 px-5 py-4 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg">
            {vertical ? vertical.emoji : '📞'}
          </div>
          <div className="min-w-0">
            <div className="truncate font-bold leading-tight">
              {vertical ? vertical.businessName : 'Never Miss a Call'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="block h-2 w-2 rounded-full bg-green-400" />
              {vertical ? 'Texting back · replies in seconds' : 'Live AI receptionist demo'}
            </div>
          </div>
        </div>

        {/* Body */}
        {!vertical ? (
          /* ---- Step 1: choose a business type ---- */
          <div className="px-5 py-7">
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Sparkles size={22} className="text-primary-600" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900">
                Try it like a real customer
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Pick a business type, then text it the way a customer would after a missed call.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_VERTICALS.map((v) => {
                const Icon = ICONS[v.id] ?? Building2
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => choose(v.id)}
                    className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left transition-all hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                      <Icon size={16} className="text-primary-700" />
                    </span>
                    <span className="text-sm font-semibold leading-tight text-gray-800">
                      {v.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* ---- Step 2: the conversation ---- */
          <>
            <div
              ref={scrollRef}
              className="h-[24rem] space-y-3 overflow-y-auto bg-gray-50 px-4 py-4 sm:h-[26rem]"
              aria-live="polite"
            >
              {/* Missed-call framing */}
              <div className="mx-auto flex max-w-[90%] items-center justify-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5 text-center text-[11px] font-semibold text-secondary-800">
                <PhoneMissed size={13} className="flex-shrink-0" />
                You called {vertical.businessName} — no answer. Here&apos;s the instant text-back:
              </div>

              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  const isUser = m.role === 'user'
                  const isEmptyStreaming = m.streaming && m.text.length === 0
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                          isUser
                            ? 'rounded-br-md bg-primary-600 text-white'
                            : 'rounded-bl-md bg-white text-gray-800 ring-1 ring-gray-200'
                        }`}
                      >
                        {isEmptyStreaming ? <TypingDots /> : m.text}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Opener chips (first turn only) */}
            {showOpeners && (
              <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-white px-4 pt-3">
                {vertical.openers.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => void send(o)}
                    className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}

            {/* Input / completion */}
            {complete ? (
              <DemoComplete onTryAnother={tryAnother} />
            ) : (
              <>
                {error && (
                  <div className="border-t border-amber-100 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-700">
                    {error}
                  </div>
                )}
                <form onSubmit={submit} className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={streaming}
                  maxLength={1000}
                  placeholder={streaming ? 'Replying…' : 'Type your reply…'}
                  aria-label="Your reply to the AI receptionist"
                  className="min-w-0 flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-[15px] text-gray-900 outline-none transition-colors focus:border-primary-400 focus:bg-white disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  aria-label="Send"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-all hover:bg-primary-700 disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
                </form>
              </>
            )}
          </>
        )}
      </div>

      {/* Reassurance line under the phone */}
      {vertical && !complete && (
        <p className="mt-3 text-center text-xs text-gray-500">
          This is a real AI conversation — the live version books straight to your calendar and texts you the lead.
        </p>
      )}
    </div>
  )
}

function DemoComplete({ onTryAnother }: { onTryAnother: () => void }) {
  return (
    <div className="border-t border-gray-100 bg-gradient-to-b from-white to-primary-50/60 px-5 py-6 text-center">
      <h4 className="font-heading text-lg font-bold text-gray-900">
        That&apos;s your AI receptionist. 👏
      </h4>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-gray-600">
        It just handled a lead instantly — 24/7, while you&apos;re on the job or asleep. Now imagine
        this answering <span className="font-semibold text-gray-800">your</span> phone.
      </p>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Button href={AUDIT_URL} variant="accent" size="md" className="w-full sm:w-auto">
          <Calendar size={18} />
          Get this for my business
          <ArrowRight size={18} />
        </Button>
        <Button href={TEL} variant="secondary" size="md" className="w-full sm:w-auto">
          <Phone size={18} />
          Call/Text Dave
        </Button>
      </div>
      <button
        type="button"
        onClick={onTryAnother}
        className="mx-auto mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-primary-700"
      >
        <RotateCcw size={13} />
        Try another business type
      </button>
    </div>
  )
}
