import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  searchListings,
  type ListingFilters,
  PAGE_SIZE,
} from "@/lib/queries/properties";
import { ListingCard } from "@/components/listing-card";
import { SearchFilters } from "@/components/search-filters";

export const metadata: Metadata = {
  title: "Properties to let — UK Property Platform",
  description:
    "Search all available UK rental listings. Filter by location, type, price and availability.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function str(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() !== "" ? s.trim() : undefined;
}
function num(v: string | string[] | undefined): number | undefined {
  const s = str(v);
  if (s == null) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function parseFilters(sp: Record<string, string | string[] | undefined>): ListingFilters {
  return {
    q: str(sp.q),
    location: str(sp.location),
    type: str(sp.type),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    availableOnly: str(sp.availableOnly) === "1",
    page: num(sp.page) ?? 1,
  };
}

function buildQuery(filters: ListingFilters, page: number): string {
  const p = new URLSearchParams();
  if (filters.q) p.set("q", filters.q);
  if (filters.location) p.set("location", filters.location);
  if (filters.type) p.set("type", filters.type);
  if (filters.minPrice != null) p.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) p.set("maxPrice", String(filters.maxPrice));
  if (filters.availableOnly) p.set("availableOnly", "1");
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const { rows, count, page, pageCount } = await searchListings(filters);

  const start = count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, count);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[750px] lg:min-h-[700px] flex-col justify-end overflow-hidden pb-0 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=3540&auto=format&fit=crop"
            alt="Beautiful UK properties"
            fill
            className="object-cover object-center opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full px-4 pt-40 pb-8 mx-auto max-w-6xl text-center flex flex-col h-full justify-end">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Properties to let
          </h1>
          <p className="mt-6 text-lg font-medium text-slate-200 max-w-2xl mx-auto">
            Search all available UK rental listings. Filter by location, type, price and availability.
          </p>
          
          <div className="mt-32 text-left w-full">
            <SearchFilters current={filters} />
          </div>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="flex-1 pb-24">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              {count === 0
                ? "No properties match your search"
                : `Showing ${start}–${end} of ${count} propert${count === 1 ? "y" : "ies"}`}
            </p>
          </div>

      {rows.length === 0 ? (
        <div className="mt-6 border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700">
          <p className="font-medium">No properties match your search.</p>
          <p className="mt-1 text-sm">Try widening your filters or resetting.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-3 text-sm">
          {page > 1 ? (
            <Link
              href={`/properties${buildQuery(filters, page - 1)}`}
              className="border border-slate-300 px-4 py-2 font-semibold uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition"
            >
              ← Previous
            </Link>
          ) : (
            <span className="border border-slate-200 px-4 py-2 font-semibold uppercase tracking-widest text-[10px] text-slate-400">
              ← Previous
            </span>
          )}
          <span className="text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-widest text-[10px]">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link
              href={`/properties${buildQuery(filters, page + 1)}`}
              className="border border-slate-300 px-4 py-2 font-semibold uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition"
            >
              Next →
            </Link>
          ) : (
            <span className="border border-slate-200 px-4 py-2 font-semibold uppercase tracking-widest text-[10px] text-slate-400">
              Next →
            </span>
          )}
        </nav>
      )}
        </div>
      </section>
    </div>
  );
}
