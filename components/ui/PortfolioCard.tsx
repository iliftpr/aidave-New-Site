'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ArrowUpRight } from 'lucide-react'
import { PortfolioItem } from '@/types'
import Image from 'next/image'

interface PortfolioCardProps {
  item: PortfolioItem
  index: number
}

export function PortfolioCard({ item, index }: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100 hover:border-primary-200"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-secondary-900/20 z-10 group-hover:opacity-0 transition-opacity duration-500" />
        <Image
          src={item.imageDesktop || "/images/portfolio-placeholder.png"}
          alt={item.title}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Industry Tag Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md text-primary-700 rounded-full text-xs font-bold shadow-sm">
            {item.industry}
          </span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-primary-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-sm">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-primary-600 rounded-full p-4 shadow-lg"
          >
            <ExternalLink className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold font-heading text-gray-900 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
        </div>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {item.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
