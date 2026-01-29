"use client";

import { motion } from "motion/react";

export function OurMission() {
  return (
    <section className="bg-florence py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="font-heading text-base font-bold uppercase tracking-[0.15em] text-navy/70 md:text-lg">
            Our Mission
          </span>
          <blockquote className="mt-6 font-tagline text-2xl leading-relaxed text-navy md:text-3xl lg:text-4xl">
            We exist to glorify God through the fulfillment of the Great
            Commission in the spirit of the Great Commandment.
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
