import { db } from "./index";
import { series, sermons } from "./schema";
import { eq, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export type SeriesInput = {
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  backgroundUrl?: string | null;
};

export type SermonInput = {
  title: string;
  slug: string;
  sermonDate: string;
  videoUrl: string;
  seriesId?: string | null;
  book?: string | null;
  pastor?: string | null;
};

// Series CRUD
export async function createSeries(data: SeriesInput) {
  const [newSeries] = await db
    .insert(series)
    .values({
      id: randomUUID(),
      ...data,
    })
    .returning();
  return newSeries;
}

export async function updateSeries(id: string, data: Partial<SeriesInput>) {
  const [updated] = await db
    .update(series)
    .set(data)
    .where(eq(series.id, id))
    .returning();
  return updated;
}

export async function deleteSeries(id: string) {
  // First, unlink any sermons from this series
  await db
    .update(sermons)
    .set({ seriesId: null })
    .where(eq(sermons.seriesId, id));

  // Then delete the series
  await db.delete(series).where(eq(series.id, id));
}

export async function getSeriesById(id: string) {
  const [result] = await db.select().from(series).where(eq(series.id, id));
  return result || null;
}

export async function getAllSeries() {
  const results = await db
    .select()
    .from(series)
    .orderBy(desc(series.createdAt));

  // Put standalone-messages first, then rest by date
  return results.sort((a, b) => {
    if (a.slug === "standalone-messages") return -1;
    if (b.slug === "standalone-messages") return 1;
    return 0; // Keep original date order for the rest
  });
}

// Sermons CRUD
export async function createSermon(data: SermonInput) {
  const [newSermon] = await db
    .insert(sermons)
    .values({
      id: randomUUID(),
      ...data,
    })
    .returning();
  return newSermon;
}

export async function updateSermon(id: string, data: Partial<SermonInput>) {
  const [updated] = await db
    .update(sermons)
    .set(data)
    .where(eq(sermons.id, id))
    .returning();
  return updated;
}

export async function deleteSermon(id: string) {
  await db.delete(sermons).where(eq(sermons.id, id));
}

export async function getSermonById(id: string) {
  const [result] = await db.select().from(sermons).where(eq(sermons.id, id));
  return result || null;
}

export async function getAllSermons() {
  const results = await db
    .select({
      sermon: sermons,
      series: series,
    })
    .from(sermons)
    .leftJoin(series, eq(sermons.seriesId, series.id))
    .orderBy(desc(sermons.sermonDate));

  return results.map((row) => ({
    ...row.sermon,
    series: row.series,
  }));
}
