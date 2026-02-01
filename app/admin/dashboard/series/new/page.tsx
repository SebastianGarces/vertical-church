import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeriesForm } from "../../components/SeriesForm";

export default function NewSeriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/series">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Series</h1>
          <p className="text-muted-foreground">Create a new sermon series</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <SeriesForm />
      </div>
    </div>
  );
}
