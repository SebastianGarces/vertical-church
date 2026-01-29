# Design Specification
## Vertical Church Website

---

## Brand Colors

### Color Palette

#### Primary Colors (Dominant)

| Name | Hex | Usage |
|------|-----|-------|
| **Navy** | `#141C25` | Primary brand color - backgrounds, headers, footers, dark sections |
| **Florence** | `#FF5231` | Primary accent - CTAs, buttons, highlights, key text |

#### Supporting Colors

| Name | Hex | Usage |
|------|-----|-------|
| Pipper | `#FFFFFF` | Light backgrounds, text on dark |
| Sage | `#676830` | Secondary accent, olive green elements |
| Sky | `#3A84D9` | Links, informational elements |
| Yuma | `#C8AF63` | Decorative gold accents |
| Tin | `#D4D4D0` | Light backgrounds, borders, surfaces |
| Salte | `#4A4E50` | Secondary text, muted UI elements |
| Bark | `#45402E` | Dark earth tone accents |
| Sand | `#F8DE5C` | Warm yellow highlights |

### Tailwind v4 Setup (global.css)

Tailwind v4 uses CSS-based configuration with the `@theme` directive. Add the following to your `global.css`:

```css
@import "tailwindcss";

@theme {
  /* Primary Colors (Dominant) */
  --color-navy: #141C25;
  --color-florence: #FF5231;
  
  /* Supporting Colors */
  --color-pipper: #FFFFFF;
  --color-sage: #676830;
  --color-sky: #3A84D9;
  --color-yuma: #C8AF63;
  --color-tin: #D4D4D0;
  --color-salte: #4A4E50;
  --color-bark: #45402E;
  --color-sand: #F8DE5C;
}
```

### Usage in Tailwind Classes

With the above theme configuration, you can use these colors directly in your classes:

```html
<!-- Backgrounds -->
<div class="bg-navy">...</div>
<div class="bg-florence">...</div>

<!-- Text -->
<p class="text-pipper">White text</p>
<p class="text-florence">Accent text</p>

<!-- Borders -->
<div class="border-tin">...</div>

<!-- Hover states -->
<button class="bg-florence hover:bg-florence/90">...</button>
```

### Semantic CSS Variables (Optional)

For additional semantic naming, add these to your `global.css` after the `@theme` block:

```css
:root {
  /* Semantic mappings */
  --color-background-dark: var(--color-navy);
  --color-background-light: var(--color-pipper);
  --color-surface: var(--color-tin);
  
  --color-accent: var(--color-florence);
  --color-accent-secondary: var(--color-yuma);
  
  --color-text-primary: var(--color-navy);
  --color-text-inverse: var(--color-pipper);
  --color-text-muted: var(--color-salte);
  
  --color-border: var(--color-tin);
  --color-overlay: var(--color-navy);
}
```

---

## Typography

