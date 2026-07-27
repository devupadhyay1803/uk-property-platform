'use client';

import { useTransition } from 'react';
import { updateServiceRequestStatus } from './actions';

export function StatusUpdater({ id, initialStatus }: { id: string; initialStatus: string }) {
 const [isPending, startTransition] = useTransition();

 const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 const newStatus = e.target.value;
 startTransition(async () => {
 await updateServiceRequestStatus(id, newStatus);
 });
 };

 return (
 <select
 disabled={isPending}
 defaultValue={initialStatus}
 onChange={handleStatusChange}
 className={`text-right text-[10px] font-bold bg-transparent border-none focus:ring-0 cursor-pointer ${
 initialStatus === 'open' ? 'text-amber-600' :
 initialStatus === 'in_progress' ? 'text-blue-600' :
 initialStatus === 'resolved' ? 'text-emerald-600' :
 'text-slate-400'
 } ${isPending ? 'opacity-50' : ''}`}
 >
 <option value="open">Open</option>
 <option value="in_progress">In Progress</option>
 <option value="resolved">Resolved</option>
 <option value="closed">Closed</option>
 </select>
 );
}
