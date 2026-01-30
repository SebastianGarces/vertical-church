"use client";

import { motion } from "motion/react";
import { Button } from "@/app/components/Button";

const serveTeams = [
  {
    title: "Guest Services",
    description:
      "Welcome and assist guests, help with parking, and extend hospitality so every person feels at home.",
  },
  {
    title: "Worship Team",
    description:
      "Use your gifts in music, vocals, or production to help lead the church in worship.",
  },
  {
    title: "Kids Team",
    description:
      "Serve in children's ministry—teaching, caring for, and investing in the next generation.",
  },
  {
    title: "Student Team",
    description:
      "Invest in middle and high school students through teaching, mentoring, and community.",
  },
  {
    title: "Tech Team",
    description:
      "Run audio, video, lighting, and live stream so the message and worship are clear and engaging.",
  },
  {
    title: "Creative Team",
    description:
      "Contribute through design, photography, social media, and other creative roles.",
  },
];

export function ServeTeams() {
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
            Serve on a Team
          </h2>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Use Your Gifts
          </p>
          <p className="mt-6 max-w-3xl font-body text-base leading-relaxed text-pipper/70 md:text-lg">
            One of the great joys of being a disciple is serving Christ and one
            another. We encourage everyone in the Vertical Church family to use
            their time, energy, and talents to build the Kingdom and care for
            each other.
          </p>

          <div className="mt-10 space-y-6">
            {serveTeams.map((team, index) => (
              <motion.div
                key={team.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-start gap-4 border-l-4 border-florence pl-6"
              >
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pipper md:text-xl">
                    {team.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-pipper/60 md:text-base">
                    {team.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-10"
          >
            <Button href="/visit" variant="primary">
              I Want to Serve
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
