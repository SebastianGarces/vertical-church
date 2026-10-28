import Image from "next/image";
import { ReactNode, Children, Fragment, isValidElement, CSSProperties } from "react";
import { Button } from "./Button";

// The entrance animation is plain CSS (hero-* classes in app/globals.css) so the
// photo, headline and CTAs start animating on first paint, not after hydration.
// Only the per-element delays live here (headline lines: see .hero-headline-line):
//   desktop CTAs     0.8s + 0.12s per button
//   mobile CTAs      0.5s + 0.1s per button
//   desktop side     0.2s + 0.15s per image
//   mobile side      0.3s + 0.12s per image
function delay(seconds: number): CSSProperties {
  return { animationDelay: `${seconds}s` };
}

// Component to animate each line of text. --hero-line drives the stagger delay.
function AnimatedLine({ children, className, index }: { children: ReactNode; className?: string; index: number }) {
  return (
    <span className={`block overflow-hidden ${className || ""}`}>
      <span className="hero-headline-line block" style={{ "--hero-line": index } as CSSProperties}>
        {children}
      </span>
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

      // Titles are usually a <>...</> fragment. Hero is a server component, so the
      // fragment arrives as one element (not as an array, as it did across the
      // client boundary), and it must be opened up to find the <br /> line breaks.
      if (isValidElement(child) && child.type === Fragment) {
        processChildren((child.props as { children?: ReactNode }).children);
      } else if (isValidElement(child) && child.type === "br") {
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
    <h1 className={className}>
      {lines.map((line, index) => (
        <AnimatedLine key={index} index={index}>{line}</AnimatedLine>
      ))}
    </h1>
  );
}

// Mobile: keep the photo, headline and both CTA buttons inside the first screen.
// 100svh is the viewport with the browser toolbars showing (in iOS 26 Safari that is
// the area above the floating bottom toolbar), so the photo gets whatever height is
// left after everything else in the mobile hero:
//   4rem     header offset (section pt-14 + py-2)
//   6rem     headline overhang + gap below the photo (mb-24)
//   7.25rem  two 52px buttons + 12px gap
//   1.5rem   breathing room above the browser toolbar
//   + env(safe-area-inset-bottom) (home indicator, if the page is ever edge-to-edge)
// It never grows past the photo's natural size and never shrinks below 15rem, so very
// short screens scroll instead of squashing the photo. object-cover crops instead of
// distorting when the cap applies.
const MOBILE_CTA_IMAGE_MAX_H =
  "object-cover max-h-[max(15rem,calc(100svh_-_18.75rem_-_env(safe-area-inset-bottom,0px)))]";

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
      <div className="mx-auto max-w-7xl px-4 py-2 md:px-8 md:py-16 lg:py-[min(5rem,7.5svh)]">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="relative pb-32 lg:pb-[min(10rem,15svh)]">
            {/* Image Collage */}
            <div className="flex gap-3">
              {/* Large left image - height matches two right images + gap */}
              <div className="relative w-[45%] flex-shrink-0">
                <div className="relative h-full overflow-hidden rounded-[20px]">
                  <div className="hero-reveal-main relative h-full w-full">
                    {/* Not priority: the mobile image below carries the preload. It uses the
                        same sizes, so on desktop both resolve to one file and download once. */}
                    <Image
                      src={mainImage.src}
                      alt={mainImage.alt}
                      fill
                      className="object-cover"
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  </div>
                  {/* Gradient overlay for text legibility */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
                </div>
              </div>

              {/* Right column - two images stacked */}
              <div className="flex flex-1 flex-col gap-3">
                {secondaryImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[16/9] overflow-hidden rounded-[20px] lg:max-h-[max(10rem,calc((100svh_-_5rem_-_min(5rem,7.5svh)_-_min(10rem,15svh)_-_1.25rem)_/_2))]"
                  >
                    <div
                      className="hero-reveal-secondary relative h-full w-full"
                      style={delay(0.2 + index * 0.15)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 55vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Overlay - positioned to straddle bottom of images */}
            <div className={`absolute left-8 lg:left-12 ${titleBottomOffset || "bottom-0"}`}>
              <AnimatedTitle className="font-heading text-5xl font-bold uppercase leading-[1.1] tracking-tight text-pipper lg:text-[length:min(3.75rem,6.7svh)] xl:text-[length:min(4.5rem,6.7svh)]">
                {title}
              </AnimatedTitle>
            </div>

            {/* Optional Badge */}
            {badge && (
              <div
                className="hero-fade-in absolute right-0 bottom-0 flex flex-col items-center border-2 border-pipper/30 bg-navy/80 px-8 py-5 text-center backdrop-blur-sm lg:px-10 lg:py-6"
                style={delay(0.5)}
              >
                <span className="font-heading text-sm uppercase tracking-[0.15em] text-pipper/60 lg:text-base">
                  {badge.label}
                </span>
                <span className="mt-1 font-heading text-base uppercase tracking-[0.1em] text-pipper lg:text-lg">
                  {badge.value}
                </span>
              </div>
            )}

            {/* CTA Buttons */}
            {showCTAs && (
              <div className="absolute right-0 bottom-0 flex items-center gap-3">
                <div className="overflow-hidden">
                  <div className="hero-slide-up" style={delay(0.8)}>
                    <Button href="/visit" variant="primary">
                      Plan A Visit
                    </Button>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div className="hero-slide-up" style={delay(0.92)}>
                    <Button href="/get-involved" variant="outline">
                      Next Steps
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Main image with title overlay */}
          <div className="relative mb-24">
            <div className="relative overflow-hidden rounded-[20px]">
              <div className="hero-reveal-main-mobile">
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt}
                  width={800}
                  height={1000}
                  className={showCTAs ? `h-auto w-full ${MOBILE_CTA_IMAGE_MAX_H}` : "h-auto w-full"}
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
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
            <div className="mb-6 flex flex-col gap-3">
              <div className="overflow-hidden">
                <div className="hero-slide-up" style={delay(0.5)}>
                  <Button href="/visit" variant="primary" className="w-full">
                    Plan A Visit
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="hero-slide-up" style={delay(0.6)}>
                  <Button href="/get-involved" variant="outline" className="w-full">
                    Next Steps
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Secondary images - full width, stacked */}
          <div className="flex flex-col gap-3">
            {secondaryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-[20px]">
                <div className="hero-reveal-secondary-mobile" style={delay(0.3 + index * 0.12)}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={450}
                    className="h-auto w-full"
                    loading="lazy"
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Optional Badge - Mobile */}
          {badge && (
            <div
              className="hero-fade-in mt-6 flex w-full flex-col items-center border-2 border-pipper/30 px-6 py-4 text-center"
              style={delay(0.4)}
            >
              <span className="font-heading text-sm uppercase tracking-[0.15em] text-pipper/60">
                {badge.label}
              </span>
              <span className="mt-1 font-heading text-base uppercase tracking-[0.1em] text-pipper">
                {badge.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
