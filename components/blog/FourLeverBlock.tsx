import { Phone, Calendar, MessageSquare, BarChart3 } from 'lucide-react'
import type { FourLeverLever } from '@/lib/posts'
import { LEVER_LABELS } from '@/lib/posts'

const LEVER_ICONS: Record<FourLeverLever, typeof Phone> = {
  1: Phone,
  2: Calendar,
  3: MessageSquare,
  4: BarChart3,
}

interface FourLeverBlockProps {
  lever?: FourLeverLever
  children: React.ReactNode
}

export function FourLeverBlock({ lever, children }: FourLeverBlockProps) {
  const Icon = lever ? LEVER_ICONS[lever] : null
  const label = lever ? LEVER_LABELS[lever] : null

  return (
    <aside
      aria-label="What this means for operators"
      className="not-prose my-10 rounded-2xl border-l-4 border-primary-600 bg-gray-50 p-6 md:p-7"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="font-heading font-bold text-xs uppercase tracking-widest text-primary-700">
          What this means for operators
        </span>
        {label && Icon && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white px-2.5 py-1 rounded-full border border-gray-200">
            <Icon size={12} className="text-primary-600" />
            Lever {lever}: {label}
          </span>
        )}
      </div>
      <div className="text-gray-800 leading-relaxed space-y-3 text-sm md:text-base">
        {children}
      </div>
    </aside>
  )
}
