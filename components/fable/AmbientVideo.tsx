'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

interface AmbientVideoProps {
  mp4: string
  webm: string
  poster: string
  /** wrapper sizing/positioning — defaults to a full-bleed background layer */
  className?: string
  /** opacity utility, e.g. "opacity-60" */
  opacityClass?: string
  /** hero = true → play immediately; others lazily mount + play only when near view */
  eager?: boolean
}

// Background video that keeps weight down: the poster is painted as a CSS
// background (LCP-friendly, no <img>), and the <video> only mounts + plays when
// the section is near the viewport, pausing when it leaves. Reduced motion hides
// the video entirely, leaving the poster.
export function AmbientVideo({
  mp4,
  webm,
  poster,
  className = 'absolute inset-0',
  opacityClass = 'opacity-60',
  eager = false,
}: AmbientVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(wrapRef, { margin: '200px' })
  const active = eager || inView

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) v.play?.().catch(() => {})
    else v.pause?.()
  }, [active])

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-cover bg-center ${opacityClass}`}
        style={{ backgroundImage: `url(${poster})` }}
      />
      {active && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover ${opacityClass} motion-reduce:hidden`}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          preload={eager ? 'metadata' : 'none'}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
