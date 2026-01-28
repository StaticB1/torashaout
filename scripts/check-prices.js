/**
 * Script to check all current talent prices
 * Run with: node scripts/check-prices.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPrices() {
  const { data: talents, error } = await supabase
    .from('talent_profiles')
    .select('display_name, price_usd, price_zig')
    .order('price_usd', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n📊 Current Talent Prices:\n');
  console.log('═'.repeat(60));

  talents.forEach(talent => {
    const usd = talent.price_usd ? `$${talent.price_usd}` : 'N/A';
    const zig = talent.price_zig ? `${talent.price_zig} ZIG` : 'N/A';
    console.log(`${talent.display_name.padEnd(25)} | USD: ${usd.padEnd(10)} | ZIG: ${zig}`);
  });

  console.log('═'.repeat(60));
  console.log(`\nTotal profiles: ${talents.length}\n`);
}

checkPrices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
