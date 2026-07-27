const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const { data, error } = await supabase
    .from('tenant_records')
    .select('*, properties(title, landlord_id, profiles!properties_landlord_id_fkey(full_name, email, phone))')
    .limit(1)
    .maybeSingle();

  console.log(JSON.stringify(data, null, 2));
}

run();
