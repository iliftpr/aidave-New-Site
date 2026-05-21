'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { ProjectItem, ProjectStatus } from '@/types'

interface ProjectCardProps {
  item: ProjectItem
  index: number
}

const statusStyles: Record<ProjectStatus, string> = {
  Live: 'bg-green-100 text-green-700 ring-1 ring-green-200',
  Beta: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  'Personal Lab': 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
}

const baseClass =
  'group relative block overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:border-primary-200 transition-all duration-500'

const motionProps = (index: number) => ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, delay: index * 0.1 },
  whileHover: { y: -8 },
})

function CardMedia({ item }: { item: ProjectItem }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      if (mq.matches) {
        video.pause()
        video.removeAttribute('autoplay')
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-secondary-900/30 z-10 group-hover:opacity-0 transition-opacity duration-500" />
      {item.videoSrc ? (
        <video
          ref={videoRef}
          src={item.videoSrc}
          poster={item.imageDesktop}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <Image
          src={item.imageDesktop}
          alt={`${item.title} screenshot`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      )}

      <div className="absolute top-4 left-4 z-20">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${statusStyles[item.status]}`}
        >
          {item.status}
        </span>
      </div>

      {item.liveUrl && (
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center justify-center w-9 h-9 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      )}
    </div>
  )
}

function CardBody({ item }: { item: ProjectItem }) {
  return (
    <>
      <CardMedia item={item} />
      <div className="p-6">
        <h3 className="text-xl font-bold font-heading text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
          {item.title}
        </h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {item.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

export function ProjectCard({ item, index }: ProjectCardProps) {
  if (item.liveUrl) {
    return (
      <motion.a
        href={item.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${item.title} in a new tab`}
        {...motionProps(index)}
        className={`${baseClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2`}
      >
        <CardBody item={item} />
      </motion.a>
    )
  }

  return (
    <motion.div {...motionProps(index)} className={baseClass}>
      <CardBody item={item} />
    </motion.div>
  )
}
