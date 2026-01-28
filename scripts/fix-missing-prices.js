/**
 * Script to fix profiles with missing ZIG prices
 * Run with: node scripts/fix-missing-prices.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Exchange rate: 50 ZIG = $1 USD (based on existing prices)
const USD_TO_ZIG_RATE = 50;

async function fixMissingPrices() {
  console.log('📊 Fetching profiles with missing ZIG prices...');

  // Fetch profiles that have USD but no ZIG price
  const { data: talents, error: fetchError } = await supabase
    .from('talent_profiles')
    .select('id, display_name, price_usd, price_zig')
    .not('price_usd', 'is', null)
    .is('price_zig', null);

  if (fetchError) {
    console.error('Error fetching talents:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${talents.length} profiles to fix\n`);

  for (const talent of talents) {
    const newPriceUSD = talent.price_usd * 4;
    const newPriceZIG = newPriceUSD * USD_TO_ZIG_RATE;

    const { error: updateError } = await supabase
      .from('talent_profiles')
      .update({
        price_usd: newPriceUSD,
        price_zig: newPriceZIG,
        updated_at: new Date().toISOString(),
      })
      .eq('id', talent.id);

    if (updateError) {
      console.error(`❌ Error updating ${talent.display_name}:`, updateError);
      continue;
    }

    console.log(`✅ Fixed ${talent.display_name}:`);
    console.log(`   USD: $${talent.price_usd} → $${newPriceUSD}`);
    console.log(`   ZIG: (none) → ${newPriceZIG}`);
  }

  console.log(`\n✨ Complete! Fixed ${talents.length} profiles`);
}

fixMissingPrices()
  .then(() => {
    console.log('\n🎉 All prices fixed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });
