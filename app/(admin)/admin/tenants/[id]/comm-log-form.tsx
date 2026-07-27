'use client';

import { useActionState } from 'react';
import { addCommunicationEntry } from '../actions';

export function CommLogForm({ tenantRecordId }: { tenantRecordId: string }) {
 const [state, formAction, pending] = useActionState(addCommunicationEntry, { ok: false, error: '' });
 return (
 <form action={formAction} className="flex gap-4 items-end">
 <input type="hidden" name="tenant_record_id" value={tenantRecordId} />
 <div className="flex-1">
 <input name="note" placeholder="Add a note…" className="w-full border-b border-slate-300 bg-transparent px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none" required />
 </div>
 <button type="submit" disabled={pending} className="bg-slate-900 px-5 py-2.5 text-[11px] font-bold text-white hover:bg-slate-700 disabled:opacity-60 transition">
 {pending ? 'Adding…' : 'Add'}
 </button>
 {state.error && <p className="text-sm text-red-600">{state.error}</p>}
 </form>
 );
}
