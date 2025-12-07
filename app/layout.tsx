import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { COMPANY_INFO } from '@/lib/constants'

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

export const metadata: Metadata = {
  metadataBase: new URL('https://ilift.com'),
  title: {
    default: 'ILift Website Design & Digital Marketing | AI-Powered Solutions in East Meadow, NY',
    template: '%s | ILift',
  },
  description: 'Transform your business with AI-powered website design, voice agents, and marketing automation in East Meadow, NY. 24/7 AI assistants that book appointments, qualify leads, and scale your business automatically.',
  keywords: [
    'AI website design',
    'digital marketing East Meadow',
    'website automation',
    'AI voice agents',
    'appointment booking system',
    'local SEO Long Island',
    'AI marketing solutions',
    'voice agent automation',
    'East Meadow web design',
    'automated lead generation',
  ],
  authors: [{ name: 'ILift Website Design & Digital Marketing' }],
  creator: 'ILift Website Design',
  publisher: 'ILift Website Design',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ilift.com',
    siteName: 'ILift Website Design & Digital Marketing',
    title: 'ILift - AI-Powered Website Design & Digital Marketing',
    description: 'Transform your business with AI-powered solutions in East Meadow, NY. 24/7 AI voice agents, automated appointment booking, and websites that convert.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ILift Website Design & Digital Marketing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ILift - AI-Powered Website Design & Digital Marketing',
    description: 'Transform your business with AI-powered solutions in East Meadow, NY',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {/* LeadConnector Chat Widget */}
        <Script
          id="leadconnector-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.src = 'https://beta.leadconnectorhq.com/loader.js';
                script.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js');
                script.setAttribute('data-widget-id', '690fd6dc33e992e8c912b705');
                document.body.appendChild(script);
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: COMPANY_INFO.name,
              image: 'https://ilift.com/logo-v3.png',
              '@id': 'https://ilift.com',
              url: 'https://ilift.com',
              telephone: COMPANY_INFO.phone,
              email: COMPANY_INFO.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Innovation Way',
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
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                ],
                opens: '09:00',
                closes: '17:00',
              },
              sameAs: [
                'https://www.google.com/maps/place/AIDave+Digital+Marketing/@40.7222033,-73.5717604,17z/data=!3m1!4b1!4m6!3m5!1s0x89c27d3f83cdf35f:0x886eba16fc6c67d!8m2!3d40.7222033!4d-73.5717604!16s%2Fg%2F11ypc6pp6k?entry=ttu&g_ep=EgoyMDI1MTEzMC4wIKXMDSoASAFQAw%3D%3D',
                'https://www.youtube.com/@iliftmarketing',
                'https://www.linkedin.com/in/aiautomationpro/',
                'https://www.instagram.com/aiconsultantpro/',
                COMPANY_INFO.social.facebook,
                COMPANY_INFO.social.linkedin,
                COMPANY_INFO.social.twitter,
                COMPANY_INFO.social.instagram,
              ],
              priceRange: '$$',
              description:
                'Transform your business with AI-powered website design, voice agents, and marketing automation in East Meadow, NY.',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                reviewCount: '8',
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
