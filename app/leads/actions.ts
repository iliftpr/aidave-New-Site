'use server'

import { revalidatePath } from 'next/cache'
import { updateLead, type LeadStatus } from '@/lib/lead-machine/db'

const STATUSES: LeadStatus[] = ['new', 'contacted', 'call_booked', 'won', 'lost']

export async function setStatus(id: string, status: string): Promise<void> {
  if (!STATUSES.includes(status as LeadStatus)) throw new Error('bad status')
  await updateLead(id, {
    status: status as LeadStatus,
    ...(status === 'contacted' ? { called_at: new Date().toISOString() } : {}),
  })
  revalidatePath('/leads')
}

export async function setNotes(id: string, notes: string): Promise<void> {
  await updateLead(id, { notes: notes.slice(0, 2000) })
  revalidatePath('/leads')
}
