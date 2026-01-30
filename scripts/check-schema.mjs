// Check actual database schema
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  console.log('🔍 Checking database schema...\n')

  // Check talent_profiles columns
  const { data: talents, error: talentError } = await supabase
    .from('talent_profiles')
    .select('*')
    .limit(1)

  console.log('talent_profiles columns:')
  if (talents && talents.length > 0) {
    console.log(Object.keys(talents[0]))
  } else {
    console.log('No data - fetching schema differently')
  }

  // Check bookings columns
  const { data: bookings, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .limit(1)

  console.log('\nbookings columns:')
  if (bookings && bookings.length > 0) {
    console.log(Object.keys(bookings[0]))
  } else {
    console.log('No data yet')
  }

  // Check notifications columns
  const { data: notifications, error: notifError } = await supabase
    .from('notifications')
    .select('*')
    .limit(1)

  console.log('\nnotifications columns:')
  if (notifications && notifications.length > 0) {
    console.log(Object.keys(notifications[0]))
  } else {
    console.log('No data yet')
  }

  // Check users
  const { data: users } = await supabase
    .from('users')
    .select('id, email, role')
    .limit(5)

  console.log('\n📊 Existing users:')
  if (users) {
    users.forEach(u => console.log(`   - ${u.email} (${u.role})`))
  }
}

checkSchema()
