// Database seeding script for ToraShaout
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env.local\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🌱 Starting database seeding...\n')

// Seed data
const categories = [
  { id: 'musician', name: 'Musician', description: 'Music artists, singers, and performers', icon: '🎵' },
  { id: 'comedian', name: 'Comedian', description: 'Stand-up comedians and entertainers', icon: '😂' },
  { id: 'gospel', name: 'Gospel', description: 'Gospel artists and ministers', icon: '🙏' },
  { id: 'business', name: 'Business', description: 'Business leaders and entrepreneurs', icon: '💼' },
  { id: 'sports', name: 'Sports', description: 'Athletes and sports personalities', icon: '⚽' },
  { id: 'influencer', name: 'Influencer', description: 'Social media influencers and content creators', icon: '📱' },
  { id: 'other', name: 'Other', description: 'Other celebrities and public figures', icon: '⭐' }
]

const testUsers = [
  // Admin user
  {
    email: 'admin@torashaout.com',
    password: 'Admin123!@#',
    full_name: 'Admin User',
    role: 'admin',
    preferred_currency: 'USD',
    region: 'zimbabwe'
  },
  // Talent users
  {
    email: 'winky.d@torashaout.com',
    password: 'Talent123!',
    full_name: 'Winky D',
    role: 'talent',
    preferred_currency: 'USD',
    region: 'zimbabwe'
  },
  {
    email: 'jah.prayzah@torashaout.com',
    password: 'Talent123!',
    full_name: 'Jah Prayzah',
    role: 'talent',
    preferred_currency: 'ZIG',
    region: 'zimbabwe'
  },
  {
    email: 'comic.pastor@torashaout.com',
    password: 'Talent123!',
    full_name: 'Comic Pastor',
    role: 'talent',
    preferred_currency: 'USD',
    region: 'zimbabwe'
  },
  {
    email: 'takura@torashaout.com',
    password: 'Talent123!',
    full_name: 'Takura',
    role: 'talent',
    preferred_currency: 'USD',
    region: 'zimbabwe'
  },
  // Fan users
  {
    email: 'fan1@example.com',
    password: 'Fan123!',
    full_name: 'John Moyo',
    role: 'fan',
    preferred_currency: 'USD',
    region: 'zimbabwe'
  },
  {
    email: 'fan2@example.com',
    password: 'Fan123!',
    full_name: 'Sarah Ncube',
    role: 'fan',
    preferred_currency: 'ZIG',
    region: 'diaspora'
  },
  {
    email: 'fan3@example.com',
    password: 'Fan123!',
    full_name: 'Mike Chikwanha',
    role: 'fan',
    preferred_currency: 'USD',
    region: 'diaspora'
  }
]

const talentProfiles = [
  {
    display_name: 'Winky D',
    bio: 'The Zimdancehall King. Multi-award winning artist bringing authentic Zimbabwean music to the world.',
    category: 'musician',
    price_usd: 150,
    price_zig: 7500,
    response_time_hours: 48,
    thumbnail_url: 'https://placehold.co/400x400/8B5CF6/white?text=Winky+D',
    verified: true,
    active: true,
    rating: 4.9,
    total_bookings: 127,
    video_intro_url: null
  },
  {
    display_name: 'Jah Prayzah',
    bio: 'Contemporary Musician. Award-winning artist known for soulful performances and meaningful lyrics.',
    category: 'musician',
    price_usd: 200,
    price_zig: 10000,
    response_time_hours: 24,
    thumbnail_url: 'https://placehold.co/400x400/8B5CF6/white?text=Jah+Prayzah',
    verified: true,
    active: true,
    rating: 4.8,
    total_bookings: 98,
    video_intro_url: null
  },
  {
    display_name: 'Comic Pastor',
    bio: 'Zimbabwe\'s funniest pastor! Bringing laughter and joy through clean, family-friendly comedy.',
    category: 'comedian',
    price_usd: 75,
    price_zig: 3750,
    response_time_hours: 24,
    thumbnail_url: 'https://placehold.co/400x400/EC4899/white?text=Comic+Pastor',
    verified: true,
    active: true,
    rating: 5.0,
    total_bookings: 156,
    video_intro_url: null
  },
  {
    display_name: 'Takura',
    bio: 'Hip-hop artist and producer. Creating authentic Zimbabwean hip-hop with global appeal.',
    category: 'musician',
    price_usd: 100,
    price_zig: 5000,
    response_time_hours: 72,
    thumbnail_url: 'https://placehold.co/400x400/8B5CF6/white?text=Takura',
    verified: true,
    active: true,
    rating: 4.7,
    total_bookings: 45,
    video_intro_url: null
  }
]

