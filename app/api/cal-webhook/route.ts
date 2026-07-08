import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'
import { recordLead } from '@/lib/leads'

const resend = new Resend(process.env.RESEND_API_KEY)

// Only fire notifications for booking-state changes (skip MEETING_*, FORM_*, etc.)
const NOTIFY_TRIGGERS = new Set([
  'BOOKING_CREATED',
  'BOOKING_PAID',
  'BOOKING_CANCELLED',
  'BOOKING_RESCHEDULED',
  'BOOKING_REQUESTED',
])

const TRIGGER_EMOJI: Record<string, string> = {
  BOOKING_CREATED: '📅',
  BOOKING_PAID: '💰',
  BOOKING_CANCELLED: '❌',
  BOOKING_RESCHEDULED: '🔄',
  BOOKING_REQUESTED: '⏳',
}

// Optional: verify Cal.com signature if CAL_WEBHOOK_SECRET is set
function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!process.env.CAL_WEBHOOK_SECRET) return true
  if (!signature) return false
  const expected = crypto
    .createHmac('sha256', process.env.CAL_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

function escapeTg(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn('[cal-webhook] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not configured — skipped Telegram')
    return
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[cal-webhook] Telegram send failed:', res.status, body)
  }
}

function fmtDate(iso?: string): string {
  if (!iso) return 'TBD'
  try {
    return new Date(iso).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return iso
  }
}

