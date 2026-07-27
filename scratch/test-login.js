const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'landlord@example.com',
    password: 'password123'
  });
  if (error) {
    console.error('Login failed:', error.message);
  } else {
    console.log('Login success!', data.user.email);
  }
}
login();
