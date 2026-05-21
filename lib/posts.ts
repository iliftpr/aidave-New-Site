import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type PostCategory = 'news' | 'framework' | 'take' | 'personal'
export type FourLeverLever = 1 | 2 | 3 | 4

export interface PostFrontmatter {
  title: string
  slug: string
  publishedAt: string
  description: string
  category: PostCategory
  tags: string[]
  heroImage: string
  heroImageAlt: string
  diagramImage?: string
  keyTakeaways: string[]
  fourLeverLever?: FourLeverLever | null
  featured?: boolean
  draft?: boolean
}

export interface Post extends PostFrontmatter {
  content: string
  readingMinutes: number
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts')

const WORDS_PER_MINUTE = 230

function readPostsDir(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
}

function deriveSlug(filename: string): string {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx?$/, '')
}

function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

function parsePostFile(filename: string): Post | null {
  const fullPath = path.join(CONTENT_DIR, filename)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)

  const slug = (data.slug as string | undefined) ?? deriveSlug(filename)
  const draft = Boolean(data.draft)
  // Hide drafts + future-dated posts on the canonical production site only.
  // Local dev, local builds, and Vercel preview deploys all show everything,
  // so Dave can review staged posts before they go live.
  const isCanonicalProd = process.env.VERCEL_ENV === 'production'
  if (draft && isCanonicalProd) return null

  const publishedAt = data.publishedAt as string | undefined
  if (!publishedAt) return null

  if (isCanonicalProd && new Date(publishedAt) > new Date()) {
    return null
  }

  return {
    title: data.title as string,
    slug,
    publishedAt,
    description: data.description as string,
    category: (data.category as PostCategory) ?? 'news',
    tags: (data.tags as string[]) ?? [],
    heroImage: data.heroImage as string,
    heroImageAlt: (data.heroImageAlt as string) ?? (data.title as string),
    diagramImage: data.diagramImage as string | undefined,
    keyTakeaways: (data.keyTakeaways as string[]) ?? [],
    fourLeverLever: (data.fourLeverLever as FourLeverLever) ?? null,
    featured: Boolean(data.featured),
    draft,
    content,
    readingMinutes: estimateReadingMinutes(content),
  }
}

export function getAllPosts(): Post[] {
  const files = readPostsDir()
  const posts = files
    .map(parsePostFile)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  return posts
}

export function getLatestPosts(n: number): Post[] {
  return getAllPosts().slice(0, n)
}

export function getPostBySlug(slug: string): Post | null {
  const all = getAllPosts()
  return all.find((p) => p.slug === slug) ?? null
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}

export function getPostsByCategory(category: PostCategory): Post[] {
  return getAllPosts().filter((p) => p.category === category)
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  news: 'News',
  framework: 'Framework',
  take: 'The Take',
  personal: 'Personal',
}

export const LEVER_LABELS: Record<FourLeverLever, string> = {
  1: 'Intake & Routing',
  2: 'Dispatch & Coordination',
  3: 'Customer Comms',
  4: 'Cross-Location Reporting',
}

export function formatPostDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
