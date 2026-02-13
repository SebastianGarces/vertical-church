"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/app/components/Button";
import { WantToServeModal } from "./WantToServeModal";
import { SERVE_TEAM_OPTIONS } from "./serve-teams-data";

export function ServeTeams() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="serve" className="bg-navy py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="overflow-hidden rounded-lg bg-cream md:flex md:flex-row-reverse md:p-5">
            <div className="relative aspect-[4/3] w-full flex-shrink-0 md:aspect-auto md:w-1/2 md:min-h-[400px] md:rounded-lg md:overflow-hidden">
              <Image
                src="https://vertical-church.t3.storage.dev/corn-festival.jpg"
                alt="Vertical Church community outreach at local event"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center p-6 md:w-1/2 md:p-8"
            >
              <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-navy md:text-3xl">
                Serve on a Team
              </h2>
              <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
                Use Your Gifts
              </p>
              <p className="mt-6 font-body text-base leading-relaxed text-navy/80 md:text-lg">
                One of the great joys of being a disciple is serving Christ and one
                another. We encourage everyone in the Vertical Church family to use
                their time, energy, and talents to build the Kingdom and care for
                each other.
              </p>

              <div className="mt-8 space-y-4">
                {SERVE_TEAM_OPTIONS.map((team, index) => (
                  <motion.div
                    key={team.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="border-l-4 border-florence pl-4"
                  >
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-navy md:text-base">
                      {team.title}
                    </h3>
                    <p className="mt-1 font-body text-xs text-navy/60 md:text-sm">
                      {team.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-8"
              >
                <Button onClick={() => setIsModalOpen(true)} variant="primary" className="w-full md:w-auto">
                  I Want to Serve
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <WantToServeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
