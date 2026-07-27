import { createClient } from '@/lib/supabase/server';

export async function getMyProperties() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_photos(storage_path, alt_text, sort_order)')
    .order('created_at', { ascending: false });
  if (error) console.error('getMyProperties:', error.message);
  return data ?? [];
}

export async function getMyEnquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enquiries')
    .select('*, properties(title, slug)')
    .order('created_at', { ascending: false });
  if (error) console.error('getMyEnquiries:', error.message);
  return data ?? [];
}

export async function getMyDashboardStats() {
  const supabase = await createClient();
  const [properties, enquiries] = await Promise.all([
    supabase.from('properties').select('id, status'),
    supabase.from('enquiries').select('id, status'),
  ]);
  const propData = properties.data ?? [];
  const enqData = enquiries.data ?? [];
  return {
    totalProperties: propData.length,
    availableCount: propData.filter(p => p.status === 'available').length,
    letCount: propData.filter(p => p.status === 'let').length,
    totalEnquiries: enqData.length,
    newEnquiries: enqData.filter(e => e.status === 'new').length,
  };
}

export async function getLandlordServiceRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('service_requests')
    .select('*, properties(title, address_line), tenant_records(full_name, phone)')
    .eq('landlord_id', user.id)
    .order('created_at', { ascending: false });
  if (error) console.error('getLandlordServiceRequests:', error.message);
  return data ?? [];
}

export async function updateMyEnquiryStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from('enquiries').update({ status: status as 'new' | 'contacted' | 'closed' }).eq('id', id);
}

export async function getMyTenants() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tenant_records')
    .select('*, properties(title, city)')
    .order('created_at', { ascending: false });
  if (error) console.error('getMyTenants:', error.message);
  return data ?? [];
}

