import { db } from "./index";
import { series, sermons } from "./schema";
import { eq, desc, sql, and, or, ilike, lt, SQL } from "drizzle-orm";

export type Series = typeof series.$inferSelect;
export type Sermon = typeof sermons.$inferSelect;

export type SermonWithSeries = Sermon & {
  series: Series | null;
};

export interface PaginationCursor {
  date: string;
  id: string;
}

export interface GetSermonsOptions {
  search?: string;
  seriesId?: string;
  book?: string;
  pastor?: string;
  year?: number;
  cursor?: PaginationCursor;
  limit?: number;
}

export interface GetSermonsResult {
  sermons: SermonWithSeries[];
  nextCursor: PaginationCursor | null;
}

export interface FilterOptions {
  series: { id: string; title: string }[];
  books: string[];
  pastors: string[];
  years: number[];
}

/**
 * Get all series (for carousel and filter dropdown)
 * Standalone messages always appears first, then rest by date
 */
export async function getSeries(): Promise<Series[]> {
  const results = await db
    .select()
    .from(series)
    .orderBy(desc(series.createdAt));

  return results.sort((a, b) => {
    if (a.slug === "standalone-messages") return -1;
    if (b.slug === "standalone-messages") return 1;
    return 0;
  });
}

/**
 * Get sermons with filters, search, and cursor-based pagination
 */
export async function getSermons(
  options: GetSermonsOptions = {}
): Promise<GetSermonsResult> {
  const { search, seriesId, book, pastor, year, cursor, limit = 12 } = options;

  const conditions: SQL[] = [];

  // Filter by series
  if (seriesId) {
    conditions.push(eq(sermons.seriesId, seriesId));
  }

  // Filter by book
  if (book) {
    conditions.push(eq(sermons.book, book));
  }

  // Filter by pastor
  if (pastor) {
    conditions.push(eq(sermons.pastor, pastor));
  }

  // Filter by year (extract year from sermon_date)
  if (year) {
    conditions.push(
      sql`EXTRACT(YEAR FROM ${sermons.sermonDate}) = ${year}`
    );
  }

  // Search across title, pastor, and book
  if (search && search.trim()) {
    const searchTerm = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(sermons.title, searchTerm),
        ilike(sermons.pastor, searchTerm),
        ilike(sermons.book, searchTerm)
      )!
    );
  }

  // Cursor-based pagination: get records after the cursor
  if (cursor) {
    conditions.push(
      or(
        lt(sermons.sermonDate, cursor.date),
        and(
          eq(sermons.sermonDate, cursor.date),
          lt(sermons.id, cursor.id)
        )
      )!
    );
  }

  // Build and execute query
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Fetch sermons with limit + 1 to check if there are more
  const rows = await db
    .select({
      sermon: sermons,
      series: series,
    })
    .from(sermons)
    .leftJoin(series, eq(sermons.seriesId, series.id))
    .where(whereClause)
    .orderBy(desc(sermons.sermonDate), desc(sermons.id))
    .limit(limit + 1);

  // Check if there are more results
  const hasMore = rows.length > limit;
  const resultRows = hasMore ? rows.slice(0, limit) : rows;

  // Transform results
  const sermonsWithSeries: SermonWithSeries[] = resultRows.map((row) => ({
    ...row.sermon,
    series: row.series,
  }));

  // Build next cursor
  let nextCursor: PaginationCursor | null = null;
  if (hasMore && resultRows.length > 0) {
    const lastSermon = resultRows[resultRows.length - 1].sermon;
    nextCursor = {
      date: lastSermon.sermonDate,
      id: lastSermon.id,
    };
  }

  return { sermons: sermonsWithSeries, nextCursor };
}

/**
 * Get a single sermon by slug
 */
export async function getSermonBySlug(
  slug: string
): Promise<SermonWithSeries | null> {
  const rows = await db
    .select({
      sermon: sermons,
      series: series,
    })
    .from(sermons)
    .leftJoin(series, eq(sermons.seriesId, series.id))
    .where(eq(sermons.slug, slug))
    .limit(1);

  if (rows.length === 0) return null;

  return {
    ...rows[0].sermon,
    series: rows[0].series,
  };
}

/**
 * Get a series by slug with its sermons
 */
export async function getSeriesBySlug(slug: string): Promise<{
  series: Series;
  sermons: Sermon[];
} | null> {
  // Get series
  const seriesRows = await db
    .select()
    .from(series)
    .where(eq(series.slug, slug))
    .limit(1);

  if (seriesRows.length === 0) return null;

  const foundSeries = seriesRows[0];

  // Get sermons for this series
  const sermonRows = await db
    .select()
    .from(sermons)
    .where(eq(sermons.seriesId, foundSeries.id))
    .orderBy(desc(sermons.sermonDate));

  return {
    series: foundSeries,
    sermons: sermonRows,
  };
}

/**
 * Get distinct values for filter dropdowns
 */
export async function getFilterOptions(): Promise<FilterOptions> {
  // Get all series for dropdown
  const seriesRows = await db
    .select({ id: series.id, title: series.title })
    .from(series)
    .orderBy(series.title);

  // Get distinct books (non-null)
  const bookRows = await db
    .selectDistinct({ book: sermons.book })
    .from(sermons)
    .where(sql`${sermons.book} IS NOT NULL`)
    .orderBy(sermons.book);

  // Get distinct pastors (non-null)
  const pastorRows = await db
    .selectDistinct({ pastor: sermons.pastor })
    .from(sermons)
    .where(sql`${sermons.pastor} IS NOT NULL`)
    .orderBy(sermons.pastor);

  // Get distinct years
  const yearRows = await db
    .selectDistinct({
      year: sql<number>`EXTRACT(YEAR FROM ${sermons.sermonDate})::int`,
    })
    .from(sermons)
    .orderBy(sql`1 DESC`); // Order by the first column (year)

  return {
    series: seriesRows,
    books: bookRows.map((r) => r.book!).filter(Boolean),
    pastors: pastorRows.map((r) => r.pastor!).filter(Boolean),
    years: yearRows.map((r) => r.year),
  };
}

/**
 * Get the latest sermon (for hero section)
 */
export async function getLatestSermon(): Promise<SermonWithSeries | null> {
  const rows = await db
    .select({
      sermon: sermons,
      series: series,
    })
    .from(sermons)
    .leftJoin(series, eq(sermons.seriesId, series.id))
    .orderBy(desc(sermons.sermonDate))
    .limit(1);

  if (rows.length === 0) return null;

  return {
    ...rows[0].sermon,
    series: rows[0].series,
  };
}
