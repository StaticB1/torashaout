-- ============================================
-- CREATE TEST APPLICATION FOR EXISTING USER
-- ============================================
-- This creates a test application linked to an EXISTING user
-- You need to have an admin user already created
-- ============================================

-- OPTION 1: Use your existing admin user
-- First, find your admin user ID:
SELECT id, email, full_name, role
FROM users
WHERE role = 'admin'
LIMIT 1;

-- Copy the ID from above, then create application:
-- Replace 'YOUR_ADMIN_USER_ID' with actual ID

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
  status,
  created_at,
  updated_at
) VALUES (
  'YOUR_ADMIN_USER_ID', -- Replace with actual user ID from above query
  'Test',
  'Talent',
  'T-Talent The Great',
  'test@talent.com',
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
  'pending',
  NOW(),
  NOW()
)
RETURNING id, stage_name, email, status;

-- ============================================
-- OPTION 2: Automated - Create for first user
-- ============================================
-- This automatically creates application for the first user in the system

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
  status,
  created_at,
  updated_at
)
SELECT
  u.id,
  'Test',
  'Talent',
  'T-Talent The Great',
  'testtalent' || floor(random() * 1000)::text || '@example.com',
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
  'pending',
  NOW(),
  NOW()
FROM users u
WHERE u.role IN ('fan', 'admin') -- Use any existing user
ORDER BY u.created_at DESC
LIMIT 1
RETURNING stage_name, email, status;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if application was created
SELECT
  ta.id,
  ta.stage_name,
  ta.email,
  ta.status,
  ta.proposed_price_usd,
  u.email as user_email,
  u.role as user_role
FROM talent_applications ta
JOIN users u ON ta.user_id = u.id
WHERE ta.status = 'pending'
ORDER BY ta.created_at DESC
LIMIT 3;

-- Count pending applications
SELECT COUNT(*) as pending_count
FROM talent_applications
WHERE status IN ('pending', 'under_review');

-- ============================================
-- CLEANUP
-- ============================================

-- Delete test applications (by email pattern)
DELETE FROM talent_applications
WHERE email LIKE '%testtalent%@example.com'
OR stage_name LIKE '%T-Talent%'
RETURNING id, stage_name, email;
