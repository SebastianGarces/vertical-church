"use client";

import Link from "next/link";
import { SermonThumbnail } from "./SermonThumbnail";
import type { SermonWithSeries } from "@/lib/db/queries";

interface LatestSermonHeroProps {
  sermon: SermonWithSeries;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function getVideoThumbnail(url: string): string | null {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  // Vimeo requires API call for thumbnail, so we'll use placeholder
  return null;
}

export function LatestSermonHero({ sermon }: LatestSermonHeroProps) {
  const thumbnailUrl =
    sermon.series?.thumbnailUrl || getVideoThumbnail(sermon.videoUrl);

  return (
    <section className="bg-navy pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="mb-6 font-heading text-[32px] font-bold uppercase leading-none tracking-[0.2em] text-pipper md:text-[48px]">
          Latest Teaching
        </h2>

        <Link
          href={`/watch/${sermon.slug}`}
          className="group block overflow-hidden rounded-2xl bg-navy ring-1 ring-pipper/20 shadow-2xl shadow-black/40"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <SermonThumbnail
              src={thumbnailUrl}
              alt={sermon.title}
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

            {/* Watch button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded bg-florence px-6 py-3 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-transform group-hover:scale-105">
                Watch
              </span>
            </div>

            {/* Title and date overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <h3 className="font-tagline text-base italic text-pipper md:text-3xl lg:text-4xl">
                {sermon.title}
              </h3>
              <p className="mt-1 font-body text-xs text-pipper/70 md:mt-2 md:text-sm">
                {formatDate(sermon.sermonDate)}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
