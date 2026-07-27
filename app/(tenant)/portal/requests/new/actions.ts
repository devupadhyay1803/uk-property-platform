'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createServiceRequest(_prev: { ok: boolean; error?: string }, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not authenticated.' };

  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim() || null;

  if (!title || !description) return { ok: false, error: 'Title and description are required.' };

  // Get tenant record to link the property and landlord
  const { data: tenancy } = await supabase
    .from('tenant_records')
    .select('id, property_id, properties(landlord_id)')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const landlord_id = (tenancy?.properties as any)?.landlord_id;

  const { error } = await supabase.from('service_requests').insert({
    created_by: user.id,
    tenant_record_id: tenancy?.id ?? null,
    property_id: tenancy?.property_id ?? null,
    landlord_id: landlord_id ?? null,
    title,
    description,
    category,
    status: 'open',
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath('/portal/requests');
  redirect('/portal/requests');
}
