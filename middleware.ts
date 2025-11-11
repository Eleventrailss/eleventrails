import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const AFFILIATE_COOKIE = 'affiliate'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 hari

function setAffiliateCookie(response: NextResponse, value: string) {
  response.cookies.set({
    name: AFFILIATE_COOKIE,
    value,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
  })
}

function clearAffiliateCookie(response: NextResponse) {
  response.cookies.set({
    name: AFFILIATE_COOKIE,
    value: '',
    maxAge: 0,
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
  })
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname === '/@' || pathname === '/@/') {
    const targetUrl = request.nextUrl.clone()
    targetUrl.pathname = '/'
    targetUrl.searchParams.set('affiliate', 'clear')

    const response = NextResponse.redirect(targetUrl)
    clearAffiliateCookie(response)
    return response
  }

  const affiliatePathMatch = pathname.match(/^\/@([^\/]+)(\/.*)?$/)

  if (affiliatePathMatch) {
    const affiliateSlug = affiliatePathMatch[1]
    const restPath = affiliatePathMatch[2] ?? '/'
    const targetUrl = request.nextUrl.clone()
    targetUrl.pathname = restPath.startsWith('/') ? restPath : `/${restPath}`
    targetUrl.searchParams.set('affiliate', affiliateSlug)

    const response = NextResponse.rewrite(targetUrl)
    setAffiliateCookie(response, affiliateSlug)
    return response
  }

  const affiliateQuery = searchParams.get('affiliate')
  if (affiliateQuery) {
    const response = NextResponse.next()
    if (affiliateQuery === 'clear') {
      clearAffiliateCookie(response)
    } else {
      setAffiliateCookie(response, affiliateQuery)
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|static|favicon.ico|robots.txt|sitemap.xml|manifest.json|api/upload|api/upload-file).*)',
  ],
}

