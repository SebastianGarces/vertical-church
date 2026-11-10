"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CHURCH_PHONE } from "@/lib/christmas";
import { Doodle } from "./Doodle";
import { PlanVisitButton } from "./PlanVisitDialog";

/** Bottom call to action: the second PLAN YOUR VISIT button and a contact fallback. */
export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <Doodle name="bow" className="absolute top-10 left-4 w-12 md:left-[8%] md:w-20" />
      <Doodle name="tree" className="absolute right-4 bottom-10 w-12 md:right-[8%] md:w-20" phase={0.6} />
      <Doodle name="ornament" className="absolute top-12 right-[16%] hidden w-14 lg:block" phase={1.1} />
      <Doodle name="holly" className="absolute bottom-12 left-[15%] hidden w-16 lg:block" phase={0.2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto flex max-w-xl flex-col items-center px-14 text-center sm:px-4"
      >
        <p className="font-christmas-script text-5xl leading-none text-pipper md:text-6xl">We&apos;d love to see you</p>
        <h2 className="font-christmas-display mt-2 text-[3.25rem] leading-[0.9] tracking-[-0.04em] text-florence md:text-[5.5rem]">
          Christmas Eve
          <span className="block text-pipper">at 4PM</span>
        </h2>
        <p className="mt-6 font-body text-lg leading-relaxed text-pipper/85">
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
