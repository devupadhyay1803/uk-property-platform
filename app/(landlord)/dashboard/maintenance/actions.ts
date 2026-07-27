'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateServiceRequestStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('service_requests')
    .update({ status: status as any })
    .eq('id', id)
    .eq('landlord_id', user.id);

  revalidatePath('/dashboard/maintenance');
}
