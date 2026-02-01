import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeriesForm } from "../../components/SeriesForm";
import { getSeriesById } from "@/lib/db/admin-queries";

export default async function EditSeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const series = await getSeriesById(id);

  if (!series) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/series">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Series</h1>
          <p className="text-muted-foreground">{series.title}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <SeriesForm series={series} />
      </div>
    </div>
  );
}
