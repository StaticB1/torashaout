// Test Supabase connection
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('URL:', supabaseUrl?.substring(0, 30) + '...')
console.log('Has Key:', !!supabaseKey, '\n')

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env.local\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Check tables
    console.log('📊 Checking database tables...\n')
    const tables = ['users', 'talent_profiles', 'bookings', 'payments', 'favorites', 'categories', 'notifications']

    const tableStatus = {}

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)

      if (error) {
        console.log(`❌ ${table.padEnd(20)} Not found - ${error.code}`)
        tableStatus[table] = false
      } else {
        console.log(`✅ ${table.padEnd(20)} Exists`)
        tableStatus[table] = true
      }
    }

    const tablesExist = Object.values(tableStatus).some(v => v === true)

    if (!tablesExist) {
      console.log('\n⚠️  No tables found in database!')
      console.log('👉 You need to run the SQL migrations from docs/SUPABASE_SETUP.md')
      console.log('👉 Go to: https://supabase.com/dashboard → SQL Editor → Run migrations\n')
      return { setup: false, message: 'No tables created' }
    }

    // Test 2: Check data counts
    console.log('\n📈 Data counts...\n')

    if (tableStatus.users) {
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      console.log(`   Users:        ${usersCount || 0}`)
    }

    if (tableStatus.talent_profiles) {
      const { count: talentsCount } = await supabase
        .from('talent_profiles')
        .select('*', { count: 'exact', head: true })
      console.log(`   Talents:      ${talentsCount || 0}`)
    }

    if (tableStatus.bookings) {
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
      console.log(`   Bookings:     ${bookingsCount || 0}`)
    }

    if (tableStatus.categories) {
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
      console.log(`   Categories:   ${categoriesCount || 0}`)
    }

    console.log('\n✅ Database connection successful!\n')
    return { setup: true, tableStatus }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    return { setup: false, error: error.message }
  }
}

testConnection().then(result => {
  if (!result.setup) {
    process.exit(1)
  }
})
