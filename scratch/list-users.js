const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1], keyMatch[1]);

async function run() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) console.error(error);
  else data.users.forEach(u => console.log(u.email, u.app_metadata.role));
}
run();
