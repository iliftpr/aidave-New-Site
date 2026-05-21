'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 relative overflow-hidden'

  const variantStyles = {
    primary: 'bg-primary-700 text-white shadow-xl shadow-primary-700/50 hover:bg-primary-800 hover:shadow-2xl border-2 border-primary-800',
    secondary: 'bg-white text-gray-900 border-2 border-gray-300 hover:border-primary-400 hover:bg-primary-50 shadow-md hover:shadow-lg',
    outline: 'bg-white/80 border-2 border-primary-400 text-primary-800 hover:border-primary-600 hover:bg-primary-50 font-semibold',
    ghost: 'bg-transparent text-gray-700 hover:text-primary-700 hover:bg-primary-100',
    accent: 'bg-amber-500 text-white shadow-xl shadow-amber-500/50 hover:bg-amber-600 hover:shadow-2xl font-extrabold border-2 border-amber-600',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
