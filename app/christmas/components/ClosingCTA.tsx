"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CHURCH_PHONE } from "@/lib/christmas";
import { Doodle } from "./Doodle";
import { PlanVisitButton } from "./PlanVisitDialog";

/** Bottom call to action: the second PLAN YOUR VISIT button and a contact fallback. */
export function ClosingCTA() {
  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-2xl flex-col items-center px-4 text-center md:px-8"
      >
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-florence">We&apos;d Love to See You</p>
        <div className="mt-4 flex items-end justify-center gap-3">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-pipper md:text-4xl">
            Christmas Eve at 4PM
          </h2>
          <Doodle name="bow" className="mb-1 w-9 shrink-0 md:w-11" />
        </div>
        <p className="mt-4 font-body text-base leading-relaxed text-pipper/80 md:text-lg">
          5400 Lear Nagle Rd, North Ridgeville
        </p>
        <PlanVisitButton className="mt-8 w-full max-w-xs py-4" />
        <p className="mt-6 font-body text-base text-pipper/80">
          Have a question?{" "}
          <Link href="/contact" className="text-pipper underline underline-offset-4 hover:text-florence">
            Contact us
          </Link>{" "}
          or call{" "}
          <a href={CHURCH_PHONE.href} className="whitespace-nowrap text-pipper underline underline-offset-4 hover:text-florence">
            {CHURCH_PHONE.display}
          </a>
        </p>
      </motion.div>
    </section>
  );
}
