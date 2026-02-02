import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../lib/db";
import { series } from "../lib/db/schema";
import { sql } from "drizzle-orm";

const OLD_HOST = "t3.storageapi.dev";
const NEW_HOST = "t3.storage.dev";

async function fixImageUrls() {
  console.log("Fetching series with incorrect image URLs...\n");

  const allSeries = await db.select().from(series);

  const toUpdate = allSeries.filter(
    (s) =>
      s.thumbnailUrl?.includes(OLD_HOST) || s.backgroundUrl?.includes(OLD_HOST)
  );

  if (toUpdate.length === 0) {
    console.log("No series found with incorrect URLs.");
    return;
  }

  console.log(`Found ${toUpdate.length} series to update:\n`);

  for (const s of toUpdate) {
    const newThumbnailUrl = s.thumbnailUrl?.replace(OLD_HOST, NEW_HOST) || null;
    const newBackgroundUrl = s.backgroundUrl?.replace(OLD_HOST, NEW_HOST) || null;

    console.log(`- ${s.title}`);
    if (s.thumbnailUrl !== newThumbnailUrl) {
      console.log(`  thumbnail: ${s.thumbnailUrl}`);
      console.log(`         -> ${newThumbnailUrl}`);
    }
    if (s.backgroundUrl !== newBackgroundUrl) {
      console.log(`  background: ${s.backgroundUrl}`);
      console.log(`          -> ${newBackgroundUrl}`);
    }

    await db
      .update(series)
      .set({
        thumbnailUrl: newThumbnailUrl,
        backgroundUrl: newBackgroundUrl,
      })
      .where(sql`${series.id} = ${s.id}`);
  }

  console.log("\nDone! All URLs updated.");
}

fixImageUrls()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
