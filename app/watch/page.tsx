import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PartnersBanner } from "../components/PartnersBanner";
import {
  LatestSermonHero,
  SeriesCarousel,
  TeachingsSection,
} from "./components";
import {
  getLatestSermon,
  getSeries,
  getSermons,
  getFilterOptions,
} from "@/lib/db/queries";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Watch",
  description:
    "Watch sermons and teachings from Vertical Church. Browse our library of messages by series, book, pastor, or year.",
  alternates: {
    canonical: "/watch",
  },
};

function HeroSkeleton() {
  return (
    <section className="bg-navy pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-6 h-8 w-64 animate-pulse rounded bg-pipper/20 md:h-12 md:w-80" />
        <div className="aspect-video w-full animate-pulse rounded-2xl bg-pipper/10" />
      </div>
    </section>
  );
}

function CarouselSkeleton() {
  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-pipper/20 md:h-12 md:w-40" />
        {/* Carousel items aligned with header */}
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 w-72 flex-shrink-0 animate-pulse rounded-xl bg-pipper/10 md:h-52 md:w-80"
            />
          ))}
        </div>
      </div>
      {/* Mobile arrows placeholder */}
      <div className="mx-auto mt-4 flex max-w-6xl justify-between px-4 md:hidden">
        <div className="h-6 w-6" />
        <div className="h-6 w-6" />
      </div>
    </section>
  );
}

function TeachingsSkeleton() {
  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-6 h-8 w-44 animate-pulse rounded bg-pipper/20 md:h-12 md:w-56" />
        <div className="mb-8 flex gap-4">
          <div className="h-11 w-48 animate-pulse rounded-md bg-pipper/10" />
          <div className="h-11 w-32 animate-pulse rounded-md bg-pipper/10" />
          <div className="h-11 w-28 animate-pulse rounded-md bg-pipper/10" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <div className="aspect-video w-full animate-pulse rounded-xl bg-pipper/10" />
              <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-pipper/20" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-pipper/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function WatchPageContent() {
  const [latestSermon, allSeries, sermonsResult, filterOptions] =
    await Promise.all([
      getLatestSermon(),
      getSeries(),
      getSermons({ limit: 12 }),
      getFilterOptions(),
    ]);

  return (
    <>
      {latestSermon && <LatestSermonHero sermon={latestSermon} />}
      <SeriesCarousel series={allSeries} />
      <TeachingsSection
        initialSermons={sermonsResult.sermons}
        initialCursor={sermonsResult.nextCursor}
        filterOptions={filterOptions}
      />
    </>
  );
}

export default function WatchPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main>
        <Suspense
          fallback={
            <>
              <HeroSkeleton />
              <CarouselSkeleton />
              <TeachingsSkeleton />
            </>
          }
        >
          <WatchPageContent />
        </Suspense>
      </main>
      <PartnersBanner />
      <Footer />
    </div>
  );
}
