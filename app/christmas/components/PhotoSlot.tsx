/**
 * Warm candle-glow panel shown in place of a photo that fails to load (see InvitePhoto
 * in Invitation.tsx), so a missing upload never shows a broken image.
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
