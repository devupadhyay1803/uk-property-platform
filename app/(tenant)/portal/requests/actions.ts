'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface RequestState { ok: boolean; error?: string; }

export async function createServiceRequest(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not authenticated.' };
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim() || null;
  if (!title || !description) return { ok: false, error: 'Title and description are required.' };
  const { error } = await supabase.from('service_requests').insert({ created_by: user.id, title, description, category });
  if (error) return { ok: false, error: 'Something went wrong. Please try again.' };
  revalidatePath('/portal/requests');
  return { ok: true };
}
