'use client'

import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { requestAgentOpen } from '@/lib/agent-open'

/**
 * "Talk to the AI on this page" CTA for server-rendered pages. Opens the
 * floating dave-agent widget (buffered if its lazy chunk hasn't mounted yet)
 * and warms the chunk on mount so the open is instant.
 */
export function TalkToAIButton({ className = '' }: { className?: string }) {
  useEffect(() => {
    import('@/components/dave-agent/DaveAgent')
  }, [])

  return (
    <Button onClick={() => requestAgentOpen()} variant="secondary" size="lg" className={className}>
      <MessageCircle size={20} />
      Talk to the AI on this page &rarr;
    </Button>
  )
}
