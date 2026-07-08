'use client'

import { useRef } from 'react'
import { Paperclip } from 'lucide-react'
import { ACCEPTED_EXTENSIONS } from './types'

type Props = {
  onFiles: (files: FileList | File[]) => void
  disabled?: boolean
}

export function FileUploadButton({ onFiles, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS}
        className="sr-only"
        onChange={(e) => {
          const files = e.target.files
          if (files && files.length > 0) onFiles(files)
          if (inputRef.current) inputRef.current.value = ''
        }}
        aria-label="Attach files"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Attach a file"
        title="Attach a PDF, image, or text file"
      >
        <Paperclip size={18} />
      </button>
    </>
  )
}
