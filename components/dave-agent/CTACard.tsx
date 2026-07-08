'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Check, Loader2, Mail } from 'lucide-react'
import { trackLead } from '@/lib/tracking'

type Props = {
  href: string
}

type LeadState = 'idle' | 'open' | 'sending' | 'sent' | 'error'

export function CTACard({ href }: Props) {
  const [leadState, setLeadState] = useState<LeadState>('idle')
  const [email, setEmail] = useState('')

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || leadState === 'sending') return
    setLeadState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'AI chat visitor',
          email: email.trim(),
          message:
            'Lead captured from the AI assistant on ilift.com — the visitor asked Dave to reach out instead of booking directly.',
          service: 'general',
          source: 'dave-agent',
        }),
      })
      if (!res.ok) throw new Error('failed')
      trackLead('chat_lead')
      setLeadState('sent')
    } catch {
      setLeadState('error')
    }
  }

  return (
    <div className="mt-2">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group block rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 p-[1.5px] no-underline shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-shadow"
      >
        <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-purple-600 text-white">
            <Calendar size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              Free 30-min Discovery Call
            </p>
            <p className="text-xs text-gray-500">
              Talk to Dave — no commitment, just a real conversation.
            </p>
          </div>
          <div className="flex h-9 items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-purple-600 px-3.5 text-xs font-semibold text-white shadow-sm transition-transform group-hover:translate-x-0.5">
            Schedule
            <ArrowRight size={14} />
          </div>
        </div>
      </motion.a>

      {/* Fallback capture — chat-qualified visitors who won't book still leave a lead */}
      {leadState === 'idle' && (
        <button
          type="button"
          onClick={() => setLeadState('open')}
          className="mt-1.5 text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
        >
          Not ready to book? Leave your email and Dave will reach out.
        </button>
      )}
      {(leadState === 'open' || leadState === 'sending' || leadState === 'error') && (
        <form onSubmit={submitLead} className="mt-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourfirm.com"
              className="w-full rounded-full border border-gray-300 bg-white py-2 pl-8 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none"
              disabled={leadState === 'sending'}
            />
          </div>
          <button
            type="submit"
            disabled={leadState === 'sending'}
            className="flex h-8 items-center gap-1 rounded-full bg-gray-900 px-3.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {leadState === 'sending' ? <Loader2 size={13} className="animate-spin" /> : 'Send'}
          </button>
        </form>
      )}
      {leadState === 'error' && (
        <p className="mt-1 text-xs text-red-500">Something went wrong — try again?</p>
      )}
      {leadState === 'sent' && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600">
          <Check size={14} />
          Got it — Dave will reach out shortly.
        </p>
      )}
    </div>
  )
}
