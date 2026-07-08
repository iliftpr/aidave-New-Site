'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileText, Image as ImageIcon } from 'lucide-react'
import { DISCOVERY_URL, type ChatMessage } from './types'
import { CTACard } from './CTACard'
import { TypingIndicator } from './TypingIndicator'

const DISALLOWED_HTML = ['iframe', 'script', 'style', 'embed', 'object', 'form', 'input']

function safeHref(href: string | undefined): string {
  if (!href) return '#'
  return /^(https?:|mailto:|tel:)/i.test(href) ? href : '#'
}

function AttachmentBadge({ name, mediaType }: { name: string; mediaType: string }) {
  const isImage = mediaType.startsWith('image/')
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs text-white/95 backdrop-blur-sm">
      {isImage ? <ImageIcon size={12} /> : <FileText size={12} />}
      <span className="max-w-[140px] truncate">{name}</span>
    </span>
  )
}

export function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const isStreaming = message.streaming && !message.text

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[85%] flex-col items-end gap-1.5">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1.5">
              {message.attachments.map((a) => (
                <AttachmentBadge key={a.id} name={a.name} mediaType={a.mediaType} />
              ))}
            </div>
          )}
          {message.text && (
            <div className="rounded-2xl rounded-tr-md bg-gradient-to-br from-sky-500 to-indigo-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
              {message.text}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
        <Image
          src="/images/dave-headshot.jpeg"
          alt="Dave"
          fill
          sizes="28px"
          className="object-cover"
        />
      </div>
      <div className="flex max-w-[85%] flex-col gap-2">
        {isStreaming ? (
          <TypingIndicator />
        ) : (
          <div className="rounded-2xl rounded-tl-md bg-white/95 px-4 py-2.5 text-sm leading-relaxed text-gray-800 ring-1 ring-gray-200 shadow-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              disallowedElements={DISALLOWED_HTML}
              unwrapDisallowed
              components={{
                a: ({ children, href }) => (
                  <a
                    href={safeHref(href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 underline hover:text-sky-700"
                  >
                    {children}
                  </a>
                ),
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
        {message.showCta && <CTACard href={DISCOVERY_URL} />}
      </div>
    </div>
  )
}
