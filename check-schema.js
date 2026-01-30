require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkSchema() {
  console.log('🔍 Checking dev database schema...\n');

  const tables = [
    'users',
    'categories',
    'talent_profiles',
    'favorites',
    'bookings',
    'payments',
    'notifications',
    'talent_applications',
    'flagged_content'
  ];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${table}: ERROR - ${error.message}`);
    } else {
      console.log(`✅ ${table}: EXISTS (${data?.length || 0} rows)`);
    }
  }

  console.log('\n🔍 Checking for users table structure...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (!usersError && users && users.length > 0) {
    console.log('📋 Users table columns:', Object.keys(users[0]).join(', '));
  }
}

checkSchema();
