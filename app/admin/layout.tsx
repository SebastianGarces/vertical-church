import type { Metadata } from "next";
import "@/app/globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  description: "Vertical Church Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-theme">{children}</div>;
}
