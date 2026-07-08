import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { COMPANY_INFO } from '@/lib/constants'
import DaveAgentLazy from '@/components/dave-agent/DaveAgentLazy'
import { MobileStickyCTA } from '@/components/MobileStickyCTA'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { LinkedInInsight } from '@/components/analytics/LinkedInInsight'
import { BookingClickTracker } from '@/components/analytics/BookingClickTracker'
import { ExitIntentScorecard } from '@/components/ExitIntentScorecard'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const SITE_DESCRIPTION =
  'Custom AI apps and agents that run the busywork inside Long Island businesses — intake, follow-up, paperwork. Law firms, accountants, contractors, med spas, dentists, restaurants, local shops, and multi-location teams (via the 4-Lever Audit). 100+ implementations. Long Island, NYC, NY metro + remote.'

export const metadata: Metadata = {
  metadataBase: new URL('https://ilift.com'),
  title: {
    default: 'Custom AI Systems for Long Island Business Owners | AI Dave (ILift)',
    template: '%s | AI Dave (ILift)',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'multi-location AI automation consultant',
    'AI for multi-location service businesses',
    '4-Lever automation audit',
    'multi-location ops AI',
    'field service AI automation',
    'multi-location automation consultant',
    'AI consultant for COO',
    'AI consultant for Director of Operations',
    'AI consultant for law firms',
    'AI consultant for accounting firms',
    'AI consultant for financial advisors',
    'AI consultant for wealth management',
    'AI consultant for RIA firms',
    'AI consultant for insurance agencies',
    'law firm automation',
    'accounting firm automation',
    'financial services AI adoption',
    'practice management AI',
    'mid-market professional services AI',
    'AI for partner firms',
    'AI builder alternative to McKinsey',
    'AI implementation partner financial services',
    'dental AI automation',
    'HVAC AI automation',
    'medspa AI automation',
    'contractor AI automation',
    'AI consultant New York',
    'AI consultant Long Island',
    'AI consultant NYC',
    'AI consultant Nassau County',
    'AI consultant Manhattan',
    'AI expert New York',
    'fractional AI officer',
    'fractional CTO New York',
    'AI strategy consultant NY',
    'AI implementation Long Island',
    'embedded AI partner',
    'mid-market AI consultant',
    'AI automation consultant New York',
    'Dave Gakshteyn',
    'AI Dave',
    'ILift',
    'AI voice agents',
    'East Meadow AI consultant',
    'New York metro AI services',
  ],
  authors: [{ name: 'Dave Gakshteyn — AI Consultant, ILift' }],
  creator: 'Dave Gakshteyn',
  publisher: 'ILift by AI Dave',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://ilift.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ilift.com',
    siteName: 'AI Dave (ILift) — AI Consultant in Long Island & NYC',
    title: 'Custom AI Systems for Long Island Business Owners | AI Dave',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Custom AI systems for Long Island business owners — ilift.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom AI Systems for Long Island Business Owners | AI Dave',
    description:
      'AI consultant serving Long Island, NYC, and the New York metro. Strategy, builds, training, fractional embed. 100+ implementations.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': 'https://ilift.com/#business',
      name: 'AI Dave (ILift) — AI Consultant',
      alternateName: ['AI Dave', 'ILift', 'Smart AI Website Design by AI Dave'],
      image: 'https://ilift.com/images/dave-headshot.jpeg',
      url: 'https://ilift.com',
      telephone: COMPANY_INFO.phone,
      email: COMPANY_INFO.email,
      description:
        'Multi-location AI automation consultant for service businesses ($5–25M revenue, 50–150 staff). The 4-Lever Audit (Intake, Dispatch, Customer Comms, Cross-Location Reporting). 100+ implementations across dental, HVAC, medspa, contractor, and field-service verticals. Long Island, NYC, NY metro + remote.',
      founder: { '@id': 'https://ilift.com/#dave' },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1738 Bard Lane',
        addressLocality: 'East Meadow',
        addressRegion: 'NY',
        postalCode: '11554',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 40.7134,
        longitude: -73.559,
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Long Island, NY' },
        { '@type': 'AdministrativeArea', name: 'Nassau County, NY' },
        { '@type': 'AdministrativeArea', name: 'Suffolk County, NY' },
        { '@type': 'City', name: 'New York City' },
        { '@type': 'City', name: 'Manhattan' },
        { '@type': 'City', name: 'Brooklyn' },
        { '@type': 'City', name: 'Queens' },
        { '@type': 'City', name: 'Bronx' },
        { '@type': 'City', name: 'Staten Island' },
        { '@type': 'City', name: 'East Meadow' },
        { '@type': 'State', name: 'New York' },
      ],
      serviceType: [
        'AI Consulting',
        'AI Strategy',
        'AI Implementation',
        'AI Automation',
        'Voice Agent Development',
        'Custom AI App Development',
        'Team Training',
        'Fractional CTO',
        'Embedded AI Partnership',
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI Consulting Services',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'AI Strategy Session',
            price: '297',
            priceCurrency: 'USD',
            description:
              '60-min 1-on-1 with Dave. Custom 90-day AI implementation plan. Refunded if not a fit.',
            url: 'https://cal.com/ilift/ai-strategy-session',
          },
          {
            '@type': 'Offer',
            name: 'AI Mastery Intensive',
            price: '997',
            priceCurrency: 'USD',
            description:
              '5-hour day with Dave — AI subscription setup, hands-on app build, custom playbook.',
            url: 'https://cal.com/ilift/ai-mastery-intensive',
          },
          {
            '@type': 'Offer',
            name: 'Done-For-You AI Automation',
            price: '3600',
            priceCurrency: 'USD',
            description:
              'Annual subscription. AI website + voice agent + CRM + ongoing optimization.',
          },
          {
            '@type': 'Offer',
            name: 'Embedded AI Growth Partner',
            description:
              'Long-term, hands-on partnership for mid-market & enterprise teams. 3 to 12+ months. By application.',
          },
        ],
      },
      sameAs: [
        'https://www.google.com/maps/place/AIDave+Digital+Marketing/@40.7222033,-73.5717604,17z/data=!3m1!4b1!4m6!3m5!1s0x89c27d3f83cdf35f:0x886eba16fc6c67d!8m2!3d40.7222033!4d-73.5717604!16s%2Fg%2F11ypc6pp6k',
        'https://www.youtube.com/@iliftmarketing',
        'https://www.linkedin.com/in/aiautomationpro/',
        'https://www.instagram.com/aiconsultantpro/',
      ],
      priceRange: '$$$',
    },
    {
      '@type': 'Service',
      '@id': 'https://ilift.com/#website-offer',
      name: 'Fixed-Scope Website Build',
      description:
        'Agency-grade 5-page business website — custom design, conversion copy polish, SEO foundations, analytics — built in a one-day sprint at a fixed $1,200 price.',
      provider: { '@id': 'https://ilift.com/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Long Island, NY' },
      url: 'https://ilift.com/websites',
      offers: {
        '@type': 'Offer',
        price: '1200',
        priceCurrency: 'USD',
        url: 'https://ilift.com/websites',
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://ilift.com/#dave',
      name: 'Dave Gakshteyn',
      givenName: 'Dave',
      familyName: 'Gakshteyn',
      jobTitle: 'AI Consultant & Founder, ILift',
      worksFor: { '@id': 'https://ilift.com/#business' },
      image: 'https://ilift.com/images/dave-headshot.jpeg',
      url: 'https://ilift.com',
      description:
        'AI automation consultant and founder of ILift (AI Dave). Multi-location service business specialist. Author of the 4-Lever Automation Audit framework. Based in East Meadow, NY (Long Island). 100+ shipped AI automation implementations across dental, HVAC, medspa, contractor, and field-service verticals. Serves multi-location ops teams ($5–25M revenue) across Long Island, NYC, and the New York metro.',
      knowsAbout: [
        'Multi-location automation strategy',
        '4-Lever Automation Audit',
        'AI strategy',
        'AI implementation',
        'AI consulting',
        'AI automation',
        'Voice agents',
        'Intake automation',
        'Dispatch and coordination automation',
        'Customer comms automation',
        'Cross-location reporting',
        'CRM automation',
        'Lead generation',
        'Field service operations',
        'Custom app development',
        'Next.js',
        'Supabase',
        'OpenAI',
        'Anthropic Claude',
        'Fractional CTO',
        'Mid-market AI strategy',
      ],
      sameAs: [
        'https://www.linkedin.com/in/aiautomationpro/',
        'https://www.instagram.com/aiconsultantpro/',
        'https://www.youtube.com/@iliftmarketing',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'East Meadow',
        addressRegion: 'NY',
        addressCountry: 'US',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ilift.com/#website',
      url: 'https://ilift.com',
      name: 'AI Dave (ILift)',
      description: 'AI consultant in Long Island & NYC',
      publisher: { '@id': 'https://ilift.com/#business' },
      inLanguage: 'en-US',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {/* Thumb-reachable booking bar on mobile — positioned clear of the chat bubble */}
        <MobileStickyCTA />
        {/* Desktop exit-intent: offer the scorecard once per session */}
        <ExitIntentScorecard />
        {/* Dave's AI Agent — floating bottom-right widget (Claude + ElevenLabs voice) */}
        <DaveAgentLazy />
        {/* Tracking — pixels no-op until their NEXT_PUBLIC_* ids are set in env */}
        <Analytics />
        <MetaPixel />
        <LinkedInInsight />
        <BookingClickTracker />
        {/* JSON-LD — @graph with ProfessionalService/LocalBusiness + Person + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA),
          }}
        />
      </body>
    </html>
  )
}
