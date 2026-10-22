import { z } from "zod";

export const nfcColors = ["orange", "green", "black", "burgundy", "blue"] as const;
export const nfcColorSchema = z.enum(nfcColors);
export const nfcDestinationSchema = z.string().trim().url().max(2048).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      !(["vertical.family", "www.vertical.family", "admin.vertical.family"].includes(url.hostname) && url.pathname.startsWith("/nfc"));
  } catch {
    return false;
  }
}, "Use an HTTPS destination outside the NFC redirects.");
