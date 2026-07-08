import Image from 'next/image'
import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'
import { ExcalidrawDiagram } from './ExcalidrawDiagram'
import { FourLeverBlock } from './FourLeverBlock'
import { KeyTakeaways } from './KeyTakeaways'
import { NewsletterInline } from './NewsletterInline'

export const mdxComponents: MDXComponents = {
  // Headings — match the site's font-heading family
  h1: ({ children, ...rest }) => (
    <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mt-0 mb-6 leading-tight" {...rest}>
      {children}
    </h1>
  ),
  h2: ({ children, ...rest }) => (
    <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mt-12 mb-4 leading-snug" {...rest}>
      {children}
    </h2>
  ),
  h3: ({ children, ...rest }) => (
    <h3 className="font-heading font-bold text-xl md:text-2xl text-gray-900 mt-8 mb-3 leading-snug" {...rest}>
      {children}
    </h3>
  ),
  h4: ({ children, ...rest }) => (
    <h4 className="font-heading font-bold text-lg md:text-xl text-gray-900 mt-6 mb-2 leading-snug" {...rest}>
      {children}
    </h4>
  ),
  p: ({ children, ...rest }) => (
    <p className="text-gray-700 leading-relaxed text-base md:text-lg my-4" {...rest}>
      {children}
    </p>
  ),
  a: ({ href = '#', children, ...rest }) => {
    const isExternal = href.startsWith('http') || href.startsWith('//')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-500 transition-colors"
          {...rest}
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href}
        className="text-primary-600 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-500 transition-colors"
      >
        {children}
      </Link>
    )
  },
  ul: ({ children, ...rest }) => (
    <ul className="list-disc pl-6 my-4 space-y-2 text-gray-700 text-base md:text-lg" {...rest}>
      {children}
    </ul>
  ),
  ol: ({ children, ...rest }) => (
    <ol className="list-decimal pl-6 my-4 space-y-2 text-gray-700 text-base md:text-lg" {...rest}>
      {children}
    </ol>
  ),
  li: ({ children, ...rest }) => (
    <li className="leading-relaxed" {...rest}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...rest }) => (
    <blockquote className="not-prose my-8 border-l-4 border-secondary-500 pl-6 italic text-gray-700 text-lg md:text-xl leading-relaxed" {...rest}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...rest }) => (
    <code className="px-1.5 py-0.5 rounded bg-gray-100 text-primary-700 text-sm font-mono" {...rest}>
      {children}
    </code>
  ),
  pre: ({ children, ...rest }) => (
    <pre className="my-6 p-5 rounded-xl bg-gray-900 text-gray-100 overflow-x-auto text-sm leading-relaxed" {...rest}>
      {children}
    </pre>
  ),
  hr: () => <hr className="my-12 border-gray-200" />,
  img: ({ src, alt, width, height, ...rest }) => {
    if (typeof src !== 'string') return null
    return (
      <Image
        src={src}
        alt={alt ?? ''}
        width={typeof width === 'number' ? width : 1600}
        height={typeof height === 'number' ? height : 900}
        className="rounded-xl my-8 w-full h-auto"
        sizes="(max-width: 1024px) 100vw, 900px"
        {...rest}
      />
    )
  },
  // Custom blog components — usable directly in MDX
  ExcalidrawDiagram,
  FourLeverBlock,
  KeyTakeaways,
  NewsletterInline,
}
