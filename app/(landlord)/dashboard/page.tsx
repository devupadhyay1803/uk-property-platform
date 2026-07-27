import type { Metadata } from 'next';
import Link from 'next/link';
import { getMyDashboardStats, getMyEnquiries } from '@/lib/queries/landlord';
import { Building2, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };

function StatCard({
 label,
 value,
 detail,
 href,
 icon: Icon,
}: {
 label: string;
 value: number;
 detail?: string;
 href: string;
 icon: React.ElementType;
}) {
 return (
 <Link
 href={href}
 className="group bg-white border border-slate-200 p-4 transition hover:border-slate-900 hover:shadow-md"
 >
 <div className="flex items-start justify-between mb-3">
 <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition">
 {label}
 </p>
 <Icon className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition" />
 </div>
 <p className="text-4xl font-sans font-bold text-slate-900">{value}</p>
 {detail && <p className="mt-1 text-xs text-slate-400">{detail}</p>}
 <div className="mt-4 flex items-center">
 <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition">
 View details <ArrowRight className="h-3 w-3" />
 </span>
 </div>
 </Link>
 );
}

export default async function LandlordDashboardPage() {
 const stats = await getMyDashboardStats();
 const recentEnquiries = (await getMyEnquiries()).slice(0, 5);

 return (
 <div className="space-y-8">
 <h1 className="text-3xl font-sans text-slate-900">Dashboard</h1>
 
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <StatCard 
 label="Properties" 
 value={stats.totalProperties} 
 detail={`${stats.availableCount} available, ${stats.letCount} let`} 
 href="/dashboard/properties"
 icon={Building2}
 />
 <StatCard 
 label="Enquiries" 
 value={stats.totalEnquiries} 
 detail={`${stats.newEnquiries} new`} 
 href="/dashboard/enquiries"
 icon={Mail}
 />
 </div>

 <section>
 <div className="mb-4 flex items-center justify-between">
 <h2 className="text-xl font-sans text-slate-900">Recent Enquiries</h2>
 <Link 
 href="/dashboard/enquiries" 
 className="text-[11px] font-bold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900"
 >
 View all &rarr;
 </Link>
 </div>
 {recentEnquiries.length === 0 ? (
 <div className="border border-slate-200 bg-white">
 <p className="text-lg italic font-sans text-slate-400 text-center py-4">
 No enquiries yet.
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-4 py-3">Name</th>
 <th className="px-4 py-3">Property</th>
 <th className="px-4 py-3">Message</th>
 <th className="px-4 py-3">Status</th>
 <th className="px-4 py-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {recentEnquiries.map((e) => {
 const property = (e as Record<string, unknown>).properties as { title: string, slug: string } | null;
 return (
 <tr key={e.id} className="hover:bg-slate-50 transition">
 <td className="px-4 py-3 text-sm font-medium text-slate-900">
 {e.name}
 </td>
 <td className="px-4 py-3 text-sm text-slate-700">
 {property ? (
 <Link
 href={`/properties/${property.slug}`}
 className="underline underline-offset-2 decoration-slate-300 hover:decoration-slate-900"
 target="_blank"
 >
 {property.title}
 </Link>
 ) : (
 '—'
 )}
 </td>
 <td className="max-w-[250px] truncate px-4 py-3 text-sm text-slate-500">
 {e.message || '—'}
 </td>
 <td className="px-4 py-3">
 <span
 className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
 e.status === 'new'
 ? 'bg-blue-50 text-blue-700 border border-blue-200'
 : e.status === 'contacted'
 ? 'bg-amber-50 text-amber-700 border border-amber-200'
 : 'bg-slate-100 text-slate-600 border border-slate-200'
 }`}
 >
 {e.status}
 </span>
 </td>
 <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
 {new Date(e.created_at).toLocaleDateString('en-GB')}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}
 </section>
 </div>
 );
}
