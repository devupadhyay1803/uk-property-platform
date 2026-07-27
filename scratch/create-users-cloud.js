const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Creating landlord@example.com...");
  const { data: landlord, error: landlordErr } = await supabase.auth.admin.createUser({
    email: 'landlord@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'landlord', full_name: 'Test Landlord' }
  });
  if (landlordErr) console.log("Landlord error:", landlordErr.message);
  else console.log("Landlord created:", landlord.user.id);

  console.log("Creating admin@example.com...");
  const { data: admin, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'admin@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'admin', full_name: 'Platform Admin' }
  });
  if (adminErr) console.log("Admin error:", adminErr.message);
  else console.log("Admin created:", admin.user.id);
}

run();
