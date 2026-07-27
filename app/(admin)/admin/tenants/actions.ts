'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTenant(_prev: { ok: boolean; error?: string }, formData: FormData) {
  const supabase = await createClient();
  const fullName = String(formData.get('full_name') ?? '').trim();
  if (!fullName) return { ok: false, error: 'Name is required.' };
  const { error } = await supabase.from('tenant_records').insert({
    full_name: fullName,
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    property_id: String(formData.get('property_id') ?? '').trim() || null,
    status: (formData.get('status') as 'active' | 'pending' | 'past') ?? 'pending',
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/tenants');
  redirect('/admin/tenants');
}

export async function updateTenant(_prev: { ok: boolean; error?: string }, formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, error: 'Missing tenant ID.' };
  const { error } = await supabase.from('tenant_records').update({
    full_name: String(formData.get('full_name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    property_id: String(formData.get('property_id') ?? '').trim() || null,
    status: (formData.get('status') as 'active' | 'pending' | 'past') ?? 'pending',
  }).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/tenants');
  redirect(`/admin/tenants/${id}`);
}

export async function addCommunicationEntry(_prev: { ok: boolean; error?: string }, formData: FormData) {
  const supabase = await createClient();
  const tenantRecordId = String(formData.get('tenant_record_id') ?? '');
  const note = String(formData.get('note') ?? '').trim();
  if (!tenantRecordId || !note) return { ok: false, error: 'Note is required.' };
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('communication_log').insert({
    tenant_record_id: tenantRecordId,
    author_id: user?.id ?? null,
    note,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/tenants/${tenantRecordId}`);
  return { ok: true };
}

export async function updateEnquiryStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from('enquiries').update({ status: status as 'new' | 'contacted' | 'closed' }).eq('id', id);
  revalidatePath('/admin/enquiries');
  revalidatePath('/admin/overview');
}
