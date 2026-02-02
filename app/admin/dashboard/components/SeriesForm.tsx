"use client";

import { useTransition, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  createSeriesAction,
  updateSeriesAction,
  deleteSeriesAction,
} from "../../actions";
import { ImageUpload } from "./ImageUpload";
import type { Series } from "@/lib/db/queries";

// Helper to create slug from title (mirrors server-side logic)
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface SeriesFormProps {
  series?: Series;
}

export function SeriesForm({ series }: SeriesFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(series?.title || "");
  const [customSlug, setCustomSlug] = useState(series?.slug || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(series?.thumbnailUrl || "");
  const [backgroundUrl, setBackgroundUrl] = useState(series?.backgroundUrl || "");

  // Compute effective slug for image uploads
  const effectiveSlug = customSlug || createSlug(title);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (series) {
        await updateSeriesAction(series.id, formData);
      } else {
        await createSeriesAction(formData);
      }
    });
  };

  const handleDelete = () => {
    if (!series) return;
    if (!confirm("Are you sure you want to delete this series?")) return;

    startTransition(async () => {
      await deleteSeriesAction(series.id);
    });
  };

  const handleThumbnailUpload = useCallback((url: string) => {
    setThumbnailUrl(url);
  }, []);

  const handleBackgroundUpload = useCallback((url: string) => {
    setBackgroundUrl(url);
  }, []);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder={effectiveSlug || "auto-generated-from-title"}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate from title
            </p>
          </div>

          <ImageUpload
            name="thumbnailUrl"
            label="Thumbnail Image"
            currentUrl={thumbnailUrl}
            slug={effectiveSlug}
            type="thumbnail"
            onUploadComplete={handleThumbnailUpload}
            disabled={isPending || !effectiveSlug}
          />

          <ImageUpload
            name="backgroundUrl"
            label="Background Image"
            currentUrl={backgroundUrl}
            slug={effectiveSlug}
            type="background"
            onUploadComplete={handleBackgroundUpload}
            disabled={isPending || !effectiveSlug}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : series
                  ? "Update Series"
                  : "Create Series"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/series")}
              disabled={isPending}
            >
              Cancel
            </Button>
            {series && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="ml-auto"
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
