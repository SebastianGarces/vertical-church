"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ReactNode, Children, isValidElement } from "react";
import { Button } from "./Button";

// Animation variants for staggered text reveal
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const lineVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as const, // cubic-bezier for smooth deceleration
    },
  },
};

// Bold image animation variants
const mainImageVariants = {
  hidden: { 
    clipPath: "inset(100% 0% 0% 0%)",
    scale: 1.2,
  },
  visible: { 
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: {
      clipPath: {
        duration: 1,
        ease: [0.77, 0, 0.175, 1] as const, // dramatic ease-in-out
      },
      scale: {
        duration: 1.2,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  },
};

const secondaryImageVariants = {
  hidden: { 
    clipPath: "inset(0% 100% 0% 0%)",
    scale: 1.15,
  },
  visible: (i: number) => ({ 
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: {
      clipPath: {
        duration: 0.9,
        delay: 0.2 + i * 0.15,
        ease: [0.77, 0, 0.175, 1] as const,
      },
      scale: {
        duration: 1.1,
        delay: 0.2 + i * 0.15,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  }),
};

const mobileMainImageVariants = {
  hidden: { 
    clipPath: "inset(100% 0% 0% 0%)",
    scale: 1.15,
  },
  visible: { 
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: {
      clipPath: {
        duration: 0.9,
        ease: [0.77, 0, 0.175, 1] as const,
      },
      scale: {
        duration: 1.1,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  },
};

const mobileSecondaryImageVariants = {
  hidden: { 
    clipPath: "inset(50% 0% 50% 0%)",
    scale: 1.1,
  },
  visible: (i: number) => ({ 
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: {
      clipPath: {
        duration: 0.8,
        delay: 0.3 + i * 0.12,
        ease: [0.77, 0, 0.175, 1] as const,
      },
      scale: {
        duration: 1,
        delay: 0.3 + i * 0.12,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  }),
};

// CTA button animation variants - reveal style like hero title
const ctaContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.8,
    },
  },
};

const ctaButtonVariants = {
  hidden: { y: "100%" },
  visible: { 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },
};

const mobileCTAContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5,
    },
  },
};

// Component to animate each line of text
function AnimatedLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className || ""}`}>
      <motion.span className="block" variants={lineVariants}>
        {children}
      </motion.span>
    </span>
  );
}

// Splits title content into animated lines
function AnimatedTitle({ children, className }: { children: ReactNode; className?: string }) {
  const lines: ReactNode[] = [];
  let currentLine: ReactNode[] = [];

  const processChildren = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (child === null || child === undefined) return;
      
      if (isValidElement(child) && child.type === "br") {
        if (currentLine.length > 0) {
          lines.push(currentLine.length === 1 ? currentLine[0] : currentLine);
          currentLine = [];
        }
      } else if (isValidElement(child) && child.type === "span") {
        // Handle span with nested content (like the florence-colored text)
        const spanProps = child.props as { children?: ReactNode; className?: string };
        const spanChildren = spanProps.children;
        const spanClassName = spanProps.className;
        const nestedLines: ReactNode[] = [];
        let nestedCurrent: ReactNode[] = [];
        
        Children.forEach(spanChildren, (nestedChild) => {
          if (isValidElement(nestedChild) && nestedChild.type === "br") {
            if (nestedCurrent.length > 0) {
              nestedLines.push(
                <span key={nestedLines.length} className={spanClassName}>
                  {nestedCurrent.length === 1 ? nestedCurrent[0] : nestedCurrent}
                </span>
              );
              nestedCurrent = [];
            }
          } else {
            nestedCurrent.push(nestedChild);
          }
        });
        
        if (nestedCurrent.length > 0) {
          nestedLines.push(
            <span key={nestedLines.length} className={spanClassName}>
              {nestedCurrent.length === 1 ? nestedCurrent[0] : nestedCurrent}
            </span>
          );
        }
        
        // Add nested lines to main lines
        if (currentLine.length > 0) {
          lines.push(currentLine.length === 1 ? currentLine[0] : currentLine);
          currentLine = [];
        }
        nestedLines.forEach((line) => lines.push(line));
      } else {
        currentLine.push(child);
      }
    });
  };

  processChildren(children);
  
  if (currentLine.length > 0) {
    lines.push(currentLine.length === 1 ? currentLine[0] : currentLine);
  }

  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, index) => (
        <AnimatedLine key={index}>{line}</AnimatedLine>
      ))}
    </motion.h1>
  );
}

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
  /** Show CTA buttons (Plan A Visit, Next Steps) */
  showCTAs?: boolean;
}

export function Hero({ mainImage, secondaryImages, title, badge, titleBottomOffset, mobileTitleBottomOffset, showCTAs }: HeroProps) {
  return (
    <section className="relative bg-navy pt-14 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 py-2 md:px-8 md:py-16 lg:py-20">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="relative pb-32 lg:pb-40">
            {/* Image Collage */}
            <div className="flex gap-3">
              {/* Large left image - height matches two right images + gap */}
              <div className="relative w-[45%] flex-shrink-0">
                <div className="relative h-full overflow-hidden rounded-[20px]">
                  <motion.div
                    variants={mainImageVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative h-full w-full"
                  >
                    <Image
                      src={mainImage.src}
                      alt={mainImage.alt}
                      fill
                      className="object-cover"
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  </motion.div>
                  {/* Gradient overlay for text legibility */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
                </div>
              </div>

              {/* Right column - two images stacked */}
              <div className="flex flex-1 flex-col gap-3">
                {secondaryImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[16/9] overflow-hidden rounded-[20px]"
                  >
                    <motion.div
                      variants={secondaryImageVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 55vw"
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Overlay - positioned to straddle bottom of images */}
            <div className={`absolute left-8 lg:left-12 ${titleBottomOffset || "bottom-0"}`}>
              <AnimatedTitle className="font-heading text-5xl font-bold uppercase leading-[1.1] tracking-tight text-pipper lg:text-6xl xl:text-7xl">
                {title}
              </AnimatedTitle>
            </div>

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

            {/* CTA Buttons */}
            {showCTAs && (
              <motion.div
                variants={ctaContainerVariants}
                initial="hidden"
                animate="visible"
                className="absolute right-0 bottom-0 flex items-center gap-3"
              >
                <div className="overflow-hidden">
                  <motion.div variants={ctaButtonVariants}>
                    <Button href="/visit" variant="primary">
                      Plan A Visit
                    </Button>
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div variants={ctaButtonVariants}>
                    <Button href="/get-involved" variant="outline">
                      Next Steps
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Main image with title overlay */}
          <div className="relative mb-24">
            <div className="relative overflow-hidden rounded-[20px]">
              <motion.div
                variants={mobileMainImageVariants}
                initial="hidden"
                animate="visible"
              >
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt}
                  width={800}
                  height={1000}
                  className="h-auto w-full"
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                />
              </motion.div>
              {/* Gradient overlay for text legibility */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
            </div>

            {/* Text Overlay - positioned at bottom of main image, extending below */}
            <div className={`absolute left-2 ${mobileTitleBottomOffset || "-bottom-20"}`}>
              <AnimatedTitle className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight text-pipper">
                {title}
              </AnimatedTitle>
            </div>
          </div>

          {/* CTA Buttons - Mobile - below title */}
          {showCTAs && (
            <motion.div
              variants={mobileCTAContainerVariants}
              initial="hidden"
              animate="visible"
              className="mb-6 flex flex-col gap-3"
            >
              <div className="overflow-hidden">
                <motion.div variants={ctaButtonVariants}>
                  <Button href="/visit" variant="primary" className="w-full">
                    Plan A Visit
                  </Button>
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div variants={ctaButtonVariants}>
                  <Button href="/get-involved" variant="outline" className="w-full">
                    Next Steps
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Secondary images - full width, stacked */}
          <div className="flex flex-col gap-3">
            {secondaryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-[20px]">
                <motion.div
                  variants={mobileSecondaryImageVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={450}
                    className="h-auto w-full"
                    loading="lazy"
                    sizes="100vw"
                  />
                </motion.div>
              </div>
            ))}
          </div>

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
