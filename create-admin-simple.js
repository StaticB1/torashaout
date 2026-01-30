// Simple script to create an admin user account
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Get credentials from command line arguments
const email = process.argv[2]
const password = process.argv[3]
const fullName = process.argv[4]

if (!email || !password || !fullName) {
  console.error('❌ Usage: node create-admin-simple.js <email> <password> <full-name>')
  console.error('   Example: node create-admin-simple.js admin@example.com password123 "Admin User"')
  process.exit(1)
}

if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters long')
  process.exit(1)
}

// Create admin client (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  console.log('🔐 Creating Admin Account...\n')

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      process.exit(1)
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Check if user profile already exists
    const { data: existingProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (existingProfile) {
      // Update existing profile to admin
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', authData.user.id)

      if (updateError) {
        console.error('❌ Error updating user profile:', updateError.message)
        process.exit(1)
      }

      console.log('✅ Updated existing profile to admin')
    } else {
      // Create user profile (in case trigger didn't fire)
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: 'admin'
        })

      if (profileError) {
        console.error('❌ Error creating user profile:', profileError.message)
        process.exit(1)
      }

      console.log('✅ User profile created')
    }

    console.log('\n🎉 Admin account created successfully!')
    console.log('\n📋 Account Details:')
    console.log(`   Email: ${email}`)
    console.log(`   Name: ${fullName}`)
    console.log(`   Role: admin`)
    console.log(`   User ID: ${authData.user.id}`)
    console.log('\n✨ You can now login at: http://localhost:3000/login')

  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

createAdmin()
