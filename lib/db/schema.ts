import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// Re-export auth tables
export * from "./auth-schema";

// Series table
export const series = pgTable(
  "series",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    thumbnailUrl: text("thumbnail_url"),
    backgroundUrl: text("background_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

// Sermons table
export const sermons = pgTable(
  "sermons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    sermonDate: date("sermon_date").notNull(),
    videoUrl: text("video_url").notNull(),
    seriesId: uuid("series_id").references(() => series.id),
    book: text("book"),
    pastor: text("pastor"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_sermons_series_id").on(table.seriesId),
    index("idx_sermons_book").on(table.book),
    index("idx_sermons_pastor").on(table.pastor),
    index("idx_sermons_date").on(table.sermonDate),
    index("idx_sermons_pagination").on(table.sermonDate, table.id),
  ]
);
