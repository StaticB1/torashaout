// Quick test script to check talent profiles
// Run with: node test-talent-query.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  console.log('Testing talent profiles query...\n');

  // Query 1: Get all talent profiles (no filter)
  console.log('1. All talent profiles:');
  const { data: allTalents, error: error1 } = await supabase
    .from('talent_profiles')
    .select('id, display_name, admin_verified, is_accepting_bookings');

  if (error1) {
    console.error('Error:', error1);
  } else {
    console.log(`Found ${allTalents?.length || 0} total talent profiles`);
    console.table(allTalents);
  }

  console.log('\n2. Admin verified talents only:');
  const { data: verifiedTalents, error: error2 } = await supabase
    .from('talent_profiles')
    .select('id, display_name, admin_verified, is_accepting_bookings')
    .eq('admin_verified', true);

  if (error2) {
    console.error('Error:', error2);
  } else {
    console.log(`Found ${verifiedTalents?.length || 0} verified talents`);
    console.table(verifiedTalents);
  }

  console.log('\n3. Full query with users join:');
  const { data: fullQuery, error: error3 } = await supabase
    .from('talent_profiles')
    .select(`
      *,
      users:user_id (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('admin_verified', true);

  if (error3) {
    console.error('Error:', error3);
    console.error('Error details:', JSON.stringify(error3, null, 2));
  } else {
    console.log(`Found ${fullQuery?.length || 0} talents with full data`);
    console.log(JSON.stringify(fullQuery, null, 2));
  }
}

testQuery().catch(console.error);
