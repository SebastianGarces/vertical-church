"use client";

import { motion } from "motion/react";
import { Button } from "./Button";

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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8"
          >
            <Button href="/visit" variant="primary">
              Visit Us
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
