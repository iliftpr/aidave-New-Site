import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkBasicAuth } from '@/lib/lead-machine/basic-auth'

// book.ilift.com → cal.com/ilift (301 permanent redirect, preserves path)
// E.g. book.ilift.com/ai-strategy-session → cal.com/ilift/ai-strategy-session
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() ?? ''

  if (host === 'book.ilift.com') {
    const path = request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname
    const search = request.nextUrl.search
    return NextResponse.redirect(`https://cal.com/ilift${path}${search}`, 301)
  }

  // /leads — the owner's lead pipeline. HTTP Basic, fails closed when creds are unset.
  const { pathname } = request.nextUrl
  if (pathname === '/leads' || pathname.startsWith('/leads/')) {
    const ok = checkBasicAuth(
      request.headers.get('authorization'),
      process.env.LEADS_DASH_USER ?? '',
      process.env.LEADS_DASH_PASS ?? '',
    )
    if (!ok) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="iLift leads", charset="UTF-8"' },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo-v3.png).*)'],
}
