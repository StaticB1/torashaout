#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkMigrationStatus() {
  console.log('🔍 Checking talent_applications table status...\n');

  try {
    // Try to query the table
    const { data, error } = await supabase
      .from('talent_applications')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Table "talent_applications" does NOT exist.');
        console.log('\n📋 You need to create the table first.');
        console.log('\n🔧 To apply the migration:');
        console.log('1. Go to: https://app.supabase.com/project/fyvqvqzdtuugqcxglwew/sql');
        console.log('2. Copy the entire contents of: supabase/migrations/20260121_create_talent_applications.sql');
        console.log('3. Paste and run in the SQL Editor');
      } else {
        console.log('⚠️  Error checking table:', error.message);
      }
      return;
    }

    console.log('✅ Table "talent_applications" exists!');
    console.log('\n🔍 Checking if UNIQUE constraint exists on email field...');

    // Try to insert a duplicate email to test constraint
    const testEmail = 'test-' + Date.now() + '@test.com';

    // Insert first record
    const { error: insertError1 } = await supabase
      .from('talent_applications')
      .insert({
        first_name: 'Test',
        last_name: 'User',
        stage_name: 'Test User',
        email: testEmail,
        phone: '+263123456789',
        category: 'other',
        bio: 'Test bio for migration check',
        years_active: 1,
        notable_work: 'Test work',
        proposed_price_usd: 50,
        response_time_hours: 48
      });

    if (insertError1) {
      console.log('⚠️  Could not insert test record:', insertError1.message);
      return;
    }

    console.log('✓ First test record inserted');

    // Try to insert duplicate
    const { error: insertError2 } = await supabase
      .from('talent_applications')
      .insert({
        first_name: 'Test2',
        last_name: 'User2',
        stage_name: 'Test User 2',
        email: testEmail,
        phone: '+263987654321',
        category: 'other',
        bio: 'Test bio 2 for migration check',
        years_active: 2,
        notable_work: 'Test work 2',
        proposed_price_usd: 75,
        response_time_hours: 48
      });

    // Clean up test record
    await supabase
      .from('talent_applications')
      .delete()
      .eq('email', testEmail);

    if (insertError2) {
      if (insertError2.code === '23505') {
        console.log('✅ UNIQUE constraint EXISTS on email field!');
        console.log('✅ Migration is already applied - no action needed!');
      } else {
        console.log('⚠️  Unexpected error:', insertError2.message);
      }
    } else {
      console.log('❌ UNIQUE constraint DOES NOT exist on email field!');
      console.log('\n🔧 To apply the migration:');
      console.log('1. Go to: https://app.supabase.com/project/fyvqvqzdtuugqcxglwew/sql');
      console.log('2. Run this SQL:\n');
      console.log('ALTER TABLE talent_applications ADD CONSTRAINT talent_applications_email_key UNIQUE (email);');
      console.log('\nOr use the file: scripts/apply-migration.sql');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkMigrationStatus();
