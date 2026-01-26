# Quick Test Setup - SQL Queries

## Option 1: Via Supabase Dashboard (Recommended)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Test Data Creation Query

Copy and paste this complete query:

```sql
-- Create test user
INSERT INTO public.users (
  id,
  email,
  phone,
  full_name,
  role,
  region,
  preferred_currency,
  is_verified,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'testtalent@example.com',
  '+263771234567',
  'Test Talent User',
  'fan',
  'zimbabwe',
  'USD',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
RETURNING id;

-- Note the ID from above, then use it in the next query
-- Or run this combined query:

WITH new_user AS (
  INSERT INTO public.users (
    id,
    email,
    phone,
    full_name,
    role,
    region,
    preferred_currency,
    is_verified,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    'testtalent' || floor(random() * 1000)::text || '@example.com',
    '+263771234567',
    'Test Talent User',
    'fan',
    'zimbabwe',
    'USD',
    true,
    NOW(),
    NOW()
  )
  RETURNING id, email
)
INSERT INTO public.talent_applications (
  user_id,
  first_name,
  last_name,
  stage_name,
  email,
  phone,
  category,
  bio,
  years_active,
  notable_work,
  instagram_handle,
  instagram_followers,
  proposed_price_usd,
  response_time_hours,
  hear_about_us,
  additional_info,
  status,
  created_at,
  updated_at
)
SELECT
  id,
  'Test',
  'Talent',
  'T-Talent The Great',
  email,
  '+263771234567',
  'musician',
  'I am a talented musician with over 5 years of experience in the industry. I specialize in Afrobeat and contemporary music.',
  5,
  'Featured on several albums and performed at major festivals including Harare International Festival.',
  '@ttalent',
  50000,
  100.00,
  24,
  'Social Media',
  'Looking forward to connecting with fans!',
  'pending',
  NOW(),
  NOW()
FROM new_user
RETURNING stage_name, email, status;
```

Click **Run** or press `Ctrl+Enter`

### Step 3: Verify Test Data

Run this verification query:

```sql
-- Check pending applications
SELECT
  ta.id,
  ta.stage_name,
  ta.email,
  ta.category,
  ta.status,
  ta.proposed_price_usd,
  u.role as user_role,
  ta.created_at
FROM talent_applications ta
JOIN users u ON ta.user_id = u.id
WHERE ta.status = 'pending'
ORDER BY ta.created_at DESC
LIMIT 5;
```

You should see your test application with status = `pending`

---

## Option 2: Via Command Line (psql)

If you have database access via psql:

```bash
# Connect to your database
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"

# Then paste the SQL from Option 1
```

---

## Option 3: Via Node.js Script

Create a file `create-test-data.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestData() {
  // Create test user
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({
      email: 'testtalent' + Date.now() + '@example.com',
      phone: '+263771234567',
      full_name: 'Test Talent User',
      role: 'fan',
      region: 'zimbabwe',
      preferred_currency: 'USD',
      is_verified: true,
    })
    .select()
    .single();

  if (userError) {
    console.error('Error creating user:', userError);
    return;
  }

  console.log('✅ User created:', user.email);

  // Create test application
  const { data: application, error: appError } = await supabase
    .from('talent_applications')
    .insert({
      user_id: user.id,
      first_name: 'Test',
      last_name: 'Talent',
      stage_name: 'T-Talent The Great',
      email: user.email,
      phone: '+263771234567',
      category: 'musician',
      bio: 'Talented musician with 5+ years experience.',
      years_active: 5,
      notable_work: 'Performed at major festivals.',
      instagram_handle: '@ttalent',
      instagram_followers: 50000,
      proposed_price_usd: 100,
      response_time_hours: 24,
      hear_about_us: 'Social Media',
      status: 'pending',
    })
    .select()
    .single();

  if (appError) {
    console.error('Error creating application:', appError);
    return;
  }

  console.log('✅ Application created:', application.stage_name);
  console.log('Application ID:', application.id);
  console.log('Status:', application.status);
}

createTestData();
```

Run it:
```bash
node create-test-data.js
```

---

## Testing the Admin Dashboard

### Step 1: Open Admin Dashboard
Navigate to: http://localhost:3004/admin

### Step 2: Check Pending Verifications Section
- Should see "T-Talent The Great" (or your test application)
- Badge count should show at least 1 pending

### Step 3: Test Approval
1. Click **"Review Details"** on the test application
2. Review the details
3. Click **"Approve"**
4. Watch the server logs for:
   ```
   PATCH /api/talent-applications/[id]/status 200 in XXXms
   ```

### Step 4: Verify Approval Success
Run this query to confirm:

```sql
-- Check user role changed to 'talent'
SELECT id, email, role
FROM users
WHERE email LIKE '%testtalent%';

-- Check talent profile was created
SELECT tp.id, tp.display_name, tp.admin_verified, u.email
FROM talent_profiles tp
JOIN users u ON tp.user_id = u.id
WHERE u.email LIKE '%testtalent%';

-- Check application status is 'approved'
SELECT id, stage_name, status, reviewed_at
FROM talent_applications
WHERE email LIKE '%testtalent%';
```

Expected results:
- ✅ User role = `talent`
- ✅ Talent profile exists with admin_verified = `true`
- ✅ Application status = `approved`

---

## Cleanup After Testing

Remove test data:

```sql
-- Get test user IDs
SELECT id, email FROM users WHERE email LIKE '%testtalent%';

-- Delete applications (replace UUID with actual test user ID)
DELETE FROM talent_applications WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%testtalent%'
);

-- Delete talent profiles
DELETE FROM talent_profiles WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%testtalent%'
);

-- Delete test users
DELETE FROM users WHERE email LIKE '%testtalent%';
```

---

## Monitoring Server Logs

Keep this running in a terminal:

```bash
tail -f /tmp/claude/-home-b-torashout/tasks/be22854.output | grep -E "(PATCH|POST|Error|talent-applications)"
```

Look for:
- ✅ `PATCH /api/talent-applications/[id]/status 200` - Approval success
- ❌ `Error creating talent profile` - RLS issue (should be fixed)
- ❌ `500` status codes - Server errors

---

## Quick Summary

1. **Create Test Data**: Run SQL query in Supabase Dashboard
2. **Verify**: Check admin dashboard shows pending application
3. **Test Approval**: Click approve button
4. **Confirm**: Run verification queries
5. **Cleanup**: Delete test data when done

This approach is much faster than manual UI testing! 🚀
