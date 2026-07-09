'use client'

import { Facebook, Linkedin, Twitter, Instagram, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { COMPANY_INFO, NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

// Footer body text + nav links use gray-300 (not gray-400) for legibility — the
// darker gray sat too low-contrast on the near-black gray-900 footer.

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-500/40">
                <Image
                  src="/images/dave-headshot.jpeg"
                  alt={COMPANY_INFO.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                {COMPANY_INFO.name}
              </span>
            </div>
            <p className="text-primary-400 font-medium text-sm mb-2">
              {COMPANY_INFO.tagline}
            </p>
            <p className="text-gray-300 mb-6">
              AI automation for businesses that actually want to ship. 100+ implementations across 8 verticals.
            </p>
            <div className="flex space-x-4">
              <a href={COMPANY_INFO.social.facebook} className="text-gray-300 hover:text-primary-500 transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href={COMPANY_INFO.social.linkedin} className="text-gray-300 hover:text-primary-500 transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href={COMPANY_INFO.social.twitter} className="text-gray-300 hover:text-primary-500 transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
              <a href={COMPANY_INFO.social.instagram} className="text-gray-300 hover:text-primary-500 transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-primary-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Work with Dave */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Work with Dave</h4>
            <nav className="flex flex-col space-y-2">
              <a href={COMPANY_INFO.links.calcom.strategy} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-500 transition-colors">
                Strategy Session ($297)
              </a>
              <a href={COMPANY_INFO.links.calcom.mastery} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-500 transition-colors">
                AI Mastery Intensive ($997)
              </a>
              <a href="/websites" className="text-gray-300 hover:text-primary-500 transition-colors">
                Website Build ($1,200 flat)
              </a>
              <a href="/#pricing" className="text-gray-300 hover:text-primary-500 transition-colors">
                Done-For-You ($3,600/yr)
              </a>
              <a href={COMPANY_INFO.links.calcom.audit} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-500 transition-colors">
                Free Automation Audit
              </a>
            </nav>
            <p className="text-gray-500 text-sm mt-4">
              Curious about long-form coaching?{' '}
              <a href={COMPANY_INFO.links.calcom.mastery} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">
                Ask about the AI Mastery Intensive.
              </a>
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col space-y-3">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-primary-500 transition-colors"
              >
                <Phone size={18} />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-primary-500 transition-colors"
              >
                <Mail size={18} />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <p>{COMPANY_INFO.address.full}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Serving Long Island, NYC & the NY metro · Remote across the U.S.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button href={COMPANY_INFO.links.calcom.audit} size="sm">
                Book a discovery call
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm text-center md:text-left mb-4 md:mb-0">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
