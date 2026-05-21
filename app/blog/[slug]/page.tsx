import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { BlogCard } from '@/components/blog/BlogCard'
import { ForwardedBar } from '@/components/blog/ForwardedBar'
import { KeyTakeaways } from '@/components/blog/KeyTakeaways'
import { NewsletterInline } from '@/components/blog/NewsletterInline'
import { mdxComponents } from '@/components/blog/MDXComponents'
import {
  CATEGORY_LABELS,
  LEVER_LABELS,
  formatPostDate,
  getAllPosts,
  getAllSlugs,
  getPostBySlug,
} from '@/lib/posts'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post not found' }

  const url = `https://ilift.com/blog/${post.slug}`
  const ogImage = post.heroImage.startsWith('http') ? post.heroImage : `https://ilift.com${post.heroImage}`

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      authors: ['Dave Gakshteyn'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return notFound()

  const all = getAllPosts()
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3)

  const heroImageAbs = post.heroImage.startsWith('http')
    ? post.heroImage
    : `https://ilift.com${post.heroImage}`

  const blogPostingLD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://ilift.com/blog/${post.slug}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ilift.com/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.description,
    image: heroImageAbs,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@id': 'https://ilift.com/#dave' },
    publisher: { '@id': 'https://ilift.com/#business' },
    keywords: post.tags.join(', '),
    articleSection: CATEGORY_LABELS[post.category],
    wordCount: post.content.trim().split(/\s+/).length,
    inLanguage: 'en-US',
  }

  // JSON-LD as text — React renders as textContent (XSS-safe).
  // Escape `<` so any user-controllable field can't close the script tag.
  const blogPostingLDText = JSON.stringify(blogPostingLD).replace(/</g, '\\u003c')

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <article className="pt-12 md:pt-16 pb-20">
        <div className="container-custom max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary-600 mb-8"
          >
            <ArrowLeft size={14} /> All posts
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
              <span className="font-bold uppercase tracking-wider bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">
                {CATEGORY_LABELS[post.category]}
              </span>
              {post.fourLeverLever && (
                <span className="font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                  Lever {post.fourLeverLever}: {LEVER_LABELS[post.fourLeverLever]}
                </span>
              )}
              <time dateTime={post.publishedAt} className="text-gray-400">
                {formatPostDate(post.publishedAt)}
              </time>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400">{post.readingMinutes} min read</span>
            </div>

            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{post.description}</p>
          </header>

          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-10 bg-gray-100">
            <Image
              src={post.heroImage}
              alt={post.heroImageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <ForwardedBar />

          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <KeyTakeaways items={post.keyTakeaways} />
          )}

          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>

          <NewsletterInline />

          {post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="container-custom">
            <ScrollReveal animation="fadeInUp" className="text-center mb-10">
              <span className="inline-block text-primary-600 font-bold text-sm uppercase tracking-widest mb-3">
                Keep reading
              </span>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900">
                More from the blog
              </h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                View all posts <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />

      <script type="application/ld+json">{blogPostingLDText}</script>
    </main>
  )
}
