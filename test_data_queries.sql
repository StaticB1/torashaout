-- ============================================
-- FAST TEST DATA CREATION FOR TALENT APPLICATION
-- ============================================
-- Run these queries in your Supabase SQL Editor
-- or via psql/database client
-- ============================================

-- STEP 1: Create a test user (fan role)
-- Replace the UUID with a new one or use this sample
-- Password will need to be set via Supabase Auth
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
  'aaaaaaaa-bbbb-cccc-dddd-111111111111', -- Test user ID
  'testtalent@example.com',
  '+263771234567',
  'Test Talent User',
  'fan', -- Will change to 'talent' when approved
  'zimbabwe',
  'USD',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- STEP 2: Create a test talent application (pending status)
INSERT INTO public.talent_applications (
  id,
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
  facebook_page,
  facebook_followers,
  youtube_channel,
  youtube_subscribers,
  twitter_handle,
  tiktok_handle,
  proposed_price_usd,
  response_time_hours,
  hear_about_us,
  additional_info,
  status,
  admin_notes,
  reviewed_by,
  reviewed_at,
  created_at,
  updated_at
) VALUES (
  'bbbbbbbb-cccc-dddd-eeee-222222222222', -- Application ID
  'aaaaaaaa-bbbb-cccc-dddd-111111111111', -- Links to test user
  'Test',
  'Talent',
  'T-Talent The Great',
  'testtalent@example.com',
  '+263771234567',
  'musician',
  'I am a talented musician with over 5 years of experience in the industry. I specialize in Afrobeat and contemporary music with a unique style that blends traditional and modern sounds. My music has resonated with audiences across Zimbabwe and internationally.',
  5,
  'Featured on several albums and performed at major festivals including Harare International Festival of the Arts, Vic Falls Carnival, and Zimbabwe Music Awards. Released 3 singles that charted on local radio stations. Collaborated with international artists and produced music for local films.',
  '@ttalent',
  50000,
  'facebook.com/ttalent',
  30000,
  'youtube.com/c/ttalent',
  15000,
  '@ttalent',
  '@ttalent',
  100.00,
  24,
  'Social Media',
  'Looking forward to connecting with fans through personalized video messages. I believe this platform will help me build stronger relationships with my audience.',
  'pending', -- Start as pending
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if test user was created
SELECT id, email, full_name, role, region
FROM public.users
WHERE email = 'testtalent@example.com';

-- Check if test application was created
SELECT id, stage_name, email, category, status, proposed_price_usd, created_at
FROM public.talent_applications
WHERE email = 'testtalent@example.com';

-- Count pending applications (should be at least 1)
SELECT COUNT(*) as pending_count
FROM public.talent_applications
WHERE status IN ('pending', 'under_review');

-- ============================================
-- CLEANUP QUERIES (run after testing)
-- ============================================

-- Delete test application
DELETE FROM public.talent_applications
WHERE email = 'testtalent@example.com';

-- Delete test user (this will cascade delete the application if user_id FK exists)
DELETE FROM public.users
WHERE email = 'testtalent@example.com';

-- Delete test talent profile (if created during approval)
DELETE FROM public.talent_profiles
WHERE user_id = 'aaaaaaaa-bbbb-cccc-dddd-111111111111';

-- ============================================
-- ADDITIONAL TEST DATA (Optional)
-- ============================================

-- Create a REJECTED application for resubmission testing
INSERT INTO public.talent_applications (
  id,
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
  proposed_price_usd,
  response_time_hours,
  status,
  admin_notes,
  created_at,
  updated_at
) VALUES (
  'cccccccc-dddd-eeee-ffff-333333333333',
  'aaaaaaaa-bbbb-cccc-dddd-111111111111',
  'Test',
  'Rejected',
  'Rejected Talent',
  'rejected@example.com',
  '+263771234568',
  'comedian',
  'Stand-up comedian with 3 years experience.',
  3,
  'Performed at local comedy clubs and events.',
  75.00,
  48,
  'rejected',
  'Please provide more details about your notable performances and include social media links to verify your following.',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;
