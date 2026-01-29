"use client";

import { motion } from "motion/react";
import { Button } from "@/app/components/Button";

const pillars = [
  {
    title: "Unapologetic Preaching",
    description: "Proclaiming the authority of God's Word without apology",
    reference: "2 Timothy",
    verse: "4:2",
  },
  {
    title: "Unashamed Worship",
    description: "Lifting high the name of Jesus through worship",
    reference: "John",
    verse: "4:23",
  },
  {
    title: "Unceasing Prayer",
    description: "Believing fervently in the power of prayer",
    reference: "Ephesians",
    verse: "6:18",
  },
  {
    title: "Unafraid Witness",
    description: "Sharing the good news of Jesus with boldness",
    reference: "Ephesians",
    verse: "6:19-20",
  },
];

export function OurPillars() {
  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
            Our Pillars
          </h2>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            What We Believe
          </p>

          <div className="mt-10 space-y-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 border-l-4 border-florence pl-6"
              >
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pipper md:text-xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-pipper/60 md:text-base">
                    {pillar.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-body text-sm text-yuma md:text-base">
                    {pillar.reference}
                  </span>
                  <span className="ml-2 font-body text-sm text-yuma/70 md:text-base">
                    {pillar.verse}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-10"
          >
            <Button href="/theology" variant="primary">
              Read About Our Theology
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
