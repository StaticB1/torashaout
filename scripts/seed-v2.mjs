// Database seeding script for ToraShaout - Version 2 (schema-corrected)
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🌱 Starting database seeding (v2)...\n')

async function updateUserRole(userId, email, role) {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)

  if (error) {
    console.error(`   ❌ Error updating role for ${email}:`, error.message)
    return false
  }
  return true
}

async function seedTalentProfiles() {
  console.log('⭐ Seeding talent profiles...\n')

  // Get existing users
  const { data: users } = await supabase
    .from('users')
    .select('id, email')

  if (!users || users.length === 0) {
    console.log('   ❌ No users found. Please create users first.\n')
    return
  }

  const userMap = {}
  users.forEach(u => { userMap[u.email] = u.id })

  // Update roles for talent users
  const talentUsers = [
    { email: 'winky.d@torashaout.com', role: 'talent' },
    { email: 'jah.prayzah@torashaout.com', role: 'talent' },
    { email: 'comic.pastor@torashaout.com', role: 'talent' },
    { email: 'takura@torashaout.com', role: 'talent' }
  ]

  for (const tu of talentUsers) {
    if (userMap[tu.email]) {
      await updateUserRole(userMap[tu.email], tu.email, tu.role)
      console.log(`   ✅ Updated ${tu.email} to role: ${tu.role}`)
    }
  }

  // Update admin role
  if (userMap['admin@torashaout.com']) {
    await updateUserRole(userMap['admin@torashaout.com'], 'admin@torashaout.com', 'admin')
    console.log(`   ✅ Updated admin@torashaout.com to role: admin`)
  }

  if (userMap['bsiwonde@torashaout.com']) {
    await updateUserRole(userMap['bsiwonde@torashaout.com'], 'bsiwonde@torashaout.com', 'admin')
    console.log(`   ✅ Updated bsiwonde@torashaout.com to role: admin\n`)
  }

  // Talent profiles (matching actual schema)
  const profiles = [
    {
      user_id: userMap['winky.d@torashaout.com'],
      display_name: 'Winky D',
      bio: 'The Zimdancehall King. Multi-award winning artist bringing authentic Zimbabwean music to the world.',
      category: 'musician',
      price_usd: 150,
      price_zig: 7500,
      response_time_hours: 48,
      thumbnail_url: 'https://placehold.co/400x400/8B5CF6/white?text=Winky+D',
      admin_verified: true,
      is_accepting_bookings: true,
      total_bookings: 127,
      average_rating: 4.9
    },
    {
      user_id: userMap['jah.prayzah@torashaout.com'],
      display_name: 'Jah Prayzah',
      bio: 'Contemporary Musician. Award-winning artist known for soulful performances and meaningful lyrics.',
      category: 'musician',
      price_usd: 200,
      price_zig: 10000,
      response_time_hours: 24,
      thumbnail_url: 'https://placehold.co/400x400/8B5CF6/white?text=Jah+Prayzah',
      admin_verified: true,
      is_accepting_bookings: true,
      total_bookings: 98,
      average_rating: 4.8
    },
    {
      user_id: userMap['comic.pastor@torashaout.com'],
      display_name: 'Comic Pastor',
      bio: 'Zimbabwe\'s funniest pastor! Bringing laughter and joy through clean, family-friendly comedy.',
      category: 'comedian',
      price_usd: 75,
      price_zig: 3750,
      response_time_hours: 24,
      thumbnail_url: 'https://placehold.co/400x400/EC4899/white?text=Comic+Pastor',
      admin_verified: true,
      is_accepting_bookings: true,
      total_bookings: 156,
      average_rating: 5.0
    },
    {
      user_id: userMap['takura@torashaout.com'],
      display_name: 'Takura',
      bio: 'Hip-hop artist and producer. Creating authentic Zimbabwean hip-hop with global appeal.',
      category: 'musician',
      price_usd: 100,
      price_zig: 5000,
      response_time_hours: 72,
      thumbnail_url: 'https://placehold.co/400x400/8B5CF6/white?text=Takura',
      admin_verified: true,
      is_accepting_bookings: true,
      total_bookings: 45,
      average_rating: 4.7
    }
  ]

  let successCount = 0

  for (const profile of profiles) {
    if (!profile.user_id) continue

    // Check if profile exists
    const { data: existing } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('user_id', profile.user_id)
      .single()

    if (existing) {
      console.log(`   ⏭️  Profile for ${profile.display_name} already exists`)
      continue
    }

    const { data, error } = await supabase
      .from('talent_profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error(`   ❌ Error creating ${profile.display_name}:`, error.message)
      continue
    }

    console.log(`   ✅ Created talent profile: ${profile.display_name}`)
    successCount++
  }

  console.log(`\n   📊 Total talent profiles created: ${successCount}\n`)
  return successCount
}

