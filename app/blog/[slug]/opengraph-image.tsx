import { ImageResponse } from 'next/og'
import { CATEGORY_LABELS, getAllSlugs, getPostBySlug } from '@/lib/posts'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'AI Dave (ILift) — The Blog'
export const dynamicParams = false

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const title = post?.title ?? 'AI Dave — The Blog'
  const category = post ? CATEGORY_LABELS[post.category] : 'The Blog'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background:
            'linear-gradient(135deg, #1e3a8a 0%, #3b0764 50%, #1e3a8a 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            AI Dave <span style={{ opacity: 0.6 }}>·</span>{' '}
            <span style={{ opacity: 0.7, fontWeight: 500 }}>ILift</span>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: title.length > 80 ? 56 : 64,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              }}
            />
            ilift.com/blog
          </div>
          <div style={{ fontWeight: 500 }}>
            Trending AI, translated for operators
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
