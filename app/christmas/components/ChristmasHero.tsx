import type { CSSProperties } from "react";
import Image from "next/image";
import { PlanVisitButton } from "./PlanVisitDialog";

// Entrance animation reuses the homepage hero's CSS classes (app/globals.css: hero-*),
// so it starts on first paint and is switched off under prefers-reduced-motion.
function delay(seconds: number): CSSProperties {
  return { animationDelay: `${seconds}s` };
}

const DETAILS = [
  { big: "4PM", small: "Christmas Eve", d: 0.85 },
  { big: "5400", small: "Lear Nagle Rd", d: 0.95 },
];

/**
 * Top of /christmas, after the mockup: candle photo card, "Join us for" / Christmas /
 * "At Vertical Church", the time and address, and the first PLAN YOUR VISIT button.
 *
 * Sizes are in container query units (cqi) so the overlapping type keeps the mockup's
 * proportions from a 320px phone up to the 56rem desktop block.
 *
 * Desktop alignment: "At Vertical Church", the details row and the button live in one
 * inline-grid column. The script line is the only child that sizes the column; the
 * details row and the button are `w-0 min-w-full`, so they add nothing to the column's
 * intrinsic width and then stretch to exactly that width. "4PM" starts on the script
 * line's left edge, "5400 / Lear Nagle Rd" ends on its right edge (justify-between),
 * and the button spans the same width, at every md+ viewport.
 *
 * Phones: "At Vertical Church" stays directly under "Christmas" (its own aria-hidden
 * copy inside the h1 overlay), and the details row and button move below the card at
 * the full content width: 4PM on the left edge, Lear Nagle Rd on the right edge.
 */
export function ChristmasHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-14 md:pt-28 md:pb-24">
      <div className="@container relative mx-auto w-full max-w-[56rem] px-4 md:px-8">
        <div className="relative">
          {/* Candle photo card */}
          <div className="relative w-[52%] overflow-hidden rounded-[1.25rem] md:w-[44%] md:rounded-[1.75rem]">
            <div className="hero-reveal-main relative aspect-[2/3]">
              <Image
                src="https://vertical-church.t3.storage.dev/vertical-candles.jpg"
                alt="Lit candles on a wooden table, ringed with pine and red berries"
                fill
                priority
                fetchPriority="high"
                className="object-cover"
                sizes="(max-width: 768px) 52vw, 400px"
              />
            </div>
          </div>

          {/* Headline over the card. "At Vertical Church" is drawn in the column below
              (so it can set that column's width); the h1 carries it for screen readers. */}
          <h1 className="absolute inset-x-0 top-[7cqi] text-pipper md:top-[4cqi]">
            <span
              className="hero-fade-in font-christmas-script block pl-[5%] text-[9.5cqi] leading-none md:text-[7.5cqi]"
              style={delay(0.35)}
            >
              Join us for
            </span>
            <span className="block overflow-hidden pt-[0.06em] -mt-[0.06em]">
              <span
                className="hero-headline-line font-christmas-display block pl-[3%] text-[23cqi] font-bold leading-[0.82] tracking-[-0.06em] text-florence"
                style={{ "--hero-line": 2 } as CSSProperties}
              >
                Christmas
              </span>
            </span>
            <span className="sr-only"> At Vertical Church</span>
            {/* Phones: the script line sits directly under "Christmas", beside the card. */}
            <span
              aria-hidden="true"
              className="hero-fade-in font-christmas-script block pt-[2.5cqi] pl-[54%] text-[7.9cqi] leading-none whitespace-nowrap md:hidden"
              style={delay(0.75)}
            >
              At Vertical Church
            </span>
          </h1>

          {/* Details + CTA.
              Phones: below the photo card, spanning the full content width (grid = 100%).
              md+: beside the card, starting just under "Christmas"
              (h1 top 4cqi + "Join us for" 7.5cqi + "Christmas" 23cqi x 0.82 + 2cqi gap),
              in a column sized by the "At Vertical Church" line. */}
          <div className="mt-[6cqi] md:absolute md:top-[32.4cqi] md:left-[48%] md:mt-0">
            <div className="grid md:inline-grid">
              <p
                aria-hidden="true"
                className="hero-fade-in font-christmas-script hidden text-[8cqi] leading-none whitespace-nowrap text-pipper md:block"
                style={delay(0.75)}
              >
                At Vertical Church
              </p>

              <div className="flex w-0 min-w-full justify-between md:mt-[3.5cqi]">
                {DETAILS.map((item) => (
                  <div key={item.big} className="overflow-hidden">
                    <p className="hero-slide-up flex flex-col text-pipper" style={delay(item.d)}>
                      <span className="font-heading text-[12cqi] font-bold leading-none tracking-[-0.04em] md:text-[6.2cqi]">
                        {item.big}
                      </span>{" "}
                      <span className="font-christmas-display text-[6.6cqi] font-bold leading-tight tracking-[-0.04em] whitespace-nowrap md:text-[3.4cqi]">
                        {item.small}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-[6cqi] w-0 min-w-full md:mt-[3cqi]">
                <div className="hero-fade-in" style={delay(1.05)}>
                  <PlanVisitButton className="w-full py-3.5 md:py-2.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
