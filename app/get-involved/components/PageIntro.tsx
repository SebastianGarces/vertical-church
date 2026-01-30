"use client";

import { motion } from "motion/react";

export function PageIntro() {
  return (
    <section className="bg-navy pt-48 pb-16 md:pt-64 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.05em] text-pipper md:text-5xl">
            Get Involved
          </h1>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Take Your Next Step
          </p>
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-pipper/80 md:text-lg">
            Whether you&apos;re new to faith or deepening your walk with Christ,
            there are clear next steps for you. Connect with community, grow in
            God&apos;s Word, and use your gifts to serve.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
