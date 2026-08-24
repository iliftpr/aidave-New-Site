import type { Metadata } from 'next'
import { listLeads } from '@/lib/lead-machine/db'
import { LeadRow } from './LeadRow'

export const metadata: Metadata = {
  title: 'Leads — iLift',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await listLeads(300)
  const fresh = leads.filter((l) => l.status === 'new').length

  return (
    <main className="container-custom py-8">
      <h1 className="font-heading text-2xl font-bold">
        Leads{' '}
        <span className="ml-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
          {fresh} new
        </span>
      </h1>
      <p className="mt-1 text-sm text-gray-500">Newest first. Tap a number to call. Status and notes save automatically.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-3">Age</th>
              <th className="p-3">Who</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Pain / source</th>
              <th className="p-3">Status</th>
              <th className="p-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td className="p-6 text-gray-500" colSpan={6}>
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((l) => <LeadRow key={l.id} lead={l} />)
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
