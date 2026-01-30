#!/usr/bin/env node

/**
 * Script to apply the talent_applications migration
 * Adds UNIQUE constraint to email field
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🔄 Applying migration: Add UNIQUE constraint to email...\n');

  try {
    // First, check if the table exists
    const { data: tables, error: tableError } = await supabase
      .from('talent_applications')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      // Table doesn't exist, run full migration
      console.log('📋 Table does not exist. Running full migration...');
      const migrationPath = path.join(__dirname, '../supabase/migrations/20260121_create_talent_applications.sql');
      const sql = fs.readFileSync(migrationPath, 'utf8');

      const { error } = await supabase.rpc('exec_sql', { sql });

      if (error) {
        console.error('❌ Error running full migration:', error.message);
        process.exit(1);
      }

      console.log('✅ Full migration applied successfully!');
    } else {
      // Table exists, just add the unique constraint
      console.log('📋 Table exists. Adding UNIQUE constraint to email field...');

      // Check if constraint already exists
      const checkConstraint = `
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'talent_applications'
        AND constraint_type = 'UNIQUE'
        AND constraint_name LIKE '%email%';
      `;

      const { data: constraints, error: checkError } = await supabase.rpc('exec_sql', {
        sql: checkConstraint
      });

      if (constraints && constraints.length > 0) {
        console.log('ℹ️  UNIQUE constraint already exists on email field.');
        console.log('✅ Migration is already applied!');
        return;
      }

      // Add the unique constraint
      const alterTableSql = `
        ALTER TABLE talent_applications
        ADD CONSTRAINT talent_applications_email_key UNIQUE (email);
      `;

      const { error: alterError } = await supabase.rpc('exec_sql', { sql: alterTableSql });

      if (alterError) {
        console.error('❌ Error adding UNIQUE constraint:', alterError.message);
        console.log('\n💡 You may need to apply this manually through the Supabase Dashboard SQL Editor:');
        console.log(alterTableSql);
        process.exit(1);
      }

      console.log('✅ UNIQUE constraint added successfully!');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('📧 The email field now has a UNIQUE constraint.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.log('\n📖 Manual Migration Instructions:');
    console.log('1. Go to your Supabase Dashboard: https://app.supabase.com/project/fyvqvqzdtuugqcxglwew');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this SQL:\n');
    console.log('ALTER TABLE talent_applications ADD CONSTRAINT talent_applications_email_key UNIQUE (email);');
    process.exit(1);
  }
}

applyMigration();
