import type { Metadata } from 'next';
import { getMyProperties } from '@/lib/queries/landlord';
import { formatPricePcm } from '@/lib/format';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Properties' };

export default async function LandlordPropertiesPage() {
 const properties = await getMyProperties();
 return (
 <div className="space-y-6">
 <h1 className="text-3xl font-sans text-slate-900">My Properties ({properties.length})</h1>
 {properties.length === 0 ? (
 <div className="border border-slate-200 bg-white">
 <p className="text-lg italic font-sans text-slate-400 text-center py-4">
 No properties assigned to your account yet.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {properties.map((p) => (
 <div key={p.id} className="border border-slate-200 bg-white p-4 transition hover:border-slate-900 hover:shadow-md">
 <div className="flex items-center justify-between mb-4">
 <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${p.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
 {p.status}
 </span>
 {p.published ? (
 <span className="text-[10px] font-bold text-emerald-600">Published</span>
 ) : (
 <span className="text-[10px] font-bold text-slate-400">Draft</span>
 )}
 </div>
 <Link href={`/properties/${p.slug}`} target="_blank" className="block group">
 <h3 className="font-sans text-xl text-slate-900 group-hover:underline underline-offset-4 decoration-slate-300">
 {p.title}
 </h3>
 </Link>
 <p className="mt-2 text-sm text-slate-500">{p.address_line}, {p.city}, {p.postcode}</p>
 <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
 <div>
 <p className="text-2xl font-sans font-bold text-slate-900">
 {formatPricePcm(p.price_pcm)}<span className="text-sm font-sans font-normal text-slate-500"> pcm</span>
 </p>
 </div>
 <div className="flex gap-3 text-xs text-slate-500 font-medium">
 <span className="capitalize">{p.property_type}</span>
 {p.bedrooms != null && <span>{p.bedrooms} bed{p.bedrooms !== 1 ? 's' : ''}</span>}
 {p.bathrooms != null && <span>{p.bathrooms} bath{p.bathrooms !== 1 ? 's' : ''}</span>}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
