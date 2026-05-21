import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { CATEGORY_LABELS, formatPostDate, getLatestPosts } from '@/lib/posts'

/**
 * Homepage "From the Blog" section — 3 latest posts as cards.
 *
 * Renders `null` until at least one post exists, so the section appears
 * automatically the moment the first MDX file lands in /content/posts/.
 *
 * Per Dave's spec: thumbnail + super-short description + "Read more"
 * link that opens in a new tab.
 */
export function LatestPostsSection() {
  const posts = getLatestPosts(3)
  if (posts.length === 0) return null

  return (
    <section
      id="from-the-blog"
      className="section-padding bg-white relative overflow-hidden"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <ScrollReveal animation="fadeInUp" className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-block text-primary-600 font-bold text-sm uppercase tracking-widest mb-4">
            From the Blog
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight">
            Trending AI, <span className="gradient-text">translated for operators</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Three reads a week. News brief, framework deep-dive, sharp take — all filtered
            through the 4-Lever Audit.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {posts.map((post, idx) => (
            <ScrollReveal key={post.slug} animation="scaleIn" delay={idx * 0.08}>
              <article className="group h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-[16/9] overflow-hidden"
                  aria-label={`Open "${post.title}" in a new tab`}
                >
                  <Image
                    src={post.heroImage}
                    alt={post.heroImageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                  />
                  <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider bg-white/95 text-primary-700 px-2.5 py-1 rounded-full shadow-sm">
                    {CATEGORY_LABELS[post.category]}
                  </span>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingMinutes} min read</span>
                  </div>

                  <h3 className="font-heading font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-700 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-5 flex-1">
                    {post.description}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors mt-auto"
                  >
                    Read more <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 font-semibold transition-colors"
          >
            View all posts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
