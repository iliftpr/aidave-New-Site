'use client'

import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChatBubble } from './ChatBubble'
import { ChatWindow } from './ChatWindow'
import { DISCOVERY_URL, type AgentMode } from './types'

const VISITED_KEY = 'dave-agent-visited'
const HIDDEN_KEY = 'dave-agent-hidden-forever'

export default function DaveAgent() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AgentMode>('text')
  const [visited, setVisited] = useState(false)
  const [hiddenForever, setHiddenForever] = useState(false)
  const [showNudge, setShowNudge] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (localStorage.getItem(HIDDEN_KEY) === '1') {
        setHiddenForever(true)
      }
      if (sessionStorage.getItem(VISITED_KEY) === '1') {
        setVisited(true)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    if (!mounted || visited || hiddenForever) return
    const t = window.setTimeout(() => setShowNudge(true), 8000)
    const dismiss = window.setTimeout(() => setShowNudge(false), 14000)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(dismiss)
    }
  }, [mounted, visited, hiddenForever])

  if (!mounted || hiddenForever) return null

  const handleOpen = () => {
    setShowNudge(false)
    setOpen(true)
    if (!visited) {
      setVisited(true)
      try {
        sessionStorage.setItem(VISITED_KEY, '1')
      } catch {
        // ignore
      }
    }
  }

  const handleClose = () => {
    setOpen(false)
    setMode('text')
  }

  return (
    <>
      {!open && (
        <ChatBubble
          onOpen={handleOpen}
          visited={visited}
          showNudge={showNudge && !open}
          onDismissNudge={handleOpen}
        />
      )}
      <AnimatePresence>
        {open && (
          <ChatWindow
            key="chat-window"
            onClose={handleClose}
            mode={mode}
            setMode={setMode}
            discoveryUrl={DISCOVERY_URL}
          />
        )}
      </AnimatePresence>
    </>
  )
}