function escape(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-cal-signature-256')

    if (!verifySignature(rawBody, signature)) {
      console.error('[cal-webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const trigger: string = event.triggerEvent ?? 'UNKNOWN'
    const p = event.payload ?? {}

    const eventName: string = p.eventTitle || p.title || p.type || 'Booking'
    const startTime: string = p.startTime
    const endTime: string = p.endTime
    const organizer = p.organizer ?? {}
    const attendee = (p.attendees ?? [])[0] ?? {}
    const responses = p.responses ?? p.userFieldsResponses ?? {}
    const bookingId = p.uid || p.id || p.bookingId || ''
    const paid = p.paid === true || p.metadata?.paymentStatus === 'paid' || trigger === 'BOOKING_PAID'
    const price = p.price ?? p.metadata?.apps?.stripe?.price
    const currency = p.currency ?? 'usd'

    // Format responses as a table of question → answer
    const responseRows = Object.entries(responses)
      .filter(([k]) => !['email', 'name', 'guests', 'rescheduleReason', 'title', 'location'].includes(k))
      .map(([k, v]) => {
        const val = typeof v === 'object' && v !== null && 'value' in (v as object) ? (v as { value: unknown }).value : v
        return `<tr><td style="padding:6px 12px;background:#f8fafc;font-weight:600;text-align:left;width:35%">${escape(k)}</td><td style="padding:6px 12px;background:#fff">${escape(val)}</td></tr>`
      })
      .join('')

    // Filter out non-booking triggers (MEETING_*, FORM_*, etc.) — they're not actionable
    if (!NOTIFY_TRIGGERS.has(trigger)) {
      return NextResponse.json({ ok: true, trigger, skipped: 'non-booking trigger' })
    }

    const priceLine = price ? `<p><strong>Price:</strong> $${(Number(price) / 100).toFixed(2)} ${String(currency).toUpperCase()} ${paid ? '✅ PAID' : '⏳ PENDING'}</p>` : ''

    const subject = `[ILift] ${trigger.replace('BOOKING_', '').toLowerCase()}: ${eventName} — ${attendee.name || attendee.email || 'unknown'}`

    // Email body (HTML)
    const emailHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:600px;margin:0 auto;color:#0f172a">
        <h2 style="background:linear-gradient(135deg,#0284c7 0%,#9333ea 100%);color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;margin:0">
          ${escape(trigger)} — ${escape(eventName)}
        </h2>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:20px;border-radius:0 0 8px 8px;background:#fff">
          <p><strong>When:</strong> ${fmtDate(startTime)} → ${fmtDate(endTime)}</p>
          <p><strong>Attendee:</strong> ${escape(attendee.name || '')} &lt;${escape(attendee.email || '')}&gt;</p>
          ${priceLine}
          ${bookingId ? `<p><strong>Booking ID:</strong> ${escape(bookingId)}</p>` : ''}
          ${
            responseRows
              ? `<h3 style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:16px">Intake responses</h3><table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden">${responseRows}</table>`
              : ''
          }
          <p style="color:#64748b;font-size:12px;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:16px">
            Sent by ilift.com/api/cal-webhook · Cal.com → Resend → dave@ilift.com + metspa@gmail.com
          </p>
        </div>
      </div>
    `

    // Telegram message (HTML)
    const emoji = TRIGGER_EMOJI[trigger] || '🔔'
    const tgLines = [
      `${emoji} <b>${escapeTg(trigger.replace('BOOKING_', ''))}</b>`,
      `<b>${escapeTg(eventName)}</b>`,
      `🗓 ${escapeTg(fmtDate(startTime))}`,
      `👤 ${escapeTg(attendee.name || 'unknown')} — ${escapeTg(attendee.email || '')}`,
    ]
    if (price) {
      tgLines.push(`💳 $${(Number(price) / 100).toFixed(2)} ${String(currency).toUpperCase()} ${paid ? '✅ PAID' : '⏳ pending'}`)
    }
    if (bookingId) {
      tgLines.push(`<i>booking: ${escapeTg(bookingId)}</i>`)
    }
    // Intake answers in Telegram message (skip default fields)
    for (const [k, v] of Object.entries(responses).slice(0, 6)) {
      if (['email', 'name', 'guests', 'rescheduleReason', 'title', 'location'].includes(k)) continue
      const val = typeof v === 'object' && v !== null && 'value' in (v as object) ? (v as { value: unknown }).value : v
      const valStr = String(val ?? '').slice(0, 200)
      if (!valStr) continue
      tgLines.push(`• <b>${escapeTg(k)}:</b> ${escapeTg(valStr)}`)
    }
    const tgText = tgLines.join('\n')

    // Fire email + Telegram in parallel; one failing doesn't block the other
    const tasks: Promise<unknown>[] = []
    if (process.env.RESEND_API_KEY) {
      tasks.push(
        resend.emails.send({
          from: 'ILift Bookings <bookings@ilift.com>',
          to: ['dave@ilift.com', 'metspa@gmail.com'],
          subject,
          html: emailHtml,
          replyTo: attendee.email || undefined,
        })
      )
    } else {
      console.warn('[cal-webhook] RESEND_API_KEY not configured — skipped email')
    }
    tasks.push(sendTelegram(tgText))

    // CRM-lite: a new/paid/requested booking is a pipeline lead (fail-soft)
    if (
      ['BOOKING_CREATED', 'BOOKING_PAID', 'BOOKING_REQUESTED'].includes(trigger) &&
      attendee.email
    ) {
      tasks.push(
        recordLead({
          name: attendee.name || undefined,
          email: attendee.email,
          source: 'cal_booking',
          service: eventName,
          message: bookingId ? `Cal.com booking ${bookingId} (${trigger})` : trigger,
          status: 'call_booked',
        })
      )
    }

    const results = await Promise.allSettled(tasks)
    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length > 0) {
      console.error('[cal-webhook] notification failures:', failures.map((f) => (f as PromiseRejectedResult).reason))
    }

    return NextResponse.json({
      ok: true,
      trigger,
      eventName,
      notified: { email: results[0]?.status === 'fulfilled', telegram: results[results.length - 1]?.status === 'fulfilled' },
    })
  } catch (err) {
    console.error('[cal-webhook] error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'cal-webhook',
    description: 'POST Cal.com booking events here (BOOKING_CREATED, BOOKING_PAID, BOOKING_CANCELLED, BOOKING_RESCHEDULED).',
  })
}
