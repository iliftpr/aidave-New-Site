'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DEMO_MAX_USER_TURNS, getDemoVertical } from '@/lib/demo-verticals'

export type DemoRole = 'user' | 'assistant'

export type DemoMessage = {
  id: string
  role: DemoRole
  text: string
  /** Display-only opening text-back — NOT sent to the API (Anthropic requires the
   *  payload to start with a user message). */
  seed?: boolean
  streaming?: boolean
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10)
}

const FALLBACK_REPLY =
  "Sorry — the demo hit a snag. That's exactly why a real one has a human backup!"

/**
 * Drives the "Never Miss a Call" live demo against /api/receptionist-demo.
 * Mirrors the SSE-consumption pattern of components/dave-agent/hooks/useChat.ts,
 * but builds the outbound payload from a ref-tracked snapshot of committed
 * messages rather than reading a setState updater's side-effect (which is not a
 * reliable way to read just-set state under React 19).
 */
export function useReceptionistDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [complete, setComplete] = useState(false)

  // Always reflects the latest committed messages so send() can read the real base
  // synchronously without depending on setState timing.
  const messagesRef = useRef<DemoMessage[]>([])
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const verticalRef = useRef<string>('other')
  const inFlightRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  // Seed the conversation with the chosen vertical's greeting (display-only).
  const start = useCallback((verticalId: string) => {
    abortRef.current?.abort()
    abortRef.current = null
    inFlightRef.current = false
    verticalRef.current = verticalId
    const v = getDemoVertical(verticalId)
    const seeded: DemoMessage[] = [{ id: genId(), role: 'assistant', text: v.greeting, seed: true }]
    messagesRef.current = seeded
    setMessages(seeded)
    setError(null)
    setComplete(false)
    setStreaming(false)
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    inFlightRef.current = false
    messagesRef.current = []
    setMessages([])
    setError(null)
    setComplete(false)
    setStreaming(false)
  }, [])

  const send = useCallback(
    async (text: string) => {
      // Synchronous guard — React 19 batches setState, so reading `streaming` can
      // lag between two rapid calls.
      if (inFlightRef.current || complete) return
      const trimmed = text.trim()
      if (!trimmed) return

      inFlightRef.current = true
      setError(null)

      const base = messagesRef.current
      const userMsg: DemoMessage = { id: genId(), role: 'user', text: trimmed }
      const placeholder: DemoMessage = { id: genId(), role: 'assistant', text: '', streaming: true }

      const next = [...base, userMsg, placeholder]
      messagesRef.current = next
      setMessages(next)
      setStreaming(true)

      const ctrl = new AbortController()
      abortRef.current = ctrl

      // Outbound payload: drop the display-only seed greeting; the API requires the
      // conversation to start with the customer's first message.
      const outbound = [...base, userMsg]
        .filter((m) => !m.seed)
        .map((m) => ({ role: m.role, text: m.text }))
      const userTurnCount = outbound.filter((m) => m.role === 'user').length

      try {
        const res = await fetch('/api/receptionist-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vertical: verticalRef.current, messages: outbound }),
          signal: ctrl.signal,
        })

        if (abortRef.current !== ctrl) return

        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({}))) as {
            error?: string
            retryable?: boolean
          }
          const errText =
            errBody.error ||
            (res.status === 429
              ? 'Slow down a sec — try again in a moment.'
              : 'Sorry — the demo is taking a break. Book a free audit to see the real thing.')
          setError(errText)
          if (errBody.retryable) {
            // Transient (minute-cap): undo this turn so nothing broken enters the
            // history, keep the session open, and let the user try again shortly.
            messagesRef.current = base
            setMessages(base)
          } else {
            // Terminal (day-cap / 503): surface the error and the CTA.
            setMessages((prev) =>
              prev.map((m) => (m.id === placeholder.id ? { ...m, text: errText, streaming: false } : m))
            )
            setComplete(true)
          }
          return
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No stream')

        const decoder = new TextDecoder()
        let buffer = ''
        let assistantText = ''
        let lockedSignal = false
        let serverError = false

        outer: while (true) {
          const { done, value } = await reader.read()
          if (done) break
          if (abortRef.current !== ctrl) return
          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const payload = line.slice(6).trim()
            if (payload === '[DONE]') break outer
            let parsed: { text?: string; event?: string; error?: string }
            try {
              parsed = JSON.parse(payload)
            } catch {
              // Don't log the raw payload — it may echo visitor text.
              console.warn('[receptionist-demo] unparsable SSE payload', { len: payload.length })
              continue
            }
            if (parsed.error) {
              serverError = true
              assistantText += assistantText ? `\n\n${parsed.error}` : parsed.error
              setError(parsed.error)
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === placeholder.id ? { ...m, text: assistantText, streaming: false } : m
                )
              )
            }
            if (parsed.text) {
              assistantText += parsed.text
              setMessages((prev) =>
                prev.map((m) => (m.id === placeholder.id ? { ...m, text: assistantText } : m))
              )
            }
            if (parsed.event === 'conversation_locked') {
              lockedSignal = true
            }
          }
        }

        if (abortRef.current !== ctrl) return

        const isFinalTurn = userTurnCount >= DEMO_MAX_USER_TURNS

        // Stream ended with no text and no error event — never leave a blank bubble.
        if (!serverError && assistantText.trim() === '') {
          assistantText = FALLBACK_REPLY
          serverError = true
          setError(FALLBACK_REPLY)
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id ? { ...m, text: assistantText, streaming: false } : m
          )
        )

        // A mid-stream server error ends the run (and surfaces the CTA) so the error
        // text never gets resent to the model as a real assistant turn.
        if (lockedSignal || isFinalTurn || serverError) {
          setComplete(true)
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        const msg = err instanceof Error ? err.message : 'Connection lost'
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id
              ? {
                  ...m,
                  text: 'Connection hiccup — but that pause is exactly the lead you lose without this. Book a free audit?',
                  streaming: false,
                }
              : m
          )
        )
        setError(msg)
        setComplete(true)
      } finally {
        if (abortRef.current === ctrl) {
          abortRef.current = null
          setStreaming(false)
        }
        inFlightRef.current = false
      }
    },
    [complete]
  )

  const userTurns = messages.filter((m) => m.role === 'user').length

  return { messages, send, start, reset, streaming, error, complete, userTurns }
}
