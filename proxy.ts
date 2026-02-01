import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").toLowerCase();
  const { pathname } = request.nextUrl;

  // Check if this is the admin subdomain
  const isAdminSubdomain =
    hostname.includes("admin.localhost") ||
    hostname.includes("admin.gsgarces") ||
    hostname.includes("admin.vertical.family");

  if (isAdminSubdomain) {
    // Admin subdomain: rewrite all paths to /admin/* 
    // (unless already prefixed with /admin or is an API route)
    if (pathname === "/") {
      // Root goes to login
      return NextResponse.rewrite(new URL("/admin/login", request.url));
    }
    
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
      // Rewrite /dashboard -> /admin/dashboard, etc.
      return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
    }
  } else {
    // Main domain: block direct access to /admin routes
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)",
  ],
};
