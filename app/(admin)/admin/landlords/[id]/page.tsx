import { notFound } from 'next/navigation';
import { getLandlordById } from '@/lib/queries/admin';
import Link from 'next/link';
import { formatPricePcm } from '@/lib/format';

export default async function AdminLandlordDetailsPage({
 params,
}: {
 params: Promise<{ id: string }>;
}) {
 const { id } = await params;
 const landlord = await getLandlordById(id);

 if (!landlord) {
 notFound();
 }

 return (
 <div className="space-y-8">
 <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
 <div className="flex h-16 w-16 items-center justify-center bg-slate-900 text-2xl font-sans text-white">
 {landlord.full_name?.charAt(0).toUpperCase() || 'L'}
 </div>
 <div>
 <h1 className="text-3xl font-sans text-slate-900">{landlord.full_name}</h1>
 <p className="text-sm text-slate-500">{landlord.email}</p>
 </div>
 </div>

 <div>
 <h2 className="mb-4 text-xl font-sans text-slate-900">Owned Properties</h2>
 {landlord.properties.length === 0 ? (
 <div className="border border-slate-200 bg-white">
 <p className="py-4 text-center text-lg italic text-slate-400 font-sans">
 This landlord has no properties assigned yet.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {landlord.properties.map((p: any) => (
 <div key={p.id} className="border border-slate-200 bg-white p-4 transition hover:border-slate-900 hover:shadow-md">
 <div className="mb-4 flex items-center justify-between">
 <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${p.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
 {p.status}
 </span>
 {p.published ? (
 <span className="text-[10px] font-bold text-emerald-600">Published</span>
 ) : (
 <span className="text-[10px] font-bold text-slate-400">Draft</span>
 )}
 </div>
 <Link href={`/admin/listings/${p.id}/edit`} className="group block">
 <h3 className="font-sans text-xl text-slate-900 group-hover:underline underline-offset-4 decoration-slate-300">
 {p.title}
 </h3>
 </Link>
 <p className="mt-2 text-sm text-slate-500">{p.address_line}, {p.city}</p>
 <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
 <p className="text-2xl font-bold font-sans text-slate-900">
 {formatPricePcm(p.price_pcm)}<span className="text-sm font-sans font-normal text-slate-500"> pcm</span>
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
