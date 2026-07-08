'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, COMPANY_INFO } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo (Dave's headshot — no title, image is the brand mark) */}
          <a href="/#home" className="flex items-center group flex-shrink-0" aria-label={COMPANY_INFO.name}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-500/40 group-hover:ring-primary-500/70 transition-all">
              <Image
                src="/images/dave-headshot.jpeg"
                alt={COMPANY_INFO.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary-600 font-medium text-sm xl:text-base transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center ml-4">
            <Button href={COMPANY_INFO.links.calcom.audit} variant="accent" size="sm">
              Book a discovery call
            </Button>
          </div>

          {/* Mobile / tablet menu button (visible <lg) — together with the CTA pill on the right */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button
              href={COMPANY_INFO.links.calcom.audit}
              variant="accent"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Book
            </Button>
            <button
              className="p-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <nav className="container-custom py-4 flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button href={`tel:${COMPANY_INFO.phone}`} variant="primary" size="md">
                  Call Now
                </Button>
                <Button href={COMPANY_INFO.links.calcom.audit} variant="accent" size="md">
                  Book a discovery call
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
