"use client";

import { motion } from "motion/react";
import { SUNDAY_AFTER_CHRISTMAS } from "@/lib/christmas";

/**
 * The Sunday after Christmas, kept deliberately secondary to Christmas Eve: a small
 * line under the gathering card, not a second event. It's a regular Sunday service.
 */
export function SundayNote() {
  return (
    <section className="-mt-6 pb-4 md:-mt-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto max-w-2xl px-6 text-center font-body text-base leading-relaxed text-pipper/80"
      >
        Come back{" "}
        <strong className="font-semibold text-pipper">
          {SUNDAY_AFTER_CHRISTMAS.date} at {SUNDAY_AFTER_CHRISTMAS.time}
        </strong>
        . This is our regular Sunday gathering, and we&apos;d love to see you again.
      </motion.p>
    </section>
  );
}
