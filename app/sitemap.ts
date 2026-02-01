import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { sermons, series } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vertical.family";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/beliefs`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/visit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/watch`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-involved`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/give`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  // Dynamic sermon pages
  const allSermons = await db
    .select({
      slug: sermons.slug,
      createdAt: sermons.createdAt,
    })
    .from(sermons)
    .orderBy(desc(sermons.sermonDate));

  const sermonPages: MetadataRoute.Sitemap = allSermons.map((sermon) => ({
    url: `${baseUrl}/watch/${sermon.slug}`,
    lastModified: new Date(sermon.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic series pages
  const allSeries = await db
    .select({
      slug: series.slug,
      createdAt: series.createdAt,
    })
    .from(series)
    .orderBy(desc(series.createdAt));

  const seriesPages: MetadataRoute.Sitemap = allSeries.map((s) => ({
    url: `${baseUrl}/watch/series/${s.slug}`,
    lastModified: new Date(s.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...sermonPages, ...seriesPages];
}
