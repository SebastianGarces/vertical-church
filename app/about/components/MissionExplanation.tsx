"use client";

import { motion } from "motion/react";

export function MissionExplanation() {
  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
            Our Mission is Unashamedly Unoriginal
          </h2>

          <div className="mt-8 max-w-3xl space-y-6 font-body text-base leading-relaxed text-pipper/70 md:text-lg">
            <p>
              Jesus initiated it and we aim to continue it. Jesus gave it to his
              church immediately following his resurrection, almost 2000 years
              ago — and we&apos;re still obeying it.
            </p>
            <p className="border-l-2 border-pipper/30 pl-6 italic text-pipper/80">
              &ldquo;Go, therefore, and make disciples of all nations, baptizing
              them in the name of the Father and of the Son and of the Holy
              Spirit, teaching them to observe all that I have commanded
              you.&rdquo; —{" "}
              <span className="text-yuma">
                The Great Commission, Matthew 28:19-20
              </span>
            </p>
            <p className="border-l-2 border-pipper/30 pl-6 italic text-pipper/80">
              &ldquo;You shall love the Lord your God with all your heart and
              with all your soul and with all your mind. This is the great and
              first commandment. And a second is like it: You shall love your
              neighbor as yourself.&rdquo; —{" "}
              <span className="text-yuma">
                The Great Commandment, Matthew 22:37-40
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
