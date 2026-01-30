require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // App uses this!

console.log('🔑 Testing with ANON key (what your app uses)...\n');

const supabase = createClient(supabaseUrl, anonKey);

async function testAnonAccess() {
  // Test 1: Categories (should be public)
  console.log('1️⃣ Testing categories (should be public)...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');

  if (catError) {
    console.log(`   ❌ ERROR: ${catError.message}`);
  } else {
    console.log(`   ✅ SUCCESS: ${categories?.length || 0} categories`);
  }

  // Test 2: Users (might need auth)
  console.log('\n2️⃣ Testing users...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*');

  if (usersError) {
    console.log(`   ❌ ERROR: ${usersError.message}`);
  } else {
    console.log(`   ✅ SUCCESS: ${users?.length || 0} users`);
  }

  // Test 3: Talent profiles
  console.log('\n3️⃣ Testing talent_profiles...');
  const { data: talents, error: talentsError } = await supabase
    .from('talent_profiles')
    .select('*');

  if (talentsError) {
    console.log(`   ❌ ERROR: ${talentsError.message}`);
  } else {
    console.log(`   ✅ SUCCESS: ${talents?.length || 0} talents`);
  }

  // Test 4: Auth sign in
  console.log('\n4️⃣ Testing authentication...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'testpassword'
  });

  if (authError) {
    console.log(`   ❌ ERROR: ${authError.message}`);
  } else {
    console.log(`   ✅ SUCCESS: Logged in as ${authData.user?.email}`);
  }
}

testAnonAccess();
