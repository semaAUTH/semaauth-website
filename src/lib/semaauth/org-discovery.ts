export type DiscoveredOrganization = {
  tenant_id: string;
  name: string;
  issuer_domain: string;
};

type OrgDiscoveryResponse = {
  organizations: DiscoveredOrganization[];
  domain: string;
};

/** Pre-auth org lookup by email domain (no user enumeration). */
export async function discoverOrganizations(
  issuerUrl: string,
  email: string,
  tenantId?: string,
): Promise<DiscoveredOrganization[]> {
  const url = new URL("/oauth/org-discovery", issuerUrl.replace(/\/$/, ""));
  url.searchParams.set("login_hint", email.trim());

  const headers: Record<string, string> = { Accept: "application/json" };
  if (tenantId) {
    headers["X-Tenant-ID"] = tenantId;
  }

  const res = await fetch(url.toString(), { headers, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Org discovery failed (${res.status})`);
  }

  const data = (await res.json()) as OrgDiscoveryResponse;
  return data.organizations ?? [];
}