async function seedBookings() {
  console.log('📋 Seeding bookings...\n')

  // Get users and talents
  const { data: users } = await supabase.from('users').select('id, email, role')
  const { data: talents } = await supabase.from('talent_profiles').select('id, user_id, display_name')

  if (!users || !talents || talents.length === 0) {
    console.log('   ❌ Need users and talents first\n')
    return
  }

  const userMap = {}
  users.forEach(u => { userMap[u.email] = u.id })

  const talentMap = {}
  talents.forEach(t => {
    const user = users.find(u => u.id === t.user_id)
    if (user) talentMap[user.email] = t.id
  })

  const fans = users.filter(u => u.role === 'fan')
  if (fans.length === 0) {
    console.log('   ⚠️  No fan users found, skipping bookings\n')
    return
  }

  // Helper to generate booking code
  const generateBookingCode = (index) => {
    const year = new Date().getFullYear()
    const code = String(index + 100001).padStart(6, '0')
    return `TRS-${year}-${code}`
  }

  const bookings = [
    {
      booking_code: generateBookingCode(0),
      customer_id: fans[0]?.id,
      talent_id: talentMap['winky.d@torashaout.com'],
      recipient_name: 'Tatenda Moyo',
      occasion: 'Birthday',
      instructions: 'Please wish him a happy 25th birthday and mention his love for Zimdancehall!',
      status: 'completed',
      currency: 'USD',
      amount_paid: 150,
      platform_fee: 15,
      talent_earnings: 135,
      video_url: 'https://example.com/videos/winky-d-birthday.mp4',
      completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      booking_code: generateBookingCode(1),
      customer_id: fans[1]?.id || fans[0]?.id,
      talent_id: talentMap['comic.pastor@torashaout.com'],
      recipient_name: 'Sarah',
      occasion: 'Anniversary',
      instructions: 'Make a funny anniversary message for my wife!',
      status: 'completed',
      currency: 'ZIG',
      amount_paid: 3750,
      platform_fee: 375,
      talent_earnings: 3375,
      video_url: 'https://example.com/videos/comic-pastor-anniversary.mp4',
      completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      booking_code: generateBookingCode(2),
      customer_id: fans[0]?.id,
      talent_id: talentMap['jah.prayzah@torashaout.com'],
      recipient_name: 'Mike',
      occasion: 'Graduation',
      instructions: 'Congratulate my son on graduating from university!',
      status: 'in_progress',
      currency: 'USD',
      amount_paid: 200,
      platform_fee: 20,
      talent_earnings: 180
    },
    {
      booking_code: generateBookingCode(3),
      customer_id: fans[1]?.id || fans[0]?.id,
      talent_id: talentMap['takura@torashaout.com'],
      recipient_name: 'John',
      occasion: 'Birthday',
      instructions: 'Hip-hop birthday shoutout for my friend!',
      status: 'payment_confirmed',
      currency: 'USD',
      amount_paid: 100,
      platform_fee: 10,
      talent_earnings: 90
    }
  ]

  let successCount = 0

  for (const booking of bookings) {
    if (!booking.customer_id || !booking.talent_id) continue

    const { error } = await supabase
      .from('bookings')
      .insert(booking)

    if (error) {
      console.error(`   ❌ Error creating booking:`, error.message)
      continue
    }

    successCount++
    console.log(`   ✅ Created booking: ${booking.occasion} for ${booking.recipient_name}`)
  }

  console.log(`\n   📊 Total bookings created: ${successCount}\n`)
}

async function seedNotifications() {
  console.log('🔔 Seeding notifications...\n')

  const { data: users } = await supabase.from('users').select('id, email, role')

  if (!users || users.length === 0) {
    console.log('   ❌ No users found\n')
    return
  }

  const userMap = {}
  users.forEach(u => { userMap[u.email] = u.id })

  const notifications = [
    {
      user_id: userMap['winky.d@torashaout.com'],
      type: 'booking_request',
      title: 'New Booking Request',
      message: 'You have a new video request from John Moyo',
      is_read: false
    },
    {
      user_id: userMap['jah.prayzah@torashaout.com'],
      type: 'payment_received',
      title: 'Payment Received',
      message: 'You earned $180 from a completed video',
      is_read: false
    },
    {
      user_id: userMap['fan1@example.com'],
      type: 'video_ready',
      title: 'Your Video is Ready!',
      message: 'Winky D has completed your video request',
      action_url: '/customer-dashboard',
      is_read: false
    },
    {
      user_id: userMap['admin@torashaout.com'],
      type: 'talent_applied',
      title: 'New Talent Application',
      message: 'A new celebrity has applied to join the platform',
      action_url: '/admin',
      is_read: false
    }
  ]

  let successCount = 0

  for (const notification of notifications) {
    if (!notification.user_id) continue

    const { error } = await supabase
      .from('notifications')
      .insert(notification)

    if (error) {
      console.error(`   ❌ Error creating notification:`, error.message)
      continue
    }

    successCount++
    console.log(`   ✅ Created notification: ${notification.title}`)
  }

  console.log(`\n   📊 Total notifications created: ${successCount}\n`)
}

async function main() {
  try {
    await seedTalentProfiles()
    await seedBookings()
    await seedNotifications()

    console.log('✅ Database seeding completed!\n')
    console.log('📝 Test Credentials:')
    console.log('   Admin:  admin@torashaout.com (check Supabase for password)')
    console.log('   Talent: winky.d@torashaout.com')
    console.log('   Fan:    fan1@example.com\n')

  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

main()
