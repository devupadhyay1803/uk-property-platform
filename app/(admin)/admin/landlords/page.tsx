import type { Metadata } from 'next';
import { getLandlordsWithStats } from '@/lib/queries/admin';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Landlords' };

export default async function AdminLandlordsPage() {
 const landlords = await getLandlordsWithStats();

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h1 className="text-3xl font-sans text-slate-900">Landlords</h1>
 <Link 
 href="/admin/landlords/new" 
 className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
 >
 Add Landlord
 </Link>
 </div>

 {landlords.length === 0 ? (
 <div className="border border-slate-200 bg-white">
 <p className="text-lg italic font-sans text-slate-400 text-center py-4">
 No landlords registered yet.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-4 py-3">Landlord Name</th>
 <th className="px-4 py-3">Contact</th>
 <th className="px-4 py-3">Total Properties</th>
 <th className="px-4 py-3">Available</th>
 <th className="px-4 py-3">Let</th>
 <th className="px-4 py-3 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {landlords.map((landlord) => (
 <tr key={landlord.id} className="hover:bg-slate-50 transition group">
 <td className="px-4 py-3 text-sm font-medium text-slate-900">
 {landlord.full_name || '—'}
 </td>
 <td className="px-4 py-3 text-sm text-slate-500">
 <a href={`mailto:${landlord.email}`} className="hover:text-slate-900 hover:underline">
 {landlord.email}
 </a>
 </td>
 <td className="px-4 py-3 text-sm font-sans font-bold text-slate-900">
 {landlord.totalProperties}
 </td>
 <td className="px-4 py-3">
 <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
 {landlord.availableCount} Available
 </span>
 </td>
 <td className="px-4 py-3">
 <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
 {landlord.letCount} Let
 </span>
 </td>
 <td className="px-4 py-3 text-right">
 <Link 
 href={`/admin/landlords/${landlord.id}`}
 className="inline-flex items-center justify-center px-3 py-1.5 text-[10px] font-bold bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition"
 >
 View details &rarr;
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
}
