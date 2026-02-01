"use client";

import { useTransition } from "react";
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
import type { Series } from "@/lib/db/queries";

interface SeriesFormProps {
  series?: Series;
}

export function SeriesForm({ series }: SeriesFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={series?.title}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={series?.slug}
              placeholder="auto-generated-from-title"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate from title
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              defaultValue={series?.thumbnailUrl || ""}
              placeholder="https://example.com/image.jpg"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundUrl">Background URL</Label>
            <Input
              id="backgroundUrl"
              name="backgroundUrl"
              type="url"
              defaultValue={series?.backgroundUrl || ""}
              placeholder="https://example.com/background.jpg"
              disabled={isPending}
            />
          </div>

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
