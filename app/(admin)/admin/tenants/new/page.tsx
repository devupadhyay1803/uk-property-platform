import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPropertiesForSelect } from '@/lib/queries/admin';
import { TenantForm } from '../tenant-form';

export const metadata: Metadata = { title: 'Add Tenant' };

export default async function NewTenantPage() {
 const properties = await getAllPropertiesForSelect();
 return (
 <div className="mx-auto max-w-2xl space-y-8">
 <div className="flex items-center justify-between">
 <h1 className="font-sans text-3xl text-slate-900">Add tenant</h1>
 <Link href="/admin/tenants" className="text-[11px] text-slate-400 hover:text-slate-900">← Back</Link>
 </div>
 <TenantForm properties={properties} />
 </div>
 );
}
