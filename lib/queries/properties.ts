import { createPublicClient } from "@/lib/supabase/public";
import type { Property, PropertyPhoto } from "@/types/database";

export type ListingCard = Pick<
  Property,
  | "id"
  | "title"
  | "slug"
  | "price_pcm"
  | "property_type"
  | "bedrooms"
  | "bathrooms"
  | "city"
  | "postcode"
  | "status"
> & {
  property_photos: Pick<
    PropertyPhoto,
    "storage_path" | "alt_text" | "sort_order"
  >[];
};

export type ListingDetail = Property & {
  property_photos: PropertyPhoto[];
};

export interface ListingFilters {
  q?: string; // keyword
  location?: string; // city
  type?: string; // property_type
  minPrice?: number; // pounds/month
  maxPrice?: number; // pounds/month
  availableOnly?: boolean;
  page?: number;
}

export const PAGE_SIZE = 12; // ARCHITECTURE §14 item 10 (default; confirm)

const CARD_COLUMNS =
  "id, title, slug, price_pcm, property_type, bedrooms, bathrooms, city, postcode, status, property_photos(storage_path, alt_text, sort_order)";

/**
 * Search + filter published listings (F6). Runs as anon under RLS, so only
 * published rows are ever returned. Returns rows + total count for pagination.
 */
export async function searchListings(filters: ListingFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const empty = { rows: [] as ListingCard[], count: 0, page, pageCount: 1 };

  const supabase = createPublicClient();
  if (!supabase) return empty;

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("properties")
    .select(CARD_COLUMNS, { count: "exact" })
    .eq("published", true);

  if (filters.q)
    query = query.textSearch("search_vector", filters.q, { type: "websearch" });
  if (filters.location) query = query.ilike("city", `%${filters.location}%`);
  if (filters.type) query = query.eq("property_type", filters.type);
  if (filters.minPrice != null)
    query = query.gte("price_pcm", filters.minPrice * 100);
  if (filters.maxPrice != null)
    query = query.lte("price_pcm", filters.maxPrice * 100);
  if (filters.availableOnly) query = query.eq("status", "available");

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("searchListings failed:", error.message);
    return empty;
  }

  return {
    rows: (data ?? []) as unknown as ListingCard[],
    count: count ?? 0,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

/** Featured listings for the home page (most recent available). */
export async function featuredListings(limit = 6): Promise<ListingCard[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("properties")
    .select(CARD_COLUMNS)
    .eq("published", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("featuredListings failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ListingCard[];
}

/** Recently let/sold listings for the home page. */
export async function recentlyLetListings(limit = 6): Promise<ListingCard[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("properties")
    .select(CARD_COLUMNS)
    .eq("published", true)
    .neq("status", "available")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("recentlyLetListings failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ListingCard[];
}

/** Single listing by slug (F1 detail). Null if not found / not published. */
export async function getListingBySlug(
  slug: string,
): Promise<ListingDetail | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_photos(*)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("getListingBySlug failed:", error.message);
    return null;
  }
  return (data as unknown as ListingDetail) ?? null;
}

/** All published slugs for the sitemap (F9). */
export async function allPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("properties")
    .select("slug, updated_at")
    .eq("published", true);
  if (error) {
    console.error("allPublishedSlugs failed:", error.message);
    return [];
  }
  return data ?? [];
}
