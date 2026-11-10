"use client";

import { motion } from "motion/react";
import { Doodle } from "./Doodle";
import { PhotoSlot } from "./PhotoSlot";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

/**
 * "You're Invited!" block, after the back of the printed card: invitation copy on the
 * left, three photo slots on the right. Wording from the card (minus the unconfirmed
 * Dec 27 date) plus the welcome line from the campaign plan.
 */
export function Invitation() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
        <div>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-end gap-3">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
                You&apos;re Invited!
              </h2>
              <Doodle name="tree" className="mb-1 w-9 shrink-0 md:w-11" />
            </div>
            <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
              Christmas at Vertical Church
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-xl space-y-5 font-body text-base leading-relaxed text-pipper/80 md:text-lg"
          >
            <p>
              We&apos;d love for you and your family to join us for our Christmas celebration at Vertical
              Church! It&apos;s a special time of music, joy, and reflection on the true meaning of Christmas.
            </p>
            <p>
              Whether you&apos;ve been in church for years or are thinking about visiting for the first
              time, we&apos;d love to welcome you.
            </p>
            <p>
              Come experience a warm, welcoming community as we celebrate the hope of Jesus together on{" "}
              <strong className="font-bold text-pipper">Christmas Eve at 4 PM</strong>.
            </p>
          </motion.div>
        </div>

        {/* Photo grid, like the card back: one wide on top, two below. */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {[
            { slot: "invite-advent", className: "col-span-2 aspect-[16/9]" },
            { slot: "invite-story", className: "aspect-square" },
            { slot: "invite-candle", className: "aspect-square" },
          ].map((photo, index) => (
            <motion.div
              key={photo.slot}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`overflow-hidden rounded-[20px] ${photo.className}`}
            >
              <PhotoSlot slot={photo.slot} className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
