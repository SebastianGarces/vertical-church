"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

interface MinistryCardProps {
  title: string;
  href: string;
  image: string;
  index?: number;
}

export function MinistryCard({ title, href, image, index = 0 }: MinistryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={href}
        className="group relative block aspect-[3/4] w-56 flex-shrink-0 overflow-hidden rounded-lg md:w-full"
      >
        {/* Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

        {/* Title */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.1em] text-pipper">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
