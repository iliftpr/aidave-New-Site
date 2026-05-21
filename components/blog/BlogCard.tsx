import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CATEGORY_LABELS, formatPostDate, type Post } from '@/lib/posts'

interface BlogCardProps {
  post: Post
  openInNewTab?: boolean
  priority?: boolean
}

export function BlogCard({ post, openInNewTab = false, priority = false }: BlogCardProps) {
  const linkProps = openInNewTab
    ? { target: '_blank' as const, rel: 'noopener noreferrer' as const }
    : {}

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
      <Link
        href={`/blog/${post.slug}`}
        {...linkProps}
        className="block relative aspect-[16/9] overflow-hidden"
      >
        <Image
          src={post.heroImage}
          alt={post.heroImageAlt}
          fill
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
        />
        <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider bg-white/95 text-primary-700 px-2.5 py-1 rounded-full">
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
            {...linkProps}
            className="hover:text-primary-700 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{post.description}</p>

        <Link
          href={`/blog/${post.slug}`}
          {...linkProps}
          className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors mt-auto"
        >
          Read more <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}
