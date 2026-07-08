'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Download } from 'lucide-react'

// Slim, dark-aware header for the /fable campaign page — mirrors the page-local
// header pattern used on /demo, but themed for the dark cinematic page so the
// light global Header's gray nav doesn't sit low-contrast over the dark hero.
export function FableHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-white/10 bg-gray-950/80 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          <a href="/" className="flex items-center gap-3" aria-label="ILift by AI Dave — home">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/20">
              <Image src="/images/dave-headshot.jpeg" alt="AI Dave" fill sizes="40px" className="object-cover" />
            </div>
            <span className="font-heading text-lg font-extrabold text-white">
              ILift <span className="font-semibold text-white/40">by AI Dave</span>
            </span>
          </a>
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-600 bg-amber-500 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-amber-500/30 transition-colors hover:bg-amber-600"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download the skill</span>
            <span className="sm:hidden">Download</span>
          </a>
        </div>
      </div>
    </header>
  )
}
