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
 * "You Are Invited!" block, after the back of the printed card: invitation copy on the
 * left, three photo slots on the right. Wording from the card (minus the unconfirmed
 * Dec 27 date) plus the welcome line from the campaign plan.
 */
export function Invitation() {
  return (
    <section className="relative py-12 md:py-20">
      <Doodle name="gift" className="absolute top-16 left-[3%] hidden w-14 xl:block 2xl:left-[8%] 2xl:w-16" phase={0.3} />
      <Doodle name="ornament" className="absolute right-3 -top-2 w-10 md:hidden" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
        <div>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex items-end gap-4">
            <h2 className="font-christmas-serif text-[3.25rem] leading-[0.95] tracking-[-0.03em] text-pipper md:text-7xl">
              You Are Invited!
            </h2>
            {/* The bow and tree from the card, beside the heading on wider screens. */}
            <div className="hidden shrink-0 items-end gap-1 sm:flex lg:hidden xl:flex" aria-hidden="true">
              <Doodle name="bow" className="w-14" />
              <Doodle name="tree" className="w-16" phase={0.5} />
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 max-w-xl space-y-5 font-body text-lg leading-relaxed text-pipper/90 md:text-xl"
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
              <PhotoSlot slot={photo.slot} className="h-full w-full" candle={photo.slot === "invite-candle"} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
