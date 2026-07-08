import { NextRequest } from 'next/server'
import { checkVoiceRateLimit, extractIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 15

function jsonError(message: string, status: number, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

export async function POST(request: NextRequest) {
  const ip = extractIp(request.headers)

  const rl = checkVoiceRateLimit(ip)
  if (!rl.ok) {
    return jsonError(
      'Too many voice sessions in the last hour — try again later or book a free Discovery Call.',
      429,
      { 'Retry-After': String(rl.retryAfter) }
    )
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID

  if (!apiKey || !agentId) {
    return jsonError('Voice mode is temporarily unavailable.', 503)
  }

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        headers: { 'xi-api-key': apiKey },
        cache: 'no-store',
      }
    )

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '')
      console.error('[/api/voice/agent-url] ElevenLabs upstream error:', upstream.status, text.slice(0, 200))
      return jsonError('Voice mode is temporarily unavailable.', 502)
    }

    const data = (await upstream.json()) as { signed_url?: string }
    if (!data.signed_url) {
      return jsonError('Voice mode is temporarily unavailable.', 502)
    }

    return new Response(JSON.stringify({ signedUrl: data.signed_url }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/voice/agent-url] fetch failed:', msg)
    return jsonError('Voice mode is temporarily unavailable.', 502)
  }
}
