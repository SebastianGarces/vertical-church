import Link from "next/link";
import { SermonThumbnail } from "./SermonThumbnail";
import type { SermonWithSeries } from "@/lib/db/queries";

interface SermonCardProps {
  sermon: SermonWithSeries;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getVideoThumbnail(url: string): string | null {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  }
  return null;
}

export function SermonCard({ sermon }: SermonCardProps) {
  const thumbnailUrl =
    sermon.series?.thumbnailUrl || getVideoThumbnail(sermon.videoUrl);

  return (
    <Link href={`/watch/${sermon.slug}`} className="group block">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <SermonThumbnail src={thumbnailUrl} alt={sermon.title} />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/20" />
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="font-tagline text-base italic text-pipper line-clamp-2 group-hover:text-florence md:text-lg">
          {sermon.title}
        </h3>
        <p className="mt-1 font-body text-sm text-pipper/60">
          {formatDate(sermon.sermonDate)}
        </p>
      </div>
    </Link>
  );
}
