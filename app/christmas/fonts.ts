import localFont from "next/font/local";

// The hero is the only place with special type. Everything else on /christmas uses the
// site's font-heading / font-body / font-button classes, like other pages.
//
// Display serif ("Christmas", "Christmas Eve", "Lear Nagle Rd"; the banner too): Times New Roman
// as a system stack (.font-christmas-display in christmas.css and the banner). No file
// is shipped for it. "4PM" / "5400" use Overpass from the root layout (font-heading).

/**
 * Script lines ("Join us for", "At Vertical Church"): Jimmy Script, self-hosted.
 *
 * LICENSE NOT CONFIRMED: the free version's readme points to a paid commercial
 * license. Everything reads this one variable (--font-christmas-script), so swapping
 * the face is a one-line change here (e.g. to a Google script via next/font/google).
 * The woff2 is a Latin subset converted from JimmyScript-Rg.otf. It is the only
 * script face; there is no Google script font anywhere on the page.
 */
export const christmasScript = localFont({
  src: "./fonts/JimmyScript-Rg.woff2",
  variable: "--font-christmas-script",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["cursive"],
});

