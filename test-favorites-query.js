require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client that bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function queryFavorites() {
  console.log('🔗 Testing database connection...');
  console.log('📍 Database:', supabaseUrl);
  console.log('');

  try {
    // Query favorites with JOIN
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        user:users!user_id(email, full_name),
        talent:talent_profiles!talent_id(display_name, category)
      `);

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n🔍 Trying simple query without JOIN...\n');

      // Try simpler query
      const { data: simple, error: simpleError } = await supabase
        .from('favorites')
        .select('*');

      if (simpleError) {
        console.error('❌ Simple query also failed:', simpleError.message);
        return;
      }

      console.log('✅ Simple query succeeded!');
      console.log(`📊 Favorites count: ${simple?.length || 0}`);

      if (simple && simple.length > 0) {
        console.log('\n📋 Data:');
        console.table(simple);
      } else {
        console.log('   (Table is empty)');
      }
      return;
    }

    console.log('✅ Query successful!');
    console.log(`📊 Favorites count: ${data?.length || 0}`);

    if (data && data.length > 0) {
      console.log('\n📋 Favorites with details:');
      console.table(data.map(f => ({
        user_email: f.user?.email || 'N/A',
        user_name: f.user?.full_name || 'N/A',
        talent_name: f.talent?.display_name || 'N/A',
        talent_category: f.talent?.category || 'N/A',
        created_at: new Date(f.created_at).toLocaleDateString()
      })));
    } else {
      console.log('   (Table is empty - no favorites yet)');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

queryFavorites();
