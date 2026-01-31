"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SmallGroupInterestModal } from "./SmallGroupInterestModal";

export function SmallGroups() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="overflow-hidden rounded-lg bg-cream md:flex md:p-5">
            {/* IMAGE PLACEHOLDER - replace with real image when available */}
            <div
              className="relative aspect-[4/3] w-full flex-shrink-0 bg-salte md:aspect-auto md:w-1/2 md:min-h-[320px]"
              aria-label="Image placeholder: small group community"
            >
              <span className="absolute inset-0 flex items-center justify-center p-6 text-center font-body text-sm uppercase tracking-wider text-pipper/60 md:text-base">
                IMAGE PLACEHOLDER: small group community
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center p-6 md:w-1/2 md:p-8"
            >
              <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-navy md:text-3xl">
                Small Groups
              </h2>
              <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
                Community That Grows Together
              </p>
              <p className="mt-6 font-body text-base leading-relaxed text-navy/80 md:text-lg">
                Growing in your walk with Christ happens best in rich community.
                Small groups are weekly gatherings where you experience fellowship,
                applicational study in God&apos;s Word, and mutual ministry. Find
                a group that fits your schedule and take the next step to connect.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-md bg-florence px-6 py-3 font-button text-xs font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-florence/90"
                >
                  Find a Group
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SmallGroupInterestModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
