import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Phone } from 'lucide-react'
import { LP_SLUGS, getLpContent } from '@/lib/lp-content'
import { LeadForm } from '@/components/lp/LeadForm'
import { COMPANY_INFO } from '@/lib/constants'

export function generateStaticParams() {
  return LP_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = getLpContent(slug)
  return {
    title: c ? `${c.headline} — iLift` : 'iLift',
    description: c?.subhead,
    robots: { index: false, follow: false },
  }
}

export default async function LpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getLpContent(slug)
  if (!c) notFound()
  const tel = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

  return (
    <main>
      <header className="container-custom flex items-center justify-between py-5">
        <span className="font-heading text-xl font-bold">iLift</span>
        <a href={tel} className="inline-flex items-center gap-2 text-sm font-semibold">
          <Phone className="h-4 w-4" aria-hidden="true" /> {COMPANY_INFO.phone}
        </a>
      </header>

      <section className="container-custom grid gap-10 py-8 md:grid-cols-2 md:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">{c.eyebrow}</p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-5xl">{c.headline}</h1>
          <p className="mt-5 text-lg text-gray-600">{c.subhead}</p>
          <ul className="mt-8 space-y-4">
            {c.bullets.map((b) => (
              <li key={b.title} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-gray-600">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-gray-600">
            Want to hear it first?{' '}
            <Link href="/demo" className="font-semibold underline">
              Try the live demo
            </Link>
            .
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8" id="form">
          <h2 className="font-heading text-2xl font-bold">{c.formTitle}</h2>
          <p className="mt-2 text-gray-600">{c.formSub}</p>
          <div className="mt-6">
            <LeadForm slug={c.slug} submitLabel={c.submitLabel} />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <h2 className="font-heading text-2xl font-bold">Results we&apos;ve shipped</h2>
          <p className="mt-1 text-sm text-gray-500">
            Anonymized outcomes from real Long Island businesses. Client names kept private.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {c.proof.map((p) => (
              <div key={p.headline} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="font-semibold">{p.headline}</p>
                <p className="mt-1 text-gray-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-12">
        <h2 className="font-heading text-2xl font-bold">Questions</h2>
        <dl className="mt-6 space-y-6">
          {c.faq.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 text-gray-600">{f.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10">
          <a
            href="#form"
            className="inline-block rounded-lg border-2 border-primary-800 bg-primary-700 px-6 py-3 font-semibold text-white hover:bg-primary-800"
          >
            {c.formTitle}
          </a>
        </div>
      </section>

      <footer className="container-custom border-t border-gray-200 py-8 text-sm text-gray-500">
        <p>
          {COMPANY_INFO.name} · {COMPANY_INFO.address.full} · <a href={tel}>{COMPANY_INFO.phone}</a>
        </p>
        <p className="mt-2">
          <Link href="/privacy" className="underline">
            Privacy
          </Link>{' '}
          ·{' '}
          <Link href="/terms" className="underline">
            Terms
          </Link>
        </p>
      </footer>
    </main>
  )
}
