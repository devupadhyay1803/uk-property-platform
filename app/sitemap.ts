import type { MetadataRoute } from "next";
import { allPublishedSlugs } from "@/lib/queries/properties";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/properties`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.3 },
  ];

  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await allPublishedSlugs();
    listingRoutes = slugs.map((s) => ({
      url: `${BASE}/properties/${s.slug}`,
      lastModified: s.updated_at,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // DB not reachable at build time — ship the static routes only.
  }

  return [...staticRoutes, ...listingRoutes];
}
