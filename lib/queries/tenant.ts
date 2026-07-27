import { createClient } from '@/lib/supabase/server';

export async function getMyTenancy() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('tenant_records')
    .select('*, properties(title, address_line, city, postcode, status, property_type, bedrooms, bathrooms, price_pcm, landlord_id, profiles!properties_landlord_id_fkey(full_name, email, phone))')
    .eq('profile_id', user.id)
    .order('status')
    .limit(1)
    .maybeSingle();
  if (error) console.error('getMyTenancy:', error.message);
  return data;
}

export async function getMyServiceRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });
  if (error) console.error('getMyServiceRequests:', error.message);
  return data ?? [];
}
