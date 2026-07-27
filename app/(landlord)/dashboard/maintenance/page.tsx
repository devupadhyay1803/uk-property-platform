import type { Metadata } from 'next';
import { getLandlordServiceRequests } from '@/lib/queries/landlord';
import { StatusUpdater } from './status-updater';

export const metadata: Metadata = { title: 'Maintenance | Landlord Portal' };

export default async function LandlordMaintenancePage() {
 const requests = await getLandlordServiceRequests();

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between border-b border-slate-200 pb-6">
 <h1 className="text-3xl font-sans text-slate-900">Maintenance Requests</h1>
 </div>

 {requests.length === 0 ? (
 <div className="border border-slate-200 bg-white p-4 text-center">
 <p className="text-lg italic font-sans text-slate-400">
 No maintenance requests from your tenants yet.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-6 py-3">Property & Tenant</th>
 <th className="px-6 py-3">Issue</th>
 <th className="px-6 py-3">Reported On</th>
 <th className="px-6 py-3 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {requests.map((req) => {
 const date = new Date(req.created_at).toLocaleDateString('en-GB');
 const property = req.properties as any;
 const tenant = req.tenant_records as any;

 return (
 <tr key={req.id} className="hover:bg-slate-50 transition">
 <td className="px-6 py-4">
 <p className="font-sans font-bold text-slate-900">{property?.title}</p>
 <p className="text-xs text-slate-500 mt-1">{tenant?.full_name} {tenant?.phone ? `(${tenant.phone})` : ''}</p>
 </td>
 <td className="px-6 py-4">
 <span className="text-[10px] font-bold text-slate-400 block mb-1">{req.category || 'General'}</span>
 <p className="font-sans text-base text-slate-900 capitalize">{req.title}</p>
 <p className="mt-1 text-sm text-slate-500 line-clamp-1 first-letter:uppercase">{req.description}</p>
 </td>
 <td className="px-6 py-4 text-sm text-slate-500">
 {date}
 </td>
 <td className="px-6 py-4 text-right">
 <StatusUpdater id={req.id} initialStatus={req.status} />
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
