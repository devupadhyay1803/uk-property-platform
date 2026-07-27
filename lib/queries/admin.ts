import { createClient } from '@/lib/supabase/server';

export async function getOverviewStats() {
  const supabase = await createClient();
  const [properties, enquiries, tenants] = await Promise.all([
    supabase.from('properties').select('id, status, published', { count: 'exact' }),
    supabase.from('enquiries').select('id, status', { count: 'exact' }),
    supabase.from('tenant_records').select('id, status', { count: 'exact' }),
  ]);
  const propData = properties.data ?? [];
  const enqData = enquiries.data ?? [];
  const tenData = tenants.data ?? [];
  return {
    totalProperties: properties.count ?? 0,
    publishedCount: propData.filter(p => p.published).length,
    availableCount: propData.filter(p => p.status === 'available').length,
    letCount: propData.filter(p => p.status === 'let').length,
    totalEnquiries: enquiries.count ?? 0,
    newEnquiries: enqData.filter(e => e.status === 'new').length,
    contactedEnquiries: enqData.filter(e => e.status === 'contacted').length,
    totalTenants: tenants.count ?? 0,
    activeTenants: tenData.filter(t => t.status === 'active').length,
    pendingTenants: tenData.filter(t => t.status === 'pending').length,
  };
}

export async function getAllListings(search?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });
  if (search) {
    query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,postcode.ilike.%${search}%`);
  }
  const { data, count, error } = await query;
  if (error) console.error('getAllListings:', error.message);
  return { listings: data ?? [], count: count ?? 0 };
}

export async function getListingById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_photos(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function getAllTenants(search?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('tenant_records')
    .select('*, properties(title, city)', { count: 'exact' })
    .order('created_at', { ascending: false });
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  const { data, count, error } = await query;
  if (error) console.error('getAllTenants:', error.message);
  return { tenants: data ?? [], count: count ?? 0 };
}

export async function getTenantById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tenant_records')
    .select('*, properties(title, city, address_line, postcode), communication_log(*, profiles(full_name))')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function getAllEnquiries(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('enquiries')
    .select('*, properties(title, slug)')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status as any);
  const { data, error } = await query;
  if (error) console.error('getAllEnquiries:', error.message);
  return data ?? [];
}

export async function getRecentEnquiries(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enquiries')
    .select('*, properties(title, slug)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) console.error('getRecentEnquiries:', error.message);
  return data ?? [];
}

export async function getAllLandlords() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'landlord')
    .order('full_name');
  if (error) console.error('getAllLandlords:', error.message);
  return data ?? [];
}

export async function getAllPropertiesForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, city')
    .order('title');
  if (error) console.error('getAllPropertiesForSelect:', error.message);
  return data ?? [];
}

export async function getLandlordsWithStats() {
  const supabase = await createClient();
  const { data: landlords, error: landlordsErr } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'landlord')
    .order('full_name');
  
  if (landlordsErr || !landlords) {
    console.error('getLandlordsWithStats:', landlordsErr?.message);
    return [];
  }

  const landlordIds = landlords.map(l => l.id);
  const { data: properties, error: propsErr } = await supabase
    .from('properties')
    .select('id, status, landlord_id')
    .in('landlord_id', landlordIds);

  if (propsErr) {
    console.error('getLandlordsWithStats (props):', propsErr.message);
  }

  const allProps = properties ?? [];

  return landlords.map((landlord) => {
    const props = allProps.filter((p) => p.landlord_id === landlord.id);
    return {
      id: landlord.id,
      full_name: landlord.full_name,
      email: landlord.email,
      totalProperties: props.length,
      availableCount: props.filter((p) => p.status === 'available').length,
      letCount: props.filter((p) => p.status === 'let').length,
    };
  });
}

export async function getLandlordById(id: string) {
  const supabase = await createClient();
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (profileErr || !profile) return null;

  const { data: properties, error: propsErr } = await supabase
    .from('properties')
    .select('*, property_photos(storage_path)')
    .eq('landlord_id', id)
    .order('created_at', { ascending: false });

  return {
    ...profile,
    properties: properties ?? [],
  };
}

export async function getAllServiceRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('service_requests')
    .select('*, properties(title, address_line), tenant_records(full_name, phone), profiles(full_name, email)')
    .order('created_at', { ascending: false });
    
  if (error) console.error('getAllServiceRequests:', error.message);
  return data ?? [];
}
