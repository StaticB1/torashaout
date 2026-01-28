/**
 * Script to increase all talent prices by 4x
 * Run with: node scripts/update-talent-prices.js
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

async function updatePrices() {
  console.log('📊 Fetching current talent profiles...');

  // Fetch all talent profiles
  const { data: talents, error: fetchError } = await supabase
    .from('talent_profiles')
    .select('id, display_name, price_usd, price_zig');

  if (fetchError) {
    console.error('Error fetching talents:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${talents.length} talent profiles\n`);

  // Update each talent's prices
  let updated = 0;
  let skipped = 0;

  for (const talent of talents) {
    if (talent.price_usd === null && talent.price_zig === null) {
      console.log(`⏭️  Skipping ${talent.display_name} (no prices set)`);
      skipped++;
      continue;
    }

    const oldPriceUSD = talent.price_usd;
    const oldPriceZIG = talent.price_zig;
    const newPriceUSD = talent.price_usd ? talent.price_usd * 4 : null;
    const newPriceZIG = talent.price_zig ? talent.price_zig * 4 : null;

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

    console.log(`✅ Updated ${talent.display_name}:`);
    if (oldPriceUSD) console.log(`   USD: $${oldPriceUSD} → $${newPriceUSD}`);
    if (oldPriceZIG) console.log(`   ZIG: ${oldPriceZIG} → ${newPriceZIG}`);

    updated++;
  }

  console.log(`\n✨ Complete!`);
  console.log(`   Updated: ${updated} profiles`);
  console.log(`   Skipped: ${skipped} profiles`);
}

updatePrices()
  .then(() => {
    console.log('\n🎉 All prices updated successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });
