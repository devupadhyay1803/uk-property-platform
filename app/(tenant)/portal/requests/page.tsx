import type { Metadata } from 'next';
import { getMyServiceRequests } from '@/lib/queries/tenant';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Maintenance Requests' };

export default async function TenantRequestsPage() {
 const requests = await getMyServiceRequests();

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between border-b border-slate-200 pb-6">
 <h1 className="text-3xl font-sans text-slate-900">Maintenance</h1>
 <Link 
 href="/portal/requests/new" 
 className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
 >
 Report Issue
 </Link>
 </div>

 {requests.length === 0 ? (
 <div className="border border-slate-200 bg-white p-4 text-center">
 <p className="text-lg italic font-sans text-slate-400">
 You have no maintenance requests.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-6 py-3">Category</th>
 <th className="px-6 py-3">Issue</th>
 <th className="px-6 py-3">Status</th>
 <th className="px-6 py-3">Reported On</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {requests.map((req) => {
 const date = new Date(req.created_at).toLocaleDateString('en-GB');
 return (
 <tr key={req.id} className="hover:bg-slate-50 transition">
 <td className="px-6 py-4">
 <span className="text-xs font-medium text-slate-500 ">{req.category || 'General'}</span>
 </td>
 <td className="px-6 py-4">
 <p className="font-sans text-base text-slate-900 capitalize">{req.title}</p>
 <p className="mt-1 text-sm text-slate-500 line-clamp-1 first-letter:uppercase">{req.description}</p>
 </td>
 <td className="px-6 py-4">
 <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
 req.status === 'open' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
 req.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
 'bg-slate-100 text-slate-600 border border-slate-200'
 }`}>
 {req.status.replace('_', ' ')}
 </span>
 </td>
 <td className="px-6 py-4 text-sm text-slate-500">
 {date}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
}
