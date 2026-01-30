#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking Payment Tables\n');

  // Try to insert a test payment
  console.log('Testing payments table insert...');
  const { data, error } = await supabase
    .from('payments')
    .insert({
      booking_id: '00000000-0000-0000-0000-000000000000',
      user_id: '00000000-0000-0000-0000-000000000000',
      gateway: 'paynow',
      reference: `TEST-${Date.now()}`,
      amount: 1.00,
      currency: 'USD',
      status: 'completed',
    })
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    console.log('\nColumns that exist:', error.details);
  } else {
    console.log('✅ Payment inserted successfully!');
    console.log('Payment ID:', data[0].id);

    // Delete test payment
    await supabase.from('payments').delete().eq('id', data[0].id);
    console.log('Test payment cleaned up.');
  }
}

checkTables();
