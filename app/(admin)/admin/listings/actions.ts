'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(title: string, city: string): string {
  return `${title}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

export async function createListing(_prev: { ok: boolean; error?: string }, formData: FormData) {
  const supabase = await createClient();
  const title = String(formData.get('title') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  if (!title || !city) return { ok: false, error: 'Title and city are required.' };

  const { error } = await supabase.from('properties').insert({
    landlord_id: String(formData.get('landlord_id') ?? ''),
    title,
    slug: slugify(title, city),
    description: String(formData.get('description') ?? '').trim() || null,
    price_pcm: Math.round(Number(formData.get('price_pcm') || 0) * 100),
    property_type: String(formData.get('property_type') ?? 'flat'),
    bedrooms: Number(formData.get('bedrooms')) || null,
    bathrooms: Number(formData.get('bathrooms')) || null,
    address_line: String(formData.get('address_line') ?? '').trim(),
    city,
    postcode: String(formData.get('postcode') ?? '').trim(),
    status: (formData.get('status') as 'available' | 'let') ?? 'available',
    published: formData.get('published') === '1',
    meta_title: String(formData.get('meta_title') ?? '').trim() || null,
    meta_description: String(formData.get('meta_description') ?? '').trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath('/properties');
  revalidatePath('/');
  redirect('/admin/listings');
}

export async function updateListing(_prev: { ok: boolean; error?: string }, formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  if (!id || !title || !city) return { ok: false, error: 'Missing required fields.' };
  const slug = String(formData.get('slug') ?? '').trim() || slugify(title, city);

  const { error } = await supabase.from('properties').update({
    landlord_id: String(formData.get('landlord_id') ?? '').trim(),
    title, slug,
    description: String(formData.get('description') ?? '').trim() || null,
    price_pcm: Math.round(Number(formData.get('price_pcm') || 0) * 100),
    property_type: String(formData.get('property_type') ?? 'flat'),
    bedrooms: Number(formData.get('bedrooms')) || null,
    bathrooms: Number(formData.get('bathrooms')) || null,
    address_line: String(formData.get('address_line') ?? '').trim(),
    city, postcode: String(formData.get('postcode') ?? '').trim(),
    status: (formData.get('status') as 'available' | 'let') ?? 'available',
    published: formData.get('published') === '1',
    meta_title: String(formData.get('meta_title') ?? '').trim() || null,
    meta_description: String(formData.get('meta_description') ?? '').trim() || null,
  }).eq('id', id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/properties');
  revalidatePath(`/properties/${slug}`);
  revalidatePath('/');
  redirect('/admin/listings');
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from('properties').update({ published }).eq('id', id);
  revalidatePath('/admin/listings');
  revalidatePath('/properties');
  revalidatePath('/');
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  await supabase.from('properties').delete().eq('id', id);
  revalidatePath('/admin/listings');
  revalidatePath('/properties');
  revalidatePath('/');
  redirect('/admin/listings');
}
