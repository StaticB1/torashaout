#!/usr/bin/env node

/**
 * Create Test Booking Script
 *
 * This script creates a test booking in the database for payment testing.
 * Run: node scripts/create-test-booking.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestBooking() {
  try {
    console.log('🎬 Creating Test Booking');
    console.log('========================\n');

    // Get a user (any user) for testing
    console.log('1️⃣ Finding a user...');
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError || !users || users.users.length === 0) {
      console.error('❌ No users found. Please create a user first.');
      console.log('\nTo create a user, sign up at: http://localhost:3000/signup');
      process.exit(1);
    }

    const testUser = users.users[0];
    console.log(`   ✓ Found user: ${testUser.email}`);

    // Get a talent profile
    console.log('\n2️⃣ Finding a talent...');
    const { data: talents, error: talentError } = await supabase
      .from('talent_profiles')
      .select('*')
      .eq('admin_verified', true)
      .limit(1);

    if (talentError || !talents || talents.length === 0) {
      console.error('❌ No verified talents found.');
      process.exit(1);
    }

    const talent = talents[0];
    console.log(`   ✓ Found talent: ${talent.display_name}`);

    // Generate booking code
    const bookingCode = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Create booking
    console.log('\n3️⃣ Creating booking...');
    const amount = 50.00;
    const platformFee = amount * 0.25;
    const talentEarnings = amount - platformFee;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_code: bookingCode,
        customer_id: testUser.id,
        talent_id: talent.id,
        recipient_name: 'John Doe',
        occasion: 'Birthday',
        instructions: 'Please make it fun and exciting!',
        currency: 'USD',
        amount_paid: amount,
        platform_fee: platformFee,
        talent_earnings: talentEarnings,
        status: 'pending_payment',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Failed to create booking:', bookingError.message);
      process.exit(1);
    }

    console.log(`   ✓ Booking created: ${bookingCode}`);

    console.log('\n✅ Test booking ready!');
    console.log('\n📋 Booking Details:');
    console.log(`   Booking ID: ${booking.id}`);
    console.log(`   Booking Code: ${bookingCode}`);
    console.log(`   Customer: ${testUser.email}`);
    console.log(`   Talent: ${talent.display_name}`);
    console.log(`   Amount: $${amount.toFixed(2)} USD`);
    console.log(`   Status: pending_payment`);

    console.log('\n🧪 Test Payment:');
    console.log(`   1. Login as: ${testUser.email}`);
    console.log(`   2. Go to: http://localhost:3000/payment/${booking.id}`);
    console.log('   3. Complete payment form');
    console.log('   4. Check database for payment record!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createTestBooking();
