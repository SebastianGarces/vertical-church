/**
 * Placeholder for a photo that hasn't been supplied yet. The printed card's photos are
 * too low-res to crop, so each slot is a warm candle-glow panel until the originals
 * arrive. To swap one in, replace <PhotoSlot slot="..."/> with a next/image <Image>.
 *
 * Slots (also listed in the PR):
 *   invite-advent     invitation grid, top (card back: Advent candle lighting on stage)
 *   invite-story      invitation grid, bottom left (card back: kids' Christmas story)
 *   invite-candle     invitation grid, bottom right (card back: candlelight close-up)
 */
export function PhotoSlot({
  slot,
  className = "",
}: {
  slot: string;
  className?: string;
}) {
  return (
    <div
      data-photo-slot={slot}
      aria-hidden="true"
      className={`christmas-photo-placeholder relative ${className}`}
    />
  );
}
