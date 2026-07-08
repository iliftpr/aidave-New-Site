'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage } from './types'
import { Message } from './Message'

type Props = {
  messages: ChatMessage[]
}

export function MessageList({ messages }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom || messages[messages.length - 1]?.role === 'user') {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  return (
    <div
      ref={scrollerRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      <div ref={endRef} />
    </div>
  )
}
