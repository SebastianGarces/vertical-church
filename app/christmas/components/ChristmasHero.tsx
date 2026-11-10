import type { CSSProperties } from "react";
import { Doodle } from "./Doodle";
import { PhotoSlot } from "./PhotoSlot";
import { PlanVisitButton } from "./PlanVisitDialog";

// Entrance animation reuses the homepage hero's CSS classes (app/globals.css: hero-*),
// so it starts on first paint and is switched off under prefers-reduced-motion.
function delay(seconds: number): CSSProperties {
  return { animationDelay: `${seconds}s` };
}

/**
 * Top of /christmas, after the mockup: candle photo card, "Join us for" / Christmas /
 * "At Vertical Church", the time and address, and the first PLAN YOUR VISIT button.
 *
 * Sizes are in container query units (cqi) so the overlapping type keeps the mockup's
 * proportions from a 320px phone up to the 56rem desktop block.
 */
export function ChristmasHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-14 md:pt-28 md:pb-24">
      {/* Doodles sit in the side margins, clear of the type. */}
      <Doodle name="star" idle="twinkle" className="absolute top-24 right-[4%] hidden w-16 xl:block 2xl:right-[10%] 2xl:w-20" />
      <Doodle name="snowflake" idle="twinkle" phase={0.8} className="absolute top-[55%] left-[3%] hidden w-14 xl:block 2xl:left-[9%] 2xl:w-16" />
      <Doodle name="star" idle="twinkle" className="absolute top-[52%] right-[9%] w-10 md:hidden" phase={0.4} />
      <Doodle name="holly" className="absolute bottom-10 right-[6%] hidden w-16 xl:block 2xl:right-[12%]" phase={0.4} />

      <div className="@container relative mx-auto w-full max-w-[56rem] px-4 md:px-8">
        <div className="relative">
          {/* Candle photo card */}
          <div className="relative w-[52%] overflow-hidden rounded-[1.25rem] md:w-[44%] md:rounded-[1.75rem]">
            <div className="hero-reveal-main aspect-[2/3]">
              <PhotoSlot slot="hero-candle" className="h-full w-full" candle />
            </div>
          </div>

          {/* Headline over the card */}
          <h1 className="absolute inset-x-0 top-[7%] text-pipper md:top-[6%]">
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
            <span
              className="hero-fade-in font-christmas-script block pt-[2cqi] pl-[53%] text-[7.6cqi] leading-none whitespace-nowrap md:pl-[48%] md:text-[8cqi]"
              style={delay(0.75)}
            >
              At Vertical Church
            </span>
          </h1>
        </div>

        {/* Time, address and CTA. Under the card on phones; beside it from md up. */}
        <div className="mt-8 md:absolute md:right-8 md:bottom-0 md:left-[calc(2rem_+_48%)] md:mt-0">
          <div className="grid grid-cols-2 gap-4 md:gap-[3cqi]">
            {[
              { big: "4PM", small: "Christmas Eve", d: 0.85 },
              { big: "5400", small: "Lear Nagle Rd", d: 0.95 },
            ].map((item) => (
              <div key={item.big} className="overflow-hidden">
                <p className="hero-slide-up flex flex-col text-pipper" style={delay(item.d)}>
                  <span className="font-heading text-[2.75rem] font-bold leading-none tracking-[-0.04em] md:text-[6.4cqi]">
                    {item.big}
                  </span>{" "}
                  <span className="font-christmas-display text-[1.375rem] font-bold leading-tight tracking-[-0.04em] md:text-[3.6cqi]">
                    {item.small}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-hidden p-1 md:mt-[3cqi]">
            <div className="hero-slide-up" style={delay(1.05)}>
              <PlanVisitButton className="w-full py-3.5 md:py-2.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
