import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllSermons } from "@/lib/db/admin-queries";

export default async function SermonsListPage() {
  const sermons = await getAllSermons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sermons</h1>
          <p className="text-muted-foreground">Manage individual sermons</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sermons/new">
            <Plus className="mr-2 h-4 w-4" />
            New Sermon
          </Link>
        </Button>
      </div>

      {sermons.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No sermons yet.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/sermons/new">Create your first sermon</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Pastor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sermons.map((sermon) => (
                <TableRow key={sermon.id}>
                  <TableCell className="font-medium">{sermon.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {sermon.series?.title || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {sermon.pastor || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(sermon.sermonDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/sermons/${sermon.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
