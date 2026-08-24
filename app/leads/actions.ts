'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { updateLead, type LeadStatus } from '@/lib/lead-machine/db'
import { checkBasicAuth } from '@/lib/lead-machine/basic-auth'

const STATUSES: LeadStatus[] = ['new', 'contacted', 'call_booked', 'proposal', 'won', 'lost']

/**
 * Server Actions are public HTTP endpoints addressed by action id, not by page path, so the
 * middleware gate on /leads does not protect them. Re-check the same Basic credentials here.
 */
async function assertAuthorized(): Promise<void> {
  const h = await headers()
  const ok = checkBasicAuth(
    h.get('authorization'),
    process.env.LEADS_DASH_USER ?? '',
    process.env.LEADS_DASH_PASS ?? '',
  )
  if (!ok) throw new Error('unauthorized')
}

export async function setStatus(id: string, status: string): Promise<void> {
  await assertAuthorized()
  if (!STATUSES.includes(status as LeadStatus)) throw new Error('bad status')
  await updateLead(id, {
    status: status as LeadStatus,
    ...(status === 'contacted' ? { called_at: new Date().toISOString() } : {}),
  })
  revalidatePath('/leads')
}

export async function setNotes(id: string, notes: string): Promise<void> {
  await assertAuthorized()
  await updateLead(id, { notes: notes.slice(0, 2000) })
  revalidatePath('/leads')
}
