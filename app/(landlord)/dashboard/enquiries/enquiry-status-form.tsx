'use client';

import { updateEnquiryStatusAction } from './actions';

export function EnquiryStatusForm({ enquiryId, currentStatus }: { enquiryId: string; currentStatus: string }) {
 return (
 <form className="flex flex-wrap gap-1">
 {(['new', 'contacted', 'closed'] as const).map((s) => (
 <button 
 key={s} 
 formAction={updateEnquiryStatusAction.bind(null, enquiryId, s)} 
 className={`px-2 py-1 text-[10px] font-bold transition ${
 currentStatus === s 
 ? (s === 'new' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
 s === 'contacted' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
 'bg-slate-200 text-slate-700 border border-slate-300') 
 : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-900 hover:text-slate-900'
 }`}
 >
 {s}
 </button>
 ))}
 </form>
 );
}
