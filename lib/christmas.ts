/**
 * Christmas 2026 campaign switches and shared details.
 *
 * To retire the sitewide banner after Christmas, set CHRISTMAS_BANNER_ENABLED to false.
 * The /christmas page itself stays up until it is removed or redirected.
 */
export const CHRISTMAS_BANNER_ENABLED = true;

export const CHRISTMAS_PATH = "/christmas";

export const CHRISTMAS_GATHERING = {
  day: "Christmas Eve",
  date: "Thursday, December 24",
  time: "4 PM",
  street: "5400 Lear Nagle Rd",
  cityStateZip: "North Ridgeville, OH 44039",
  /** ISO start time (Eastern) for structured data. */
  startDate: "2026-12-24T16:00:00-05:00",
} as const;

/** The regular Sunday service after Christmas. Not Christmas-themed; shown as a secondary note. */
export const SUNDAY_AFTER_CHRISTMAS = {
  date: "Sunday, December 27",
  time: "10am",
} as const;

export const CHURCH_PHONE = { display: "(440) 420-7335", href: "tel:4404207335" } as const;

export const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=5400+Lear+Nagle+Rd+North+Ridgeville+OH+44039";

export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=5400+Lear+Nagle+Rd,+North+Ridgeville,+OH+44039&output=embed";
