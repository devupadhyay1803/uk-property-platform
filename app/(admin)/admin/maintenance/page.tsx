import type { Metadata } from 'next';
import { getAllServiceRequests } from '@/lib/queries/admin';

export const metadata: Metadata = { title: 'Maintenance Overview | Admin' };

export default async function AdminMaintenancePage() {
 const requests = await getAllServiceRequests();

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h1 className="text-3xl font-sans text-slate-900">Platform Maintenance</h1>
 </div>

 {requests.length === 0 ? (
 <div className="border border-slate-200 bg-white">
 <p className="py-4 text-center text-lg italic font-sans text-slate-400">
 No maintenance requests across the platform.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-4 py-3">Issue</th>
 <th className="px-4 py-3">Tenant & Property</th>
 <th className="px-4 py-3">Landlord</th>
 <th className="px-4 py-3">Reported On</th>
 <th className="px-4 py-3 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {requests.map((req) => {
 const date = new Date(req.created_at).toLocaleDateString('en-GB');
 const property = req.properties as any;
 const tenant = req.tenant_records as any;
 const landlord = req.profiles as any;

 return (
 <tr key={req.id} className="hover:bg-slate-50 transition">
 <td className="px-4 py-4">
 <span className="text-[10px] font-bold text-slate-400 block mb-1">{req.category || 'General'}</span>
 <p className="font-sans text-base text-slate-900 capitalize">{req.title}</p>
 <p className="mt-1 text-sm text-slate-500 line-clamp-1 first-letter:uppercase">{req.description}</p>
 </td>
 <td className="px-4 py-4">
 <p className="font-medium text-slate-900">{tenant?.full_name}</p>
 <p className="text-xs text-slate-500">{property?.title}</p>
 </td>
 <td className="px-4 py-4 text-slate-500 text-sm">
 {landlord?.full_name || '—'}
 </td>
 <td className="px-4 py-4 text-sm text-slate-500">
 {date}
 </td>
 <td className="px-4 py-4 text-right">
 <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
 req.status === 'open' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
 req.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
 req.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
 'bg-slate-100 text-slate-600 border border-slate-200'
 }`}>
 {req.status.replace('_', ' ')}
 </span>
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
