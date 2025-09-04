import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAMES } from '@/lib/auth'

// Define route configurations
const ROUTES = {
  // Public routes that don't require authentication
  PUBLIC: [
    '/',
    '/login',
    '/signup',
    '/about',
    '/api/health',
    '/api/hello',
  ],
  // Authentication routes (redirect to dashboard if already authenticated)
  AUTH: [
    '/login',
    '/signup',
  ],
  // Protected routes that require authentication
  PROTECTED: [
    '/chat',
    '/dashboard',
    '/profile',
    '/settings',
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
 * Frontend Route Middleware
 * Only checks for access token presence in cookies for protected routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
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
  
  // Handle protected routes
  if (matchesPattern(pathname, ROUTES.PROTECTED)) {
    if (!hasToken) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Handle auth routes (redirect if already authenticated)
  if (matchesPattern(pathname, ROUTES.AUTH)) {
    if (hasToken) {
      // Redirect to dashboard or return URL
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
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
