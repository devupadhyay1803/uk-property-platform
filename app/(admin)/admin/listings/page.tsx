import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllListings } from '@/lib/queries/admin';
import { formatPricePcm } from '@/lib/format';
import { togglePublished } from './actions';

export const metadata: Metadata = { title: 'Manage Listings' };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminListingsPage({ searchParams }: { searchParams: SearchParams }) {
 const sp = await searchParams;
 const search = typeof sp.search === 'string' ? sp.search : undefined;
 const { listings, count } = await getAllListings(search);

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h1 className="text-3xl font-sans text-slate-900">Listings ({count})</h1>
 <Link href="/admin/listings/new" className="bg-slate-900 px-5 py-3 text-[11px] font-bold text-white transition hover:bg-slate-700">+ Add listing</Link>
 </div>
 <form action="/admin/listings" method="get">
 <input name="search" type="search" defaultValue={search} placeholder="Search by title, city, postcode…" className="w-full max-w-md border-b border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none" />
 </form>
 <div className="overflow-x-auto border border-slate-200 bg-white">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
 <tr>
 <th className="px-4 py-3">Title</th>
 <th className="px-4 py-3">City</th>
 <th className="px-4 py-3">Price</th>
 <th className="px-4 py-3">Status</th>
 <th className="px-4 py-3">Published</th>
 <th className="px-4 py-3">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 bg-white">
 {listings.map((listing) => (
 <tr key={listing.id}>
 <td className="px-4 py-3 text-sm font-medium text-slate-900">{listing.title}</td>
 <td className="px-4 py-3 text-sm text-slate-700">{listing.city}</td>
 <td className="px-4 py-3 text-sm text-slate-700">{formatPricePcm(listing.price_pcm)}</td>
 <td className="px-4 py-3">
 <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${listing.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
 {listing.status}
 </span>
 </td>
 <td className="px-4 py-3">
 <form action={togglePublished.bind(null, listing.id, !listing.published)}>
 <button type="submit" className={`px-2 py-0.5 text-[10px] font-bold transition ${listing.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}>
 {listing.published ? 'Published' : 'Draft'}
 </button>
 </form>
 </td>
 <td className="px-4 py-3"><Link href={`/admin/listings/${listing.id}/edit`} className="text-sm text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900">Edit</Link></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
}
