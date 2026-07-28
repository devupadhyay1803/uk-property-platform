import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { featuredListings, recentlyLetListings } from "@/lib/queries/properties";
import { ListingCard } from "@/components/listing-card";
import { SearchFilters } from "@/components/search-filters";
import { Star, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "UK Property Platform — Homes to let across the UK",
  description:
    "Browse UK rental properties. Search by location, type and price, and enquire in seconds.",
};

export const revalidate = 300;

export default async function HomePage() {
  const allAvailable = await featuredListings(6);
  const featured = allAvailable.slice(0, 3);
  const newToMarket = allAvailable.slice(3, 6);
  const soldListings = await recentlyLetListings(3);

  const reviews = [
    { name: "Sarah M.", text: "Found my dream flat in 2 days. The process was incredibly smooth and the landlords are verified.", role: "Tenant in London" },
    { name: "James T.", text: "Easiest platform to use. I listed my property and had quality enquiries within hours.", role: "Landlord in Manchester" },
    { name: "Emily R.", text: "No hidden fees, clean interface, and very easy to navigate on my phone. Highly recommend!", role: "Tenant in Bristol" },
    { name: "David L.", text: "The transparent bidding process is a game changer. I knew exactly where I stood.", role: "Tenant in Edinburgh" },
    { name: "Sophie W.", text: "Incredible support team. They helped me upload all my documents and I was approved the same day.", role: "Tenant in Leeds" },
    { name: "Michael C.", text: "As a landlord with a large portfolio, this is the only platform I trust. Highly professional.", role: "Landlord in Birmingham" },
  ];
  // Duplicate for seamless infinite scroll
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* 1. Premium Hero Section */}
      <section className="relative flex min-h-[95vh] flex-col justify-end overflow-hidden pb-0 bg-slate-900">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-900">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="object-cover w-full h-full object-center opacity-80"
          >
            <source src="/videos/hero-video-v2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full px-4 pt-40 pb-8 mx-auto max-w-6xl flex flex-col h-full justify-end">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-serif tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find your next home across the UK
            </h1>
            <p className="mt-6 text-lg text-slate-200 max-w-2xl sm:text-xl font-medium">
              Search verified listings, filter by what matters, and enquire directly — no account needed.
            </p>
          </div>
          
          <div className="mt-32 w-full text-left">
            <SearchFilters current={{}} />
          </div>
        </div>
      </section>

      {/* Property Categories (Knight Frank style) */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar text-[13px] font-semibold uppercase tracking-widest text-slate-900">
            <Link href="/properties?type=flat" className="whitespace-nowrap hover:text-slate-500">Flats & Apartments</Link>
            <Link href="/properties?type=house" className="whitespace-nowrap hover:text-slate-500">Townhouses</Link>
            <Link href="/properties?type=studio" className="whitespace-nowrap hover:text-slate-500">Studios</Link>
            <Link href="/properties?type=bungalow" className="whitespace-nowrap hover:text-slate-500">Bungalows</Link>
            <Link href="/properties?type=maisonette" className="whitespace-nowrap hover:text-slate-500">Maisonettes</Link>
            <Link href="/properties?location=London" className="whitespace-nowrap hover:text-slate-500 text-slate-500">London Commute</Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Properties Carousel */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-12 sm:py-16 animate-scroll-reveal">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-serif text-slate-900 sm:text-5xl">
              Featured properties
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light">Handpicked premium homes available right now.</p>
          </div>
          <Link
            href="/properties"
            className="hidden items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-slate-900 hover:text-red-600 transition-colors sm:flex"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="border-t border-slate-200 bg-transparent py-24 text-center text-slate-500">
            <p>No properties published yet.</p>
          </div>
        ) : (
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0 sm:snap-none">
              {featured.map((l) => (
                <div key={l.id} className="min-w-[85vw] snap-center sm:min-w-0">
                  <ListingCard listing={l} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. New to Market Carousel */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-12 sm:py-16 animate-scroll-reveal">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-serif text-slate-900 sm:text-5xl">
              New to market
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light">The latest verified homes available right now.</p>
          </div>
          <Link
            href="/properties"
            className="hidden items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-slate-900 hover:text-red-600 transition-colors sm:flex"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {newToMarket.length === 0 ? (
          <div className="border-t border-slate-200 bg-transparent py-24 text-center text-slate-500">
            <p>No properties published yet.</p>
          </div>
        ) : (
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0 sm:snap-none">
              {newToMarket.map((l) => (
                <div key={l.id} className="min-w-[85vw] snap-center sm:min-w-0">
                  <ListingCard listing={l} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border border-slate-900 bg-transparent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-slate-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-900"
          >
            View all properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 2b. Recently Let & Sold Carousel */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-12 sm:py-16 animate-scroll-reveal">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-serif text-slate-900 sm:text-5xl">
              Recently let & sold
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light">Properties successfully matched with new residents.</p>
          </div>
        </div>

        {soldListings.length === 0 ? (
          <div className="border-t border-slate-200 bg-transparent py-24 text-center text-slate-500">
            <p>No market activity to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {soldListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center sm:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border border-slate-900 bg-transparent px-5 py-3 text-[13px] font-semibold uppercase tracking-widest text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            View market activity <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 3. Testimonials / Social Proof Slider */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <section className="bg-slate-50 border-y border-slate-200 py-12 sm:py-16 animate-scroll-reveal overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 text-center mb-12">
          <h2 className="text-4xl font-serif text-slate-900 sm:text-5xl">
            Trusted by thousands across the UK
          </h2>
        </div>

        <div className="w-full overflow-hidden relative">
          <div className="animate-marquee gap-6 px-4">
            {marqueeReviews.map((t, i) => (
              <div key={i} className="flex flex-col justify-between border border-slate-200 bg-white p-8 w-[350px] sm:w-[450px] flex-shrink-0 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="flex gap-1 text-[#e60000] mb-6">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed">"{t.text}"</p>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Action Blocks */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 sm:py-16 animate-scroll-reveal">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          
          {/* Tenant CTA */}
          <div className="relative overflow-hidden bg-slate-900 p-10 sm:p-12 shadow-sm flex flex-col justify-end min-h-[340px]">
            <div className="relative z-10 mt-auto">
              <h3 className="text-3xl font-serif text-white">Ready to move?</h3>
              <p className="mt-4 max-w-sm text-slate-300 font-light text-lg">
                Browse our full selection of verified properties across the UK and find the perfect match.
              </p>
              <Link href="/properties" className="mt-8 inline-flex items-center gap-3 bg-white px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-slate-900 transition hover:bg-slate-200">
                View all properties <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Landlord CTA */}
          <div className="relative overflow-hidden border border-slate-200 bg-white p-10 sm:p-12 shadow-sm flex flex-col justify-end min-h-[340px]">
            <div className="relative z-10 mt-auto">
              <div className="flex items-center gap-2 text-[#e60000] mb-3">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-widest text-slate-900">Verified Landlords Only</span>
              </div>
              <h3 className="text-3xl font-serif text-slate-900">Are you a landlord?</h3>
              <p className="mt-4 max-w-sm text-slate-600 font-light text-lg">
                Manage your portfolio effortlessly. Track enquiries and tenancies all from one dashboard.
              </p>
              <Link href="/login" className="mt-8 inline-flex items-center gap-3 bg-slate-900 px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800">
                Sign in to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* About CTA */}
          <div className="relative overflow-hidden p-10 sm:p-12 shadow-sm group flex flex-col justify-end min-h-[340px]">
            <div className="absolute inset-0 z-0">
              <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" alt="Premium Office" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/10 mix-blend-multiply" />
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-3xl font-serif text-white">Know our story</h3>
              <p className="mt-4 max-w-sm text-slate-300 font-light text-lg">
                Discover how we are redefining the UK property market with absolute transparency and genuine expertise.
              </p>
              <Link href="/about" className="mt-8 inline-flex items-center gap-3 bg-white px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-slate-900 transition hover:bg-slate-200">
                About us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="relative overflow-hidden p-10 sm:p-12 shadow-sm group flex flex-col justify-end min-h-[340px]">
            <div className="absolute inset-0 z-0 bg-slate-900">
              <Image src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1200&auto=format&fit=crop" alt="Contact Support" fill className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-3xl font-serif text-white">Get in touch</h3>
              <p className="mt-4 max-w-sm text-slate-300 font-light text-lg">
                Have a question or need assistance? Our dedicated property support team is available around the clock.
              </p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-3 bg-[#e60000] px-6 py-3 text-[13px] font-semibold uppercase tracking-widest text-white transition hover:bg-red-700">
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
