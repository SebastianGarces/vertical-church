"use client";

import { motion } from "motion/react";

const expectations = [
  {
    number: "01",
    title: "Fervent Worship",
    description:
      "A typical service will begin with the worship band leading the congregation in singing vertically-focused worship songs in a contemporary style.",
  },
  {
    number: "02",
    title: "Scripture-Driven Teaching",
    description:
      "Every week, Pastor Bryan will study the Word of God and deliver a message centered on Scriptural truths and personal application.",
  },
  {
    number: "03",
    title: "Community",
    description:
      "We will gather together to worship God in community. Our weekends will include opportunities before or after the service to fellowship and connect with one another.",
  },
];

function ExpectationCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="h-full rounded-lg bg-cream p-6 md:p-8">
      <span className="font-heading text-sm uppercase tracking-[0.15em] text-florence">
        {number}
      </span>
      <h3 className="mt-2 font-heading text-xl font-bold uppercase tracking-wide text-navy md:text-2xl">
        {title}
      </h3>
      <p className="mt-4 font-body text-sm leading-relaxed text-navy/70 md:text-base">
        {description}
      </p>
    </div>
  );
}

export function WhatToExpect() {
  return (
    <section id="what-to-expect" className="bg-navy py-16 md:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
            What to Expect
          </h2>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            When You Visit
          </p>
        </motion.div>

        {/* Expectation Cards */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {expectations.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ExpectationCard
                number={item.number}
                title={item.title}
                description={item.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
