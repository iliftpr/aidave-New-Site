import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  SERVICE_LABELS,
  ENGAGEMENT_TYPE_LABELS,
  TIMEFRAME_OPTIONS,
} from '@/lib/constants'
import type {
  ServiceType,
  EngagementType,
  EngagementTimeframe,
} from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

function escape(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Strip CRLF — prevents SMTP header injection via subject lines built from user input
function stripHeader(s: unknown): string {
  return String(s ?? '').replace(/[\r\n]+/g, ' ').trim()
}

function formatTimeframe(t?: EngagementTimeframe): string {
  if (!t) return ''
  const found = TIMEFRAME_OPTIONS.find((o) => o.value === t)
  return found ? found.label : t
}

function formatEngagementTypes(types?: EngagementType[]): string {
  if (!types || types.length === 0) return ''
  return types.map((t) => ENGAGEMENT_TYPE_LABELS[t] ?? t).join(' + ')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      message,
      service,
      company,
      engagementTypes,
      timeframe,
      website,
      source,
    } = body as {
      name?: string
      email?: string
      phone?: string
      message?: string
      service?: ServiceType
      company?: string
      engagementTypes?: EngagementType[]
      timeframe?: EngagementTimeframe
      website?: string
      source?: string
    }

    // Honeypot — bots fill the "website" field, humans don't.
    // Silently 200 OK and drop without emailing.
    if (website && website.trim().length > 0) {
      console.warn('[contact] Honeypot tripped — silent drop')
      return NextResponse.json({ success: true, message: 'Message sent successfully' })
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Basic email shape — rejects CRLF / header-injection vectors via replyTo
    const emailRegex = /^[^\s@<>"'\\]+@[^\s@<>"'\\]+\.[^\s@<>"'\\]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (service === 'fractional') {
      if (!company || !company.trim()) {
        return NextResponse.json({ error: 'Company is required' }, { status: 400 })
      }
      if (!Array.isArray(engagementTypes) || engagementTypes.length === 0) {
        return NextResponse.json({ error: 'Pick at least one engagement type' }, { status: 400 })
      }
      if (!timeframe) {
        return NextResponse.json({ error: 'Timeframe is required' }, { status: 400 })
      }
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const serviceLabel =
      service && service in SERVICE_LABELS ? SERVICE_LABELS[service] : 'General inquiry'

    let subject: string
    let html: string

    if (service === 'fractional') {
      const engagement = formatEngagementTypes(engagementTypes)
      const tf = formatTimeframe(timeframe)
      subject = `[ILift Fractional] ${stripHeader(company)} — ${tf} — ${engagement}`
      html = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
          <h2 style="background:linear-gradient(135deg,#0284c7 0%,#9333ea 100%);color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;margin:0;font-size:18px">
            Embedded AI Growth Partner — new inquiry
          </h2>
          <div style="border:1px solid #e2e8f0;border-top:none;padding:20px;border-radius:0 0 8px 8px;background:#fff">
            <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden">
              <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600;width:35%">Name</td><td style="padding:8px 12px;background:#fff">${escape(name)}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600">Company</td><td style="padding:8px 12px;background:#fff">${escape(company)}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600">Email</td><td style="padding:8px 12px;background:#fff"><a href="mailto:${escape(email)}" style="color:#0284c7;text-decoration:none">${escape(email)}</a></td></tr>
              <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600">Phone</td><td style="padding:8px 12px;background:#fff">${phone ? escape(phone) : '<span style="color:#94a3b8">Not provided</span>'}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600">Engagement</td><td style="padding:8px 12px;background:#fff">${escape(engagement)}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600">Timeframe</td><td style="padding:8px 12px;background:#fff">${escape(tf)}</td></tr>
            </table>
            <h3 style="margin:20px 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b">What success looks like</h3>
            <div style="padding:12px;background:#f8fafc;border-radius:6px;white-space:pre-wrap;line-height:1.6;font-size:14px">${escape(message)}</div>
            <p style="color:#94a3b8;font-size:11px;margin-top:20px;border-top:1px solid #e2e8f0;padding-top:12px">
              Sent from ilift.com — Embedded AI Growth Partner inquiry
            </p>
          </div>
        </div>
      `
    } else {
      subject =
        source === 'dave-agent'
          ? `[ILift Chat Lead] ${stripHeader(email)}`
          : `[ILift] ${serviceLabel}: ${stripHeader(name)}`
      html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Interest:</strong> ${escape(serviceLabel)}</p>
        <p><strong>Name:</strong> ${escape(name)}</p>
        <p><strong>Email:</strong> ${escape(email)}</p>
        <p><strong>Phone:</strong> ${phone ? escape(phone) : 'Not provided'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escape(message).replace(/\n/g, '<br />')}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">This message was sent from the ILift website contact form.</p>
      `
    }

    const { data, error } = await resend.emails.send({
      from: 'ILift Website <hello@ilift.com>',
      to: ['dave@ilift.com'],
      subject,
      html,
      replyTo: email,
    })

    if (error) {
      console.error('Resend API error:', error)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    // Confirmation to the lead — best-effort; a failure here must not fail the lead
    try {
      await resend.emails.send({
        from: 'Dave at ILift <hello@ilift.com>',
        to: [email],
        subject: 'Got your message — ILift (AI Dave)',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;line-height:1.6">
            <p>Hi${name && name !== 'AI chat visitor' ? ` ${escape(name)}` : ''},</p>
            <p>Thanks for reaching out — your message landed in Dave's inbox and he replies personally, usually within one business day.</p>
            <p>If you'd rather skip the back-and-forth, grab a free 30-minute discovery call directly:</p>
            <p><a href="https://cal.com/ilift/automation-audit" style="color:#0284c7;font-weight:600">Book a discovery call &rarr;</a></p>
            <p style="margin-top:24px">— Dave Gakshteyn<br/>ILift · East Meadow, NY<br/><a href="https://ilift.com" style="color:#0284c7">ilift.com</a></p>
          </div>
        `,
        replyTo: 'dave@ilift.com',
      })
    } catch (confirmError) {
      console.error('[contact] Lead confirmation email failed (non-fatal):', confirmError)
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: data?.id,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
