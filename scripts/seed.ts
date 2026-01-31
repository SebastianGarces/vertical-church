import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { series, sermons } from "../lib/db/schema";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Helper to generate slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
}

// Parse CSV - handles quoted fields with commas
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header.trim()] = values[idx]?.trim() || "";
      });
      rows.push(row);
    }
  }
  return rows;
}

// Parse a single CSV line, handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function seed() {
  console.log("Starting seed process...\n");

  // Read CSV files
  const seriesPath = path.join(process.cwd(), "data", "Series.csv");
  const sermonsPath = path.join(process.cwd(), "data", "Sermons.csv");

  if (!fs.existsSync(seriesPath)) {
    throw new Error(`Series CSV not found at ${seriesPath}`);
  }
  if (!fs.existsSync(sermonsPath)) {
    throw new Error(`Sermons CSV not found at ${sermonsPath}`);
  }

  const seriesCSV = fs.readFileSync(seriesPath, "utf-8");
  const sermonsCSV = fs.readFileSync(sermonsPath, "utf-8");

  const seriesData = parseCSV(seriesCSV);
  const sermonsData = parseCSV(sermonsCSV);

  console.log(`Found ${seriesData.length} series`);
  console.log(`Found ${sermonsData.length} sermons\n`);

  // Build a map of series IDs for validation
  const seriesIds = new Set(seriesData.map((s) => s["ID"]));

  // Validate sermon series references
  const invalidSermons = sermonsData.filter(
    (s) => s["series"] && !seriesIds.has(s["series"])
  );
  if (invalidSermons.length > 0) {
    console.error("ERROR: Found sermons with invalid series IDs:");
    invalidSermons.forEach((s) => {
      console.error(`  - "${s["Title"]}" references series ID: ${s["series"]}`);
    });
    throw new Error("Invalid series references found");
  }

  // Insert series
  console.log("Inserting series...");
  const seriesInserts = seriesData.map((row) => ({
    id: row["ID"],
    title: row["title"],
    slug: slugify(row["title"]),
    thumbnailUrl: null, // Will be added via admin dashboard
    backgroundUrl: null, // Will be added via admin dashboard
    createdAt: new Date(row["Created Date"]),
  }));

  for (const s of seriesInserts) {
    await db.insert(series).values(s).onConflictDoNothing();
    console.log(`  + ${s.title}`);
  }

  // Insert sermons
  console.log("\nInserting sermons...");
  const sermonInserts = sermonsData.map((row) => ({
    id: row["ID"],
    title: row["Title"],
    slug: slugify(row["Title"]),
    sermonDate: row["Date"], // Format: YYYY-MM-DD
    videoUrl: row["Video URL"],
    seriesId: row["series"] || null,
    book: null, // Will be added via admin dashboard
    pastor: null, // Will be added via admin dashboard
    createdAt: new Date(row["Created Date"]),
  }));

  for (const s of sermonInserts) {
    await db.insert(sermons).values(s).onConflictDoNothing();
    console.log(`  + ${s.title}`);
  }

  // Verify relationships
  console.log("\n--- Verification ---");
  console.log("\nSermon count per series:");

  const seriesMap = new Map(seriesData.map((s) => [s["ID"], s["title"]]));
  const sermonCounts = new Map<string, number>();

  for (const sermon of sermonsData) {
    const seriesId = sermon["series"];
    if (seriesId) {
      sermonCounts.set(seriesId, (sermonCounts.get(seriesId) || 0) + 1);
    }
  }

  for (const [seriesId, count] of sermonCounts) {
    const seriesTitle = seriesMap.get(seriesId) || "Unknown";
    console.log(`  ${seriesTitle}: ${count} sermons`);
  }

  console.log("\nSeed completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
