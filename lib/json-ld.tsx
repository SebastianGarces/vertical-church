/**
 * JSON-LD Structured Data helpers for AI SEO.
 * These schemas help AI systems (ChatGPT, Perplexity, etc.) understand our content.
 * @see https://schema.org
 */

import type { EventWithDetails } from "./planning-center";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = "https://vertical.family";
const CHURCH_NAME = "Vertical Church";
const CHURCH_SLOGAN = "Show up for Church. End up with Family.";
const CHURCH_DESCRIPTION =
  `A Bible-teaching church in North Ridgeville, Ohio. ${CHURCH_SLOGAN} We exist to glorify God through the fulfillment of the Great Commission in the spirit of the Great Commandment.`;

const ADDRESS = {
  streetAddress: "5400 Lear Nagle Rd",
  addressLocality: "North Ridgeville",
  addressRegion: "OH",
  postalCode: "44039",
  addressCountry: "US",
};

const GEO = {
  latitude: 41.3892,
  longitude: -82.019,
};

const SOCIAL_PROFILES = [
  "https://www.facebook.com/verticalchurch.family",
  "https://www.instagram.com/vertical.family/",
  "https://www.youtube.com/@VerticalChurchNorth/featured",
  "https://open.spotify.com/show/54N7ElGRkMBptcXuZRfoVL",
];

// ─────────────────────────────────────────────────────────────────────────────
// Organization / Church Schema
// ─────────────────────────────────────────────────────────────────────────────

export interface OrganizationSchema {
  "@context": string;
  "@type": string[];
  name: string;
  description: string;
  slogan: string;
  url: string;
  logo: string;
  image: string;
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: {
    "@type": string;
    dayOfWeek: string;
    opens: string;
    closes: string;
  };
  sameAs: string[];
}

/**
 * Get the Organization/Church schema for the root layout.
 * This tells AI systems who we are, where we're located, and when we meet.
 */
export function getOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": ["Church", "LocalBusiness", "Organization"],
    name: CHURCH_NAME,
    description: CHURCH_DESCRIPTION,
    slogan: CHURCH_SLOGAN,
    url: SITE_URL,
    logo: `${SITE_URL}/vertical-main-logo.svg`,
    image: "https://vertical-church.t3.storage.dev/home-hero-1.png",
    address: {
      "@type": "PostalAddress",
      ...ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...GEO,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "12:00",
    },
    sameAs: SOCIAL_PROFILES,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VideoObject Schema (for Sermons)
// ─────────────────────────────────────────────────────────────────────────────

export interface VideoObjectSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  publisher: {
    "@type": string;
    name: string;
    logo: {
      "@type": string;
      url: string;
    };
  };
}

export interface SermonData {
  title: string;
  description?: string;
  sermonDate: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  pastor?: string | null;
  series?: { title: string } | null;
}

/**
 * Get VideoObject schema for a sermon page.
 * Helps AI systems understand and recommend our sermon videos.
 */
export function getVideoObjectSchema(sermon: SermonData): VideoObjectSchema {
  const youtubeId = extractYouTubeId(sermon.videoUrl);
  const thumbnailUrl =
    sermon.thumbnailUrl ||
    (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : undefined);

  const description = sermon.description
    ? sermon.description
    : sermon.pastor
      ? `Watch "${sermon.title}" by ${sermon.pastor} from ${sermon.series?.title || CHURCH_NAME}.`
      : `Watch "${sermon.title}" from ${sermon.series?.title || CHURCH_NAME}.`;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: sermon.title,
    description,
    thumbnailUrl,
    uploadDate: new Date(sermon.sermonDate).toISOString(),
    contentUrl: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined,
    embedUrl: youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : undefined,
    publisher: {
      "@type": "Organization",
      name: CHURCH_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/vertical-main-logo.svg`,
      },
    },
  };
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Schema
// ─────────────────────────────────────────────────────────────────────────────

export interface EventSchema {
  "@context": string;
  "@type": string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  image?: string;
  url: string;
  location?: {
    "@type": string;
    name: string;
    address: string;
  };
  organizer: {
    "@type": string;
    name: string;
    url: string;
  };
  eventStatus: string;
  eventAttendanceMode: string;
}

/**
 * Get Event schema for an event from Planning Center.
 * Helps AI systems discover and recommend our events.
 */
export function getEventSchema(event: EventWithDetails): EventSchema | null {
  // Need at least one time to create a valid event schema
  if (event.times.length === 0) return null;

  const firstTime = event.times[0];

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description || undefined,
    startDate: firstTime.startsAt.toISOString(),
    endDate: firstTime.endsAt?.toISOString(),
    image: event.logoUrl || undefined,
    url: event.registrationUrl,
    location: event.location
      ? {
          "@type": "Place",
          name: event.location.name,
          address: event.location.address,
        }
      : {
          "@type": "Place",
          name: CHURCH_NAME,
          address: `${ADDRESS.streetAddress}, ${ADDRESS.addressLocality}, ${ADDRESS.addressRegion} ${ADDRESS.postalCode}`,
        },
    organizer: {
      "@type": "Organization",
      name: CHURCH_NAME,
      url: SITE_URL,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
}

/**
 * Get an array of Event schemas for multiple events.
 */
export function getEventsSchema(events: EventWithDetails[]): EventSchema[] {
  return events.map(getEventSchema).filter((e): e is EventSchema => e !== null);
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD Script Component Helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render a JSON-LD script tag.
 * Use this in page components to inject structured data.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
