'use client'

import { Download, FileText, Youtube } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { FABLE_LINKS, INSTALL_STEPS, DOWNLOAD_CONTENTS } from '@/lib/fable-content'

export function DownloadCTA() {
  const reduce = useReducedMotion() ?? false
  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-dark rounded-2xl border border-white/10 p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-heading text-lg font-bold text-white">What&apos;s in the download</h3>
            <ul className="mt-4 space-y-3">
              {DOWNLOAD_CONTENTS.map((d) => (
                <li key={d.file}>
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-amber-300">{d.file}</code>
                  <p className="mt-1 text-sm text-white/60">{d.desc}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Install in 30 seconds</h3>
            <ol className="mt-4 space-y-3">
              {INSTALL_STEPS.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <motion.a
          href={FABLE_LINKS.downloadZip}
          download
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          className="inline-flex items-center gap-3 rounded-2xl border-2 border-amber-600 bg-amber-500 px-8 py-4 text-lg font-extrabold text-white shadow-xl shadow-amber-500/40 transition-colors hover:bg-amber-600"
        >
          <Download size={22} />
          Download the Fable Method
        </motion.a>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a
            href={FABLE_LINKS.rawSkill}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <FileText size={16} />
            View the raw SKILL.md
          </a>
          <a
            href={FABLE_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <Youtube size={16} />
            Watch the walkthrough
          </a>
        </div>
        <p className="text-xs text-white/40">Free · one file · works on Opus or Sonnet · no API key</p>
      </div>
    </div>
  )
}
