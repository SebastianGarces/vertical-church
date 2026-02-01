import "@/app/globals.css";
import "./admin.css";

export const metadata = {
  title: "Admin | Vertical Church",
  description: "Vertical Church Admin Dashboard",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-theme">{children}</div>;
}
