import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import verifyToken from './middleware/auth'
import AccessJWTPayload from '@/entities/HelpTypes/AccessJWTPayload'

export const config = {
  matcher: [
    {
      // Match all request paths
      // Except: /api, next/static, next/image, favicon & prefetch
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}

export const middleware = (request: NextRequest) => {
  const pathName: string = request.nextUrl.pathname ?? ''
  const redirection: URL = new URL('/account/login', request.url)

  // Whitelist for auth
  const whitelist = ['/account/login', 'account/register']
  if (whitelist.includes(pathName)) return

  // Auth validation - Access token needed
  let token: string = request.cookies.get('accessToken')?.value ?? ''
  if (!token) return NextResponse.redirect(redirection)

  // Auth validation - Must be a valid JWT and have private signature
  const payload: AccessJWTPayload | null = verifyToken(token) as AccessJWTPayload | null
  if (!payload) return NextResponse.redirect(redirection)

  return
}
