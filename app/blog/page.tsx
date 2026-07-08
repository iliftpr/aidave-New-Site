import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Rss } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogCard } from '@/components/blog/BlogCard'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { CATEGORY_LABELS, getAllPosts, type PostCategory } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'The Blog — Trending AI, translated for operators',
  description:
    'Three reads a week on AI news, translated through the 4-Lever Audit for mid-market and enterprise operators. Mon brief, Wed framework, Fri take.',
  alternates: {
    canonical: 'https://ilift.com/blog',
    types: {
      'application/rss+xml': 'https://ilift.com/blog/rss.xml',
    },
  },
  openGraph: {
    title: 'The Blog | AI Dave (ILift)',
    description:
      'Three reads a week on AI news, translated through the 4-Lever Audit for mid-market and enterprise operators.',
    type: 'website',
    url: 'https://ilift.com/blog',
  },
}

const CATEGORY_ORDER: PostCategory[] = ['news', 'framework', 'take', 'personal']

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const hasPosts = posts.length > 0

  const blogLD = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://ilift.com/blog#blog',
    name: 'AI Dave (ILift) — The Blog',
    description:
      'AI news translated through the 4-Lever Audit for mid-market and enterprise operators.',
    url: 'https://ilift.com/blog',
    inLanguage: 'en-US',
    author: { '@id': 'https://ilift.com/#dave' },
    publisher: { '@id': 'https://ilift.com/#business' },
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      '@id': `https://ilift.com/blog/${p.slug}`,
      headline: p.title,
      url: `https://ilift.com/blog/${p.slug}`,
      datePublished: p.publishedAt,
      author: { '@id': 'https://ilift.com/#dave' },
    })),
  }

  // JSON-LD as a string — escape `<` to avoid `</script>` injection in case any
  // user-controllable post field contains it. React renders it as textContent
  // which is XSS-safe by default.
  const blogLDText = JSON.stringify(blogLD).replace(/</g, '\\u003c')

  return (
    <main className="min-h-screen">
      <Header />

      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container-custom">
          <ScrollReveal animation="fadeInUp" className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-primary-600 font-bold text-sm uppercase tracking-widest mb-4">
              The Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
              Trending AI, <span className="gradient-text">translated for operators</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
              Three reads a week. Monday news brief, Wednesday framework deep-dive, Friday take.
              All filtered through the 4-Lever Audit so mid-market and enterprise teams know what
              to actually ship.
            </p>
            <Link
              href="/blog/rss.xml"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Rss size={14} /> Subscribe via RSS
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container-custom">
          {hasPosts ? (
            <>
              {CATEGORY_ORDER.map((category) => {
                const inCategory = posts.filter((p) => p.category === category)
                if (inCategory.length === 0) return null
                return (
                  <div key={category} className="mb-16 last:mb-0">
                    <div className="flex items-end justify-between mb-6 border-b border-gray-100 pb-3">
                      <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900">
                        {CATEGORY_LABELS[category]}
                      </h2>
                      <span className="text-sm text-gray-400">
                        {inCategory.length} {inCategory.length === 1 ? 'post' : 'posts'}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {inCategory.map((post, idx) => (
                        <BlogCard key={post.slug} post={post} priority={idx < 3} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div className="max-w-xl mx-auto text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-6">
                <Rss size={26} />
              </div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-3">
                The first posts ship soon.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                The editorial calendar starts Monday. Three posts a week — news brief, framework
                deep-dive, and a sharp take. Get the first one in your inbox.
              </p>
              <Link
                href="/scorecard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Take the 4-Lever Audit + subscribe
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <script type="application/ld+json">{blogLDText}</script>
    </main>
  )
}
