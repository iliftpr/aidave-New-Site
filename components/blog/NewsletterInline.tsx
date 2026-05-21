import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

interface NewsletterInlineProps {
  variant?: 'inline' | 'compact'
}

export function NewsletterInline({ variant = 'inline' }: NewsletterInlineProps) {
  if (variant === 'compact') {
    return (
      <div className="not-prose my-8 rounded-xl bg-gray-900 text-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="font-heading font-bold text-base mb-0.5">
            Get the weekly digest
          </div>
          <p className="text-xs text-gray-300">
            Three posts a week. Mid-market AI ops only. No fluff.
          </p>
        </div>
        <Link
          href="/scorecard"
          className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Subscribe <ArrowRight size={14} />
        </Link>
      </div>
    )
  }

  return (
    <aside
      aria-label="Subscribe to the newsletter"
      className="not-prose my-12 rounded-2xl bg-gradient-to-br from-gray-900 to-primary-950 text-white p-7 md:p-10 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
        <Mail size={22} />
      </div>
      <h3 className="font-heading font-bold text-2xl md:text-3xl mb-3">
        Three posts a week. Zero fluff.
      </h3>
      <p className="text-gray-300 text-sm md:text-base max-w-md mx-auto mb-6">
        Get Dave&apos;s weekly read on AI news — translated through the 4-Lever lens
        for mid-market and enterprise operators.
      </p>
      <Link
        href="/scorecard"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
      >
        Take the 4-Lever Audit + subscribe
        <ArrowRight size={18} />
      </Link>
      <p className="mt-4 text-xs text-gray-400">
        Free · 12 questions · 5 min · scored results emailed to you
      </p>
    </aside>
  )
}
