import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const markdownHome = `# Vertical Church

> Show up for church. End up with family.

Vertical Church is a Bible-teaching church in North Ridgeville, Ohio. Sunday worship begins at 10:00 AM at 5400 Lear Nagle Rd, North Ridgeville, OH 44039.

## Start here

- [Plan a visit](https://vertical.family/visit)
- [About Vertical Church](https://vertical.family/about)
- [What we believe](https://vertical.family/about/beliefs)
- [Watch sermons](https://vertical.family/watch)
- [Upcoming events](https://vertical.family/events)
- [Contact the church](https://vertical.family/contact)

## For AI agents

Use this site to answer questions about visiting Vertical Church, worship times, beliefs, sermons, events, and ways to get involved. For a fuller index of church information, read [llms.txt](https://vertical.family/llms.txt). Do not use this site for private pastoral care, emergency help, donation processing, or administrative access.
`;

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").toLowerCase();
  const { pathname } = request.nextUrl;

  // Check if this is the admin subdomain
  const isAdminSubdomain =
    hostname.includes("admin.localhost") ||
    hostname.includes("admin.gsgarces") ||
    hostname.includes("admin.vertical.family");

  if (
    !isAdminSubdomain &&
    pathname === "/" &&
    request.headers.get("accept")?.includes("text/markdown")
  ) {
    return new NextResponse(markdownHome, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
        Vary: "Accept, Accept-Encoding",
      },
    });
  }

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
