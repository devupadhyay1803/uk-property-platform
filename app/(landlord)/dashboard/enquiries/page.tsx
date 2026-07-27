import type { Metadata } from 'next';
import { getMyEnquiries } from '@/lib/queries/landlord';
import { EnquiryStatusForm } from './enquiry-status-form';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Enquiries' };

export default async function LandlordEnquiriesPage() {
 const enquiries = await getMyEnquiries();
 return (
 <div className="space-y-6">
 <h1 className="text-3xl font-sans text-slate-900">Enquiries ({enquiries.length})</h1>
 {enquiries.length === 0 ? (
 <div className="border border-slate-200 bg-white">
 <p className="text-lg italic font-sans text-slate-400 text-center py-4">
 No enquiries yet.
 </p>
 </div>
 ) : (
 <div className="space-y-4">
 {enquiries.map((e) => {
 const property = (e as Record<string, unknown>).properties as { title: string; slug: string } | null;
 return (
 <div key={e.id} className="border border-slate-200 bg-white p-4 transition hover:border-slate-900">
 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
 <div className="space-y-1">
 <p className="font-sans text-xl text-slate-900">{e.name}</p>
 <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
 <a href={`mailto:${e.email}`} className="hover:text-slate-900 hover:underline">{e.email}</a>
 {e.phone && (
 <>
 <span>&middot;</span>
 <a href={`tel:${e.phone}`} className="hover:text-slate-900 hover:underline">{e.phone}</a>
 </>
 )}
 </div>
 {property && (
 <Link 
 href={`/properties/${property.slug}`} 
 target="_blank"
 className="inline-block mt-2 text-[11px] font-bold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900"
 >
 {property.title} &rarr;
 </Link>
 )}
 </div>
 <EnquiryStatusForm enquiryId={e.id} currentStatus={e.status} />
 </div>
 <div className="mt-4 pt-4 border-t border-slate-100">
 <p className="text-sm text-slate-700 leading-relaxed">{e.message || <span className="italic text-slate-400">No message provided</span>}</p>
 <p className="mt-3 text-[10px] font-bold text-slate-400">
 Received {new Date(e.created_at).toLocaleDateString('en-GB')}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 );
}
