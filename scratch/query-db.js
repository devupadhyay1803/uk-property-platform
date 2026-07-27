const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Applying RLS Policy for Tenant...");
  const { error: rlsError } = await supabase.rpc('run_sql', { query: `
    create policy "tenant reads landlord profile" on public.profiles
      for select using (
        id in (
          select p.landlord_id from public.properties p
          join public.tenant_records tr on tr.property_id = p.id
          where tr.profile_id = auth.uid()
        )
      );
  `});
  if (rlsError) console.log("RLS Apply Note:", rlsError.message);
  
  // Just try selecting users
  const { data: users } = await supabase.auth.admin.listUsers();
  const emails = users.users.map(u => ({ id: u.id, email: u.email }));
  console.log("Users:", emails);

  const { data: properties } = await supabase.from('properties').select('id, title, landlord_id');
  console.log("Properties:", properties);

  const { data: tenants } = await supabase.from('tenant_records').select('id, email, profile_id, property_id');
  console.log("Tenant Records:", tenants);
}

run();
