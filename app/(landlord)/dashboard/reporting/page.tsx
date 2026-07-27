import type { Metadata } from 'next';
import { getMyDashboardStats, getMyEnquiries } from '@/lib/queries/landlord';

export const metadata: Metadata = { title: 'Reporting' };

export default async function LandlordReportingPage() {
 const stats = await getMyDashboardStats();
 const enquiries = await getMyEnquiries();
 
 const byMonth: Record<string, number> = {};
 for (const e of enquiries) {
 const month = new Date(e.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });
 byMonth[month] = (byMonth[month] ?? 0) + 1;
 }
 
 const occupancyRate = stats.totalProperties > 0 ? Math.round((stats.letCount / stats.totalProperties) * 100) : 0;

 return (
 <div className="space-y-8">
 <h1 className="text-3xl font-sans text-slate-900">Reporting</h1>
 
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
 <div className="border border-slate-200 bg-white p-4">
 <p className="text-[10px] font-bold text-slate-400 mb-2">Total properties</p>
 <p className="text-4xl font-sans font-bold text-slate-900">{stats.totalProperties}</p>
 </div>
 <div className="border border-slate-200 bg-white p-4">
 <p className="text-[10px] font-bold text-slate-400 mb-2">Occupancy rate</p>
 <p className="text-4xl font-sans font-bold text-slate-900">{occupancyRate}%</p>
 <p className="mt-2 text-xs text-slate-500">{stats.letCount} let / {stats.totalProperties} total</p>
 </div>
 <div className="border border-slate-200 bg-white p-4">
 <p className="text-[10px] font-bold text-slate-400 mb-2">Total enquiries</p>
 <p className="text-4xl font-sans font-bold text-slate-900">{stats.totalEnquiries}</p>
 <p className="mt-2 text-xs text-slate-500">{stats.newEnquiries} awaiting response</p>
 </div>
 </div>

 <section>
 <h2 className="mb-4 text-xl font-sans text-slate-900">Enquiries by Month</h2>
 {Object.keys(byMonth).length === 0 ? (
 <div className="border border-slate-200 bg-white">
 <p className="text-lg italic font-sans text-slate-400 text-center py-4">
 No enquiry data yet.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-4 py-3">Month</th>
 <th className="px-4 py-3">Enquiries</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {Object.entries(byMonth).map(([month, count]) => (
 <tr key={month} className="hover:bg-slate-50 transition">
 <td className="px-4 py-3 text-sm font-medium text-slate-900">{month}</td>
 <td className="px-4 py-3 text-sm text-slate-700">{count}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </section>
 </div>
 );
}
