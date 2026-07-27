import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenantById, getAllPropertiesForSelect } from '@/lib/queries/admin';
import { TenantForm } from '../tenant-form';
import { CommLogForm } from './comm-log-form';

export const metadata: Metadata = { title: 'Tenant Detail' };
type Params = Promise<{ id: string }>;

export default async function TenantDetailPage({ params }: { params: Params }) {
 const { id } = await params;
 const [tenant, properties] = await Promise.all([getTenantById(id), getAllPropertiesForSelect()]);
 if (!tenant) notFound();
 const logs = ((tenant as Record<string, unknown>).communication_log ?? []) as Array<{ id: string; note: string; created_at: string; profiles: { full_name: string } | null }>;

 return (
 <div className="mx-auto max-w-2xl space-y-8">
 <div className="flex items-center justify-between">
 <h1 className="font-sans text-3xl text-slate-900">{tenant.full_name}</h1>
 <Link href="/admin/tenants" className="text-[11px] text-slate-400 hover:text-slate-900">← Back</Link>
 </div>
 <TenantForm tenant={tenant} properties={properties} />
 <section className="mt-12 space-y-6">
 <h2 className="text-xl font-sans text-slate-900">Communication log</h2>
 <CommLogForm tenantRecordId={tenant.id} />
 <div className="space-y-4">
 {logs.length === 0 ? (
 <p className="text-center font-sans italic text-slate-500 py-5">No entries yet.</p>
 ) : logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((entry) => (
 <div key={entry.id} className="border border-slate-200 bg-white p-5">
 <p className="text-sm text-slate-700">{entry.note}</p>
 <p className="mt-2 text-[11px] text-slate-400">{entry.profiles?.full_name ?? 'System'} · {new Date(entry.created_at).toLocaleString('en-GB')}</p>
 </div>
 ))}
 </div>
 </section>
 </div>
 );
}
