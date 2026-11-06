/** True when a Host header value belongs to the admin subdomain. Shared by proxy.ts and the GA4 tag. */
export function isAdminHost(host: string | null | undefined): boolean {
  const hostname = (host ?? "").toLowerCase();
  return (
    hostname.includes("admin.localhost") ||
    hostname.includes("admin.gsgarces") ||
    hostname.includes("admin.vertical.family")
  );
}
