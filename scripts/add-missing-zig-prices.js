/**
 * Script to add ZIG prices where missing
 * Run with: node scripts/add-missing-zig-prices.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Exchange rate: 50 ZIG = $1 USD
const USD_TO_ZIG_RATE = 50;

async function addMissingZigPrices() {
  console.log('📊 Finding profiles with missing ZIG prices...\n');

  // Fetch all talents
  const { data: talents, error } = await supabase
    .from('talent_profiles')
    .select('id, display_name, price_usd, price_zig');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const needsUpdate = talents.filter(t => t.price_usd && !t.price_zig);

  console.log(`Found ${needsUpdate.length} profiles needing ZIG prices\n`);

  for (const talent of needsUpdate) {
    const zigPrice = talent.price_usd * USD_TO_ZIG_RATE;

    const { error: updateError } = await supabase
      .from('talent_profiles')
      .update({
        price_zig: zigPrice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', talent.id);

    if (updateError) {
      console.error(`❌ Error updating ${talent.display_name}:`, updateError);
      continue;
    }

    console.log(`✅ Added ZIG price for ${talent.display_name}:`);
    console.log(`   USD: $${talent.price_usd} → ZIG: ${zigPrice}`);
  }

  console.log(`\n✨ Complete! Updated ${needsUpdate.length} profiles`);
}

addMissingZigPrices()
  .then(() => {
    console.log('\n🎉 All ZIG prices added successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });
