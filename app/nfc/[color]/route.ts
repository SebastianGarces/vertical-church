import { after } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { nfcLinks, nfcOpens } from "@/lib/db/schema";
import { nfcColorSchema, nfcDestinationSchema } from "@/lib/nfc";

const responseHeaders = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

async function handle(request: Request, context: { params: Promise<{ color: string }> }, track: boolean) {
  const color = nfcColorSchema.safeParse((await context.params).color);
  if (!color.success) return new Response("Link not found.", { status: 404, headers: responseHeaders });
  try {
    const [link] = await db.select().from(nfcLinks).where(eq(nfcLinks.color, color.data));
    const destination = nfcDestinationSchema.safeParse(link?.destination);
    if (!link?.enabled || !destination.success) {
      return new Response("This link is not active yet. Please ask a member of the church team for help.", { status: 200, headers: responseHeaders });
    }
    if (track) {
      const openedAt = new Date();
      after(async () => {
        try {
          await db.insert(nfcOpens).values({ color: color.data, destination: destination.data, label: link.label, openedAt });
        } catch {
          console.error("Failed to record NFC link open");
        }
      });
    }
    return new Response(null, { status: 302, headers: { ...responseHeaders, Location: destination.data } });
  } catch {
    return new Response("This link is temporarily unavailable. Please try again shortly.", { status: 503, headers: responseHeaders });
  }
}

export function GET(request: Request, context: { params: Promise<{ color: string }> }) {
  return handle(request, context, true);
}
export function HEAD(request: Request, context: { params: Promise<{ color: string }> }) {
  return handle(request, context, false);
}
