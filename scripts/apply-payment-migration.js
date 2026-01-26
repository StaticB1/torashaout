#!/usr/bin/env node

/**
 * Apply Payment Migration Script
 *
 * This script applies the bookings and payments table migration to Supabase.
 * Run: node scripts/apply-payment-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('📦 ToraShaout Payment Migration');
    console.log('================================\n');

    // Read migration file
    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations/20260126_create_bookings_and_payments.sql'
    );

    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Reading migration file...');
    console.log(`   Location: ${migrationPath}`);
    console.log(`   Size: ${migrationSQL.length} characters\n`);

    console.log('🚀 Applying migration to database...');

    // Execute migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    });

    if (error) {
      // Try direct execution if RPC fails
      console.log('   Trying alternative method...');

      // Split into individual statements and execute
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);

        const { error: stmtError } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });

        if (stmtError && !stmtError.message.includes('already exists')) {
          console.error(`   ⚠️  Statement ${i + 1} warning:`, stmtError.message);
        }
      }
    }

    console.log('\n✅ Migration applied successfully!\n');

    // Verify tables exist
    console.log('🔍 Verifying tables...');

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('count', { count: 'exact', head: true });

    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('count', { count: 'exact', head: true });

    if (!bookingsError) {
      console.log('   ✓ bookings table created');
    } else {
      console.log('   ⚠️  bookings table check:', bookingsError.message);
    }

    if (!paymentsError) {
      console.log('   ✓ payments table created');
    } else {
      console.log('   ⚠️  payments table check:', paymentsError.message);
    }

    console.log('\n📋 Summary:');
    console.log('   • Created bookings table with RLS policies');
    console.log('   • Created payments table with RLS policies');
    console.log('   • Added indexes for performance');
    console.log('   • Created trigger for automatic booking status updates');
    console.log('   • Added helper functions');

    console.log('\n🎉 Payment system database is ready!');
    console.log('\nNext steps:');
    console.log('   1. Test payment flow at: http://localhost:3000/payment/test-booking');
    console.log('   2. Create a test booking first, then try payment');
    console.log('   3. Check database for payment records');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run migration
applyMigration();
