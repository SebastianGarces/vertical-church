import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { getSermonBySlug, getSermons } from "@/lib/db/queries";
import { VideoPlayer } from "./VideoPlayer";
import { SermonCard } from "../components/SermonCard";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
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
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) {
    return { title: "Sermon Not Found" };
  }

  const thumbnailUrl =
    sermon.series?.thumbnailUrl || getVideoThumbnail(sermon.videoUrl);

  const description = sermon.pastor
    ? `Watch "${sermon.title}" by ${sermon.pastor} from ${sermon.series?.title || "Vertical Church"}.`
    : `Watch "${sermon.title}" from ${sermon.series?.title || "Vertical Church"}.`;

  return {
    title: sermon.title,
    description,
    alternates: {
      canonical: `/watch/${slug}`,
    },
    openGraph: {
      title: sermon.title,
      description,
      type: "video.other",
      ...(thumbnailUrl && {
        images: [
          {
            url: thumbnailUrl,
            width: 480,
            height: 360,
            alt: sermon.title,
          },
        ],
      }),
    },
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SermonPage({ params }: PageProps) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) {
    notFound();
  }

  // Get more sermons from the same series for "More from this series"
  const moreFromSeries = sermon.seriesId
    ? await getSermons({ seriesId: sermon.seriesId, limit: 4 })
    : null;

  // Filter out current sermon
  const relatedSermons =
    moreFromSeries?.sermons.filter((s) => s.id !== sermon.id).slice(0, 3) || [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        {/* Back link */}
        <div className="mx-auto max-w-6xl px-4 pt-24 md:px-8 md:pt-28">
          <Link
            href="/watch"
            className="inline-flex items-center gap-2 rounded-full border border-pipper/30 px-4 py-2 font-button text-sm uppercase tracking-wider text-pipper transition-colors hover:border-florence hover:text-florence"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Teachings
          </Link>
        </div>

        {/* Video player */}
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <VideoPlayer videoUrl={sermon.videoUrl} title={sermon.title} />
        </section>

        {/* Sermon info */}
        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <h1 className="font-tagline text-3xl italic text-pipper md:text-4xl lg:text-5xl">
            {sermon.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-pipper/60">
            <span className="font-body">{formatDate(sermon.sermonDate)}</span>

            {sermon.series && (
              <>
                <span className="text-pipper/30">•</span>
                <Link
                  href={`/watch/series/${sermon.series.slug}`}
                  className="font-body transition-colors hover:text-florence"
                >
                  {sermon.series.title}
                </Link>
              </>
            )}

            {sermon.pastor && (
              <>
                <span className="text-pipper/30">•</span>
                <span className="font-body">{sermon.pastor}</span>
              </>
            )}

            {sermon.book && (
              <>
                <span className="text-pipper/30">•</span>
                <span className="font-body">{sermon.book}</span>
              </>
            )}
          </div>
        </section>

        {/* More from this series */}
        {relatedSermons.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pt-16 md:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-pipper">
                More from {sermon.series?.title}
              </h2>
              {sermon.series && (
                <Link
                  href={`/watch/series/${sermon.series.slug}`}
                  className="font-button text-sm uppercase tracking-wider text-pipper/60 transition-colors hover:text-florence"
                >
                  View All
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedSermons.map((s) => (
                <SermonCard key={s.id} sermon={s} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
