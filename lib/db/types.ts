// Re-export types from schema
import { series, sermons } from "./schema";

// Inferred types from schema
export type Series = typeof series.$inferSelect;
export type NewSeries = typeof series.$inferInsert;

export type Sermon = typeof sermons.$inferSelect;
export type NewSermon = typeof sermons.$inferInsert;

// Query result types
export type { SermonWithSeries, PaginationCursor, GetSermonsOptions, GetSermonsResult, FilterOptions } from "./queries";
