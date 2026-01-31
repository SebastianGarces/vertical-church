"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SearchToolbar } from "./SearchToolbar";
import { SermonCard } from "./SermonCard";
import type { SermonWithSeries, FilterOptions, PaginationCursor } from "@/lib/db/queries";

interface TeachingsSectionProps {
  initialSermons: SermonWithSeries[];
  initialCursor: PaginationCursor | null;
  filterOptions: FilterOptions;
}

export function TeachingsSection({
  initialSermons,
  initialCursor,
  filterOptions,
}: TeachingsSectionProps) {
  const [sermons, setSermons] = useState(initialSermons);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialCursor);

  // Filter state
  const [search, setSearch] = useState("");
  const [seriesId, setSeriesId] = useState("all");
  const [book, setBook] = useState("all");
  const [pastor, setPastor] = useState("all");
  const [year, setYear] = useState("all");

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch sermons with current filters
  const fetchSermons = useCallback(
    async (newCursor?: PaginationCursor | null, reset = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (seriesId !== "all") params.set("seriesId", seriesId);
        if (book !== "all") params.set("book", book);
        if (pastor !== "all") params.set("pastor", pastor);
        if (year !== "all") params.set("year", year);
        if (newCursor) {
          params.set("cursorDate", newCursor.date);
          params.set("cursorId", newCursor.id);
        }

        const res = await fetch(`/api/sermons?${params.toString()}`);
        const data = await res.json();

        if (reset) {
          setSermons(data.sermons);
        } else {
          setSermons((prev) => [...prev, ...data.sermons]);
        }
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } catch (error) {
        console.error("Failed to fetch sermons:", error);
      } finally {
        setLoading(false);
      }
    },
    [search, seriesId, book, pastor, year]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    // Debounce search input
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSermons(null, true);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, seriesId, book, pastor, year, fetchSermons]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchSermons(cursor);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [cursor, hasMore, loading, fetchSermons]);

  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="mb-6 font-heading text-[32px] font-bold uppercase leading-none tracking-[0.2em] text-pipper md:text-[48px]">
          Teachings
        </h2>

        {/* Search and filters toolbar */}
        <div className="mb-8">
          <SearchToolbar
            filterOptions={filterOptions}
            search={search}
            seriesId={seriesId}
            book={book}
            pastor={pastor}
            year={year}
            onSearchChange={setSearch}
            onSeriesChange={setSeriesId}
            onBookChange={setBook}
            onPastorChange={setPastor}
            onYearChange={setYear}
          />
        </div>

        {/* Sermons grid */}
        {sermons.length === 0 && !loading ? (
          <div className="py-12 text-center">
            <p className="text-pipper/60">No teachings found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        )}

        {/* Load more trigger / loading indicator */}
        <div ref={loadMoreRef} className="mt-8 flex justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-pipper/60">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-pipper/30 border-t-pipper" />
              <span className="font-button text-sm uppercase tracking-wider">
                Loading...
              </span>
            </div>
          )}
          {!hasMore && sermons.length > 0 && !loading && (
            <p className="font-button text-sm uppercase tracking-wider text-pipper/40">
              All teachings loaded
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
