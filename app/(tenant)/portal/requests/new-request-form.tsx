'use client';

import { useActionState } from 'react';
import { createServiceRequest, type RequestState } from './actions';

const initial: RequestState = { ok: false };
const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

export function NewRequestForm() {
  const [state, formAction, pending] = useActionState(createServiceRequest, initial);
  if (state.ok) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
        Request submitted. We will get back to you shortly.
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div><label htmlFor="request-category" className={labelCls}>Category</label><select id="request-category" name="category" className={field}><option value="">General</option><option value="plumbing">Plumbing</option><option value="electrical">Electrical</option><option value="heating">Heating</option><option value="structural">Structural</option><option value="other">Other</option></select></div>
      <div><label htmlFor="request-title" className={labelCls}>Title *</label><input id="request-title" name="title" placeholder="Brief summary" className={field} required /></div>
      <div><label htmlFor="request-description" className={labelCls}>Description *</label><textarea id="request-description" name="description" rows={4} placeholder="Describe the issue…" className={field} required /></div>
      {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">{pending ? 'Submitting…' : 'Submit request'}</button>
    </form>
  );
}
