'use client'

import { motion } from 'framer-motion'
import { FileText, Image as ImageIcon, X } from 'lucide-react'

type Props = {
  name: string
  mediaType: string
  size: number
  onRemove: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentChip({ name, mediaType, size, onRemove }: Props) {
  const isImage = mediaType.startsWith('image/')
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="inline-flex max-w-[200px] items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs text-gray-700 ring-1 ring-gray-200 shadow-sm"
    >
      {isImage ? (
        <ImageIcon size={12} className="flex-shrink-0 text-sky-600" />
      ) : (
        <FileText size={12} className="flex-shrink-0 text-purple-600" />
      )}
      <span className="truncate font-medium">{name}</span>
      <span className="text-[10px] text-gray-400">{formatSize(size)}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label={`Remove ${name}`}
      >
        <X size={10} />
      </button>
    </motion.div>
  )
}
