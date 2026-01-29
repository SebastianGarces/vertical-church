"use client";

import { motion } from "motion/react";

export function OurHistory() {
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
            Our History
          </h2>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-pipper/50">
            Built on the foundations that preceded it.
          </p>

          <div className="mt-8 max-w-3xl space-y-6 font-body text-base leading-relaxed text-pipper/70 md:text-lg">
            <p>
              Vertical Church was first started as a mission destination at
              Stony&apos;s Baptist Church, sponsored by the First Southern
              Baptist Church of Columbus. That started in June of 1967 (over the
              Bowling Alley on Linden Street in Coshocton. It appears otherwise
              that it did not last long).
            </p>
            <p>
              In 1984, the building at 300 Grace of Columbus is built and First
              Southern Baptist Church started the first of several churches in
              what would be the Greater and Columbus. In 1985 and in 1988, Grace
              Baptist Church within 1st change its name, eventually becoming
              Known as Vertical Church.
            </p>
            <p>
              In 2015, the pastorate of Colonial Village Baptist Church was due
              to dwindle and give all of the resources to Gateway Church, with
              the Metro of a supporter. In 2018, Gateway Church of North
              Ridgeville and Vertical Church Columbus (now came together to
              Birth Vertical Church North).
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
