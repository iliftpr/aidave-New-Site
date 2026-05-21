import { CheckCircle2 } from 'lucide-react'

interface KeyTakeawaysProps {
  items: string[]
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  if (!items || items.length === 0) return null

  return (
    <aside
      aria-label="Key takeaways"
      className="not-prose my-8 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100 p-6 md:p-7"
    >
      <h2 className="font-heading font-bold text-base uppercase tracking-widest text-primary-700 mb-4 flex items-center gap-2">
        <CheckCircle2 size={18} />
        Key Takeaways
      </h2>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-gray-800 leading-relaxed">
            <span
              aria-hidden
              className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-primary-700 text-xs font-bold font-heading shadow-sm"
            >
              {i + 1}
            </span>
            <span className="text-sm md:text-base">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
