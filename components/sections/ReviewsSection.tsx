'use client'

import { useEffect, useRef } from 'react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { ReviewCard } from '@/components/ui/ReviewCard'
import { REVIEWS } from '@/lib/constants'

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const scroll = () => {
      scrollPosition += scrollSpeed
      if (scrollContainer) {
        // Reset scroll when reaching halfway point (since we duplicate reviews)
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationFrameId)
    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll)
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      scrollContainer?.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Duplicate reviews for infinite scroll effect
  const duplicatedReviews = [...REVIEWS, ...REVIEWS]

  return (
    <section id="reviews" className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
      <div className="container-custom mb-12">
        {/* Section Header */}
        <ScrollReveal animation="fadeInUp" className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real results from real businesses. See how AI automation has transformed their operations.
          </p>
        </ScrollReveal>
      </div>

      {/* Scrolling Reviews */}
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden scrollbar-hide py-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
