'use client'

import Image from 'next/image'
import { Calendar, Mic, MicOff, X } from 'lucide-react'
import type { AgentMode } from './types'

type Props = {
  mode: AgentMode
  onToggleVoice: () => void
  onClose: () => void
  discoveryUrl: string
}

export function ChatHeader({ mode, onToggleVoice, onClose, discoveryUrl }: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200/70 bg-white/70 px-4 py-3 backdrop-blur-md">
      <div className="relative h-9 w-9 flex-shrink-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 220deg at 50% 50%, #0ea5e9, #6366f1, #a855f7, #ec4899, #0ea5e9)',
            padding: 2,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            <Image
              src="/images/dave-headshot.jpeg"
              alt="Dave Gakshteyn"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight text-gray-900">Dave&rsquo;s AI</p>
        <p className="text-[11px] text-gray-500 leading-tight">
          {mode === 'voice' ? 'Voice mode — say hi' : 'Usually replies instantly'}
        </p>
      </div>
      <a
        href={discoveryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-purple-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:shadow transition-shadow"
        title="Book a free 30-min Discovery Call"
      >
        <Calendar size={12} />
        Book call
      </a>
      <button
        type="button"
        onClick={onToggleVoice}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label={mode === 'voice' ? 'Switch to text mode' : 'Switch to voice mode'}
      >
        {mode === 'voice' ? <MicOff size={16} /> : <Mic size={16} />}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Close chat"
      >
        <X size={18} />
      </button>
    </div>
  )
}
