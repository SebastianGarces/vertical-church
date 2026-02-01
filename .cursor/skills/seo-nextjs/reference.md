# SEO Reference for Next.js 16

Detailed patterns and technical reference for SEO implementation.

## Metadata Inheritance and Merging

Next.js merges metadata from parent to child segments:

```
app/layout.tsx         → Base metadata (metadataBase, defaults)
  app/blog/layout.tsx  → Blog section defaults
    app/blog/[slug]/page.tsx → Individual page overrides
```

**Merging rules**:
- Nested fields like `openGraph` are **replaced**, not merged
- To share OG images across pages, create a shared export:

```tsx
// app/shared-metadata.ts
export const openGraphImage = { images: ['/og-default.png'] }

// app/about/page.tsx
import { openGraphImage } from '../shared-metadata'

export const metadata: Metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'About Us',
  },
}
```

## Title Patterns

### Template Usage

```tsx
// Root layout
export const metadata = {
  title: {
    template: '%s | Brand',
    default: 'Brand - Tagline',
  },
}

// Child page
export const metadata = {
  title: 'Products', // → "Products | Brand"
}

// Override template (absolute title)
export const metadata = {
  title: {
    absolute: 'Custom Title Without Brand',
  },
}
```

## Canonical URL Patterns

### Static Pages

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: '/about',
  },
}
```

### Dynamic Pages

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}
```

### Internationalized Sites

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: '/about',
    languages: {
      'en-US': '/en/about',
      'es-ES': '/es/about',
    },
  },
}
```

## Streaming Metadata Behavior

Next.js 16 streams `generateMetadata` results for better TTFB:

1. **JavaScript-capable bots** (Googlebot): Metadata appended to `<body>`, interpreted correctly
2. **HTML-limited bots** (Twitterbot, Slackbot): Metadata blocks rendering, appears in `<head>`

To control this behavior:

```ts
// next.config.ts
export default {
  // Treat all bots as HTML-limited (disable streaming)
  htmlLimitedBots: /.*/,
}
```

## Large Site Sitemaps

For sites with >50,000 URLs, use `generateSitemaps`:

```tsx
// app/products/sitemap.ts
import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  const totalProducts = await getProductCount()
  const sitemapCount = Math.ceil(totalProducts / 50000)
  
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id)
  const products = await getProductsBatch(id * 50000, 50000)
  
  return products.map((product) => ({
    url: `https://example.com/products/${product.slug}`,
    lastModified: product.updatedAt,
  }))
}
```

Output: `/products/sitemap/0.xml`, `/products/sitemap/1.xml`, etc.

## Robots.txt Patterns

### Development vs Production

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }
  
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

### Bot-Specific Rules

```tsx
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/', crawlDelay: 10 },
      { userAgent: 'GPTBot', disallow: '/' }, // Block AI crawlers
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## Image SEO

### Next/Image Optimization

```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Descriptive alt text with keywords"
  width={1200}
  height={630}
  priority // LCP image
/>
```

### Image Sitemap

```tsx
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com/products/widget',
      lastModified: new Date(),
      images: [
        'https://example.com/images/widget-front.jpg',
        'https://example.com/images/widget-side.jpg',
      ],
    },
  ]
}
```

## Video Sitemap

```tsx
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com/tutorials/getting-started',
      videos: [
        {
          title: 'Getting Started Tutorial',
          thumbnail_loc: 'https://example.com/thumbnails/getting-started.jpg',
          description: 'Learn how to get started with our product.',
          content_loc: 'https://example.com/videos/getting-started.mp4',
          duration: 120,
        },
      ],
    },
  ]
}
```

## JSON-LD Patterns

### Organization Schema (Root Layout)

```tsx
// app/layout.tsx
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Company Name',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://twitter.com/company',
    'https://facebook.com/company',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
```

### Breadcrumb Schema

```tsx
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://example.com/blog' },
    { '@type': 'ListItem', position: 3, name: post.title },
  ],
}
```

### FAQ Schema

```tsx
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}
```

## Performance Impact on SEO

### Avoid Metadata Waterfalls

```tsx
// Bad - sequential fetches
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  const author = await getAuthor(post.authorId) // Waits for post
  
  return { title: `${post.title} by ${author.name}` }
}

// Good - parallel fetches
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  const author = getAuthor(post.authorId) // Start early
  
  return {
    title: `${post.title} by ${(await author).name}`,
  }
}
```

### Cache Metadata Fetches

```tsx
import { cache } from 'react'

export const getPost = cache(async (slug: string) => {
  return db.query.posts.findFirst({ where: eq(posts.slug, slug) })
})

// Used in both generateMetadata and page component
// Only fetches once per request
```

## Common Audit Findings

### Missing Metadata

```bash
# Check which pages lack metadata exports
grep -rL "export const metadata\|export async function generateMetadata" app/**/page.tsx
```

### Duplicate Titles

Look for pages with identical or very similar titles that could cannibalize each other.

### Missing Alt Text

```bash
# Find images without alt attributes
grep -r "<Image" app/ --include="*.tsx" | grep -v "alt="
```

### Thin Content

Pages with minimal unique content should either:
- Be expanded with valuable content
- Be consolidated with related pages
- Use `noindex` if utility pages
