import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

let _db: NeonHttpDatabase | null = null;

function getDb(): NeonHttpDatabase {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = neon(url);
  _db = drizzle(sql);
  return _db;
}

// Proxy that lazily initializes the database connection
export const db = new Proxy({} as NeonHttpDatabase, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof NeonHttpDatabase];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
