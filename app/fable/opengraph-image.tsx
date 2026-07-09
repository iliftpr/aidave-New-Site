import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'The Fable Method — a Claude Code skill that verifies before it says done'

const GATES = ['Scope', 'Evidence', 'Adversarial', 'Verify', 'Report']

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          background: 'radial-gradient(circle at 50% -10%, #171735 0%, #07070d 62%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 700 }}>
            AI Dave <span style={{ opacity: 0.5 }}>·</span>{' '}
            <span style={{ opacity: 0.7, fontWeight: 500 }}>ILift</span>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.4)',
              color: '#fbbf24',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Claude Code Skill
          </div>
        </div>

        {/* Title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
            The Fable Method
          </div>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 500, color: 'rgba(255,255,255,0.72)', maxWidth: 1000 }}>
            The five-checkpoint discipline that makes AI verify before it says done.
          </div>
        </div>

        {/* Five gates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {GATES.map((g, i) => (
            <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ display: 'flex', fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>{g}</div>
              </div>
              {i < GATES.length - 1 ? (
                <div style={{ display: 'flex', width: 22, height: 2, background: 'rgba(255,255,255,0.2)' }} />
              ) : null}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              }}
            />
            ilift.com/fable
          </div>
          <div style={{ display: 'flex', fontWeight: 500 }}>Free · one file · Opus or Sonnet</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
