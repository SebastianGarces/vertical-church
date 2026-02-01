import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SermonForm } from "../../components/SermonForm";
import { getAllSeries } from "@/lib/db/admin-queries";

export default async function NewSermonPage() {
  const allSeries = await getAllSeries();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/sermons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Sermon</h1>
          <p className="text-muted-foreground">Add a new sermon</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <SermonForm allSeries={allSeries} />
      </div>
    </div>
  );
}
