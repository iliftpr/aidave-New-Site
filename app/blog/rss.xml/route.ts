import { NextResponse } from 'next/server'
import { CATEGORY_LABELS, getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'
export const revalidate = 3600

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()
  const site = 'https://ilift.com'
  const feedUrl = `${site}/blog/rss.xml`
  const buildDate = new Date().toUTCString()
  const lastBuildDate = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toUTCString()
    : buildDate

  const items = posts
    .map((post) => {
      const url = `${site}/blog/${post.slug}`
      const pubDate = new Date(post.publishedAt).toUTCString()
      const heroAbs = post.heroImage.startsWith('http')
        ? post.heroImage
        : `${site}${post.heroImage}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(CATEGORY_LABELS[post.category])}</category>
      <enclosure url="${heroAbs}" type="image/jpeg" />
      <dc:creator>Dave Gakshteyn</dc:creator>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AI Dave (ILift) — The Blog</title>
    <link>${site}/blog</link>
    <description>Trending AI, translated through the 4-Lever Audit for mid-market and enterprise operators. Three posts a week from Dave Gakshteyn.</description>
    <language>en-us</language>
    <copyright>© ILift by AI Dave</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
