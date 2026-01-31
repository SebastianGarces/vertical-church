"use client";

import { motion } from "motion/react";

export function PageIntro() {
  return (
    <section className="bg-navy pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.05em] text-pipper md:text-5xl">
            Events
          </h1>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            See What&apos;s Happening
          </p>
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-pipper/80 md:text-lg">
            Join us for worship gatherings, community events, and opportunities
            to connect. Check out what&apos;s coming up and register to be a part
            of it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
