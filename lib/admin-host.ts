/** True when a Host header value belongs to the admin subdomain. Used by proxy.ts. */
export function isAdminHost(host: string | null | undefined): boolean {
  const hostname = (host ?? "").toLowerCase();
  return (
    hostname.includes("admin.localhost") ||
    hostname.includes("admin.gsgarces") ||
    hostname.includes("admin.vertical.family")
  );
}
