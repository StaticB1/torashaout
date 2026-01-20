#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const categories = ['musician', 'comedian', 'gospel-artist', 'actor', 'sports', 'influencer']
const firstNames = ['Kevin', 'Lauren', 'Justin', 'Michelle', 'Tyler', 'Stephanie', 'Eric', 'Melissa', 'Brian', 'Rachel', 'Patrick', 'Christina', 'Steven', 'Angela', 'Jason', 'Brittany']
const lastNames = ['Moyo', 'Ndlovu', 'Sibanda', 'Ncube', 'Dube', 'Khumalo', 'Mpofu', 'Nkomo', 'Banda', 'Chikwanha', 'Mutasa', 'Gumbo', 'Makoni', 'Zvobgo']

const bios = [
  'Emerging talent looking to make a mark in the entertainment industry.',
  'Aspiring performer with a passion for bringing joy to audiences.',
  'New to the scene but eager to showcase unique talents.',
]

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

async function createTestUser(email, fullName) {
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (authError) {
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUsers) return existingUsers.id
      throw authError
    }

    await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: 'talent'
    })

    return authData.user.id
  } catch (error) {
    console.error(`Error creating user ${email}:`, error.message)
    return null
  }
}

async function addRejectedTalents() {
  console.log('🌱 Adding more rejected talents...\n')

  let created = 0
  const targetCount = 15

  for (let i = 0; i < targetCount; i++) {
    const firstName = getRandomElement(firstNames)
    const lastName = getRandomElement(lastNames)
    const fullName = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.rejected.extra${i}@test.com`

    const userId = await createTestUser(email, fullName)
    if (!userId) continue

    const { error } = await supabase.from('talent_profiles').insert({
      user_id: userId,
      display_name: fullName,
      category: getRandomElement(categories),
      bio: getRandomElement(bios),
      price_usd: Math.floor(Math.random() * 200) + 50,
      price_zig: Math.floor(Math.random() * 6000) + 1500,
      response_time_hours: 24,
      admin_verified: false,
      verification_status: 'rejected',
      is_accepting_bookings: false,
      total_bookings: 0,
      average_rating: 0
    })

    if (!error) {
      created++
      console.log(`  ✓ Created rejected talent: ${fullName}`)
    }
  }

  console.log(`\n✅ Created ${created}/${targetCount} rejected talents`)
}

addRejectedTalents().then(() => process.exit(0))
