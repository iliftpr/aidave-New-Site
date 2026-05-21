import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ForwardedBar() {
  return (
    <div className="not-prose rounded-xl bg-primary-50 border border-primary-200 px-5 py-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
      <span className="text-gray-700">Was this forwarded to you?</span>
      <Link
        href="/scorecard"
        className="font-bold text-primary-700 hover:text-primary-800 inline-flex items-center gap-1 self-start sm:self-auto"
      >
        Take the free 4-Lever Audit <ArrowRight size={14} />
      </Link>
    </div>
  )
}
