'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ChatHeader } from './ChatHeader'
import { ConversationLockCard } from './ConversationLockCard'
import { InputBar } from './InputBar'
import { MessageList } from './MessageList'
import { QuickPrompts } from './QuickPrompts'
import { VoiceMode } from './VoiceMode'
import { useAttachments } from './hooks/useAttachments'
import { useChat } from './hooks/useChat'
import type { AgentMode } from './types'

type Props = {
  onClose: () => void
  mode: AgentMode
  setMode: (m: AgentMode) => void
  discoveryUrl: string
}

export function ChatWindow({ onClose, mode, setMode, discoveryUrl }: Props) {
  const { messages, send, streaming, locked, reset } = useChat()
  const { attachments, addFiles, remove, clear, error: attachmentError } = useAttachments()
  const windowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    windowRef.current?.focus()
  }, [])

  const handleSend = async (text: string, atts: typeof attachments) => {
    await send(text, atts)
    clear()
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (mode !== 'text' || locked || streaming) return
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (mode !== 'text' || locked || streaming) return
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void addFiles(e.dataTransfer.files)
    }
  }

  return (
    <motion.div
      ref={windowRef}
      role="dialog"
      aria-label="Dave's AI Assistant"
      aria-modal="false"
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 16 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: 'bottom right' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="
        fixed z-[60] flex flex-col overflow-hidden bg-white/80 backdrop-blur-2xl backdrop-saturate-150
        ring-1 ring-black/5 shadow-2xl
        inset-x-2 bottom-2 top-2 rounded-3xl
        sm:inset-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[640px] sm:max-h-[calc(100vh-7rem)] sm:w-[400px] sm:rounded-3xl
      "
    >
      <ChatHeader
        mode={mode}
        onToggleVoice={() => setMode(mode === 'voice' ? 'text' : 'voice')}
        onClose={onClose}
        discoveryUrl={discoveryUrl}
      />

      {mode === 'voice' ? (
        <VoiceMode onExit={() => setMode('text')} />
      ) : (
        <>
          <MessageList messages={messages} />
          {messages.length === 0 && !locked && (
            <QuickPrompts onPick={(t) => void handleSend(t, [])} />
          )}
          {locked ? (
            <ConversationLockCard href={discoveryUrl} onReset={reset} />
          ) : (
            <InputBar
              onSend={(t, a) => void handleSend(t, a)}
              onVoice={() => setMode('voice')}
              onFiles={(f) => void addFiles(f)}
              onRemoveAttachment={remove}
              attachments={attachments}
              attachmentError={attachmentError}
              streaming={streaming}
            />
          )}
        </>
      )}
    </motion.div>
  )
}
