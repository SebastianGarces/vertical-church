"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface VideoHeroProps {
  /** Vimeo video ID */
  vimeoVideoId: string;
  /** Vimeo hash for private/unlisted videos */
  vimeoHash?: string;
  /** Title content - can include JSX for styling */
  title?: ReactNode;
}

export function VideoHero({ vimeoVideoId, vimeoHash, title }: VideoHeroProps) {
  // Build Vimeo embed URL with parameters
  const hashParam = vimeoHash ? `&h=${vimeoHash}` : "";
  const vimeoSrc = `https://player.vimeo.com/video/${vimeoVideoId}?autoplay=1&loop=1&muted=1&playsinline=1${hashParam}`;

  return (
    <section className="relative bg-navy pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-16 lg:py-20">
        {/* Title - in normal document flow above video */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight text-pipper md:text-5xl lg:text-6xl xl:text-7xl">
              {title}
            </h1>
          </motion.div>
        )}

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-[20px]"
        >
          {/* Responsive container maintaining 16:9 aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={vimeoSrc}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Video"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
