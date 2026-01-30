#!/usr/bin/env node

/**
 * Simple database query script
 * Usage: node scripts/query-db-simple.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔗 Connecting to:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runQueries() {
  try {
    // Query 1: Get users count
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact' });

    if (usersError) {
      console.error('❌ Error querying users:', usersError.message);
    } else {
      console.log('\n📊 Users:');
      console.log(`   Total: ${users.length}`);
      if (users.length > 0) {
        console.log('   Sample:', users.slice(0, 3).map(u => ({ email: u.email, role: u.role })));
      }
    }

    // Query 2: Get talent profiles count
    const { data: talents, error: talentsError } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact' });

    if (talentsError) {
      console.error('❌ Error querying talent_profiles:', talentsError.message);
    } else {
      console.log('\n🎭 Talent Profiles:');
      console.log(`   Total: ${talents.length}`);
      if (talents.length > 0) {
        console.log('   Sample:', talents.slice(0, 3).map(t => ({ name: t.display_name, category: t.category })));
      }
    }

    // Query 3: Get bookings count
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' });

    if (bookingsError) {
      console.error('❌ Error querying bookings:', bookingsError.message);
    } else {
      console.log('\n📖 Bookings:');
      console.log(`   Total: ${bookings.length}`);
      if (bookings.length > 0) {
        console.log('   Sample:', bookings.slice(0, 3).map(b => ({ code: b.booking_code, status: b.status })));
      }
    }

    // Query 4: Get categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      console.error('❌ Error querying categories:', categoriesError.message);
    } else {
      console.log('\n📂 Categories:');
      console.log('   ', categories.map(c => c.name).join(', '));
    }

    console.log('\n✅ Query complete!');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

runQueries();
