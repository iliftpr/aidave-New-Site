'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { genId, type VoiceStatus, type VoiceTranscriptEntry } from '../types'

type IncomingEvent =
  | { type: 'conversation_initiation_metadata' }
  | {
      type: 'audio'
      audio_event: { audio_base_64: string; event_id?: number }
    }
  | {
      type: 'user_transcript'
      user_transcription_event: { user_transcript: string }
    }
  | {
      type: 'agent_response'
      agent_response_event: { agent_response: string }
    }
  | {
      type: 'agent_response_correction'
      agent_response_correction_event: { corrected_agent_response: string }
    }
  | { type: 'interruption'; interruption_event: { reason?: string } }
  | { type: 'ping'; ping_event: { event_id: number; ping_ms?: number } }
  | { type: string; [k: string]: unknown }

const SAMPLE_RATE_IN = 16000
// Skip outbound audio frames when the WebSocket has more than this many bytes
// buffered locally — prevents unbounded latency growth on slow uplinks.
const WS_BUFFER_BACKPRESSURE_BYTES = 64 * 1024

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!)
  return btoa(bin)
}

function pcm16BytesToFloat32(bytes: Uint8Array): Float32Array<ArrayBuffer> {
  const samples = Math.floor(bytes.byteLength / 2)
  const out = new Float32Array(new ArrayBuffer(samples * 4))
  for (let i = 0; i < samples; i++) {
    const lo = bytes[i * 2] ?? 0
    const hi = bytes[i * 2 + 1] ?? 0
    let s = (hi << 8) | lo
    if (s & 0x8000) s = s - 0x10000
    out[i] = s / 0x8000
  }
  return out
}

