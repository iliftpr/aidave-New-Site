export const DISCOVERY_URL =
  process.env.NEXT_PUBLIC_DISCOVERY_CALL_URL || 'https://cal.com/ilift/automation-audit'

export function genId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export type ChatRole = 'user' | 'assistant'

export type Attachment = {
  id: string
  name: string
  mediaType: string
  base64: string
  size: number
}

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  attachments?: Attachment[]
  showCta?: boolean
  streaming?: boolean
}

export type AgentMode = 'text' | 'voice'

export type VoiceStatus = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error'

export type VoiceTranscriptEntry = {
  id: string
  role: 'user' | 'agent'
  text: string
  final: boolean
}

export const MAX_USER_TURNS = 7
export const MAX_ATTACHMENTS = 3
export const MAX_FILE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_MIME = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'text/markdown',
]
export const ACCEPTED_EXTENSIONS = '.pdf,.png,.jpg,.jpeg,.webp,.txt,.md'

// Narrower set — older list ("call", "start", "estimate") fired on almost every
// reply since those words show up in normal sales conversation.
export const CTA_KEYWORDS =
  /\b(pricing|quote|how long|discovery call|schedule|book(ing)?|consult(ation)?)\b/i
