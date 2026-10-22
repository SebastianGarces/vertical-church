import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { nfcLinks } from "@/lib/db/schema";
import { nfcColors } from "@/lib/nfc";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LinkForm } from "./LinkForm";

const colorSwatches = {
  orange: "#ea7c24",
  green: "#32834a",
  black: "#202020",
  burgundy: "#800020",
  blue: "#2563eb",
};

export default async function NfcPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const [links, counts] = await Promise.all([
    db.select().from(nfcLinks),
    db.execute(sql`SELECT color, count(*)::int AS total FROM nfc_opens WHERE opened_at >= now() - interval '30 days' GROUP BY color`),
  ]);
  const totals = new Map(counts.rows.map(row => [String(row.color), Number(row.total)]));
  const max = Math.max(1, ...totals.values());
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div><h1 className="text-3xl font-bold">NFC links</h1><p className="text-muted-foreground">Program each color once. Change its destination here whenever you need.</p></div>
      <Card><CardHeader><CardTitle>Opens by color · last 30 days</CardTitle></CardHeader><CardContent className="space-y-3">
        {nfcColors.map(color => <div key={color} className="grid grid-cols-[80px_1fr_40px] items-center gap-3 text-sm"><span className="capitalize">{color}</span><div className="h-3 rounded bg-muted"><div className="h-3 rounded bg-primary" style={{ width: `${(totals.get(color) ?? 0) / max * 100}%` }} /></div><span className="text-right tabular-nums">{totals.get(color) ?? 0}</span></div>)}
        <p className="text-xs text-muted-foreground">Counts include NFC and QR opens using the same URL, including repeat opens. They do not measure completed gifts or check-ins.</p>
      </CardContent></Card>
      <div className="grid gap-4 md:grid-cols-2">
        {nfcColors.map(color => {
          const link = links.find(link => link.color === color);
          if (!link) return null;
          return <Card key={color}><CardHeader><CardTitle className="flex items-center gap-2.5 capitalize"><span aria-hidden="true" className="size-3.5 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: colorSwatches[color] }} />{color}</CardTitle><p className="break-all font-mono text-xs text-muted-foreground">https://vertical.family/nfc/{color}</p></CardHeader><CardContent><LinkForm link={link} /></CardContent></Card>;
        })}
      </div>
    </div>
  );
}
