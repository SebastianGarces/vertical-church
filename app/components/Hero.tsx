"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface HeroImage {
  src: string;
  alt: string;
}

interface HeroBadge {
  label: string;
  value: string;
}

interface HeroProps {
  /** Main large image (left side on desktop, top on mobile) */
  mainImage: HeroImage;
  /** Secondary images (right side stacked on desktop, below on mobile) */
  secondaryImages: HeroImage[];
  /** Title content - can include JSX for styling */
  title: ReactNode;
  /** Optional badge displayed at bottom right */
  badge?: HeroBadge;
  /** Optional bottom offset for title positioning on desktop (e.g., "bottom-8") */
  titleBottomOffset?: string;
  /** Optional bottom offset for title positioning on mobile (e.g., "-bottom-16") */
  mobileTitleBottomOffset?: string;
}

export function Hero({ mainImage, secondaryImages, title, badge, titleBottomOffset, mobileTitleBottomOffset }: HeroProps) {
  return (
    <section className="relative bg-navy pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-16 lg:py-20">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="relative pb-32 lg:pb-40">
            {/* Image Collage */}
            <div className="flex gap-3">
              {/* Large left image - height matches two right images + gap */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-[45%] flex-shrink-0"
              >
                <div className="relative h-full overflow-hidden rounded-[20px]">
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay for text legibility */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
                </div>
              </motion.div>

              {/* Right column - two images stacked */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-1 flex-col gap-3"
              >
                {secondaryImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[16/9] overflow-hidden rounded-[20px]"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Text Overlay - positioned to straddle bottom of images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`absolute left-8 lg:left-12 ${titleBottomOffset || "bottom-0"}`}
            >
              <h1 className="font-heading text-5xl font-bold uppercase leading-[1.1] tracking-tight text-pipper lg:text-6xl xl:text-7xl">
                {title}
              </h1>
            </motion.div>

            {/* Optional Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="absolute right-0 bottom-0 flex flex-col items-center border-2 border-pipper/30 bg-navy/80 px-8 py-5 text-center backdrop-blur-sm lg:px-10 lg:py-6"
              >
                <span className="font-heading text-sm uppercase tracking-[0.15em] text-pipper/60 lg:text-base">
                  {badge.label}
                </span>
                <span className="mt-1 font-heading text-base uppercase tracking-[0.1em] text-pipper lg:text-lg">
                  {badge.value}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Main image with title overlay */}
          <div className="relative mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[20px]"
            >
              <Image
                src={mainImage.src}
                alt={mainImage.alt}
                width={800}
                height={1000}
                className="h-auto w-full"
                priority
              />
              {/* Gradient overlay for text legibility */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
            </motion.div>

            {/* Text Overlay - positioned at bottom of main image, extending below */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`absolute left-2 ${mobileTitleBottomOffset || "-bottom-20"}`}
            >
              <h1 className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight text-pipper">
                {title}
              </h1>
            </motion.div>
          </div>

          {/* Secondary images - full width, stacked */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            {secondaryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-[20px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={450}
                  className="h-auto w-full"
                  priority
                />
              </div>
            ))}
          </motion.div>

          {/* Optional Badge - Mobile */}
          {badge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-6 flex w-full flex-col items-center border-2 border-pipper/30 px-6 py-4 text-center"
            >
              <span className="font-heading text-sm uppercase tracking-[0.15em] text-pipper/60">
                {badge.label}
              </span>
              <span className="mt-1 font-heading text-base uppercase tracking-[0.1em] text-pipper">
                {badge.value}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
