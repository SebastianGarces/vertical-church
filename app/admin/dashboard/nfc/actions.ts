"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { nfcLinks } from "@/lib/db/schema";
import { nfcColorSchema, nfcDestinationSchema } from "@/lib/nfc";

export async function saveNfcLink(_state: { message: string; ok: boolean }, form: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, message: "Please sign in again." };
  const parsed = z.object({
    color: nfcColorSchema,
    label: z.string().trim().min(1).max(80),
    destination: z.union([nfcDestinationSchema, z.literal("")]),
    enabled: z.boolean(),
  }).safeParse({ color: form.get("color"), label: form.get("label"), destination: form.get("destination"), enabled: form.get("enabled") === "on" });
  if (!parsed.success) return { ok: false, message: "Enter a name and a valid HTTPS destination. NFC redirect loops are not allowed." };
  if (parsed.data.enabled && !parsed.data.destination) return { ok: false, message: "Add a destination before enabling this color." };
  const { color, ...values } = parsed.data;
  try {
    await db.update(nfcLinks).set({ ...values, destination: values.destination || null }).where(eq(nfcLinks.color, color));
  } catch {
    return { ok: false, message: "Could not save. Please try again." };
  }
  revalidatePath("/admin/dashboard/nfc");
  revalidatePath("/dashboard/nfc");
  return { ok: true, message: "Saved. This color now uses these settings." };
}
