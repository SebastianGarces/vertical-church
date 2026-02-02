"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createSeries,
  updateSeries,
  deleteSeries,
  createSermon,
  updateSermon,
  deleteSermon,
} from "@/lib/db/admin-queries";
import { S3 } from "@/lib/s3";

// Helper to check auth
async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return session;
}

// Helper to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// UUID validation
const uuidSchema = z.string().uuid("Invalid ID format");

// Series Schemas
const seriesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  backgroundUrl: z.string().url().nullable().optional(),
});

// Sermon Schemas
const sermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  sermonDate: z.string().min(1, "Date is required"),
  videoUrl: z.string().url("Valid video URL is required"),
  seriesId: z.string().nullable().optional(),
  book: z.string().nullable().optional(),
  pastor: z.string().nullable().optional(),
});

// Series Actions
export async function createSeriesAction(formData: FormData) {
  await requireAuth();

  const data = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    thumbnailUrl: (formData.get("thumbnailUrl") as string) || null,
    backgroundUrl: (formData.get("backgroundUrl") as string) || null,
  };

  const validated = seriesSchema.parse(data);
  const slug = validated.slug || createSlug(validated.title);

  await createSeries({
    ...validated,
    slug,
  });

  revalidatePath("/dashboard/series");
  redirect("/dashboard/series");
}

export async function updateSeriesAction(id: string, formData: FormData) {
  await requireAuth();
  const validatedId = uuidSchema.parse(id);

  const data = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    thumbnailUrl: (formData.get("thumbnailUrl") as string) || null,
    backgroundUrl: (formData.get("backgroundUrl") as string) || null,
  };

  const validated = seriesSchema.parse(data);
  const slug = validated.slug || createSlug(validated.title);

  await updateSeries(validatedId, {
    ...validated,
    slug,
  });

  revalidatePath("/dashboard/series");
  revalidatePath(`/dashboard/series/${validatedId}`);
  redirect("/dashboard/series");
}

export async function deleteSeriesAction(id: string) {
  await requireAuth();
  const validatedId = uuidSchema.parse(id);

  await deleteSeries(validatedId);

  revalidatePath("/dashboard/series");
  redirect("/dashboard/series");
}

// Sermon Actions
export async function createSermonAction(formData: FormData) {
  await requireAuth();

  const rawSeriesId = formData.get("seriesId") as string;
  const seriesId = rawSeriesId === "none" || !rawSeriesId ? null : rawSeriesId;

  const data = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    sermonDate: formData.get("sermonDate") as string,
    videoUrl: formData.get("videoUrl") as string,
    seriesId,
    book: (formData.get("book") as string) || null,
    pastor: (formData.get("pastor") as string) || null,
  };

  const validated = sermonSchema.parse(data);
  const slug = validated.slug || createSlug(validated.title);

  await createSermon({
    ...validated,
    slug,
    seriesId: validated.seriesId || null,
  });

  revalidatePath("/dashboard/sermons");
  redirect("/dashboard/sermons");
}

export async function updateSermonAction(id: string, formData: FormData) {
  await requireAuth();
  const validatedId = uuidSchema.parse(id);

  const rawSeriesId = formData.get("seriesId") as string;
  const seriesId = rawSeriesId === "none" || !rawSeriesId ? null : rawSeriesId;

  const data = {
    title: formData.get("title") as string,
    slug: (formData.get("slug") as string) || undefined,
    sermonDate: formData.get("sermonDate") as string,
    videoUrl: formData.get("videoUrl") as string,
    seriesId,
    book: (formData.get("book") as string) || null,
    pastor: (formData.get("pastor") as string) || null,
  };

  const validated = sermonSchema.parse(data);
  const slug = validated.slug || createSlug(validated.title);

  await updateSermon(validatedId, {
    ...validated,
    slug,
    seriesId: validated.seriesId || null,
  });

  revalidatePath("/dashboard/sermons");
  revalidatePath(`/dashboard/sermons/${validatedId}`);
  redirect("/dashboard/sermons");
}

export async function deleteSermonAction(id: string) {
  await requireAuth();
  const validatedId = uuidSchema.parse(id);

  await deleteSermon(validatedId);

  revalidatePath("/dashboard/sermons");
  redirect("/dashboard/sermons");
}

// Image Upload
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImageAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  await requireAuth();

  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;
  const type = formData.get("type") as "thumbnail" | "background" | null;

  if (!file || !slug || !type) {
    return { error: "Missing required fields" };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, WebP" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "File too large. Maximum size is 5MB" };
  }

  if (!["thumbnail", "background"].includes(type)) {
    return { error: "Invalid image type" };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await S3.uploadImage(slug, type, buffer, file.type);
    return { url };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }
}