async function seedCategories() {
  console.log('📂 Seeding categories...')

  // First, check if categories already exist
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .limit(1)

  if (existing && existing.length > 0) {
    console.log('   ⏭️  Categories already seeded, skipping...\n')
    return
  }

  const { data, error } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'id' })

  if (error) {
    console.error('   ❌ Error seeding categories:', error.message)
    return
  }

  console.log(`   ✅ Seeded ${categories.length} categories\n`)
}

async function seedUsers() {
  console.log('👥 Seeding users...')

  const userIds = {}

  for (const user of testUsers) {
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const userExists = existingUser?.users?.find(u => u.email === user.email)

    if (userExists) {
      console.log(`   ⏭️  User ${user.email} already exists, skipping...`)
      userIds[user.email] = userExists.id
      continue
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
        role: user.role
      }
    })

    if (authError) {
      console.error(`   ❌ Error creating auth user ${user.email}:`, authError.message)
      continue
    }

    userIds[user.email] = authData.user.id

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        preferred_currency: user.preferred_currency,
        region: user.region
      })

    if (profileError) {
      console.error(`   ❌ Error creating profile for ${user.email}:`, profileError.message)
      continue
    }

    console.log(`   ✅ Created user: ${user.email} (${user.role})`)
  }

  console.log(`\n   📊 Total users created: ${Object.keys(userIds).length}\n`)
  return userIds
}

async function seedTalentProfiles(userIds) {
  console.log('⭐ Seeding talent profiles...')

  const talentEmails = [
    'winky.d@torashaout.com',
    'jah.prayzah@torashaout.com',
    'comic.pastor@torashaout.com',
    'takura@torashaout.com'
  ]

  const talentIds = {}

  for (let i = 0; i < talentProfiles.length; i++) {
    const profile = talentProfiles[i]
    const email = talentEmails[i]
    const userId = userIds[email]

    if (!userId) {
      console.log(`   ⚠️  User not found for ${email}, skipping profile...`)
      continue
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existing) {
      console.log(`   ⏭️  Profile for ${profile.display_name} already exists, skipping...`)
      talentIds[email] = existing.id
      continue
    }

    const { data, error } = await supabase
      .from('talent_profiles')
      .insert({
        user_id: userId,
        ...profile
      })
      .select()
      .single()

    if (error) {
      console.error(`   ❌ Error creating profile for ${profile.display_name}:`, error.message)
      continue
    }

    talentIds[email] = data.id
    console.log(`   ✅ Created talent profile: ${profile.display_name}`)
  }

  console.log(`\n   📊 Total talent profiles created: ${Object.keys(talentIds).length}\n`)
  return talentIds
}

