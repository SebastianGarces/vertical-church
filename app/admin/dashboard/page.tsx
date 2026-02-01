import Link from "next/link";
import { Film, FolderOpen, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSeries, getSermons } from "@/lib/db/queries";

export default async function DashboardPage() {
  const [allSeries, sermonsResult] = await Promise.all([
    getSeries(),
    getSermons({ limit: 5 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your sermon series and individual sermons
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Series</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allSeries.length}</div>
            <Link
              href="/dashboard/series"
              className="text-xs text-muted-foreground hover:underline"
            >
              View all series →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sermons</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sermonsResult.sermons.length}+
            </div>
            <Link
              href="/dashboard/sermons"
              className="text-xs text-muted-foreground hover:underline"
            >
              View all sermons →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard/series/new">
            <Plus className="mr-2 h-4 w-4" />
            New Series
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/sermons/new">
            <Plus className="mr-2 h-4 w-4" />
            New Sermon
          </Link>
        </Button>
      </div>

      {/* Recent Sermons */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sermons</CardTitle>
        </CardHeader>
        <CardContent>
          {sermonsResult.sermons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sermons yet.</p>
          ) : (
            <div className="space-y-4">
              {sermonsResult.sermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{sermon.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {sermon.series?.title || "No series"} •{" "}
                      {new Date(sermon.sermonDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/sermons/${sermon.id}`}>Edit</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
