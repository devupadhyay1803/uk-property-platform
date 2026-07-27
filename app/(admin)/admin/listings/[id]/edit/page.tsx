import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListingById, getAllLandlords } from '@/lib/queries/admin';
import { ListingForm } from '../../listing-form';
import { deleteListing } from '../../actions';

export const metadata: Metadata = { title: 'Edit Listing' };

type Params = Promise<{ id: string }>;

export default async function EditListingPage({ params }: { params: Params }) {
  const { id } = await params;
  const [listing, landlords] = await Promise.all([getListingById(id), getAllLandlords()]);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit listing</h1>
        <Link href="/admin/listings" className="text-sm text-slate-500 hover:underline">← Back</Link>
      </div>
      <ListingForm listing={listing} landlords={landlords} />
      <form action={deleteListing.bind(null, listing.id)}>
        <button type="submit" className="text-sm text-red-600 hover:underline">Delete this listing</button>
      </form>
    </div>
  );
}
