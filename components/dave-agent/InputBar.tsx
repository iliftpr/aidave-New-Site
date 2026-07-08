'use client'

import { AnimatePresence } from 'framer-motion'
import { ArrowUp, Mic } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AttachmentChip } from './AttachmentChip'
import { FileUploadButton } from './FileUploadButton'
import type { Attachment } from './types'

type Props = {
  onSend: (text: string, attachments: Attachment[]) => void
  onVoice: () => void
  onFiles: (files: FileList | File[]) => void
  onRemoveAttachment: (id: string) => void
  attachments: Attachment[]
  attachmentError: string | null
  streaming: boolean
}

const MAX_INPUT_CHARS = 4000

export function InputBar({
  onSend,
  onVoice,
  onFiles,
  onRemoveAttachment,
  attachments,
  attachmentError,
  streaming,
}: Props) {
  const [text, setText] = useState('')
  const taRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 144) + 'px'
  }, [text])

  const canSend = !streaming && (text.trim().length > 0 || attachments.length > 0)

  const submit = () => {
    if (!canSend) return
    onSend(text, attachments)
    setText('')
  }

  return (
    <div className="border-t border-gray-200/70 bg-white/85 backdrop-blur-md px-3 py-2.5">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5 px-1">
          <AnimatePresence>
            {attachments.map((a) => (
              <AttachmentChip
                key={a.id}
                name={a.name}
                mediaType={a.mediaType}
                size={a.size}
                onRemove={() => onRemoveAttachment(a.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
      {attachmentError && (
        <p className="mb-2 px-1 text-xs text-rose-600">{attachmentError}</p>
      )}
      <div className="flex items-end gap-1.5 rounded-2xl bg-white px-2 py-1.5 ring-1 ring-gray-200 focus-within:ring-sky-300 transition-shadow">
        <FileUploadButton onFiles={onFiles} disabled={streaming} />
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_INPUT_CHARS))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Ask about Dave's work, attach a doc, or say what you're trying to ship…"
          rows={1}
          className="flex-1 resize-none bg-transparent px-1 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          aria-label="Message"
        />
        <button
          type="button"
          onClick={onVoice}
          disabled={streaming}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40"
          aria-label="Switch to voice mode"
          title="Talk to Dave's AI"
        >
          <Mic size={18} />
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-purple-600 text-white shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none"
          aria-label="Send message"
        >
          <ArrowUp size={16} />
        </button>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-gray-400">
        Up to 3 files · 5 MB each · PDFs up to 30 pages
      </p>
    </div>
  )
}
