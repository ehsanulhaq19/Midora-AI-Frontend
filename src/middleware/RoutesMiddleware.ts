import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAMES } from '@/lib/auth'

// Define route configurations
const ROUTES = {
  // Public routes that don't require authentication
  PUBLIC: [
    '/',
    '/signup',
    '/chat',
    '/chat/*',
    '/api/health',
    '/api/hello',
  ],
  // Authentication routes (redirect to chat if already authenticated)
  AUTH: [
    '/signup',
    '/signup/*',
  ],
  // Protected routes that require authentication
  PROTECTED: [
    '/profile',
    '/settings',
    '/app-documents',
    '/pricing',
    '/checkout',
  ],
} as const

/**
 * Check if a path matches any of the given patterns
 */
function matchesPattern(pathname: string, patterns: readonly string[]): boolean {
  return patterns.some(pattern => {
    // Exact match
    if (pattern === pathname) return true
    
    // Wildcard match for nested routes
    if (pattern.endsWith('*')) {
      const basePattern = pattern.slice(0, -1)
      return pathname.startsWith(basePattern)
    }
    
    // Dynamic route match (e.g., /chat/[id])
    if (pattern.includes('[') && pattern.includes(']')) {
      const regexPattern = pattern
        .replace(/\[([^\]]+)\]/g, '[^/]+') // Replace [param] with [^/]+
        .replace(/\//g, '\\/') // Escape forward slashes
      const regex = new RegExp(`^${regexPattern}$`)
      return regex.test(pathname)
    }
    
    return false
  })
}

/**
 * Get access token from request cookies
 */
function getAccessToken(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value || null
}

/**
 * Check if access token is present (simple presence check)
 */
function hasAccessToken(request: NextRequest): boolean {
  const accessToken = getAccessToken(request)
  return !!accessToken
}

/**
 * Routes Middleware for Next.js Routes
 * Handles authentication and route protection for frontend routes only
 */
export function RoutesMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('pathname', pathname)
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }
  
  const hasToken = hasAccessToken(request)
  console.log('pathname', pathname, hasToken)
  
  // Handle protected routes
  if (matchesPattern(pathname, ROUTES.PROTECTED)) {
    if (!hasToken) {
      // Redirect to signup page with return URL
      const signupUrl = new URL('/signup', request.url)
      signupUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(signupUrl)
    }
  }
  
  // Handle auth routes (redirect if already authenticated)
  if (matchesPattern(pathname, ROUTES.AUTH)) {
    if (hasToken) {
      // Redirect to chat or return URL
      const returnUrl = request.nextUrl.searchParams.get('returnUrl')
      const redirectUrl = returnUrl || '/chat'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // CSP header for additional security
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )
  
  return response
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