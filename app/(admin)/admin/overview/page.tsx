import type { Metadata } from 'next';
import Link from 'next/link';
import { getOverviewStats, getRecentEnquiries } from '@/lib/queries/admin';
import { updateEnquiryStatus } from '../tenants/actions';
import { Building2, Users, Mail, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Overview' };

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

export default async function AdminOverviewPage() {
 const stats = await getOverviewStats();
 const recent = await getRecentEnquiries(8);

 return (
 <div className="space-y-8">
 {/* Header with quick actions */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <h1 className="text-3xl font-sans text-slate-900">Platform Overview</h1>
 <div className="flex gap-3">
 <Link
 href="/admin/listings/new"
 className="flex items-center gap-2 bg-slate-900 px-4 py-2.5 text-[11px] font-bold text-white hover:bg-slate-700 transition"
 >
 <Plus className="h-3.5 w-3.5" /> Add Listing
 </Link>
 <Link
 href="/admin/tenants/new"
 className="flex items-center gap-2 border border-slate-900 px-4 py-2.5 text-[11px] font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition"
 >
 <Plus className="h-3.5 w-3.5" /> Add Tenant
 </Link>
 </div>
 </div>

 {/* Stat cards — each links to its section */}
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <StatCard
 label="Properties"
 value={stats.totalProperties}
 detail={`${stats.publishedCount} published`}
 href="/admin/listings"
 icon={Building2}
 />
 <StatCard
 label="Available"
 value={stats.availableCount}
 detail={`${stats.letCount} let`}
 href="/admin/listings?status=available"
 icon={TrendingUp}
 />
 <StatCard
 label="Enquiries"
 value={stats.totalEnquiries}
 detail={`${stats.newEnquiries} new`}
 href="/admin/enquiries"
 icon={Mail}
 />
 <StatCard
 label="Tenants"
 value={stats.totalTenants}
 detail={`${stats.activeTenants} active, ${stats.pendingTenants} pending`}
 href="/admin/tenants"
 icon={Users}
 />
 </div>

 {/* Recent enquiries with inline actions */}
 <section>
 <div className="mb-4 flex items-center justify-between">
 <h2 className="text-xl font-sans text-slate-900">Recent Enquiries</h2>
 <Link
 href="/admin/enquiries"
 className="text-[11px] font-bold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900"
 >
 View all &rarr;
 </Link>
 </div>
 {recent.length === 0 ? (
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
 <th className="px-4 py-3">Email</th>
 <th className="px-4 py-3">Property</th>
 <th className="px-4 py-3">Message</th>
 <th className="px-4 py-3">Status</th>
 <th className="px-4 py-3">Date</th>
 <th className="px-4 py-3">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {recent.map((e) => {
 const property = (e as Record<string, unknown>).properties as {
 title: string;
 slug: string;
 } | null;
 return (
 <tr key={e.id} className="hover:bg-slate-50 transition">
 <td className="px-4 py-3 text-sm font-medium text-slate-900">
 {e.name}
 </td>
 <td className="px-4 py-3 text-sm text-slate-700">
 <a
 href={`mailto:${e.email}`}
 className="underline underline-offset-2 decoration-slate-300 hover:decoration-slate-900"
 >
 {e.email}
 </a>
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
 <td className="max-w-[200px] truncate px-4 py-3 text-sm text-slate-500">
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
 <td className="px-4 py-3">
 <form className="flex gap-1">
 {(['new', 'contacted', 'closed'] as const).map((s) => (
 <button
 key={s}
 formAction={updateEnquiryStatus.bind(null, e.id, s)}
 className={`px-2 py-0.5 text-[10px] font-bold transition ${
 e.status === s
 ? s === 'new'
 ? 'bg-blue-50 text-blue-700 border border-blue-200'
 : s === 'contacted'
 ? 'bg-amber-50 text-amber-700 border border-amber-200'
 : 'bg-slate-200 text-slate-700 border border-slate-300'
 : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-900 hover:text-slate-900'
 }`}
 >
 {s}
 </button>
 ))}
 </form>
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
