'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'

type Props = {
  href: string
}

export function CTACard({ href }: Props) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group mt-2 block rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 p-[1.5px] no-underline shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-shadow"
    >
      <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-purple-600 text-white">
          <Calendar size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            Free 30-min Discovery Call
          </p>
          <p className="text-xs text-gray-500">
            Talk to Dave — no commitment, just a real conversation.
          </p>
        </div>
        <div className="flex h-9 items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-purple-600 px-3.5 text-xs font-semibold text-white shadow-sm transition-transform group-hover:translate-x-0.5">
          Schedule
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.a>
  )
}
