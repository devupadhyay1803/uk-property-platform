const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: tenancy } = await supabase
    .from('tenant_records')
    .select('id, profile_id, property_id, properties(landlord_id)')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (!tenancy) {
    console.log("no tenant record"); return;
  }
  
  const tenantUserId = tenancy.profile_id;

  const landlord_id = tenancy?.properties?.landlord_id;

  const { data, error } = await supabase.from('service_requests').insert({
    created_by: tenantUserId,
    tenant_record_id: tenancy?.id ?? null,
    property_id: tenancy?.property_id ?? null,
    landlord_id: landlord_id ?? null,
    title: 'Test Issue',
    description: 'This is a test issue from the script',
    category: 'General',
    status: 'open',
  }).select();

  if (error) console.log("Error inserting:", error);
  else console.log("Inserted:", data);
}

run();
