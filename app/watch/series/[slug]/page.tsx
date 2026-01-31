import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { getSeriesBySlug, getSeries } from "@/lib/db/queries";
import { SermonThumbnail } from "../../components/SermonThumbnail";
import { SermonCard } from "../../components/SermonCard";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const result = await getSeriesBySlug(slug);

  if (!result) {
    return { title: "Series Not Found | Vertical Church" };
  }

  return {
    title: `${result.series.title} | Vertical Church`,
    description: `Watch all sermons from the "${result.series.title}" series at Vertical Church.`,
  };
}

export async function generateStaticParams() {
  const allSeries = await getSeries();
  return allSeries.map((s) => ({ slug: s.slug }));
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getSeriesBySlug(slug);

  if (!result) {
    notFound();
  }

  const { series, sermons } = result;

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

        {/* Series header */}
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Series thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:w-80 md:flex-shrink-0 lg:w-96">
              <SermonThumbnail
                src={series.thumbnailUrl}
                alt={series.title}
                priority
              />
            </div>

            {/* Series info */}
            <div className="flex-1">
              <h1 className="font-tagline text-3xl italic text-pipper md:text-4xl lg:text-5xl">
                {series.title}
              </h1>
              <p className="mt-4 font-body text-pipper/60">
                {sermons.length} {sermons.length === 1 ? "teaching" : "teachings"}
              </p>
            </div>
          </div>
        </section>

        {/* Sermons list */}
        <section className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
          <h2 className="mb-6 font-heading text-sm font-bold uppercase tracking-[0.2em] text-pipper">
            All Teachings
          </h2>

          {sermons.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-pipper/60">No teachings in this series yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon) => (
                <SermonCard
                  key={sermon.id}
                  sermon={{ ...sermon, series }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
