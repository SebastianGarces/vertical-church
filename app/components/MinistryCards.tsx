"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { MinistryCard } from "./MinistryCard";

const ministries = [
  { title: "Small Groups", href: "/connect/small-groups", image: "https://vertical-church.t3.storage.dev/small-groups.png" },
  { title: "Worship Services", href: "/connect/worship", image: "https://vertical-church.t3.storage.dev/worship-services.png" },
  { title: "Children's Ministry", href: "/connect/children", image: "https://vertical-church.t3.storage.dev/children-ministry.png" },
  { title: "Student Ministry", href: "/connect/students", image: "https://vertical-church.t3.storage.dev/student-ministry.png" },
];

export function MinistryCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      
      // Calculate progress (0 to 1)
      const progress = scrollLeft / maxScroll;
      
      // Map progress to card index
      const newIndex = Math.round(progress * (ministries.length - 1));
      setActiveIndex(Math.min(Math.max(newIndex, 0), ministries.length - 1));
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const cards = scrollContainer.querySelectorAll("[data-card]");
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  return (
    <section className="bg-navy py-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Mobile: Horizontal scroll with snap */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-4 md:hidden"
          style={{ scrollPaddingLeft: "16px" }}
        >
          {ministries.map((ministry, index) => (
            <div key={ministry.title} data-card className="snap-start">
              <MinistryCard
                title={ministry.title}
                href={ministry.href}
                image={ministry.image}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Mobile: Pagination dots */}
        <div className="flex items-center justify-center gap-3 pt-4 md:hidden">
          {ministries.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className="relative flex h-3 items-center justify-center"
              aria-label={`Go to card ${index + 1}`}
            >
              <motion.div
                className="bg-pipper/50"
                initial={false}
                animate={{
                  width: activeIndex === index ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: activeIndex === index ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </button>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden grid-cols-4 gap-6 px-8 md:grid">
          {ministries.map((ministry, index) => (
            <MinistryCard
              key={ministry.title}
              title={ministry.title}
              href={ministry.href}
              image={ministry.image}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
