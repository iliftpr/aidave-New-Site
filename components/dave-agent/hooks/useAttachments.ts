'use client'

import { useCallback, useState } from 'react'
import {
  ACCEPTED_MIME,
  Attachment,
  MAX_ATTACHMENTS,
  MAX_FILE_BYTES,
  genId,
} from '../types'

function inferMediaType(file: File): string {
  if (file.type) return file.type
  if (file.name.endsWith('.md')) return 'text/markdown'
  if (file.name.endsWith('.txt')) return 'text/plain'
  return ''
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read file'))
        return
      }
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Read error'))
    reader.readAsDataURL(file)
  })
}

export type UseAttachments = ReturnType<typeof useAttachments>

export function useAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [error, setError] = useState<string | null>(null)

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError(null)
    const incoming = Array.from(files)
    const accepted: Attachment[] = []
    let nextError: string | null = null

    for (const file of incoming) {
      const mediaType = inferMediaType(file)
      if (!ACCEPTED_MIME.includes(mediaType)) {
        nextError = `Unsupported file: ${file.name}`
        continue
      }
      if (file.size > MAX_FILE_BYTES) {
        nextError = `Too large: ${file.name} (max 5MB)`
        continue
      }
      try {
        const base64 = await fileToBase64(file)
        accepted.push({
          id: genId(),
          name: file.name,
          mediaType,
          base64,
          size: file.size,
        })
      } catch {
        nextError = `Could not read ${file.name}`
      }
    }

    if (accepted.length > 0) {
      setAttachments((prev) => {
        const room = Math.max(0, MAX_ATTACHMENTS - prev.length)
        if (accepted.length > room) {
          nextError = `Up to ${MAX_ATTACHMENTS} files per message.`
        }
        return [...prev, ...accepted.slice(0, room)]
      })
    }

    if (nextError) setError(nextError)
  }, [])

  const remove = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const clear = useCallback(() => {
    setAttachments([])
    setError(null)
  }, [])

  return { attachments, addFiles, remove, clear, error }
}
