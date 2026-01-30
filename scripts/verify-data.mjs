// Verify seeded data with service role key
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
  console.log('🔍 Verifying seeded data...\n')

  // Check users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, full_name, role')
    .order('role')

  console.log('👥 Users:')
  if (users) {
    users.forEach(u => {
      console.log(`   - ${u.email?.padEnd(35)} | ${u.role?.padEnd(10)} | ${u.full_name || 'N/A'}`)
    })
    console.log(`   Total: ${users.length}\n`)
  } else {
    console.log('   Error:', usersError?.message, '\n')
  }

  // Check talents
  const { data: talents } = await supabase
    .from('talent_profiles')
    .select('id, display_name, category, price_usd, admin_verified, total_bookings')
    .order('display_name')

  console.log('⭐ Talent Profiles:')
  if (talents) {
    talents.forEach(t => {
      const verified = t.admin_verified ? '✅' : '❌'
      console.log(`   ${verified} ${t.display_name?.padEnd(20)} | ${t.category?.padEnd(10)} | $${t.price_usd} | Bookings: ${t.total_bookings}`)
    })
    console.log(`   Total: ${talents.length}\n`)
  }

  // Check bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, booking_code, occasion, status, amount_paid, currency')
    .order('created_at', { ascending: false })

  console.log('📋 Bookings:')
  if (bookings) {
    bookings.forEach(b => {
      console.log(`   ${b.booking_code} | ${b.occasion?.padEnd(15)} | ${b.status?.padEnd(20)} | ${b.currency}${b.amount_paid}`)
    })
    console.log(`   Total: ${bookings.length}\n`)
  }

  // Check notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, title, type, is_read')
    .order('created_at', { ascending: false })

  console.log('🔔 Notifications:')
  if (notifications) {
    notifications.forEach(n => {
      const readStatus = n.is_read ? '📖' : '🆕'
      console.log(`   ${readStatus} ${n.title?.padEnd(30)} | ${n.type}`)
    })
    console.log(`   Total: ${notifications.length}\n`)
  }

  console.log('✅ Verification complete!\n')
}

verify()
