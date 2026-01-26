-- ============================================
-- QUICK USER CLEANUP SCRIPT
-- ============================================
-- Use this to completely remove a user from the system
-- Deletes from both auth.users and public.users + all related data
-- ============================================

-- OPTION 1: Single User Cleanup (MOST COMMON)
-- Replace the email below with the user you want to delete
DO $$
DECLARE
  user_email TEXT := 'testuser@example.com'; -- ⚠️ CHANGE THIS EMAIL
  user_uuid UUID;
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;

  IF user_uuid IS NOT NULL THEN
    -- Delete in correct order (respects foreign key constraints)
    DELETE FROM public.talent_applications WHERE user_id = user_uuid;
    DELETE FROM public.talent_profiles WHERE user_id = user_uuid;
    DELETE FROM public.favorites WHERE user_id = user_uuid;
    DELETE FROM public.bookings WHERE customer_id = user_uuid OR talent_id = user_uuid;
    DELETE FROM public.notifications WHERE user_id = user_uuid;
    DELETE FROM public.users WHERE id = user_uuid;
    DELETE FROM auth.users WHERE id = user_uuid;

    RAISE NOTICE 'User % deleted completely', user_email;
  ELSE
    RAISE NOTICE 'User % not found', user_email;
  END IF;
END $$;

-- ============================================
-- OPTION 2: Delete All Test Users
-- ============================================
-- Uncomment to use
/*
DO $$
DECLARE
  deleted_count INTEGER := 0;
  user_record RECORD;
BEGIN
  FOR user_record IN
    SELECT id, email FROM auth.users
    WHERE email LIKE '%test%' OR email LIKE '%@example.com'
  LOOP
    DELETE FROM public.talent_applications WHERE user_id = user_record.id;
    DELETE FROM public.talent_profiles WHERE user_id = user_record.id;
    DELETE FROM public.favorites WHERE user_id = user_record.id;
    DELETE FROM public.bookings WHERE customer_id = user_record.id OR talent_id = user_record.id;
    DELETE FROM public.notifications WHERE user_id = user_record.id;
    DELETE FROM public.users WHERE id = user_record.id;
    DELETE FROM auth.users WHERE id = user_record.id;

    deleted_count := deleted_count + 1;
    RAISE NOTICE 'Deleted user: %', user_record.email;
  END LOOP;

  RAISE NOTICE 'Total users deleted: %', deleted_count;
END $$;
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if user still exists in auth
SELECT 'Checking auth.users...' as step;
SELECT id, email, created_at
FROM auth.users
WHERE email = 'testuser@example.com'; -- Change email

-- Check if user still exists in public.users
SELECT 'Checking public.users...' as step;
SELECT id, email, role
FROM public.users
WHERE email = 'testuser@example.com'; -- Change email

-- Check if any related data remains
SELECT 'Checking related data...' as step;
SELECT COUNT(*) as remaining_applications
FROM public.talent_applications
WHERE email = 'testuser@example.com'; -- Change email
