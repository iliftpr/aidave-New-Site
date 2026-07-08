'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { recordLead } from '@/lib/leads'
import { LEVERS, type ScoreMap, leverTotals, lowestLever } from '@/lib/scorecard-content'

interface ScorecardSubmission {
  name: string
  email: string
  company?: string
  role?: string
  scores: ScoreMap
}

export interface SubmissionResult {
  ok: boolean
  totals: Record<1 | 2 | 3 | 4, number>
  lowestLeverId: 1 | 2 | 3 | 4 | null
  emailSent: boolean
  beehiivSubscribed?: boolean
  error?: string
}

function validate(input: ScorecardSubmission): string | null {
  if (!input.name?.trim()) return 'Name is required.'
  if (!input.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
    return 'A valid email is required.'
  const allQuestionIds = LEVERS.flatMap((l) => l.questions.map((q) => q.id))
  for (const qid of allQuestionIds) {
    const v = input.scores[qid]
    if (typeof v !== 'number' || v < 1 || v > 5) {
      return `Score for question ${qid} must be between 1 and 5.`
    }
  }
  return null
}

async function persistSubmission(input: ScorecardSubmission, totals: Record<1 | 2 | 3 | 4, number>) {
  // Append to a local JSON file so submissions are never lost while Beehiiv / CRM is being wired.
  // In production on Vercel this writes to /tmp; locally it writes to data/. Both are acceptable for
  // the short window before the email layer is the source of truth.
  const dir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data')
  await fs.mkdir(dir, { recursive: true })
  const file = path.join(dir, 'scorecard-submissions.jsonl')
  const entry = {
    submittedAt: new Date().toISOString(),
    ...input,
    totals,
  }
  await fs.appendFile(file, JSON.stringify(entry) + '\n', 'utf-8')
}

async function subscribeToBeehiiv(
  input: ScorecardSubmission,
  totals: Record<1 | 2 | 3 | 4, number>,
): Promise<boolean> {
  const apiKey = process.env.BEEHIIV_API_KEY
  const pubId = process.env.BEEHIIV_PUBLICATION_ID
  if (!apiKey || !pubId || apiKey.startsWith('PENDING_')) {
    console.warn('[scorecard] BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID missing/pending — skipping subscribe')
    return false
  }

  const lowest = lowestLever(input.scores)
  try {
    const res = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: input.email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: 'scorecard',
        utm_medium: 'website',
        utm_campaign: 'scorecard-4-lever',
        custom_fields: [
          { name: 'First Name', value: input.name.split(' ')[0] },
          { name: 'Full Name', value: input.name },
          { name: 'Company', value: input.company || '' },
          { name: 'Role', value: input.role || '' },
          { name: 'Lowest Lever', value: lowest?.name || '' },
          { name: 'Lowest Lever ID', value: String(lowest?.id || '') },
          { name: 'Lever 1 Total', value: String(totals[1]) },
          { name: 'Lever 2 Total', value: String(totals[2]) },
          { name: 'Lever 3 Total', value: String(totals[3]) },
          { name: 'Lever 4 Total', value: String(totals[4]) },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text().catch(() => '<no body>')
      console.error('[scorecard] Beehiiv subscribe failed', res.status, err)
      return false
    }
    return true
  } catch (e) {
    console.error('[scorecard] Beehiiv subscribe threw', e)
    return false
  }
}

function emailHtml(input: ScorecardSubmission, totals: Record<1 | 2 | 3 | 4, number>): string {
  const lowest = lowestLever(input.scores)
  const leverRows = LEVERS.map((lever) => {
    const total = totals[lever.id]
    const isLowest = lever.id === lowest?.id
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;${isLowest ? 'background:#fef3c7;font-weight:600;' : ''}">
          Lever ${lever.id} — ${lever.name}${isLowest ? ' &larr; YOUR FIRST SPRINT' : ''}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;${isLowest ? 'background:#fef3c7;font-weight:600;' : ''}">
          ${total} / 15
        </td>
      </tr>
    `
  }).join('')

  const sprintBlock = lowest
    ? `
      <h2 style="font-family:Poppins,sans-serif;color:#0c4a6e;margin-top:32px;">Your first sprint: Lever ${lowest.id} — ${lowest.name}</h2>
      <p style="color:#374151;line-height:1.6;">${lowest.firstSprint.diagnosis}</p>
      <p style="color:#374151;margin-top:16px;"><strong>Typical 4–6 week scope:</strong></p>
      <ul style="color:#374151;line-height:1.7;">
        ${lowest.firstSprint.scope.map((s) => `<li>${s}</li>`).join('')}
      </ul>
      <p style="color:#374151;"><strong>Typical investment:</strong> ${lowest.firstSprint.investment}</p>
      <p style="color:#374151;"><strong>Typical return:</strong> ${lowest.firstSprint.typicalReturn}</p>
    `
    : ''

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#1f2937;">
      <h1 style="font-family:Poppins,sans-serif;color:#0c4a6e;">Hey ${input.name.split(' ')[0]} —</h1>
      <p style="line-height:1.6;">Here's your 4-Lever Automation Audit, scored.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-family:Inter,Arial,sans-serif;">
        ${leverRows}
      </table>
      ${sprintBlock}
      <h2 style="font-family:Poppins,sans-serif;color:#0c4a6e;margin-top:32px;">Want a 30-min outside read?</h2>
      <p style="line-height:1.6;">I run a free 30-min Automation Audit. You walk me through your scorecard, I ask 6–8 questions about your lowest Lever, and I leave you with a 3-option roadmap — regardless of whether you ever hire me.</p>
      <p style="margin:24px 0;">
        <a href="https://cal.com/ilift/automation-audit" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Book the free 30-min audit</a>
      </p>
      <p style="line-height:1.6;color:#4b5563;font-size:14px;">
        — Dave Gakshteyn<br>
        Founder, ILift<br>
        <a href="https://www.linkedin.com/in/aiautomationpro/" style="color:#0284c7;">linkedin.com/in/aiautomationpro</a> · <a href="https://ilift.com" style="color:#0284c7;">ilift.com</a>
      </p>
    </div>
  `
}

export async function submitScorecard(input: ScorecardSubmission): Promise<SubmissionResult> {
  const err = validate(input)
  if (err) {
    return { ok: false, totals: { 1: 0, 2: 0, 3: 0, 4: 0 }, lowestLeverId: null, emailSent: false, error: err }
  }

  const totals = leverTotals(input.scores)
  const lowest = lowestLever(input.scores)

  // Persist regardless of email outcome so no submission is ever lost.
  try {
    await persistSubmission(input, totals)
  } catch (e) {
    console.error('[scorecard] persistence failed', e)
  }

  // CRM-lite: scorecard opt-in is a pipeline lead (fail-soft)
  await recordLead({
    name: input.name,
    email: input.email,
    company: input.company,
    source: 'scorecard',
    service: '4-Lever Automation Scorecard',
    message: lowest
      ? `Lowest lever: ${lowest.name} (L1 ${totals[1]} / L2 ${totals[2]} / L3 ${totals[3]} / L4 ${totals[4]})`
      : undefined,
  })

  // Beehiiv subscribe — primary delivery once configured. Returns false gracefully when
  // BEEHIIV_API_KEY is unset or PENDING, so Resend fallback below still runs.
  const beehiivSubscribed = await subscribeToBeehiiv(input, totals)

  // Resend send.
  //   - If Beehiiv took the subscriber: send a Dave-only notification (no copy to subscriber;
  //     Beehiiv's automation sequence handles Email 1 with the results).
  //   - If Beehiiv is not yet configured: send the full results email to the subscriber + BCC Dave
  //     (current behavior — keeps deliverability working until Beehiiv is wired).
  let emailSent = false
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    try {
      const resend = new Resend(resendKey)
      const fromAddress = process.env.RESEND_FROM_ADDRESS || 'Dave Gakshteyn <dave@ilift.com>'
      const bcc = process.env.RESEND_BCC_ADDRESS || 'dave@ilift.com'

      if (beehiivSubscribed) {
        // Beehiiv is primary — send Dave a notification only.
        await resend.emails.send({
          from: fromAddress,
          to: bcc,
          subject: `[Scorecard opt-in] ${input.name} — lowest: ${lowest?.name ?? 'unknown'}`,
          html: emailHtml(input, totals),
        })
      } else {
        // Fallback — Beehiiv not configured or failed. Send full results to subscriber.
        await resend.emails.send({
          from: fromAddress,
          to: input.email,
          bcc,
          subject: `Your 4-Lever Audit results — first sprint: ${lowest?.name ?? 'see inside'}`,
          html: emailHtml(input, totals),
        })
      }
      emailSent = true
    } catch (e) {
      console.error('[scorecard] email send failed', e)
    }
  } else {
    console.warn('[scorecard] RESEND_API_KEY missing — submission persisted, email skipped')
  }

  return {
    ok: true,
    totals,
    lowestLeverId: lowest?.id ?? null,
    emailSent,
    beehiivSubscribed,
  }
}
