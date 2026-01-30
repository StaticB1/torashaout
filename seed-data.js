// Seed script to populate initial data in Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedCategories() {
  console.log('🌱 Seeding categories...')

  const categories = [
    { name: 'Musicians', slug: 'musician', icon: '🎵', booking_count: 0 },
    { name: 'Comedians', slug: 'comedian', icon: '😂', booking_count: 0 },
    { name: 'Gospel Artists', slug: 'gospel', icon: '🙏', booking_count: 0 },
    { name: 'Business Leaders', slug: 'business', icon: '💼', booking_count: 0 },
    { name: 'Sports Stars', slug: 'sports', icon: '⚽', booking_count: 0 },
    { name: 'Influencers', slug: 'influencer', icon: '📱', booking_count: 0 },
    { name: 'Other Celebrities', slug: 'other', icon: '⭐', booking_count: 0 }
  ]

  // Check if categories already exist
  const { data: existing, error: checkError } = await supabase
    .from('categories')
    .select('slug')

  if (checkError) {
    console.error('❌ Error checking existing categories:', checkError.message)
    return false
  }

  if (existing && existing.length > 0) {
    console.log('⚠️  Categories already exist. Skipping seed.')
    return true
  }

  // Insert categories
  const { data, error } = await supabase
    .from('categories')
    .insert(categories)
    .select()

  if (error) {
    console.error('❌ Error seeding categories:', error.message)
    return false
  }

  console.log(`✅ Successfully seeded ${data.length} categories`)
  return true
}

async function main() {
  console.log('🚀 Starting database seed...\n')

  // Test connection
  console.log('🔌 Testing database connection...')
  const { data: testData, error: testError } = await supabase
    .from('categories')
    .select('count')
    .limit(1)

  if (testError) {
    console.error('❌ Database connection failed:', testError.message)
    process.exit(1)
  }

  console.log('✅ Database connection successful\n')

  // Seed categories
  const success = await seedCategories()

  if (success) {
    console.log('\n🎉 Database seeding completed!')
  } else {
    console.log('\n❌ Database seeding failed')
    process.exit(1)
  }
}

main()
