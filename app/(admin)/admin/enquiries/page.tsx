import type { Metadata } from 'next';
import { getAllEnquiries } from '@/lib/queries/admin';
import { updateEnquiryStatus } from '../tenants/actions';

export const metadata: Metadata = { title: 'Manage Enquiries' };
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: SearchParams }) {
 const sp = await searchParams;
 const statusFilter = typeof sp.status === 'string' ? sp.status : undefined;
 const enquiries = await getAllEnquiries(statusFilter);

 return (
 <div className="space-y-6">
 <h1 className="text-3xl font-sans text-slate-900">Enquiries ({enquiries.length})</h1>
 <div className="flex gap-2">
 {(['', 'new', 'contacted', 'closed'] as const).map((s) => (
 <a key={s} href={s ? `/admin/enquiries?status=${s}` : '/admin/enquiries'} className={`transition ${
 (statusFilter ?? '') === s 
 ? 'bg-slate-900 text-white px-3 py-1.5 text-[10px] font-bold ' 
 : 'border border-slate-300 text-slate-500 px-3 py-1.5 text-[10px] font-bold hover:border-slate-900 hover:text-slate-900'
 }`}>
 {s || 'All'}
 </a>
 ))}
 </div>
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-4 py-3">Name</th>
 <th className="px-4 py-3">Email</th>
 <th className="px-4 py-3">Property</th>
 <th className="px-4 py-3">Message</th>
 <th className="px-4 py-3">Status</th>
 <th className="px-4 py-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {enquiries.map((e) => {
 const property = (e as Record<string, unknown>).properties as { title: string; slug: string } | null;
 return (
 <tr key={e.id}>
 <td className="px-4 py-3 text-sm font-medium text-slate-900">{e.name}</td>
 <td className="px-4 py-3 text-sm text-slate-700">{e.email}</td>
 <td className="px-4 py-3 text-sm text-slate-700">{property?.title ?? '—'}</td>
 <td className="max-w-xs truncate px-4 py-3 text-sm text-slate-700">{e.message}</td>
 <td className="px-4 py-3">
 <form className="flex gap-1">
 {(['new', 'contacted', 'closed'] as const).map((s) => {
 const isActive = e.status === s;
 let btnClass = 'px-2 py-0.5 text-[10px] font-bold transition ';
 if (isActive) {
 if (s === 'new') btnClass += 'bg-blue-50 text-blue-700 border border-blue-200';
 else if (s === 'contacted') btnClass += 'bg-amber-50 text-amber-700 border border-amber-200';
 else btnClass += 'bg-slate-100 text-slate-600 border border-slate-200';
 } else {
 btnClass += 'border border-slate-200 bg-transparent text-slate-400 hover:border-slate-400 hover:text-slate-600';
 }
 return (
 <button key={s} formAction={updateEnquiryStatus.bind(null, e.id, s)} className={btnClass}>
 {s}
 </button>
 );
 })}
 </form>
 </td>
 <td className="px-4 py-3 text-sm text-slate-700">{new Date(e.created_at).toLocaleDateString('en-GB')}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 );
}
