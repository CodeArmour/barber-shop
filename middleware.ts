import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("adminAuthenticated")?.value
  const pathname = request.nextUrl.pathname

  // access to sign in
  if (pathname === "/admin/sign-in") {
    return NextResponse.next()
  }

  // unauthenticated users cannot access other admin routes
  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/admin/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"], // middleware only checks admin routes
}
