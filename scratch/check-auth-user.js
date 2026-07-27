const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.auth.admin.getUserById('22222222-2222-2222-2222-222222222222');
  if (error) {
    console.error('Error fetching user 2222...:', error);
  } else {
    console.log('User 2222... exists!', data.user.email);
  }

  const { data: adminData, error: adminError } = await supabase.auth.admin.getUserById('11111111-1111-1111-1111-111111111111');
  if (adminError) {
    console.error('Error fetching admin 1111...:', adminError);
  } else {
    console.log('Admin 1111... exists!', adminData.user.email);
  }
}
check();
