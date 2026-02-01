import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SermonForm } from "../../components/SermonForm";
import { getSermonById, getAllSeries } from "@/lib/db/admin-queries";

export default async function EditSermonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [sermon, allSeries] = await Promise.all([
    getSermonById(id),
    getAllSeries(),
  ]);

  if (!sermon) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/sermons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Sermon</h1>
          <p className="text-muted-foreground">{sermon.title}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <SermonForm sermon={sermon} allSeries={allSeries} />
      </div>
    </div>
  );
}
