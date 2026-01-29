"use client";

import { motion } from "motion/react";

export function OurVision() {
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
            Our Vision
          </h2>

          <p className="mt-6 max-w-4xl font-tagline text-xl leading-relaxed text-florence md:text-2xl lg:text-3xl">
            Our vision is to be a church that is faithfully committed to making
            more disciples and extending the dream of Jesus Christ with an
            effective witness and mutual ministry.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
