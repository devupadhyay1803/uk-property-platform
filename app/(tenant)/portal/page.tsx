import type { Metadata } from 'next';
import { getMyTenancy } from '@/lib/queries/tenant';
import { formatPricePcm } from '@/lib/format';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Tenancy' };

export default async function TenantPortalPage() {
 const tenancy = await getMyTenancy();
 
 if (!tenancy) {
 return (
 <div className="space-y-6">
 <h1 className="text-3xl font-sans text-slate-900">Overview</h1>
 <div className="border border-slate-200 bg-white">
 <p className="py-4 text-center text-lg italic text-slate-400 font-sans">
 No tenancy record found. Please contact your administrator.
 </p>
 </div>
 </div>
 );
 }

 const property = (tenancy as Record<string, unknown>).properties as {
 title: string; address_line: string; city: string; postcode: string; status: string;
 property_type: string; bedrooms: number | null; bathrooms: number | null; price_pcm: number;
 profiles: { full_name: string; email: string; phone: string | null } | null;
 } | null;

 return (
 <div className="space-y-8">
 <div className="flex items-center justify-between border-b border-slate-200 pb-6">
 <h1 className="text-3xl font-sans text-slate-900">Overview</h1>
 <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${tenancy.status === 'active' ? 'bg-emerald-100 text-emerald-800' : tenancy.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
 {tenancy.status.charAt(0).toUpperCase() + tenancy.status.slice(1)} Tenancy
 </span>
 </div>

 {property && (
 <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
 
 {/* Main Details */}
 <div className="lg:col-span-2 space-y-8">
 <section className="border border-slate-200 bg-white p-5">
 <h2 className="mb-6 text-xl font-sans text-slate-900">Property Details</h2>
 <div className="space-y-4">
 <div>
 <p className="text-[10px] font-bold text-slate-400">Property</p>
 <p className="mt-1 text-lg font-sans text-slate-900">{property.title}</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-[10px] font-bold text-slate-400">Type</p>
 <p className="mt-1 text-sm capitalize text-slate-900">{property.property_type}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400">Address</p>
 <p className="mt-1 text-sm text-slate-900">{property.address_line}<br/>{property.city}<br/>{property.postcode}</p>
 </div>
 {property.bedrooms != null && (
 <div>
 <p className="text-[10px] font-bold text-slate-400">Bedrooms</p>
 <p className="mt-1 text-sm text-slate-900">{property.bedrooms}</p>
 </div>
 )}
 {property.bathrooms != null && (
 <div>
 <p className="text-[10px] font-bold text-slate-400">Bathrooms</p>
 <p className="mt-1 text-sm text-slate-900">{property.bathrooms}</p>
 </div>
 )}
 </div>
 </div>
 </section>
 </div>

 {/* Sidebar Widgets */}
 <div className="space-y-8">
 <section className="border border-slate-200 bg-slate-900 p-5 text-white">
 <h2 className="mb-6 text-[10px] font-bold text-slate-400">Rent Status</h2>
 <div className="space-y-6">
 <div>
 <p className="text-3xl font-sans">{formatPricePcm(property.price_pcm)}<span className="text-sm font-sans font-normal text-slate-400"> pcm</span></p>
 </div>
 <div className="border-t border-slate-800 pt-4">
 <p className="text-[10px] font-bold text-emerald-400">Next Payment Due</p>
 <p className="mt-1 text-lg font-sans">1st of the month</p>
 </div>
 </div>
 </section>

 {property.profiles ? (
 <section className="border border-slate-200 bg-white p-5">
 <h2 className="mb-4 text-[10px] font-bold text-slate-400">Landlord Contact</h2>
 <div className="space-y-4">
 <div>
 <p className="font-sans text-lg text-slate-900">{property.profiles.full_name || 'Unnamed Landlord'}</p>
 </div>
 {property.profiles.email && (
 <div>
 <a href={`mailto:${property.profiles.email}`} className="text-sm text-slate-500 hover:text-slate-900 hover:underline">
 {property.profiles.email}
 </a>
 </div>
 )}
 {property.profiles.phone && (
 <div>
 <a href={`tel:${property.profiles.phone}`} className="text-sm text-slate-500 hover:text-slate-900 hover:underline">
 {property.profiles.phone}
 </a>
 </div>
 )}
 </div>
 <div className="mt-6 pt-6 border-t border-slate-100">
 <Link href="/portal/requests/new" className="block w-full border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-700 transition">
 Report Issue
 </Link>
 </div>
 </section>
 ) : (
 <section className="border border-slate-200 bg-white p-5">
 <h2 className="mb-4 text-[10px] font-bold text-slate-400">Landlord Contact</h2>
 <p className="text-sm text-slate-500">Landlord details are currently unavailable.</p>
 <div className="mt-6 pt-6 border-t border-slate-100">
 <Link href="/portal/requests/new" className="block w-full border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-700 transition">
 Report Issue
 </Link>
 </div>
 </section>
 )}
 </div>
 </div>
 )}
 </div>
 );
}
