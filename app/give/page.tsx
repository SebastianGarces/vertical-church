import type { Metadata } from "next";
import { GivePageClient } from "./components";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Support the mission of Vertical Church. Your generosity helps us share the love of Christ and serve our community in North Ridgeville.",
  alternates: {
    canonical: "/give",
  },
};

export default function GivePage() {
  return <GivePageClient />;
}
