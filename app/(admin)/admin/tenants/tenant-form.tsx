'use client';

import { useActionState } from 'react';
import { createTenant, updateTenant } from './actions';
import type { TenantRecord } from '@/types/database';

const field = 'w-full border-b border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none';
const labelCls = 'mb-2 block text-[10px] font-bold text-slate-500';

type PropertyOption = { id: string; title: string; city: string };

export function TenantForm({ tenant, properties }: { tenant?: TenantRecord; properties: PropertyOption[] }) {
 const action = tenant ? updateTenant : createTenant;
 const [state, formAction, pending] = useActionState(action, { ok: false, error: '' });
 return (
 <form action={formAction} className="space-y-6 border border-slate-200 bg-white p-5">
 {tenant && <input type="hidden" name="id" value={tenant.id} />}
 <div>
 <label htmlFor="tenant-name" className={labelCls}>Full name *</label>
 <input id="tenant-name" name="full_name" defaultValue={tenant?.full_name ?? ''} className={field} required />
 </div>
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
 <div>
 <label htmlFor="tenant-email" className={labelCls}>Email</label>
 <input id="tenant-email" name="email" type="email" defaultValue={tenant?.email ?? ''} className={field} />
 </div>
 <div>
 <label htmlFor="tenant-phone" className={labelCls}>Phone</label>
 <input id="tenant-phone" name="phone" defaultValue={tenant?.phone ?? ''} className={field} />
 </div>
 </div>
 <div>
 <label htmlFor="tenant-property" className={labelCls}>Property</label>
 <select id="tenant-property" name="property_id" defaultValue={tenant?.property_id ?? ''} className={field}>
 <option value="">No property</option>
 {properties.map(p => <option key={p.id} value={p.id}>{p.title} ({p.city})</option>)}
 </select>
 </div>
 <div>
 <label htmlFor="tenant-status" className={labelCls}>Status</label>
 <select id="tenant-status" name="status" defaultValue={tenant?.status ?? 'pending'} className={field}>
 <option value="pending">Pending</option>
 <option value="active">Active</option>
 <option value="past">Past</option>
 </select>
 </div>
 {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
 <button type="submit" disabled={pending} className="w-full bg-slate-900 px-5 py-3 text-[11px] font-bold text-white hover:bg-slate-700 disabled:opacity-60 transition">
 {pending ? 'Saving…' : (tenant ? 'Update tenant' : 'Add tenant')}
 </button>
 </form>
 );
}
