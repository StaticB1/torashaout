#!/usr/bin/env node

/**
 * Seed script to add test talent profiles to the database
 * This will create talents with different statuses (pending, approved, rejected)
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample talent data
const categories = ['musician', 'comedian', 'gospel-artist', 'actor', 'sports', 'influencer']
const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Daniel', 'Ashley', 'Matthew', 'Amanda', 'Joshua', 'Samantha', 'Andrew', 'Jennifer', 'Ryan', 'Elizabeth', 'Brandon', 'Nicole', 'Christopher', 'Rebecca']
const lastNames = ['Moyo', 'Ndlovu', 'Sibanda', 'Ncube', 'Dube', 'Khumalo', 'Mpofu', 'Nkomo', 'Banda', 'Chikwanha', 'Mutasa', 'Gumbo', 'Makoni', 'Zvobgo', 'Mapfumo', 'Chidzonga', 'Mahlangu', 'Mlambo', 'Nyathi', 'Tshabalala']

const bios = [
  'Award-winning performer with over 10 years of experience in the entertainment industry.',
  'Passionate about bringing joy and laughter to every event.',
  'Professional entertainer specializing in corporate and private events.',
  'Rising star known for energetic performances and crowd engagement.',
  'Experienced performer with a unique style that captivates audiences.',
  'Dedicated to creating memorable experiences for all occasions.',
  'Multi-talented artist with a passion for entertainment excellence.',
  'Known for dynamic performances that leave lasting impressions.',
  'Professional entertainer committed to delivering top-quality shows.',
  'Creative performer bringing fresh energy to every event.',
]

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomPrice() {
  const prices = [50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 500]
  return getRandomElement(prices)
}

function getRandomResponseTime() {
  return getRandomElement([12, 24, 36, 48, 72])
}

function getRandomRating() {
  return Math.floor(Math.random() * 21) / 4 + 3.5 // Random between 3.5 and 5.0
}

function getRandomBookings() {
  return Math.floor(Math.random() * 50) + 1
}

async function createTestUser(email, fullName) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    })

    if (authError) {
      // If user already exists, try to get it
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUsers) {
        return existingUsers.id
      }
      throw authError
    }

    // Create user record in users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'talent'
      })

    if (userError && !userError.message.includes('duplicate')) {
      throw userError
    }

    return authData.user.id
  } catch (error) {
    console.error(`Error creating user ${email}:`, error.message)
    return null
  }
}

async function seedTalents() {
  console.log('🌱 Starting talent seeding process...\n')

  const talentsToCreate = {
    pending: 15,
    approved: 25,
    rejected: 10
  }

  let created = { pending: 0, approved: 0, rejected: 0 }

  // Create pending talents
  console.log('📝 Creating pending talents...')
  for (let i = 0; i < talentsToCreate.pending; i++) {
    const firstName = getRandomElement(firstNames)
    const lastName = getRandomElement(lastNames)
    const fullName = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.pending${i}@test.com`

    const userId = await createTestUser(email, fullName)
    if (!userId) continue

    const { error } = await supabase
      .from('talent_profiles')
      .insert({
        user_id: userId,
        display_name: fullName,
        category: getRandomElement(categories),
        bio: getRandomElement(bios),
        price_usd: getRandomPrice(),
        price_zig: getRandomPrice() * 30,
        response_time_hours: getRandomResponseTime(),
        admin_verified: false,
        verification_status: 'pending',
        is_accepting_bookings: false,
        total_bookings: 0,
        average_rating: 0
      })

    if (!error) {
      created.pending++
      console.log(`  ✓ Created pending talent: ${fullName}`)
    }
  }

  // Create approved talents
  console.log('\n✅ Creating approved talents...')
  for (let i = 0; i < talentsToCreate.approved; i++) {
    const firstName = getRandomElement(firstNames)
    const lastName = getRandomElement(lastNames)
    const fullName = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.approved${i}@test.com`

    const userId = await createTestUser(email, fullName)
    if (!userId) continue

    const { error } = await supabase
      .from('talent_profiles')
      .insert({
        user_id: userId,
        display_name: fullName,
        category: getRandomElement(categories),
        bio: getRandomElement(bios),
        price_usd: getRandomPrice(),
        price_zig: getRandomPrice() * 30,
        response_time_hours: getRandomResponseTime(),
        admin_verified: true,
        verification_status: 'approved',
        is_accepting_bookings: Math.random() > 0.3, // 70% accepting bookings
        total_bookings: getRandomBookings(),
        average_rating: getRandomRating()
      })

    if (!error) {
      created.approved++
      console.log(`  ✓ Created approved talent: ${fullName}`)
    }
  }

  // Create rejected talents
  console.log('\n❌ Creating rejected talents...')
  for (let i = 0; i < talentsToCreate.rejected; i++) {
    const firstName = getRandomElement(firstNames)
    const lastName = getRandomElement(lastNames)
    const fullName = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.rejected${i}@test.com`

    const userId = await createTestUser(email, fullName)
    if (!userId) continue

    const { error } = await supabase
      .from('talent_profiles')
      .insert({
        user_id: userId,
        display_name: fullName,
        category: getRandomElement(categories),
        bio: getRandomElement(bios),
        price_usd: getRandomPrice(),
        price_zig: getRandomPrice() * 30,
        response_time_hours: getRandomResponseTime(),
        admin_verified: false,
        verification_status: 'rejected',
        is_accepting_bookings: false,
        total_bookings: 0,
        average_rating: 0
      })

    if (!error) {
      created.rejected++
      console.log(`  ✓ Created rejected talent: ${fullName}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('🎉 Seeding completed!')
  console.log('='.repeat(50))
  console.log(`\n📊 Summary:`)
  console.log(`  Pending talents:  ${created.pending}/${talentsToCreate.pending}`)
  console.log(`  Approved talents: ${created.approved}/${talentsToCreate.approved}`)
  console.log(`  Rejected talents: ${created.rejected}/${talentsToCreate.rejected}`)
  console.log(`  Total created:    ${created.pending + created.approved + created.rejected}`)
  console.log('\n✨ You can now test pagination in the admin dashboard!')
}

// Run the seeder
seedTalents()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
