import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildReceptionistPrompt, DEMO_FINAL_DIRECTIVE } from '@/lib/demo-receptionist-prompt'
import { checkChatRateLimit, extractIp } from '@/lib/rate-limit'
import { DEMO_MAX_USER_TURNS, DEMO_VERTICAL_IDS } from '@/lib/demo-verticals'

export const runtime = 'nodejs'
export const maxDuration = 30

// Haiku: this is a public, high-volume demo toy. Haiku 4.5 is plenty for a scoped
// receptionist persona, ~12x cheaper than Opus, and lower latency = a snappier,
// more text-message-like feel. Alias auto-resolves to the latest 4.5 snapshot.
const MODEL = 'claude-haiku-4-5'

// 8 user turns + up to ~8 assistant turns, with headroom. The greeting is shown
// client-side only and is NOT sent in the payload, so it doesn't count here.
const MAX_MESSAGES_PAYLOAD = 24
const MAX_TEXT_CHARS = 1000

type ClientMessage = { role: 'user' | 'assistant'; text: string }

function jsonError(message: string, status: number, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

// This is a public, unauthenticated endpoint. A POST with Content-Type:
// application/json triggers a CORS preflight (so foreign sites can't hit it that
// way), but a "simple" cross-origin POST (text/plain) skips preflight and would
// still execute server-side and burn tokens. Reject foreign browser origins;
// fail OPEN when there's no Origin (same-origin navigations / non-browser callers
// send none) so legitimate use is never blocked.
const ALLOWED_ORIGIN_HOSTS = new Set(['ilift.com', 'www.ilift.com', 'localhost', '127.0.0.1'])

function originAllowed(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  let host: string
  try {
    host = new URL(origin).hostname
  } catch {
    return false
  }
  if (ALLOWED_ORIGIN_HOSTS.has(host) || host.endsWith('.vercel.app')) return true
  // Same-origin: the Origin host matches the request's own host.
  const reqHost = request.headers.get('host')?.split(':')[0]
  return !!reqHost && host === reqHost
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError('The live demo is temporarily unavailable.', 503)
  }

  if (!originAllowed(request)) {
    return jsonError('Forbidden', 403)
  }

  let body: { vertical?: unknown; messages?: unknown }
  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  // The vertical id is interpolated into the system prompt, so it MUST come from a
  // fixed allowlist — never trust the raw client value (prompt-injection vector).
  const vertical =
    typeof body.vertical === 'string' && DEMO_VERTICAL_IDS.includes(body.vertical)
      ? body.vertical
      : 'other'

  const messages = Array.isArray(body.messages) ? (body.messages as ClientMessage[]) : []
  if (messages.length === 0) {
    return jsonError('At least one message is required', 400)
  }
  if (messages.length > MAX_MESSAGES_PAYLOAD) {
    return jsonError('Conversation too long', 400)
  }

  for (const m of messages) {
    if (!m || typeof m !== 'object') {
      return jsonError('Invalid message', 400)
    }
    if (m.role !== 'user' && m.role !== 'assistant') {
      return jsonError('Invalid message role', 400)
    }
    if (typeof m.text !== 'string') {
      return jsonError('Message text must be a string', 400)
    }
    if (m.text.length > MAX_TEXT_CHARS) {
      return jsonError(`Message too long (max ${MAX_TEXT_CHARS} chars)`, 400)
    }
  }

  // Anthropic requires the conversation to begin with a user message. The demo's
  // greeting is display-only and excluded by the client, so the first payload entry
  // should always be the customer's reply.
  const first = messages[0]
  if (!first || first.role !== 'user') {
    return jsonError('Conversation must start with a customer message', 400)
  }

  // Rate limit AFTER validation so malformed requests don't burn slots. Namespaced
  // ('demo:') so it has its own bucket separate from the main /api/chat agent.
  // extractIp() hands header-stripped requests a unique random key (so a proxy-less
  // user can't be DoS'd via a shared 'unknown' bucket) — but for THIS public demo
  // that would give every scripted no-header caller its own unlimited bucket, so we
  // collapse them all into one shared 'no-ip' bucket to keep them jointly capped.
  const rawIp = extractIp(request.headers)
  const ip = rawIp.startsWith('anon-') ? 'no-ip' : rawIp
  const rl = checkChatRateLimit(`demo:${ip}`, { minuteCap: 8, dayCap: 60 })
  if (!rl.ok) {
    const isDay = rl.reason === 'day'
    // `retryable` lets the client keep a minute-capped session open instead of
    // ending it at the CTA (the message tells the user to try again shortly).
    return new Response(
      JSON.stringify({
        error: isDay
          ? "You've reached the demo limit for today — want this for real? Book a free audit."
          : 'One sec — give it a moment and try again.',
        retryable: !isDay,
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfter) },
      }
    )
  }

  const userTurns = messages.filter((m) => m.role === 'user').length
  const isFinalTurn = userTurns >= DEMO_MAX_USER_TURNS

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.text,
  }))

  const basePrompt = buildReceptionistPrompt(vertical)
  const system = isFinalTurn ? `${basePrompt}\n\n---\n\n${DEMO_FINAL_DIRECTIVE}` : basePrompt

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const encoder = new TextEncoder()

  // Abort the upstream Anthropic request if the client disconnects or the consumer
  // cancels the stream — otherwise an abandoned generation keeps billing tokens.
  const upstream = new AbortController()
  request.signal.addEventListener('abort', () => upstream.abort())

  const FALLBACK = "Sorry — the demo hit a snag. That's exactly why a real one has a human backup!"

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false
      // Guarded so a post-cancel enqueue (controller already closed) can't throw and
      // take down the error path with it.
      const raw = (s: string) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(s))
        } catch {
          closed = true
        }
      }
      const send = (event: Record<string, unknown>) => raw(`data: ${JSON.stringify(event)}\n\n`)
      const close = () => {
        if (closed) return
        closed = true
        try {
          controller.close()
        } catch {
          /* already closed by a cancel */
        }
      }

      try {
        const anthropicStream = client.messages.stream(
          {
            model: MODEL,
            max_tokens: isFinalTurn ? 200 : 256,
            system,
            messages: anthropicMessages,
          },
          { signal: upstream.signal }
        )

        let sawText = false
        for await (const event of anthropicStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            sawText = true
            send({ text: event.delta.text })
          }
        }

        // A successful-but-empty completion (refusal, non-text stop, truncation)
        // would otherwise render as a blank bubble — fail loudly instead.
        if (!sawText) {
          console.error('[/api/receptionist-demo] empty completion', { isFinalTurn })
          send({ error: FALLBACK })
        } else if (isFinalTurn) {
          send({ event: 'conversation_locked' })
        }
        raw('data: [DONE]\n\n')
        close()
      } catch (err) {
        const apiErr = err as { status?: number; name?: string; error?: { type?: string } }
        // Client disconnect / consumer cancel — not an error, just stop quietly.
        if (apiErr?.name === 'AbortError' || upstream.signal.aborted) {
          close()
          return
        }
        // Log only structured fields — visitor text (which may include a real phone
        // number they typed) must never leak into logs via error.message.
        console.error('[/api/receptionist-demo] stream error', {
          status: apiErr?.status,
          name: apiErr?.name,
          errorType: apiErr?.error?.type,
        })
        send({ error: FALLBACK })
        raw('data: [DONE]\n\n')
        close()
      }
    },
    cancel() {
      upstream.abort()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
