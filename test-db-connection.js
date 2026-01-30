// Quick test to check Supabase connection and database status
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('Supabase URL:', supabaseUrl)
console.log('Has Anon Key:', !!supabaseKey, '\n')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Check connection
    console.log('1️⃣ Testing basic connection...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (healthError) {
      console.log('❌ Connection test:', healthError.message)

      // Check if table exists
      if (healthError.code === '42P01') {
        console.log('\n⚠️  Tables not created yet!')
        console.log('👉 Run SQL migrations from docs/SUPABASE_SETUP.md\n')
        return
      }
    } else {
      console.log('✅ Connection successful!\n')
    }

    // Test 2: Check tables
    console.log('2️⃣ Checking database tables...')
    const tables = ['users', 'talent_profiles', 'bookings', 'payments', 'favorites', 'categories', 'notifications']

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)

      if (error) {
        console.log(`❌ ${table}: Not found`)
      } else {
        console.log(`✅ ${table}: Exists`)
      }
    }

    // Test 3: Check data counts
    console.log('\n3️⃣ Checking data counts...')

    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    console.log(`   Users: ${usersCount || 0}`)

    const { count: talentsCount } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })
    console.log(`   Talents: ${talentsCount || 0}`)

    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
    console.log(`   Bookings: ${bookingsCount || 0}`)

    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
    console.log(`   Categories: ${categoriesCount || 0}`)

    console.log('\n✅ Database test complete!')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
  }
}

testConnection()
