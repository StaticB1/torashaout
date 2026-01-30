// Test script to verify Supabase connection and data
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🧪 Testing Supabase Connection...\n')

  // Test 1: Fetch categories
  console.log('Test 1: Fetching categories...')
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (catError) {
    console.error('❌ Categories test failed:', catError.message)
  } else {
    console.log(`✅ Found ${categories.length} categories:`)
    categories.forEach(cat => console.log(`   - ${cat.icon} ${cat.name} (${cat.slug})`))
  }

  // Test 2: Check tables
  console.log('\nTest 2: Checking table structure...')
  const tables = ['users', 'talent_profiles', 'bookings', 'payments', 'favorites', 'categories', 'notifications']

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select('*')
      .limit(0)

    if (error) {
      console.log(`   ❌ ${table}: ${error.message}`)
    } else {
      console.log(`   ✅ ${table}: exists and accessible`)
    }
  }

  // Test 3: Check auth
  console.log('\nTest 3: Checking authentication...')
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    console.log('   ℹ️  Not logged in (expected)')
  } else if (user) {
    console.log(`   ✅ Logged in as: ${user.email}`)
  } else {
    console.log('   ℹ️  Not authenticated (expected)')
  }

  console.log('\n🎉 All tests completed!')
}

testConnection()
