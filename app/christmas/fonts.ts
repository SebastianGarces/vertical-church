import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";

// Christmas-only typefaces, imported by the /christmas page and the sitewide banner,
// so other routes never download them.
//
// Display serif ("Christmas", "Christmas Eve", "Lear Nagle Rd", banner): Times New Roman
// as a system stack (.font-christmas-display in christmas.css and the banner). No file
// is shipped for it. "4PM" / "5400" use Overpass from the root layout (font-heading).

/**
 * Script lines ("Join us for", "At Vertical Church"): Jimmy Script, self-hosted.
 *
 * LICENSE NOT CONFIRMED: the free version's readme points to a paid commercial
 * license. Everything reads this one variable (--font-christmas-script), so swapping
 * the face is a one-line change here (e.g. to a Google script via next/font/google).
 * The woff2 is a Latin subset converted from JimmyScript-Rg.otf.
 */
export const christmasScript = localFont({
  src: "./fonts/JimmyScript-Rg.woff2",
  variable: "--font-christmas-script",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["cursive"],
});

/** Condensed serif from the printed card's back ("You Are Invited!"). */
export const christmasSerif = Instrument_Serif({
  variable: "--font-christmas-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});
