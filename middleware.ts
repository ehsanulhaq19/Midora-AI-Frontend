import type { NextRequest } from 'next/server'
import { RoutesMiddleware } from '@/middleware'

/**
 * Main middleware entry point
 * Delegates to RoutesMiddleware for handling Next.js routes
 */
export function middleware(request: NextRequest) {
  return RoutesMiddleware(request)
}

/**
 * Configure which paths the middleware should run on
 * Only handles Next.js frontend routes, excludes API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - excluded to only handle frontend routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
