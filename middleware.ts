import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes that don't require authentication
const publicRoutes = ["/", "/auth/login", "/auth/signup"]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get user from cookies
  const user = request.cookies.get("user")?.value

  // If trying to access protected route without authentication, redirect to login
  if (!isPublicRoute && !user) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if ((pathname === "/auth/login" || pathname === "/auth/signup") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
}
