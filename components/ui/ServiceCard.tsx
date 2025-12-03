'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Service } from '@/types'
import { Button } from './Button'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  service: Service
  index: number
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = (Icons as any)[service.icon] || Icons.Zap

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="glass-card rounded-2xl p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary-200 group"
    >
      {/* Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold font-heading mb-4 text-gray-900 group-hover:text-primary-600 transition-colors">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-start space-x-3">
            <div className="mt-1 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Icons.Check className="w-3 h-3 text-primary-600" />
            </div>
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>


    </motion.div>
  )
}