async function seedBookings(userIds, talentIds) {
  console.log('📋 Seeding bookings...')

  const fanIds = [
    userIds['fan1@example.com'],
    userIds['fan2@example.com'],
    userIds['fan3@example.com']
  ]

  const bookings = [
    // Completed bookings
    {
      customer_id: fanIds[0],
      talent_id: talentIds['winky.d@torashaout.com'],
      talent_name: 'Winky D',
      recipient_name: 'Tatenda Moyo',
      occasion: 'Birthday',
      instructions: 'Please wish him a happy 25th birthday and mention his love for Zimdancehall!',
      status: 'completed',
      currency: 'USD',
      amount_paid: 150,
      platform_fee: 15,
      talent_earnings: 135,
      video_url: 'https://example.com/videos/winky-d-birthday.mp4',
      completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      customer_id: fanIds[1],
      talent_id: talentIds['comic.pastor@torashaout.com'],
      talent_name: 'Comic Pastor',
      recipient_name: 'Sarah',
      occasion: 'Anniversary',
      instructions: 'Make a funny anniversary message for my wife!',
      status: 'completed',
      currency: 'ZIG',
      amount_paid: 3750,
      platform_fee: 375,
      talent_earnings: 3375,
      video_url: 'https://example.com/videos/comic-pastor-anniversary.mp4',
      completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    // In progress bookings
    {
      customer_id: fanIds[2],
      talent_id: talentIds['jah.prayzah@torashaout.com'],
      talent_name: 'Jah Prayzah',
      recipient_name: 'Mike',
      occasion: 'Graduation',
      instructions: 'Congratulate my son on graduating from university!',
      status: 'in_progress',
      currency: 'USD',
      amount_paid: 200,
      platform_fee: 20,
      talent_earnings: 180
    },
    // Pending payment
    {
      customer_id: fanIds[0],
      talent_id: talentIds['takura@torashaout.com'],
      talent_name: 'Takura',
      recipient_name: 'John',
      occasion: 'Birthday',
      instructions: 'Hip-hop birthday shoutout for my friend!',
      status: 'payment_confirmed',
      currency: 'USD',
      amount_paid: 100,
      platform_fee: 10,
      talent_earnings: 90
    },
    // More completed bookings for stats
    {
      customer_id: fanIds[1],
      talent_id: talentIds['winky.d@torashaout.com'],
      talent_name: 'Winky D',
      recipient_name: 'Grace',
      occasion: 'Get Well Soon',
      instructions: 'Send encouragement to my friend in hospital',
      status: 'completed',
      currency: 'USD',
      amount_paid: 150,
      platform_fee: 15,
      talent_earnings: 135,
      video_url: 'https://example.com/videos/winky-d-getwell.mp4',
      completed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    }
  ]

  let successCount = 0

  for (const booking of bookings) {
    const { error } = await supabase
      .from('bookings')
      .insert(booking)

    if (error) {
      console.error(`   ❌ Error creating booking:`, error.message)
      continue
    }

    successCount++
  }

  console.log(`   ✅ Created ${successCount} bookings\n`)
}

async function seedNotifications(userIds, talentIds) {
  console.log('🔔 Seeding notifications...')

  const notifications = [
    // Talent notifications
    {
      user_id: userIds['winky.d@torashaout.com'],
      type: 'booking_request',
      title: 'New Booking Request',
      message: 'You have a new video request from John Moyo',
      read: false
    },
    {
      user_id: userIds['jah.prayzah@torashaout.com'],
      type: 'payment_received',
      title: 'Payment Received',
      message: 'You earned $180 from a completed video',
      read: true
    },
    // Fan notifications
    {
      user_id: userIds['fan1@example.com'],
      type: 'video_ready',
      title: 'Your Video is Ready!',
      message: 'Winky D has completed your video request',
      action_url: '/customer-dashboard',
      read: false
    },
    {
      user_id: userIds['fan2@example.com'],
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Comic Pastor accepted your video request',
      read: true
    },
    {
      user_id: userIds['fan3@example.com'],
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Jah Prayzah is working on your video',
      read: false
    }
  ]

  let successCount = 0

  for (const notification of notifications) {
    const { error } = await supabase
      .from('notifications')
      .insert(notification)

    if (error) {
      console.error(`   ❌ Error creating notification:`, error.message)
      continue
    }

    successCount++
  }

  console.log(`   ✅ Created ${successCount} notifications\n`)
}

async function main() {
  try {
    // Step 1: Seed categories
    await seedCategories()

    // Step 2: Seed users
    const userIds = await seedUsers()

    if (Object.keys(userIds).length === 0) {
      console.log('❌ No users created, stopping seed process\n')
      return
    }

    // Step 3: Seed talent profiles
    const talentIds = await seedTalentProfiles(userIds)

    // Step 4: Seed bookings
    await seedBookings(userIds, talentIds)

    // Step 5: Seed notifications
    await seedNotifications(userIds, talentIds)

    console.log('✅ Database seeding completed successfully!\n')
    console.log('📝 Test Credentials:')
    console.log('   Admin:  admin@torashaout.com / Admin123!@#')
    console.log('   Talent: winky.d@torashaout.com / Talent123!')
    console.log('   Fan:    fan1@example.com / Fan123!\n')

  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

main()
