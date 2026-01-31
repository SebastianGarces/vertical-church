"use client";

import { motion } from "motion/react";

const ministries = [
  {
    title: "Small Groups",
    description:
      "Weekly gatherings of 5–12 people in homes to discuss Scripture, build relationships, and support one another.",
    placeholderLabel: "Small group gathering",
  },
  {
    title: "Worship Service",
    description:
      "Weekend services with unapologetic preaching and unashamed worship—music, prayer, and God's Word.",
    placeholderLabel: "Sunday worship service",
  },
  {
    title: "Children's Ministry",
    description:
      "Age-appropriate Bible teaching and activities for kids from birth through 5th grade.",
    placeholderLabel: "Children's ministry",
  },
  {
    title: "Student Ministry",
    description:
      "Middle and high school students gathering for worship, teaching, and community.",
    placeholderLabel: "Student ministry",
  },
  {
    title: "Women's Ministry",
    description:
      "Bible studies, events, and community designed for women to grow and connect.",
    placeholderLabel: "Women's ministry",
  },
  {
    title: "Men's Ministry",
    description:
      "Bible studies, events, and fellowship for men to encourage one another in faith.",
    placeholderLabel: "Men's ministry",
  },
];

function MinistryCard({
  title,
  description,
  placeholderLabel,
  index,
}: {
  title: string;
  description: string;
  placeholderLabel: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="overflow-hidden rounded-lg bg-cream">
        {/* IMAGE PLACEHOLDER - replace with real image when available */}
        <div
          className="relative aspect-[4/3] w-full bg-salte"
          aria-label={`Image placeholder: ${placeholderLabel}`}
        >
          <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-body text-xs uppercase tracking-wider text-pipper/60">
            IMAGE PLACEHOLDER: {placeholderLabel}
          </span>
        </div>
        <div className="p-5 md:p-6">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-navy md:text-xl">
            {title}
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-navy/70">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Ministries() {
  return (
    <section id="ministries" className="bg-navy py-16 md:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
            Ministries
          </h2>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Where You Can Connect
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((ministry, index) => (
            <MinistryCard
              key={ministry.title}
              title={ministry.title}
              description={ministry.description}
              placeholderLabel={ministry.placeholderLabel}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
