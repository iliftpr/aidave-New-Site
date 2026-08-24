'use client'

import { useState, useTransition } from 'react'
import { setStatus, setNotes } from './actions'
import type { LeadRow as Row } from '@/lib/lead-machine/db'

// Superset of the statuses the older site paths (contact form, scorecard, cal.com) already write.
const STATUSES = ['new', 'contacted', 'call_booked', 'proposal', 'won', 'lost'] as const
const SOURCE_LABEL: Record<string, string> = {
  meta_form: 'Form',
  meta_lp: 'LP',
  contact_form: 'Site contact',
  scorecard: 'Scorecard',
  cal_booking: 'Booked call',
  dave_agent: 'Chat agent',
}

function age(iso: string): string {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (m < 60) return `${m}m`
  if (m < 1440) return `${Math.round(m / 60)}h`
  return `${Math.round(m / 1440)}d`
}

export function LeadRow({ lead }: { lead: Row }) {
  const [pending, start] = useTransition()
  const [notes, setLocalNotes] = useState(lead.notes ?? '')
  const t = (lead.tracking ?? {}) as Record<string, string>
  const src = SOURCE_LABEL[lead.source] ?? lead.source
  const meta = [src, lead.vertical, t.ad_name].filter(Boolean).join(' · ')

  return (
    <tr className={`border-b align-top ${lead.status === 'new' ? 'bg-yellow-50' : ''}`}>
      <td className="whitespace-nowrap p-3 text-xs text-gray-500">{age(lead.created_at)}</td>
      <td className="p-3">
        <div className="font-semibold">{lead.name || '—'}</div>
        <div className="text-sm text-gray-600">{lead.company || ''}</div>
      </td>
      <td className="whitespace-nowrap p-3">
        {lead.phone_e164 ? (
          <a className="font-semibold text-primary-700 underline" href={`tel:${lead.phone_e164}`}>
            {lead.phone_e164}
          </a>
        ) : (
          '—'
        )}
        <div className="text-xs text-gray-500">{lead.email || ''}</div>
      </td>
      <td className="p-3 text-sm">
        {lead.pain?.replace(/_/g, ' ') || '—'}
        <div className="text-xs text-gray-500">{meta}</div>
      </td>
      <td className="p-3">
        <select
          defaultValue={lead.status}
          disabled={pending}
          onChange={(e) => {
            const v = e.target.value
            start(() => setStatus(lead.id, v))
          }}
          className="rounded border px-2 py-1 text-sm"
          aria-label="Status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </td>
      <td className="p-3">
        <textarea
          defaultValue={notes}
          rows={2}
          className="w-56 rounded border px-2 py-1 text-sm"
          aria-label="Notes"
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (lead.notes ?? '')) start(() => setNotes(lead.id, notes))
          }}
        />
      </td>
    </tr>
  )
}
