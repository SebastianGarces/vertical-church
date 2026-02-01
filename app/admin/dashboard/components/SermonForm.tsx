"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createSermonAction,
  updateSermonAction,
  deleteSermonAction,
} from "../../actions";
import type { Series, Sermon } from "@/lib/db/queries";

interface SermonFormProps {
  sermon?: Sermon;
  allSeries: Series[];
}

export function SermonForm({ sermon, allSeries }: SermonFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (sermon) {
        await updateSermonAction(sermon.id, formData);
      } else {
        await createSermonAction(formData);
      }
    });
  };

  const handleDelete = () => {
    if (!sermon) return;
    if (!confirm("Are you sure you want to delete this sermon?")) return;

    startTransition(async () => {
      await deleteSermonAction(sermon.id);
    });
  };

  // Format date for input[type="date"]
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
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
              defaultValue={sermon?.title}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={sermon?.slug}
              placeholder="auto-generated-from-title"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate from title
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sermonDate">Sermon Date *</Label>
            <Input
              id="sermonDate"
              name="sermonDate"
              type="date"
              defaultValue={formatDate(sermon?.sermonDate)}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL *</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={sermon?.videoUrl}
              placeholder="https://vimeo.com/..."
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seriesId">Series</Label>
            <Select
              name="seriesId"
              defaultValue={sermon?.seriesId || "none"}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No series</SelectItem>
                {allSeries.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pastor">Pastor</Label>
              <Input
                id="pastor"
                name="pastor"
                defaultValue={sermon?.pastor || ""}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="book">Book</Label>
              <Input
                id="book"
                name="book"
                defaultValue={sermon?.book || ""}
                placeholder="e.g., Matthew"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : sermon
                  ? "Update Sermon"
                  : "Create Sermon"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/sermons")}
              disabled={isPending}
            >
              Cancel
            </Button>
            {sermon && (
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
