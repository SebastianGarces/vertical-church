"use client";

import { motion } from "motion/react";

function ServiceTimesBadge({ className }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col items-center border-2 border-pipper/30 px-6 py-4 text-center ${className || ""}`}>
      <span className="font-heading text-sm uppercase tracking-[0.15em] text-pipper/60">
        Weekly Services
      </span>
      <span className="mt-1 font-heading text-base uppercase tracking-[0.1em] text-pipper">
        Sun. at 10 AM
      </span>
    </div>
  );
}

export function Welcome() {
  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl font-bold uppercase tracking-[0.05em] text-pipper md:text-5xl">
            Welcome to Vertical Church
          </h2>

          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-pipper/70 md:text-lg">
            Passionate worship, bold proclamation of God&apos;s Word, purposeful
            prayer, and relentless love of God and others...these are the
            hallmarks of Vertical Church, and whether you are a lifelong
            follower of Jesus Christ or just exploring who God is, we hope you
            will join us!
          </p>

          {/* Service Times Badge - below paragraph */}
          <ServiceTimesBadge className="mt-8 w-full md:w-auto" />
        </motion.div>
      </div>
    </section>
  );
}
