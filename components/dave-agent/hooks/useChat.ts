'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Attachment,
  ChatMessage,
  CTA_KEYWORDS,
  MAX_USER_TURNS,
  genId,
} from '../types'

function buildOutboundMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role,
    text: m.text,
    attachments: m.attachments?.map((a) => ({
      name: a.name,
      mediaType: a.mediaType,
      base64: a.base64,
    })),
  }))
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const ctaShownRef = useRef(false)
  const inFlightRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    inFlightRef.current = false
    setMessages([])
    setError(null)
    setLocked(false)
    setStreaming(false)
    ctaShownRef.current = false
  }, [])

  const send = useCallback(
    async (text: string, attachments: Attachment[] = []) => {
      // Synchronous guard — React 19 batches setState; reading `streaming`
      // can return false between two rapid calls before commit.
      if (inFlightRef.current || locked) return
      const trimmed = text.trim()
      if (!trimmed && attachments.length === 0) return

      inFlightRef.current = true
      setError(null)

      const userMsg: ChatMessage = {
        id: genId(),
        role: 'user',
        text: trimmed,
        attachments: attachments.length ? attachments : undefined,
      }
      const placeholder: ChatMessage = {
        id: genId(),
        role: 'assistant',
        text: '',
        streaming: true,
      }

      let snapshot: ChatMessage[] = []
      setMessages((prev) => {
        snapshot = [...prev, userMsg, placeholder]
        return snapshot
      })
      setStreaming(true)

      const ctrl = new AbortController()
      abortRef.current = ctrl

      try {
        const outboundHistory = buildOutboundMessages(
          snapshot.slice(0, -1)
        )

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: outboundHistory }),
          signal: ctrl.signal,
        })

        if (abortRef.current !== ctrl) return

        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({}))) as { error?: string }
          const errText =
            errBody.error ||
            (res.status === 429
              ? 'Slow down a sec — try again in a moment.'
              : 'Sorry — something went wrong.')
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholder.id
                ? { ...m, text: errText, streaming: false, showCta: true }
                : m
            )
          )
          setError(errText)
          return
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No stream')

        const decoder = new TextDecoder()
        let buffer = ''
        let assistantText = ''
        let lockedSignal = false

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
              continue
            }
            if (parsed.error) {
              assistantText += `\n\n${parsed.error}`
            }
            if (parsed.text) {
              assistantText += parsed.text
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === placeholder.id ? { ...m, text: assistantText } : m
                )
              )
            }
            if (parsed.event === 'conversation_locked') {
              lockedSignal = true
            }
          }
        }

        // Bail if reset() fired during the stream.
        if (abortRef.current !== ctrl) return

        const userTurnCount = snapshot.filter((m) => m.role === 'user').length
        const isFinalTurn = userTurnCount >= MAX_USER_TURNS
        const matchedKeyword = CTA_KEYWORDS.test(assistantText)
        const isFirstCtaTrigger =
          !ctaShownRef.current && (matchedKeyword || userTurnCount >= 3)
        const shouldShowCta = lockedSignal || isFinalTurn || isFirstCtaTrigger

        if (shouldShowCta) ctaShownRef.current = true

        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id
              ? { ...m, streaming: false, showCta: shouldShowCta }
              : m
          )
        )

        if (lockedSignal || isFinalTurn) {
          setLocked(true)
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // reset() aborted us — nothing more to do
          return
        }
        const msg = err instanceof Error ? err.message : 'Connection lost'
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id
              ? {
                  ...m,
                  text: 'Connection hiccup — try the Schedule button below.',
                  streaming: false,
                  showCta: true,
                }
              : m
          )
        )
        setError(msg)
      } finally {
        if (abortRef.current === ctrl) {
          abortRef.current = null
          setStreaming(false)
        }
        inFlightRef.current = false
      }
    },
    [locked]
  )

  return { messages, send, streaming, error, locked, reset }
}
