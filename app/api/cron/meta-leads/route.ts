import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/lead-machine/env'
import { syncMetaLeads } from '@/lib/lead-machine/meta-leads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Vercel cron (every minute, see vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`. */
export async function GET(request: NextRequest) {
  const secret = env.cronSecret()
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const result = await syncMetaLeads()
  return NextResponse.json(result)
}
