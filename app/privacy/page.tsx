import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { COMPANY_INFO } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How ILift collects, uses, and protects your information — including details you share through our website, lead forms, and advertising on platforms like Facebook and Instagram.',
  alternates: { canonical: 'https://ilift.com/privacy' },
}

const EFFECTIVE_DATE = 'July 17, 2026'

const sections: { title: string; body: string[] }[] = [
  {
    title: 'Information we collect',
    body: [
      'When you contact us, book a call, download a resource, or submit a form — on this website or through a lead form on platforms such as Facebook, Instagram, or Eventbrite — we collect the information you choose to share: typically your name, email address, phone number, business name, and what you tell us about your business.',
      'Like most websites, we also collect basic usage data (pages visited, device and browser type, approximate location from IP address) through cookies and similar technologies, including analytics and advertising pixels.',
    ],
  },
  {
    title: 'How we use it',
    body: [
      'We use your information to respond to your inquiries, deliver the services or resources you requested, send follow-up communications you have opted into, improve our website and offerings, and measure the effectiveness of our marketing.',
      'If you signed up for an event or an audit, we use your contact details to confirm, remind, and follow up about that event or audit.',
    ],
  },
  {
    title: 'What we do not do',
    body: [
      'We do not sell your personal information. We do not share it with third parties except for service providers who help us operate (e.g., email, scheduling, CRM, and analytics tools), and only for the purposes described here.',
    ],
  },
  {
    title: 'Advertising and lead forms',
    body: [
      'When you submit a lead form on a platform like Facebook or Instagram, that platform provides us with the information you agreed to share and processes your data under its own privacy policy as well. We use that information only to contact you about the offer or event you responded to and for related follow-up.',
    ],
  },
  {
    title: 'Data retention and security',
    body: [
      'We keep personal information only as long as needed for the purposes above or as required by law, and we use reasonable administrative and technical safeguards to protect it.',
    ],
  },
  {
    title: 'Your choices',
    body: [
      'You can opt out of marketing emails via the unsubscribe link in any message, and you can ask us to access, correct, or delete your personal information at any time by contacting us.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-neutral-500">Effective {EFFECTIVE_DATE}</p>
        <p className="mt-6 text-neutral-700 dark:text-neutral-300">
          ILift (&ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This policy explains what
          we collect, how we use it, and the choices you have.
        </p>
        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-xl font-semibold">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-neutral-700 dark:text-neutral-300">
                {p}
              </p>
            ))}
          </section>
        ))}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-3 text-neutral-700 dark:text-neutral-300">
            Questions or requests: email {COMPANY_INFO.email} or call {COMPANY_INFO.phone}.{' '}
            {COMPANY_INFO.address.full}.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
