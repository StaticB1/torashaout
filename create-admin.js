// Script to create an admin user account
const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Create admin client (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function createAdmin() {
  console.log('🔐 Admin Account Creation\n')

  // Get user input
  const email = await question('Enter admin email: ')
  const password = await question('Enter admin password (min 6 characters): ')
  const fullName = await question('Enter admin full name: ')

  if (!email || !password || password.length < 6 || !fullName) {
    console.error('❌ Invalid input. Please provide all required fields.')
    rl.close()
    process.exit(1)
  }

  try {
    console.log('\n📝 Creating admin account...')

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
      rl.close()
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
        rl.close()
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
        rl.close()
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
    console.error('❌ Unexpected error:', err.message)
  } finally {
    rl.close()
  }
}

// Alternative: Promote existing user to admin
async function promoteToAdmin() {
  console.log('👑 Promote Existing User to Admin\n')

  const email = await question('Enter email of user to promote: ')

  if (!email) {
    console.error('❌ Email is required')
    rl.close()
    process.exit(1)
  }

  try {
    console.log('\n📝 Promoting user to admin...')

    // Find user by email
    const { data: userData, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (findError || !userData) {
      console.error('❌ User not found with email:', email)
      rl.close()
      process.exit(1)
    }

    // Update role to admin
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userData.id)

    if (updateError) {
      console.error('❌ Error updating user role:', updateError.message)
      rl.close()
      process.exit(1)
    }

    console.log('\n🎉 User promoted to admin successfully!')
    console.log('\n📋 Account Details:')
    console.log(`   Email: ${userData.email}`)
    console.log(`   Name: ${userData.full_name}`)
    console.log(`   Role: admin`)
    console.log(`   User ID: ${userData.id}`)

  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
  } finally {
    rl.close()
  }
}

// Main menu
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('   ToraShaout - Admin User Setup')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const choice = await question('Choose an option:\n  1. Create new admin account\n  2. Promote existing user to admin\n\nEnter choice (1 or 2): ')

  if (choice === '1') {
    await createAdmin()
  } else if (choice === '2') {
    await promoteToAdmin()
  } else {
    console.error('❌ Invalid choice')
    rl.close()
  }
}

main()
