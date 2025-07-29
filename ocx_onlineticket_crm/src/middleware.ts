import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Danh sách các trang cần authentication
const protectedRoutes = [
  '/dashboard',
  '/users',
  '/organizations',
  '/events',
  '/tickets',
  '/orders',
  '/payments',
  '/email-management',
  '/ticket-codes',
  '/charts',
]

// Danh sách các trang public (không cần authentication)
const publicRoutes = [
  '/signin',
  '/signup',
  '/auth',
  '/api',
  '/testflight-buy-ticket',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Bỏ qua API routes và static files
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/public')) {
    return NextResponse.next()
  }
  
  // Kiểm tra xem có phải là protected route không
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Nếu là protected route
  if (isProtectedRoute) {
    // Kiểm tra token trong cookies
    const token = request.cookies.get('access_token')?.value
    
    console.log(`[Middleware] Protected route: ${pathname}`);
    console.log(`[Middleware] Token found: ${!!token}`);
    
    // Nếu không có token, redirect về signin
    if (!token) {
      const signinUrl = new URL('/signin', request.url)
      signinUrl.searchParams.set('redirect', pathname)
      console.log(`[Middleware] Redirecting to: ${signinUrl.toString()}`);
      return NextResponse.redirect(signinUrl)
    }
  }
  
  // Nếu đã đăng nhập và truy cập signin/signup, redirect về dashboard
  if (pathname === '/signin' || pathname === '/signup') {
    const token = request.cookies.get('access_token')?.value
    
    console.log(`[Middleware] Public route: ${pathname}`);
    console.log(`[Middleware] Token found: ${!!token}`);
    
    if (token) {
      console.log(`[Middleware] Redirecting authenticated user to dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 