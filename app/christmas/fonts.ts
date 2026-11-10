import { DM_Serif_Display, Instrument_Serif, Mr_De_Haviland } from "next/font/google";

// Christmas-only typefaces. Imported by the /christmas page and the sitewide banner,
// so other routes never download the script face.

/** Heavy display serif: the big "Christmas", the detail labels and the banner. */
export const christmasDisplay = DM_Serif_Display({
  variable: "--font-christmas-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  // The banner is on every page; keep it from competing with each page's hero image.
  preload: false,
});

/** Condensed serif from the printed card's back ("You Are Invited!"). */
export const christmasSerif = Instrument_Serif({
  variable: "--font-christmas-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

/** Script lines: "Join us for", "At Vertical Church". */
export const christmasScript = Mr_De_Haviland({
  variable: "--font-christmas-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