function float32ToPcm16Base64(float: Float32Array): string {
  const buf = new ArrayBuffer(float.length * 2)
  const view = new DataView(buf)
  for (let i = 0; i < float.length; i++) {
    const s = Math.max(-1, Math.min(1, float[i]!))
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return bytesToBase64(new Uint8Array(buf))
}

function downsampleTo16k(
  input: Float32Array,
  inputRate: number
): Float32Array<ArrayBuffer> {
  const ratio = inputRate / SAMPLE_RATE_IN
  if (inputRate === SAMPLE_RATE_IN) {
    const copy = new Float32Array(new ArrayBuffer(input.length * 4))
    copy.set(input)
    return copy
  }
  const outLen = Math.floor(input.length / ratio)
  const out = new Float32Array(new ArrayBuffer(outLen * 4))
  for (let i = 0; i < outLen; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.min(input.length, Math.floor((i + 1) * ratio))
    let sum = 0
    for (let j = start; j < end; j++) sum += input[j]!
    out[i] = sum / Math.max(1, end - start)
  }
  return out
}

export function useElevenLabsAgent() {
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const [transcript, setTranscript] = useState<VoiceTranscriptEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const silentSinkRef = useRef<GainNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const playQueueRef = useRef<{ data: Float32Array<ArrayBuffer>; gen: number }[]>([])
  const playingRef = useRef(false)
  // Bumped on every `interruption` event so stale audio frames already in flight
  // get discarded instead of being played after the interruption.
  const generationRef = useRef(0)

  const playNextChunk = useCallback(() => {
    const ctx = audioCtxRef.current
    if (!ctx) {
      playingRef.current = false
      return
    }
    // Drop any stale generations queued before the latest interruption.
    while (
      playQueueRef.current.length > 0 &&
      playQueueRef.current[0]!.gen !== generationRef.current
    ) {
      playQueueRef.current.shift()
    }
    const next = playQueueRef.current.shift()
    if (!next) {
      playingRef.current = false
      setStatus((s) => (s === 'speaking' ? 'listening' : s))
      return
    }
    playingRef.current = true
    setStatus('speaking')
    const buffer = ctx.createBuffer(1, next.data.length, SAMPLE_RATE_IN)
    buffer.copyToChannel(next.data, 0)
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.connect(ctx.destination)
    src.onended = () => playNextChunk()
    src.start()
  }, [])

  const stop = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.close()
      } catch {
        // ignore
      }
    }
    wsRef.current = null

    processorRef.current?.disconnect()
    processorRef.current = null
    silentSinkRef.current?.disconnect()
    silentSinkRef.current = null
    sourceRef.current?.disconnect()
    sourceRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {})
    }
    audioCtxRef.current = null
    playQueueRef.current = []
    playingRef.current = false
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    setError(null)
    setTranscript([])
    setStatus('connecting')

    let signedUrl: string
    try {
      const res = await fetch('/api/voice/agent-url', { method: 'POST' })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error || 'Voice unavailable')
      }
      const data = (await res.json()) as { signedUrl?: string }
      if (!data.signedUrl) throw new Error('No signed URL')
      signedUrl = data.signedUrl
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Voice setup failed'
      setError(msg)
      setStatus('error')
      return
    }

    let mediaStream: MediaStream
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError('Microphone access denied.')
      setStatus('error')
      return
    }
    streamRef.current = mediaStream

    const AudioContextCtor: typeof AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new AudioContextCtor()
    audioCtxRef.current = ctx
    const source = ctx.createMediaStreamSource(mediaStream)
    sourceRef.current = source

    const processor = ctx.createScriptProcessor(4096, 1, 1)
    processorRef.current = processor

    const ws = new WebSocket(signedUrl)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'conversation_initiation_client_data',
        })
      )
      setStatus('listening')
    }

    ws.onmessage = (event) => {
      let data: IncomingEvent | null = null
      try {
        data = JSON.parse(event.data) as IncomingEvent
      } catch {
        return
      }
      if (!data || !data.type) return

      switch (data.type) {
        case 'audio': {
          const ev = (data as Extract<IncomingEvent, { type: 'audio' }>).audio_event
          if (!ev?.audio_base_64) return
          try {
            const bytes = base64ToBytes(ev.audio_base_64)
            const float = pcm16BytesToFloat32(bytes)
            playQueueRef.current.push({ data: float, gen: generationRef.current })
            if (!playingRef.current) playNextChunk()
          } catch {
            // ignore decode errors
          }
          break
        }
        case 'user_transcript': {
          const ev = (data as Extract<IncomingEvent, { type: 'user_transcript' }>)
            .user_transcription_event
          if (!ev) return
          setTranscript((prev) => [
            ...prev,
            { id: genId(), role: 'user', text: ev.user_transcript, final: true },
          ])
          setStatus('thinking')
          break
        }
        case 'agent_response': {
          const ev = (data as Extract<IncomingEvent, { type: 'agent_response' }>)
            .agent_response_event
          if (!ev) return
          setTranscript((prev) => [
            ...prev,
            { id: genId(), role: 'agent', text: ev.agent_response, final: true },
          ])
          break
        }
        case 'agent_response_correction': {
          const ev = (
            data as Extract<IncomingEvent, { type: 'agent_response_correction' }>
          ).agent_response_correction_event
          if (!ev) return
          setTranscript((prev) => {
            const out = [...prev]
            for (let i = out.length - 1; i >= 0; i--) {
              if (out[i]!.role === 'agent') {
                out[i] = { ...out[i]!, text: ev.corrected_agent_response }
                return out
              }
            }
            return out
          })
          break
        }
        case 'interruption': {
          generationRef.current++
          playQueueRef.current = []
          playingRef.current = false
          setStatus('listening')
          break
        }
        case 'ping': {
          const ev = (data as Extract<IncomingEvent, { type: 'ping' }>).ping_event
          if (ev && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'pong', event_id: ev.event_id }))
          }
          break
        }
      }
    }

    ws.onerror = () => {
      setError('Voice connection error.')
      setStatus('error')
    }
    ws.onclose = () => {
      setStatus((s) => (s === 'error' ? 'error' : 'idle'))
    }

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return
      // Drop frames if the local WS buffer is backing up — keeps latency bounded
      // on slow uplinks instead of accumulating a long send queue.
      if (ws.bufferedAmount > WS_BUFFER_BACKPRESSURE_BYTES) return
      const input = e.inputBuffer.getChannelData(0)
      const down = downsampleTo16k(input, ctx.sampleRate)
      const b64 = float32ToPcm16Base64(down)
      ws.send(JSON.stringify({ user_audio_chunk: b64 }))
    }

    // ScriptProcessorNode requires a destination to fire `onaudioprocess`, but
    // connecting to ctx.destination would route the mic back to the speakers
    // and create acoustic feedback. Route to a silent gain node instead.
    const silentSink = ctx.createGain()
    silentSink.gain.value = 0
    silentSink.connect(ctx.destination)
    silentSinkRef.current = silentSink
    source.connect(processor)
    processor.connect(silentSink)
  }, [playNextChunk])

  useEffect(() => () => stop(), [stop])

  return { status, transcript, error, start, stop }
}
