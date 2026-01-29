"use client";

import { motion } from "motion/react";

const GOOGLE_MAPS_URL =
  "https://maps.google.com/?q=5400+Lear+Nagle+Rd+North+Ridgeville+OH+44039";

export function ServiceInfo() {
  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 rounded-[20px] border-2 border-pipper/20 bg-navy/50 px-6 py-8 text-center md:flex-row md:justify-center md:gap-12 md:px-12"
        >
          {/* Service Time */}
          <div className="flex flex-col items-center">
            <span className="font-heading text-sm uppercase tracking-[0.15em] text-pipper/60">
              Service Time
            </span>
            <span className="mt-1 font-heading text-2xl font-bold uppercase tracking-wide text-pipper md:text-3xl">
              Sundays at 10am
            </span>
          </div>

          {/* Divider */}
          <div className="hidden h-16 w-px bg-pipper/20 md:block" />
          <div className="h-px w-24 bg-pipper/20 md:hidden" />

          {/* Location */}
          <div className="flex flex-col items-center">
            <span className="font-heading text-sm uppercase tracking-[0.15em] text-pipper/60">
              Location
            </span>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 font-heading text-lg text-florence underline decoration-florence/50 underline-offset-4 transition-colors hover:text-florence/80 hover:decoration-florence md:text-xl"
            >
              5400 Lear Nagle Rd, North Ridgeville, OH 44039
            </a>
            <span className="mt-1 text-sm text-pipper/50">
              Click for directions
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
