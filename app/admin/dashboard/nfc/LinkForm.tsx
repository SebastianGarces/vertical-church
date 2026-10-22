"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveNfcLink } from "./actions";

export function LinkForm({ link }: { link: { color: string; label: string; destination: string | null; enabled: boolean } }) {
  const [state, action, pending] = useActionState(saveNfcLink, { message: "", ok: false });
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="color" value={link.color} />
      <label className="block space-y-1 text-sm"><span>Purpose / name</span><Input name="label" defaultValue={link.label} required maxLength={80} /></label>
      <label className="block space-y-1 text-sm"><span>Destination URL</span><Input name="destination" type="url" placeholder="https://…" defaultValue={link.destination ?? ""} maxLength={2048} /></label>
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm"><input name="enabled" type="checkbox" defaultChecked={link.enabled} />Active</label>
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
      </div>
      <p role="status" className={`text-sm ${state.ok ? "text-muted-foreground" : "text-destructive"}`}>{state.message}</p>
    </form>
  );
}
