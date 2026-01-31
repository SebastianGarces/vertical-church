"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

const principles = [
  {
    number: "01",
    title: "Worship Christ",
    description:
      "God's Word admonishes us to worship together regularly. We worship together as a community through music, prayer, and the preaching of God's Word every weekend.",
  },
  {
    number: "02",
    title: "Walk with Christ",
    description:
      "Growing in your walk with Christ is best achieved in rich community. The Vertical Church family encourages everyone to join a Small Group where you experience fellowship, applicational study in God's Word, and mutual ministry.",
  },
  {
    number: "03",
    title: "Work for Christ",
    description:
      "One of the great joys of being a disciple of Christ is by serving Christ and one another. We encourage all those in the Vertical Church family to use their time, energy, and talents to build the Kingdom of God and care for one another.",
  },
  {
    number: "04",
    title: "Witness for Christ",
    description:
      "Sharing the Good News about Jesus Christ is a vital aspect in the life of a growing disciple. At Vertical Church we encourage believers to share the Gospel with those around us in loving and intentional ways.",
  },
];

function PrincipleCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="h-full rounded-lg bg-cream p-6 md:p-8">
      <span className="font-heading text-sm uppercase tracking-[0.15em] text-florence">
        {number}
      </span>
      <h3 className="mt-2 font-heading text-xl font-bold uppercase tracking-wide text-navy md:text-2xl">
        {title}
      </h3>
      <p className="mt-4 font-body text-sm leading-relaxed text-navy/70 md:text-base">
        {description}
      </p>
    </div>
  );
}

export function OurPrinciples() {
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

      if (maxScroll <= 0) {
        setActiveIndex(0);
        return;
      }

      const progress = scrollLeft / maxScroll;
      const newIndex = Math.round(progress * (principles.length - 1));
      setActiveIndex(Math.min(Math.max(newIndex, 0), principles.length - 1));
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
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-4 md:px-8"
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
            Our Principles
          </h2>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Who We Are
          </p>

          <p className="mt-6 max-w-3xl font-body text-base leading-relaxed text-pipper/70 md:text-lg">
            The Vertical Church exists at Vertical Church is to glorify God by
            fulfilling the mission that Jesus gave His followers to make
            disciples, baptize them, and teach them to follow His ways (Matthew
            28:19-20). Vertical Church makes disciples of Jesus by encouraging
            them to worship Christ, walk with Christ, work for Christ, and
            witness for Christ.
          </p>
        </motion.div>

        {/* Mobile: Horizontal scroll with snap */}
        <div className="mt-10 md:hidden">
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
            style={{ scrollPaddingLeft: "16px" }}
          >
            {principles.map((principle, index) => (
              <motion.div
                key={principle.number}
                data-card
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="w-[280px] min-w-[280px] snap-start"
              >
                <PrincipleCard
                  number={principle.number}
                  title={principle.title}
                  description={principle.description}
                />
              </motion.div>
            ))}
          </div>

          {/* Mobile: Pagination dots */}
          <div className="flex items-center justify-center gap-3 pt-4">
            {principles.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className="relative flex h-3 items-center justify-center cursor-pointer"
                aria-label={`Go to card ${index + 1}`}
              >
                <motion.div
                  className="bg-pipper/50"
                  initial={false}
                  animate={{
                    width: activeIndex === index ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      activeIndex === index
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.5)",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Tablet & Desktop: Grid */}
        <div className="mt-10 hidden grid-cols-2 gap-6 px-8 md:grid min-[1300px]:grid-cols-4">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <PrincipleCard
                number={principle.number}
                title={principle.title}
                description={principle.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
