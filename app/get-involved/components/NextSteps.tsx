"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

/**
 * Content rooted in product-docs/theology.md:
 * - Salvation: theology "Salvation" + "Eternal Security of the Believer"
 * - Baptism: theology "Baptism and Communion"
 * - Read God's Word: theology "Sufficiency of Scripture"
 * - Talk with God: theology "Worship" (prayer, adoration, thanksgiving)
 */
const nextSteps = [
  {
    number: "01",
    title: "I Said Yes to Jesus",
    description:
      "Salvation comes by faith in Christ alone—He died for our sins and rose again. When you receive Him as Savior, you are justified by His shed blood and born again by the Spirit. Your salvation is secure in Him.",
    reference: "Romans 8:37-39",
  },
  {
    number: "02",
    title: "Get Baptized",
    description:
      "Water baptism is a public identification with Jesus in His death, burial, and resurrection. It symbolizes our death to sin and newness of life in Christ. Baptism is commanded for every believer—not for salvation, but as an obedient next step.",
    reference: "Romans 6:3-4",
  },
  {
    number: "03",
    title: "Read God's Word",
    description:
      "Scripture is God's complete and sufficient revelation—the final authority for faith and life. Engaging with the Bible daily gives us the truth, wisdom, and counsel we need to trust and obey Him.",
    reference: "2 Timothy 3:16",
  },
  {
    number: "04",
    title: "Talk with God",
    description:
      "Worship includes adoration, praise, prayer, and thanksgiving. God invites us to draw near to Him. Prayer is not only asking—it's yielding our hearts to Him and lifting His name high.",
    reference: "John 4:23-24",
  },
];

function NextStepCard({
  number,
  title,
  description,
  reference,
}: {
  number: string;
  title: string;
  description: string;
  reference: string;
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
      <p className="mt-4 font-body text-xs text-yuma md:text-sm">{reference}</p>
    </div>
  );
}

export function NextSteps() {
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
      const newIndex = Math.round(progress * (nextSteps.length - 1));
      setActiveIndex(Math.min(Math.max(newIndex, 0), nextSteps.length - 1));
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const cards = scrollContainer.querySelectorAll("[data-card]");
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="px-4 md:px-8"
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
            Next Steps
          </h2>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Your Journey in Faith
          </p>
        </motion.div>

        {/* Mobile: Horizontal scroll with snap */}
        <div className="mt-10 md:hidden">
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
            style={{ scrollPaddingLeft: "16px" }}
          >
            {nextSteps.map((step, index) => (
              <motion.div
                key={step.number}
                data-card
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="w-[280px] min-w-[280px] snap-start"
              >
                <NextStepCard
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  reference={step.reference}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            {nextSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className="relative flex h-3 items-center justify-center cursor-pointer"
                aria-label={`Go to step ${index + 1}`}
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
          {nextSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <NextStepCard
                number={step.number}
                title={step.title}
                description={step.description}
                reference={step.reference}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
