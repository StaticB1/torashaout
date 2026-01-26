// Check if users exist for the talent profiles
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  const talentUserIds = [
    '2bd42808-cb5e-4eb5-a189-7a96985a0d64',
    '106e009d-a94b-4248-bcfd-785ca649f632'
  ];

  console.log('Checking if users exist for talents...\n');

  for (const userId of talentUserIds) {
    console.log(`Checking user: ${userId}`);

    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(`  Error: ${error.message}`);
      console.error(`  Details:`, error);
    } else if (data) {
      console.log(`  ✓ Found: ${data.email} (${data.role})`);
    } else {
      console.log(`  ✗ User not found`);
    }
    console.log('');
  }

  // Try without filter to see if RLS is blocking
  console.log('Attempting to query users table without filter...');
  const { data: allUsers, error: allError } = await supabase
    .from('users')
    .select('id, email, role')
    .limit(5);

  if (allError) {
    console.error('Error querying users:', allError.message);
    console.error('This suggests an RLS policy is blocking reads');
  } else {
    console.log(`Successfully queried ${allUsers?.length || 0} users`);
  }
}

checkUsers().catch(console.error);
