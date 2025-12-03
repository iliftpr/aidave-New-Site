'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
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
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-[0_0_20px_-5px_var(--color-primary-500)] hover:shadow-[0_0_30px_-5px_var(--color-primary-500)] hover:scale-[1.02]',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 shadow-sm hover:shadow-md',
    outline: 'bg-transparent border-2 border-primary-200 text-primary-700 hover:border-primary-400 hover:bg-primary-50',
    ghost: 'bg-transparent text-gray-600 hover:text-primary-600 hover:bg-primary-50/50',
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
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
