import { Doodle } from "./Doodle";

/**
 * Placeholder for a photo that hasn't been supplied yet. The printed card's photos are
 * too low-res to crop, so each slot is a warm candle-glow panel until the originals
 * arrive. To swap one in, replace <PhotoSlot slot="..."/> with a next/image <Image>.
 *
 * Slots (also listed in the PR):
 *   hero-candle       hero card, portrait 2:3 (mockup: candles on a table)
 *   invite-advent     invitation grid, top (card back: Advent candle lighting on stage)
 *   invite-story      invitation grid, bottom left (card back: kids' Christmas story)
 *   invite-candle     invitation grid, bottom right (card back: candlelight close-up)
 */
export function PhotoSlot({
  slot,
  className = "",
  candle = false,
}: {
  slot: string;
  className?: string;
  /** Draw a line-art candle in the panel. */
  candle?: boolean;
}) {
  return (
    <div
      data-photo-slot={slot}
      aria-hidden="true"
      className={`christmas-photo-placeholder relative ${className}`}
    >
      {candle && (
        <Doodle
          name="candle"
          idle="twinkle"
          className="absolute bottom-[8%] left-1/2 w-[38%] -translate-x-1/2 opacity-90"
        />
      )}
    </div>
  );
}
