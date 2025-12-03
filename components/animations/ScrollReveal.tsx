'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { fadeInUp, fadeIn, scaleIn } from '@/lib/animations'

interface ScrollRevealProps {
  children: ReactNode
  animation?: 'fadeIn' | 'fadeInUp' | 'scaleIn'
  delay?: number
  className?: string
}

const animationVariants: Record<string, Variants> = {
  fadeIn,
  fadeInUp,
  scaleIn,
}

export function ScrollReveal({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const selectedVariant = animationVariants[animation]
  const variantWithDelay = {
    ...selectedVariant,
    visible: {
      ...selectedVariant.visible,
      transition: {
        ...(selectedVariant.visible as any).transition,
        delay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variantWithDelay}
      className={className}
    >
      {children}
    </motion.div>
  )
}
