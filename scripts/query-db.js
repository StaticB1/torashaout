#!/usr/bin/env node

/**
 * Quick database query script
 * Usage: node scripts/query-db.js "SELECT * FROM users LIMIT 5"
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runQuery(query) {
  try {
    console.log('📊 Running query...\n');

    // Use the SQL query via RPC or direct table query
    const { data, error } = await supabase.rpc('exec_sql', { query });

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log('✅ Results:\n');
    console.table(data);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Get query from command line argument
const query = process.argv[2];

if (!query) {
  console.log('Usage: node scripts/query-db.js "SELECT * FROM users LIMIT 5"');
  process.exit(1);
}

runQuery(query);
