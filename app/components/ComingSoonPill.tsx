interface ComingSoonPillProps {
  /** light: cream pill with navy text. dark: navy pill with cream text. */
  variant: "light" | "dark";
  /** sm: 11px text. md: 12px text (larger ministry cards). */
  size?: "sm" | "md";
  /** Pin the pill to the top-left corner of the nearest positioned ancestor (over a card image). */
  overlay?: boolean;
}

const VARIANT_CLASSES = {
  light: "bg-cream text-navy",
  dark: "bg-navy text-cream",
} as const;

const SIZE_CLASSES = {
  sm: "text-[11px]",
  md: "text-xs",
} as const;

/**
 * "Coming soon" badge. The one place that defines the pill, so the home ministry card,
 * /get-involved ministries, the serve list and the Want to Serve modal can't drift apart.
 *
 * Vertical centering: the pill is 24px tall with 2px of top padding (Overpass caps sit
 * high in their line box), and the line box is exactly 22px, so it fills the content box.
 * Don't swap this for a shorter line-height plus flex centering: that puts the line box
 * at a half-pixel offset, and Chrome snaps the box and the text to whole pixels
 * separately. Wherever the pill lands on a fractional y (like the home cards), the text
 * then renders 1px high.
 *
 * Every text property is set here so the pill doesn't pick up font, line-height,
 * letter-spacing or case from wherever it's placed.
 */
export function ComingSoonPill({ variant, size = "sm", overlay = false }: ComingSoonPillProps) {
  return (
    <span
      className={[
        "inline-flex h-6 shrink-0 items-center justify-center whitespace-nowrap rounded-full pt-0.5",
        "font-heading font-bold not-italic uppercase leading-[22px] tracking-[0.1em]",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        overlay ? "absolute left-3 top-3 px-3 shadow-sm" : "px-2.5",
      ].join(" ")}
    >
      Coming soon
    </span>
  );
}
