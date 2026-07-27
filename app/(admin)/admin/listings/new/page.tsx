import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllLandlords } from '@/lib/queries/admin';
import { ListingForm } from '../listing-form';

export const metadata: Metadata = { title: 'Add Listing' };

export default async function NewListingPage() {
  const landlords = await getAllLandlords();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add listing</h1>
        <Link href="/admin/listings" className="text-sm text-slate-500 hover:underline">← Back</Link>
      </div>
      <ListingForm landlords={landlords} />
    </div>
  );
}
