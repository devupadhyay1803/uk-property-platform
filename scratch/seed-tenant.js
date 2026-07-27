const fs = require('fs');
const path = require('path');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'tenant2@example.com';
  let tenantId;
  const { data, error: userError } = await supabase.auth.admin.createUser({
    email: email,
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'tenant' }
  });

  if (userError) {
    if (userError.message.includes('already exists') || userError.message.includes('already been registered')) {
        console.log('User already exists, finding ID...');
        const { data: users } = await supabase.auth.admin.listUsers();
        const existing = users.users.find(u => u.email === email);
        if (existing) tenantId = existing.id;
    } else {
        console.error('Error creating user:', userError);
        return;
    }
  } else {
      tenantId = data.user.id;
  }

  if (!tenantId) {
      console.log('Failed to find or create tenant ID');
      return;
  }

  await supabase.from('profiles').update({
    role: 'tenant',
    full_name: 'Demo Tenant',
  }).eq('id', tenantId);

  const { data: props } = await supabase.from('properties').select('id, landlord_id').limit(1);
  if (props && props.length > 0) {
      const property = props[0];
      
      const { data: existingRecord } = await supabase.from('tenant_records').select('*').eq('profile_id', tenantId);
      
      if (!existingRecord || existingRecord.length === 0) {
          await supabase.from('tenant_records').insert({
             profile_id: tenantId,
             property_id: property.id,
             full_name: 'Demo Tenant',
             email: email,
             phone: '07700 900077',
             status: 'active'
          });
          console.log('Tenant record created');
      } else {
          console.log('Tenant record already exists');
      }
  }
}

run();
