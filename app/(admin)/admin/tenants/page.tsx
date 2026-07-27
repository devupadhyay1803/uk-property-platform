import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTenants } from '@/lib/queries/admin';

export const metadata: Metadata = { title: 'Manage Tenants' };
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminTenantsPage({ searchParams }: { searchParams: SearchParams }) {
 const sp = await searchParams;
 const search = typeof sp.search === 'string' ? sp.search : undefined;
 const { tenants, count } = await getAllTenants(search);
 return (
 <div className="space-y-8">
 <div className="flex items-center justify-between">
 <h1 className="font-sans text-3xl text-slate-900">Tenants ({count})</h1>
 <Link href="/admin/tenants/new" className="bg-slate-900 px-5 py-3 text-[11px] font-bold text-white transition hover:bg-slate-700">+ Add tenant</Link>
 </div>
 <form action="/admin/tenants" method="get">
 <input name="search" type="search" defaultValue={search} placeholder="SEARCH BY NAME, EMAIL, PHONE…" className="w-full max-w-md border-b border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none" />
 </form>
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50">
 <tr>
 <th className="px-4 py-3 text-[10px] font-bold text-slate-500">Name</th>
 <th className="px-4 py-3 text-[10px] font-bold text-slate-500">Email</th>
 <th className="px-4 py-3 text-[10px] font-bold text-slate-500">Property</th>
 <th className="px-4 py-3 text-[10px] font-bold text-slate-500">Status</th>
 <th className="px-4 py-3 text-[10px] font-bold text-slate-500">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {tenants.map((t) => {
 const property = (t as Record<string, unknown>).properties as { title: string; city: string } | null;
 return (
 <tr key={t.id}>
 <td className="px-4 py-3 text-sm font-medium text-slate-900">{t.full_name}</td>
 <td className="px-4 py-3 text-sm text-slate-700">{t.email ?? '—'}</td>
 <td className="px-4 py-3 text-sm text-slate-700">{property ? `${property.title} (${property.city})` : '—'}</td>
 <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-bold ${t.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : t.status === 'pending' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{t.status}</span></td>
 <td className="px-4 py-3"><Link href={`/admin/tenants/${t.id}`} className="text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 text-sm">View</Link></td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 );
}
