import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// book.ilift.com → cal.com/ilift (301 permanent redirect, preserves path)
// E.g. book.ilift.com/ai-strategy-session → cal.com/ilift/ai-strategy-session
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() ?? ''

  if (host === 'book.ilift.com') {
    const path = request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname
    const search = request.nextUrl.search
    return NextResponse.redirect(`https://cal.com/ilift${path}${search}`, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo-v3.png).*)'],
}