> **Font Source**: All fonts are available via [Google Fonts](https://fonts.google.com/)

### Font Families

| Usage | Font | Style/Weight | Notes |
|-------|------|--------------|-------|
| **Taglines/Quotes** | Fraunces | Italic | Elegant serif for inspirational text like "Love God. Love People. Serve the World." |
| **Subheadings/Labels** | Overpass | Medium, Caps, Loose tracking | Used for section labels like "VERTICALLY FOCUSED" |
| **Body Text** | Overpass | Regular (400) | Primary body copy font |
| **Buttons/CTAs** | PT Mono | Bold, Caps, Loose tracking | Monospace font for button text like "JOIN A GROUP" |

### Google Fonts Import

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,400;1,500;1,600&family=Overpass:wght@400;500;600;700&family=PT+Mono&display=swap');

/* CSS Variables */
:root {
  --font-tagline: 'Fraunces', Georgia, serif;
  --font-heading: 'Overpass', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Overpass', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-button: 'PT Mono', 'Courier New', monospace;
}
```

### Type Scale

| Element | Font | Size (Desktop) | Size (Mobile) | Weight | Style |
|---------|------|----------------|---------------|--------|-------|
| Tagline/Quote | Fraunces | 32-48px | 24-32px | 400-500 | Italic |
| H1 (Hero) | Overpass | 64-80px | 36-48px | 700 | Normal |
| H2 (Section) | Overpass | 40-48px | 28-32px | 600 | Caps, Loose |
| H3 (Card Title) | Overpass | 24-28px | 20-24px | 600 | Caps, Loose |
| Body Large | Overpass | 18-20px | 16-18px | 400 | Normal |
| Body | Overpass | 16px | 14-16px | 400 | Normal |
| Caption | Overpass | 12-14px | 12px | 400 | Normal |
| Button | PT Mono | 14-16px | 14px | 700 | Caps, Loose |

### Text Styles

- **Fraunces Italic** - Used for inspirational taglines and quotes (elegant, humanist feel)
- **Overpass Caps + Loose Tracking** - Used for labels, navigation items, and subheaders
- **Overpass Regular** - Used for body text and general content
- **PT Mono Bold Caps** - Used exclusively for button text (creates distinctive CTA style)
- **Accent color** - Applied to highlighted text (e.g., "END UP WITH FAMILY")

### Letter Spacing (Tracking)

```css
/* Loose tracking for caps text */
.text-caps-loose {
  text-transform: uppercase;
  letter-spacing: 0.1em; /* Adjust as needed: 0.05em - 0.15em */
}
```

---

## Layout & Grid

### Container Widths

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile | 100% | 16-24px |
| Tablet | 100% | 32-48px |
| Desktop | 1200-1440px | 48-80px |

### Grid System

- **12-column grid** for desktop layouts
- **Flexible gaps**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Section spacing**: 80-120px vertical padding between sections

### Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## Component Specifications

### Navigation (Header)

**Desktop:**
- Fixed/sticky header on scroll
- Logo left-aligned
- Navigation links centered: About, Connect, Resources, Giving, Shop
- "Plan a Visit" CTA button right-aligned (accent color, rounded)
- Height: 64-80px
- Background: Dark/primary color

**Mobile:**
- Hamburger menu icon right side
- Full-screen overlay menu on open
- Stacked navigation links
- Height: 56-64px

### Hero Section

- **Layout**: Image collage/mosaic with overlapping photos
- **Text overlay**: Large headline with accent color on key phrase
- **Weekly services badge**: Bordered box with service time
- **Background**: Dark with image treatment
- **Height**: 70-90vh (desktop), 60-80vh (mobile)

### Image Collage/Mosaic

- Mix of color and black & white photography
- Overlapping/layered effect
- Rotated images (slight angle: 2-5 degrees)
- Drop shadows for depth
- Images show: worship, community, preaching, fellowship

### Section Cards

**Ministry Cards:**
- Square or portrait aspect ratio
- Image with text overlay at bottom
- Hover effect (scale, overlay change)
- Caption: Ministry name in uppercase

**Teaching Cards:**
- Landscape or square aspect ratio
- Series artwork/branding
- Title, date, and metadata below
- Consistent styling across series

### Buttons

**Primary Button:**
- Background: Accent color (orange)
- Text: White, uppercase, tracked
- Padding: 12-16px vertical, 24-32px horizontal
- Border-radius: 4-6px
- Hover: Darken or scale effect

**Secondary Button:**
- Border: 1-2px solid white or accent
- Background: Transparent
- Text: White or accent color

**Ghost Button:**
- No border
- Text with arrow or underline on hover

### Marquee/Scrolling Text

- Large display text (80-150px)
- Continuous horizontal scroll animation
- Text phrases: "WITH CHRIST", "WALK WITH CHRIST", etc.
- Opacity: Muted/faded appearance
- Spans full viewport width

### Footer

**Layout:**
- Logo centered or left-aligned
- Multi-column link layout (4-5 columns)
- Categories: Connections, Ministries, Resources, Support Us, Shop
- Address and copyright at bottom
- Social media icons

**Styling:**
- Dark background (primary color)
- Light text
- Subtle link hover effects

---

## Imagery Guidelines

### Photography Style

- **Authentic moments** - Real congregation, genuine emotions
- **High contrast** - Bold, impactful imagery
- **Mix of color and B&W** - Creates visual interest and variety
- **Action shots** - Worship, community, service in progress
- **Portraits** - Leadership, community members

### Image Treatments

- **Overlays**: Dark overlays for text legibility (50-70% opacity)
- **Duotone**: Optional duotone effects using brand colors
- **Borders/Frames**: White or colored borders on some images
- **Rotation**: Slight rotation (2-5deg) for dynamic feel

### Aspect Ratios

| Usage | Ratio |
|-------|-------|
| Hero images | 16:9, 4:3 |
| Ministry cards | 1:1, 3:4 |
| Teaching thumbnails | 16:9 |
| Staff portraits | 1:1 (circular crop) |

---

## Interactive Elements

### Hover States

- Buttons: Color shift, subtle scale (1.02-1.05)
- Cards: Lift effect (translateY), shadow increase
- Links: Underline, color change
- Images: Overlay opacity change, zoom effect

### Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;
```

### Animations

- **Fade in on scroll**: Elements animate in as user scrolls
- **Marquee**: Continuous horizontal scroll (30-60s duration)
- **Carousel**: Smooth slide transitions for series cards
- **Menu**: Slide-in or fade for mobile menu

---

## Page-Specific Layouts

### Home Page

1. Navigation (fixed)
2. Hero with image collage + headline
3. Welcome section (centered text + CTA)
4. Ministry cards (horizontal scroll on mobile, grid on desktop)
5. Marquee text band
6. "Who is Vertical Church" feature block
7. Footer

### About Page

1. Navigation
2. Hero with "About Vertical Church" + image collage
3. Our History section
4. Mission statement (accent background callout)
5. Ministry carousel
6. Our Pillars (list with icons/numbers)
7. Marquee text band
8. Our Principles (3-column layout)
9. Our Vision
10. Our Leadership (photo grid with bios)
11. Footer

### Teachings Page

1. Navigation
2. Latest Teaching (featured video with details)
3. Series carousel (horizontal scroll)
4. Teachings library (filterable grid)
5. Load more button
6. Footer

### Content/Article Pages

1. Navigation
2. Hero banner with title
3. Article content (max-width: 720-800px, centered)
4. Related content
5. Footer

---

## Accessibility

- **Color contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Focus states**: Visible focus rings on all interactive elements
- **Alt text**: Descriptive alt text for all images
- **Keyboard navigation**: Full site navigable via keyboard
- **ARIA labels**: Proper labeling for screen readers
- **Reduced motion**: Respect `prefers-reduced-motion`

---

## Responsive Behavior

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Hamburger | Hamburger | Full nav |
| Hero images | Stacked/single | Collage (smaller) | Full collage |
| Ministry cards | Horizontal scroll | 2-column grid | 4-column grid |
| Footer | Stacked columns | 2x2 grid | Single row |
| Teaching grid | 1 column | 2 columns | 3 columns |
| Marquee | Smaller text | Medium | Full size |

---

*Design Specification v1.0*
*Reference: Vertical Church Mockups*
