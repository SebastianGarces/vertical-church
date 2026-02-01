# SEO Implementation

This document describes the current SEO implementation for the Vertical Church website.

## Current Status

All core SEO features are implemented and functional.

### Completed Checklist

- [x] `metadataBase` configured in root layout
- [x] Title template set up with brand suffix (`%s | Vertical Church`)
- [x] Unique titles and descriptions per page
- [x] OpenGraph metadata on all public pages
- [x] Twitter card metadata configured (`summary_large_image`)
- [x] `sitemap.ts` generating all indexable URLs
- [x] `robots.ts` allowing/disallowing correct paths
- [x] Canonical URLs via `alternates` on all pages
- [x] Dynamic pages use `generateMetadata`
- [x] OG images for sermon/series pages (YouTube thumbnails, series thumbnails)
- [ ] Search console verification codes (add when ready to verify)
- [ ] JSON-LD structured data (future enhancement)

---

## Configuration

### Base URL

```
https://vertical.family
```

### Root Layout Metadata (`app/layout.tsx`)

The root layout configures:

- `metadataBase`: Base URL for resolving relative OG image URLs
- `title.template`: `%s | Vertical Church` - automatically appends brand to page titles
- `title.default`: `Vertical Church` - used when no page title specified
- `description`: "Love God. Love People. Serve the World."
- `openGraph`: Site name, locale (en_US), type (website)
- `twitter.card`: `summary_large_image`
- `robots`: Index/follow with googleBot directives for rich snippets

---

## Page Metadata

### Static Pages

| Route | Title | Canonical |
|-------|-------|-----------|
| `/` | Vertical Church (default) | - |
| `/about` | About Us | `/about` |
| `/about/beliefs` | What We Believe | `/about/beliefs` |
| `/visit` | Plan Your Visit | `/visit` |
| `/watch` | Watch | `/watch` |
| `/events` | Events | `/events` |
| `/get-involved` | Get Involved | `/get-involved` |
| `/give` | Give | `/give` |
| `/contact` | Contact Us | `/contact` |

### Dynamic Pages

| Route | Title Source | OG Image Source |
|-------|--------------|-----------------|
| `/watch/[slug]` | `sermon.title` | YouTube thumbnail or series thumbnail |
| `/watch/series/[slug]` | `series.title` | Series thumbnail URL |

### Protected Pages (noindex)

| Route | robots |
|-------|--------|
| `/admin/*` | `index: false, follow: false` |

---

## Sitemap (`app/sitemap.ts`)

The sitemap dynamically generates URLs for:

1. **Static pages** (9 pages) - All public routes with appropriate priority/changeFrequency
2. **Sermon pages** - All `/watch/[slug]` routes from database
3. **Series pages** - All `/watch/series/[slug]` routes from database

Access at: `/sitemap.xml`

---

## Robots (`app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://vertical.family/sitemap.xml
```

---

## Architecture Notes

### Client Component Pages

Some pages required refactoring to support metadata:

- `/contact` - Client logic extracted to `app/contact/components/ContactPageClient.tsx`
- `/give` - Client logic extracted to `app/give/components/GivePageClient.tsx`

The page.tsx files are now server components that export metadata and render the client component.

### Dynamic Metadata

Sermon and series pages use `generateMetadata` to:

1. Fetch content from database
2. Generate title and description from content
3. Set canonical URL
4. Configure OpenGraph with thumbnail images

---

## Future Enhancements

### JSON-LD Structured Data

Recommended schemas to implement:

| Page | Schema Type | Fields |
|------|-------------|--------|
| Homepage | `Organization` + `Church` | name, url, logo, address, telephone |
| `/watch/[slug]` | `VideoObject` | name, description, thumbnailUrl, uploadDate |
| `/events` | `Event` | name, startDate, location, description |

### Dynamic OG Images

Consider adding `opengraph-image.tsx` files for:

- Sermon pages (branded template with sermon title)
- Series pages (branded template with series artwork)

### Search Console Verification

Add to `app/layout.tsx` when ready:

```tsx
verification: {
  google: 'your-google-verification-code',
}
```
