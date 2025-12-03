'use client'

import { Star } from 'lucide-react'
import { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg min-w-[350px] max-w-[350px] flex-shrink-0 mx-3 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-900">{review.name}</h4>
          <p className="text-sm text-gray-600">{review.business}</p>
        </div>
        {/* Avatar Placeholder */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {review.name.charAt(0)}
        </div>
      </div>

      {/* Stars */}
      <div className="flex space-x-1 mb-4">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed mb-4">
        "{review.text}"
      </p>

      {/* Industry Tag */}
      <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
        {review.industry}
      </div>
    </div>
  )
}
