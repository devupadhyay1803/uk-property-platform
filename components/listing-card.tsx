import Link from "next/link";
import type { ListingCard as Listing } from "@/lib/queries/properties";
import { formatPricePcm } from "@/lib/format";
import { PropertyImage } from "@/components/property-image";

export function ListingCard({ listing }: { listing: Listing }) {
  const photo = [...listing.property_photos].sort(
    (a, b) =>
      (a as { sort_order?: number }).sort_order! -
      (b as { sort_order?: number }).sort_order!,
  )[0];
  const beds = listing.bedrooms ?? 0;

  return (
    <Link
      href={`/properties/${listing.slug}`}
      className="group block overflow-hidden"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100 mb-3">
        <PropertyImage
          path={photo?.storage_path}
          alt={photo?.alt_text ?? listing.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <span
          className={`absolute left-4 top-4 px-2 py-1 text-[10px] uppercase tracking-widest font-semibold ${
            listing.status === "available"
              ? "bg-white text-slate-900"
              : "bg-slate-900 text-white"
          }`}
        >
          {listing.status === "available" ? "Available" : "Let"}
        </span>
      </div>
      
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
            {listing.title}
          </h3>
          <p className="mt-1 text-[13px] text-slate-500">
            {listing.city}, {listing.postcode}
          </p>
          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {beds > 0 && `${beds} BED${beds > 1 ? "S" : ""} • `}
            {listing.bathrooms && `${listing.bathrooms} BATH${listing.bathrooms > 1 ? "S" : ""} • `}
            {listing.property_type}
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-900 text-right whitespace-nowrap pl-4">
          {formatPricePcm(listing.price_pcm)}
        </p>
      </div>
    </Link>
  );
}
