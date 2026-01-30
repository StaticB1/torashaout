// Apply RLS fix for users table
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('Applying RLS fix for users table...\n');

  const sql = fs.readFileSync('supabase/migrations/20260123_allow_public_user_reads.sql', 'utf8');

  const { data, error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error('Error applying migration:');
    console.error(error);
    console.log('\n📋 Please apply this SQL manually in your Supabase SQL Editor:');
    console.log('----------------------------------------');
    console.log(sql);
    console.log('----------------------------------------');
    process.exit(1);
  }

  console.log('✅ Migration applied successfully!');
  console.log('You can now refresh the browse page to see your talents.');
}

applyMigration().catch(err => {
  console.error('Error:', err.message);
  console.log('\n📋 Please apply this SQL manually in your Supabase SQL Editor:');
  console.log('Go to: https://supabase.com/dashboard → Your Project → SQL Editor');
  console.log('Then run this SQL:');
  console.log('----------------------------------------');
  const sql = fs.readFileSync('supabase/migrations/20260123_allow_public_user_reads.sql', 'utf8');
  console.log(sql);
  console.log('----------------------------------------');
});
