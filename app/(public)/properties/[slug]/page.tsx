import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getListingBySlug } from "@/lib/queries/properties";
import { formatPricePcm, storagePublicUrl } from "@/lib/format";
import { PropertyImage } from "@/components/property-image";
import { EnquiryForm } from "./enquiry-form";
import { ExpandableDescription } from "@/components/expandable-description";

type Params = Promise<{ slug: string }>;

// ISR: cache rendered listing pages; publish/edit actions can revalidate.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Property not found" };

  const title =
    listing.meta_title ?? `${listing.title} — ${listing.city} | To let`;
  const description =
    listing.meta_description ??
    (listing.description?.slice(0, 155) ??
      `${listing.property_type} to let in ${listing.city}.`);

  return {
    title,
    description,
    alternates: { canonical: `/properties/${listing.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const photos = [...listing.property_photos].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  
  const heroPhoto = photos[0];
  const gridPhotos = photos.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: listing.title,
    description: listing.description ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address_line,
      addressLocality: listing.city,
      postalCode: listing.postcode,
      addressCountry: "GB",
    },
    image: photos.map((p) => p.storage_path.startsWith("http") ? p.storage_path : storagePublicUrl("property-photos", p.storage_path)),
  };

  return (
    <div className="relative min-h-screen bg-[#F8F7F3] selection:bg-slate-200 pb-20 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full bg-slate-900">
        {heroPhoto ? (
          <PropertyImage
            path={heroPhoto.storage_path}
            alt={heroPhoto.alt_text ?? listing.title}
            className="h-full w-full object-cover opacity-90"
          />
        ) : (
          <div className="h-full w-full bg-slate-200" />
        )}
        
        {/* Transparent Overlay for Header */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Floating Info Box (Bottom Left) */}
        <div className="absolute bottom-8 left-8 lg:bottom-16 lg:left-16 w-full max-w-[400px] bg-[#F8F7F3] p-10 z-10 hidden md:block shadow-xl">
          <h1 className="text-3xl font-serif text-slate-900 tracking-tight leading-snug">
            {listing.title}
          </h1>
          <p className="mt-3 text-slate-700 text-[15px]">
            {listing.city} {listing.postcode}
          </p>
          <p className="mt-1 text-slate-900 text-[15px] font-medium tracking-wide">
            {formatPricePcm(listing.price_pcm)}
          </p>
          <p className="mt-1 text-slate-700 text-[15px] capitalize">
            {listing.status === "let" ? "Let Agreed" : "Available"}
          </p>
          <p className="mt-1 text-slate-700 text-[15px]">
            {listing.bedrooms != null ? `${listing.bedrooms} Beds • ` : ""}
            {listing.bathrooms != null ? `${listing.bathrooms} Baths` : ""}
            <span className="capitalize"> • {listing.property_type}</span>
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-5">
            <span className="hover:text-slate-500 cursor-pointer transition-colors border-b border-slate-900 pb-1">Floorplan</span>
            <span className="hover:text-slate-500 cursor-pointer transition-colors pb-1">EPC</span>
            <span className="hover:text-slate-500 cursor-pointer transition-colors pb-1">Map</span>
            <span className="hover:text-slate-500 cursor-pointer transition-colors pb-1">Brochure</span>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <a href="#enquire" className="w-full border border-slate-900 bg-transparent py-3 text-center text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
              Request Viewing
            </a>
            <button className="w-full border border-slate-900 bg-transparent py-3 text-center text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
              Register for similar homes
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-700">
            or call <span className="underline decoration-slate-300 underline-offset-4">020 3795 5920</span>
          </p>
        </div>
      </section>

      {/* Mobile Info Box (Displays below hero on small screens) */}
      <div className="block md:hidden bg-[#F8F7F3] p-6 border-b border-slate-200">
        <h1 className="text-3xl font-serif text-slate-900 tracking-tight leading-snug">
          {listing.title}
        </h1>
        <p className="mt-2 text-slate-600 font-serif text-lg italic">
          {listing.city} {listing.postcode}
        </p>
        <p className="mt-4 text-slate-900 font-medium tracking-wide">
          {formatPricePcm(listing.price_pcm)}
        </p>
        
        <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-4">
          <span className="border-b border-slate-900 pb-1">Floorplan</span>
          <span className="pb-1">EPC</span>
          <span className="pb-1">Map</span>
        </div>
        
        <div className="mt-6 flex flex-col gap-3">
          <a href="#enquire" className="w-full border border-slate-900 bg-transparent py-3 text-center text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
            Request Viewing
          </a>
        </div>
      </div>

      {/* 2. Editorial Body / Description */}
      {listing.description && (
        <section className="py-20 md:py-32 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900 leading-relaxed md:leading-snug italic mb-12 text-center">
              “{listing.meta_description || (listing.description?.split(/(?<=\.)\s+/)[0] || listing.title)}”
            </h2>
            
            <ExpandableDescription content={listing.description} />
          </div>
        </section>
      )}

      {/* 3. Photo Grid */}
      {gridPhotos.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gridPhotos.map((p) => (
              <div key={p.id} className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 group">
                <PropertyImage
                  path={p.storage_path}
                  alt={p.alt_text ?? listing.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Enquiry Section */}
      <section className="mx-auto max-w-2xl px-6 py-20" id="enquire">
        <h3 className="mb-8 text-3xl font-serif text-slate-900 text-center">Enquire about this property</h3>
        <EnquiryForm propertyId={listing.id} />
      </section>

      {/* 4. Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 transform transition-transform shadow-[0_-4px_20px_rgba(0,0,0,0.05)] hidden md:block">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-8">
          
          {/* Left: Property Info */}
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-serif text-slate-900 truncate max-w-md">{listing.title}</h3>
            <span className="text-[13px] font-medium text-slate-500">{formatPricePcm(listing.price_pcm)}</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 border-r border-slate-200 pr-8">
               <span className="hover:text-slate-900 cursor-pointer transition-colors">Floorplan</span>
               <span className="hover:text-slate-900 cursor-pointer transition-colors">EPC</span>
               <span className="hover:text-slate-900 cursor-pointer transition-colors">Map</span>
               <span className="hover:text-slate-900 cursor-pointer transition-colors">Brochure</span>
             </div>
             <a href="#enquire" className="bg-black text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
               Request Viewing
             </a>
          </div>

        </div>
      </div>

    </div>
  );
}
