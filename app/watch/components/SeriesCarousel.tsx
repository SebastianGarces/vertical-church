"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SermonThumbnail } from "./SermonThumbnail";
import type { Series } from "@/lib/db/queries";

interface SeriesCarouselProps {
  series: Series[];
}

export function SeriesCarousel({ series }: SeriesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320; // Card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="mb-6 font-heading text-[32px] font-bold uppercase leading-none tracking-[0.2em] text-pipper md:text-[48px]">
          Series
        </h2>
      </div>

      {/* Carousel container - extends beyond the max-width */}
      <div className="relative">
        {/* Left arrow - desktop only */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-navy/80 p-2 text-pipper backdrop-blur-sm transition-opacity md:block ${
            canScrollLeft ? "opacity-100 hover:bg-navy" : "opacity-0"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Scrollable container - extends beyond max-width to the right */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto pl-4 pr-8 md:pl-8 xl:pl-[calc((100vw-72rem)/2+2rem)]"
        >
          {series.map((s) => (
            <Link
              key={s.id}
              href={`/watch/series/${s.slug}`}
              className="group flex-shrink-0"
            >
              <div className="relative h-44 w-72 overflow-hidden rounded-xl md:h-52 md:w-80">
                <SermonThumbnail
                  src={s.thumbnailUrl}
                  alt={s.title}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/20" />
              </div>
            </Link>
          ))}
        </div>

        {/* Right arrow - desktop only */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-navy/80 p-2 text-pipper backdrop-blur-sm transition-opacity md:block ${
            canScrollRight ? "opacity-100 hover:bg-navy" : "opacity-0"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation arrows below on mobile */}
      <div className="mx-auto mt-4 flex max-w-6xl justify-between px-4 md:hidden">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`text-pipper transition-opacity ${
            canScrollLeft ? "opacity-100" : "opacity-30"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`text-pipper transition-opacity ${
            canScrollRight ? "opacity-100" : "opacity-30"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
