'use client'

import { Facebook, Linkedin, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import { COMPANY_INFO, NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="relative w-32 h-12 mb-4">
              <Image
                src="/logo-v3.png"
                alt={COMPANY_INFO.name}
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-400 mb-6">
              Transform your business with AI-powered websites, voice agents, and marketing automation.
            </p>
            <div className="flex space-x-4">
              <a
                href={COMPANY_INFO.social.facebook}
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={COMPANY_INFO.social.linkedin}
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={COMPANY_INFO.social.twitter}
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={COMPANY_INFO.social.instagram}
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
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
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#services" className="text-gray-400 hover:text-primary-500 transition-colors">
                AI Website Design
              </a>
              <a href="#services" className="text-gray-400 hover:text-primary-500 transition-colors">
                Voice Agent Automation
              </a>
              <a href="#services" className="text-gray-400 hover:text-primary-500 transition-colors">
                Appointment Booking
              </a>
              <a href="#services" className="text-gray-400 hover:text-primary-500 transition-colors">
                Marketing Automation
              </a>
              <a href="#services" className="text-gray-400 hover:text-primary-500 transition-colors">
                Lead Generation & CRM
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col space-y-3">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center space-x-3 text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Phone size={18} />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center space-x-3 text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Mail size={18} />
                <span>{COMPANY_INFO.email}</span>
              </a>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>{COMPANY_INFO.address.full}</span>
              </div>
            </div>
            <div className="mt-6">
              <Button href={COMPANY_INFO.links.calendly} size="sm">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center md:text-left mb-4 md:mb-0">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
