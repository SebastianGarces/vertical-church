"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function PastorBio() {
  return (
    <section className="bg-navy py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="overflow-hidden rounded-lg bg-salte/20 md:flex">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] md:aspect-auto md:w-1/2"
          >
            <Image
              src="https://vertical-church.t3.storage.dev/nass-family.png"
              alt="Pastor Bryan and Sara Nass"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-center p-6 md:w-1/2 md:p-10"
          >
            <span className="font-heading text-sm uppercase tracking-[0.15em] text-florence">
              About Pastor Bryan & Sara Nass
            </span>

            <div className="mt-4 space-y-4 font-body text-sm leading-relaxed text-pipper/70 md:text-base">
              <p>
                Pastor Bryan was born and raised in Lorain County. After high
                school, he began pursuing a degree in Business management but a
                while volunteering at his stepfather&apos;s church, God called
                Bryan to go into full-time ministry. He let go of his corporate
                goals to pursue the call and attended Moody Bible Institute
                where he met his wife, Sara, and graduated in 2003 with a B.A.
                in Student Ministry. Since graduation from Moody, Pastor Bryan
                has served the local Church in a variety of capacities for over
                15 years as a youth pastor while Sara worked in pregnancy help
                centers and taught the Bible as a volunteer teacher.
              </p>
              <p>
                Shortly after that, God began leading Bryan and Sara to pursue
                church planting. Through a series of closed doors and&apos;t
                open doors and open ones, one of which is a member and associate
                of Dave Faulk Church Planting and Vertical Church of Columbus,
                the Nasses prepared to plant Vertical Church North in Lorain
                County. Vertical Church North launched in October. Learn more
                about us. Click{" "}
                <a href="/contact" className="text-florence hover:underline">
                  here
                </a>{" "}
                for more information and to get involved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
