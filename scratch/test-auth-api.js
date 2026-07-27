const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuth() {
  console.log('Testing login with admin@gmail.com / password123...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: 'password123',
  });
  
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS! Logged in as:', data.user.email);
  }
}

testAuth();
