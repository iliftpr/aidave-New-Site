import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLpContent } from '@/lib/lp-content'
import { LeadPixelEvent } from '@/components/lp/LeadPixelEvent'
import { COMPANY_INFO } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Got it — iLift',
  robots: { index: false, follow: false },
}

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ eid?: string }>
}) {
  const { slug } = await params
  const { eid } = await searchParams
  const c = getLpContent(slug)
  if (!c) notFound()
  const tel = `tel:${COMPANY_INFO.phone.replace(/\D/g, '')}`

  return (
    <main className="container-custom py-12 md:py-20">
      {eid && <LeadPixelEvent eventId={eid} source={slug} />}
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">{c.eyebrow}</p>
      <h1 className="mt-3 font-heading text-3xl font-bold md:text-4xl">Got it — Dave is texting you now.</h1>
      <p className="mt-3 text-lg text-gray-600">
        Want to skip the back-and-forth? Grab a free 15-minute slot below, or call{' '}
        <a href={tel} className="font-semibold underline">
          {COMPANY_INFO.phone}
        </a>
        .
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
        <iframe
          src={`${COMPANY_INFO.links.calcom.audit}?embed=true&layout=month_view`}
          title="Book a free 15-minute look"
          className="h-[720px] w-full"
          loading="lazy"
        />
      </div>
    </main>
  )
}
