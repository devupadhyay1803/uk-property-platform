'use server';

import { updateMyEnquiryStatus } from '@/lib/queries/landlord';
import { revalidatePath } from 'next/cache';

export async function updateEnquiryStatusAction(id: string, status: string) {
  await updateMyEnquiryStatus(id, status);
  revalidatePath('/dashboard/enquiries');
  revalidatePath('/dashboard');
}
