# Subdomain Routing Pattern

## Problem

We needed to serve an admin dashboard on `admin.vertical.family` subdomain while the main site runs on `vertical.family`. 

### Challenges Encountered

1. **Route groups `(admin)` don't work reliably with subdomains** - Server action redirects caused the wrong page to render (home page instead of admin page) even though the URL was correct.

2. **`next.config.js` rewrites don't work for client-side navigation** - Rewrites with `has: [{ type: "host" }]` only apply to server requests, not Link/router navigations.

3. **Cookie domain issues in local dev** - Better Auth cookies were being set for production domain, not localhost.

---

## Solution: Proxy-Based Rewriting

Use `proxy.ts` (Next.js 16's renamed middleware) to rewrite ALL requests, including client-side navigations.

### Architecture

```
URL user sees          →  Internal route
─────────────────────────────────────────
admin.*/              →  /admin/login
admin.*/dashboard     →  /admin/dashboard
admin.*/dashboard/x   →  /admin/dashboard/x
```

### File Structure

```
app/
├── admin/                    # Actual routes at /admin/*
│   ├── layout.tsx
│   ├── admin.css             # Light theme overrides
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── actions.ts            # Server actions (redirects use /dashboard, not /admin/dashboard)
│   ├── components/
│   │   └── AdminSidebar.tsx
│   └── dashboard/
│       ├── layout.tsx        # Auth check
│       ├── page.tsx
│       ├── series/...
│       └── sermons/...
├── page.tsx                  # Main site home
└── ...
```

### proxy.ts

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").toLowerCase();
  const { pathname } = request.nextUrl;

  const isAdminSubdomain =
    hostname.includes("admin.localhost") ||
    hostname.includes("admin.yourdomain.com");

  if (isAdminSubdomain) {
    // Rewrite all paths to /admin/* (unless already prefixed)
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/admin/login", request.url));
    }
    
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)",
  ],
};
```

### Key Rules

1. **Routes live at `/admin/*`** - Actual file paths are `app/admin/dashboard/page.tsx`, etc.

2. **Links/redirects use paths WITHOUT `/admin` prefix** - Write `href="/dashboard"` not `href="/admin/dashboard"`. The proxy adds the prefix.

3. **Server actions redirect to unprefixed paths** - `redirect("/dashboard/series")` not `redirect("/admin/dashboard/series")`.

4. **`usePathname()` returns the URL path** - On `admin.localhost/dashboard`, it returns `/dashboard`, not `/admin/dashboard`.

---

## Local Development

1. Add to `/etc/hosts`:
   ```
   127.0.0.1 admin.localhost
   ```

2. Access at `http://admin.localhost:3000`

3. **Important**: Don't set `BETTER_AUTH_URL` or `BETTER_AUTH_COOKIE_DOMAIN` in `.env.local` for local dev. Only set in production (Vercel).

---

## Production (Vercel)

1. Add domains in Vercel Dashboard:
   - `yourdomain.com` (main site)
   - `admin.yourdomain.com` (admin - same deployment)

2. Set environment variables:
   ```
   BETTER_AUTH_URL=https://admin.yourdomain.com
   BETTER_AUTH_TRUSTED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
   BETTER_AUTH_COOKIE_DOMAIN=.yourdomain.com
   ```

3. DNS records:
   - `A` record for `@` → `76.76.21.21`
   - `CNAME` record for `admin` → `cname.vercel-dns.com`

---

## Why Not Other Approaches?

| Approach | Problem |
|----------|---------|
| Route groups `(admin)` | Server action redirects render wrong page |
| `next.config.js` rewrites | Don't apply to client-side navigation |
| Separate deployment | Unnecessary complexity, can't share code |

The proxy-based approach works because it intercepts ALL requests, both server and client-side.
