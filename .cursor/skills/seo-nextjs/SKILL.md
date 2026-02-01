---
name: seo-nextjs
description: Audit and optimize SEO for Next.js 16 applications using the Metadata API. Use when reviewing page metadata, implementing generateMetadata, creating sitemaps, configuring robots.txt, generating OG images, or improving search engine optimization.
---

# SEO for Next.js 16

Comprehensive SEO audit and implementation guide using Next.js 16 Metadata APIs and best practices.

## Current Implementation Status

**See [/product-docs/seo-implementation.md](/product-docs/seo-implementation.md) for what's already implemented in this project.**

Summary of completed features:
- Root layout with `metadataBase`, title template, OpenGraph, Twitter cards, robots
- Static metadata on all public pages with canonical URLs
- Dynamic `generateMetadata` on `/watch/[slug]` and `/watch/series/[slug]`
- `sitemap.ts` with static + dynamic routes from database
- `robots.ts` blocking `/admin/` and `/api/`
- Admin pages marked as noindex

Remaining enhancements (not yet implemented):
- JSON-LD structured data (Organization, VideoObject, Event schemas)
- Dynamic OG image generation with `ImageResponse`
- Search console verification codes

## When to Apply

- Auditing existing page metadata
- Implementing `generateMetadata` for dynamic pages
- Creating or updating `sitemap.ts` or `robots.ts`
- Generating dynamic OG images with `ImageResponse`
- Fixing crawlability or indexation issues
- Optimizing Core Web Vitals for SEO

## Quick Audit Checklist

```
SEO Audit Progress (Vertical Church):
- [x] metadataBase configured in root layout
- [x] Title template set up with brand suffix
- [x] Unique titles and descriptions per page
- [x] OpenGraph metadata on all public pages
- [x] Twitter card metadata configured
- [x] sitemap.ts generating all indexable URLs
- [x] robots.ts allowing/disallowing correct paths
- [x] Canonical URLs via alternates
- [x] Dynamic pages use generateMetadata
- [x] OG images exist (static or generated)
- [ ] Verification codes for Search Console
- [ ] JSON-LD structured data where appropriate
```

## Next.js 16 Metadata Implementation

### 1. Root Layout Configuration

Always set `metadataBase` and title template in root layout:

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    template: '%s | Brand Name',
    default: 'Brand Name',
  },
  description: 'Site-wide default description',
  openGraph: {
    siteName: 'Brand Name',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### 2. Static Page Metadata

For pages with known content, export static `metadata`:

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us', // Becomes "About Us | Brand Name"
  description: 'Learn about our mission and team.',
  alternates: {
    canonical: '/about',
  },
}
```

### 3. Dynamic Page Metadata

Use `generateMetadata` for data-dependent pages:

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}
```

**Performance tip**: Use `React.cache()` to deduplicate data fetching between `generateMetadata` and page component:

```tsx
import { cache } from 'react'

export const getPost = cache(async (slug: string) => {
  return db.query.posts.findFirst({ where: eq(posts.slug, slug) })
})
```

### 4. File-Based Metadata

#### Sitemap (`app/sitemap.ts`)

```tsx
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://example.com'
  
  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: 'monthly' as const },
  ]
  
  // Dynamic pages from database
  const posts = await db.query.posts.findMany()
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postUrls]
}
```

#### Robots (`app/robots.ts`)

```tsx
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://example.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

#### Dynamic OG Images (`app/blog/[slug]/opengraph-image.tsx`)

```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        padding: 60,
      }}>
        <h1 style={{ fontSize: 60, textAlign: 'center' }}>{post.title}</h1>
      </div>
    )
  )
}
```

## Technical SEO Audit

### Crawlability Issues

| Issue | Check | Fix |
|-------|-------|-----|
| Blocked by robots | Review `robots.ts` | Ensure indexable pages have `allow` |
| Missing sitemap | Check `/sitemap.xml` | Create `app/sitemap.ts` |
| Broken internal links | Audit `<Link>` usage | Fix href values |
| Orphan pages | Check internal linking | Add links from parent pages |

### Indexation Issues

| Issue | Check | Fix |
|-------|-------|-----|
| Noindex on important pages | Check `robots` metadata | Set `index: true` |
| Missing canonicals | Check `alternates.canonical` | Add to all pages |
| Duplicate content | Compare page metadata | Use canonical or consolidate |

### Core Web Vitals Impact on SEO

Next.js 16 features that improve Core Web Vitals:

1. **Streaming Metadata**: `generateMetadata` streams without blocking UI
2. **Image Optimization**: Use `next/image` for automatic optimization
3. **Font Optimization**: Use `next/font` to eliminate layout shift
4. **Parallel Fetching**: Avoid waterfalls with `Promise.all()`

## On-Page SEO Checklist

### Title Tags

- [ ] 50-60 characters visible in SERP
- [ ] Primary keyword near beginning
- [ ] Unique per page
- [ ] Uses title template for brand consistency

### Meta Descriptions

- [ ] 150-160 characters
- [ ] Includes primary keyword
- [ ] Compelling call to action
- [ ] Unique per page

### Heading Structure

- [ ] One H1 per page
- [ ] H1 contains primary keyword
- [ ] Logical hierarchy (H1 → H2 → H3)
- [ ] Server-rendered (not client-only)

### OpenGraph & Twitter

- [ ] `og:title` matches or enhances page title
- [ ] `og:description` matches meta description
- [ ] `og:image` is 1200x630px minimum
- [ ] `twitter:card` set to `summary_large_image`

## Structured Data (JSON-LD)

Add JSON-LD in page components:

```tsx
// app/blog/[slug]/page.tsx
export default async function Page({ params }: Props) {
  const post = await getPost((await params).slug)
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* content */}</article>
    </>
  )
}
```

## Common Schema Types

| Page Type | Schema | Required Fields |
|-----------|--------|-----------------|
| Article/Blog | `Article` | headline, datePublished, author |
| Product | `Product` | name, offers, image |
| Organization | `Organization` | name, url, logo |
| Local Business | `LocalBusiness` | name, address, telephone |
| FAQ | `FAQPage` | mainEntity (questions) |
| Event | `Event` | name, startDate, location |

## Verification Codes

Add search console verification:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
  },
}
```

## Output Format

When reporting SEO issues:

```
## SEO Audit Report

### Critical Issues
- **Issue**: Missing metadataBase in root layout
- **Impact**: High - OG images use relative URLs
- **Fix**: Add `metadataBase: new URL('https://...')` to app/layout.tsx

### On-Page Issues
- **Issue**: Duplicate titles on /about and /team
- **Impact**: Medium - keyword cannibalization
- **Fix**: Differentiate titles with unique keywords

### Quick Wins
- **Issue**: No OG images on blog posts
- **Impact**: Low - poor social sharing appearance
- **Fix**: Add opengraph-image.tsx to blog/[slug]/
```

## Related Resources

- [Next.js Metadata API](/.next-docs/01-app/03-api-reference/04-functions/generate-metadata.mdx)
- [Sitemap Documentation](/.next-docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.mdx)
- [OG Image Generation](/.next-docs/01-app/01-getting-started/14-metadata-and-og-images.mdx)
