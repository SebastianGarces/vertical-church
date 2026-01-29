"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "./Button";
import { VerticalCoinSolidLogo } from "./icons";

export function FeatureSection() {
  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-lg bg-cream p-4 md:flex md:p-5">
            {/* Text Content */}
            <div className="flex flex-col justify-center p-4 md:w-1/2 md:p-6">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.05em] text-florence md:text-xl">
                Who is Vertical Church?
              </h2>

              <p className="mt-4 font-body text-sm leading-relaxed text-navy/80 md:text-base">
                Our goal is to see disciples growing in their Worship for
                Christ, Walk with Christ, Work for Christ, and Witness for
                Christ. More than just knowing what we believe, we want for you
                to experience the power of God and the love of His people in
                uncommon community.
              </p>

              <div className="mt-6">
                <Button href="/about" variant="primary" className="text-xs">
                  About Us
                </Button>
              </div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative order-first md:order-last md:w-1/2"
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="https://vertical-church.t3.storage.dev/who-is-vertical.png"
                  alt="Community at Vertical Church"
                  width={600}
                  height={500}
                  className="h-auto w-full object-cover"
                />
                {/* Coin logo overlay */}
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
                  <VerticalCoinSolidLogo
                    className="h-12 w-12 md:h-16 md:w-16"
                    color="#D4D4D0"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
