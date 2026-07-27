'use client';

import { useActionState } from 'react';
import { createServiceRequest } from './actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = ['General', 'Plumbing', 'Electrical', 'Heating', 'Appliance', 'Security'];
const fieldCls = 'w-full border-b border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none';
const labelCls = 'mb-2 block text-[10px] font-bold text-slate-500';

export default function NewServiceRequestPage() {
 const [state, formAction, pending] = useActionState(createServiceRequest, { ok: false, error: '' });

 return (
 <div className="mx-auto max-w-2xl space-y-8">
 <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
 <Link href="/portal/requests" className="text-slate-400 hover:text-slate-900 transition">
 <ArrowLeft className="h-6 w-6" />
 </Link>
 <h1 className="text-3xl font-sans text-slate-900">Report an Issue</h1>
 </div>

 <form action={formAction} className="border border-slate-200 bg-white p-5 space-y-6 shadow-sm">
 <div>
 <label htmlFor="req-category" className={labelCls}>Category</label>
 <select id="req-category" name="category" className={fieldCls} required defaultValue="General">
 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
 </select>
 </div>
 
 <div>
 <label htmlFor="req-title" className={labelCls}>Short Title</label>
 <input id="req-title" name="title" className={fieldCls} placeholder="e.g. Leaking tap in kitchen" required />
 </div>

 <div>
 <label htmlFor="req-desc" className={labelCls}>Detailed Description</label>
 <textarea 
 id="req-desc" 
 name="description" 
 rows={5} 
 className={fieldCls} 
 placeholder="Please provide as much detail as possible..." 
 required 
 />
 </div>

 {state.error && (
 <div className="border border-red-200 bg-red-50 p-4">
 <p className="text-sm text-red-600">{state.error}</p>
 </div>
 )}

 <button 
 type="submit" 
 disabled={pending} 
 className="w-full bg-slate-900 px-5 py-3 text-[11px] font-bold text-white hover:bg-slate-700 disabled:opacity-60 transition"
 >
 {pending ? 'Submitting...' : 'Submit Request'}
 </button>
 </form>
 </div>
 );
}
