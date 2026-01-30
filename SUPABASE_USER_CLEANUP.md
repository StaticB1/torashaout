# Supabase User Cleanup Documentation

## Problem

When deleting users from the `public.users` table in Supabase, the authentication record remains in `auth.users`, causing signup errors:

**Error Message**: "User already registered" or "Email already exists"

This happens because Supabase maintains **two separate user tables**:
1. **`auth.users`** - Supabase's authentication system (email, password, auth metadata)
2. **`public.users`** - Your application's user data (role, phone, region, etc.)

Deleting from `public.users` alone leaves the authentication record intact, preventing new signups with the same email.

---

## Solution: Complete User Cleanup Script

### Single User Cleanup

Use this script to completely remove a user from all tables:

```sql
-- Complete user cleanup (replace email as needed)
DO $$
DECLARE
  user_email TEXT := 'testuser@example.com'; -- ⚠️ CHANGE THIS
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
```

**How to Use:**
1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy the script above
3. **Replace** `'testuser@example.com'` with actual email
4. Click **Run** or press `Ctrl+Enter`
5. Check output: "User [email] deleted completely"

---

## Batch Cleanup Scripts

### Delete All Test Users

```sql
-- Delete all test users (emails containing 'test' or ending in @example.com)
DO $$
DECLARE
  deleted_count INTEGER := 0;
  user_record RECORD;
BEGIN
  FOR user_record IN
    SELECT id, email FROM auth.users
    WHERE email LIKE '%test%' OR email LIKE '%@example.com'
  LOOP
    -- Delete related data
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
```

### Delete Test Applications Only (Keep Users)

```sql
-- Delete test applications but keep the user accounts
DELETE FROM public.talent_applications
WHERE email LIKE '%test%'
   OR email LIKE '%@example.com'
   OR stage_name LIKE '%Test%'
   OR stage_name LIKE '%T-Talent%';
```

---

## Verification Queries

### Check If User Exists in Auth System

```sql
-- Check auth.users
SELECT id, email, created_at, confirmed_at
FROM auth.users
WHERE email = 'testuser@example.com';
```

### Check If User Exists in Public Schema

```sql
-- Check public.users
SELECT id, email, full_name, role, created_at
FROM public.users
WHERE email = 'testuser@example.com';
```

### Find All Related Data for a User

```sql
-- Get complete user data across all tables
SELECT
  'auth.users' as table_name,
  au.id,
  au.email,
  NULL as additional_info
FROM auth.users au
WHERE au.email = 'testuser@example.com'

UNION ALL

SELECT
  'public.users',
  pu.id,
  pu.email,
  pu.role
FROM public.users pu
WHERE pu.email = 'testuser@example.com'

UNION ALL

SELECT
  'talent_applications',
  ta.id::text,
  ta.email,
  ta.status
FROM talent_applications ta
WHERE ta.email = 'testuser@example.com'

UNION ALL

SELECT
  'talent_profiles',
  tp.id::text,
  u.email,
  tp.display_name
FROM talent_profiles tp
JOIN users u ON tp.user_id = u.id
WHERE u.email = 'testuser@example.com';
```

---

## Automated Cleanup Function (Optional)

Create a reusable function for user cleanup:

```sql
-- Create cleanup function
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_email TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get user ID
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;

  IF user_uuid IS NULL THEN
    RETURN QUERY SELECT FALSE, 'User not found: ' || user_email;
    RETURN;
  END IF;

  -- Delete all related data
  DELETE FROM public.talent_applications WHERE user_id = user_uuid;
  DELETE FROM public.talent_profiles WHERE user_id = user_uuid;
  DELETE FROM public.favorites WHERE user_id = user_uuid;
  DELETE FROM public.bookings WHERE customer_id = user_uuid OR talent_id = user_uuid;
  DELETE FROM public.notifications WHERE user_id = user_uuid;
  DELETE FROM public.users WHERE id = user_uuid;
  DELETE FROM auth.users WHERE id = user_uuid;

  RETURN QUERY SELECT TRUE, 'User deleted completely: ' || user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage:
SELECT * FROM public.delete_user_completely('testuser@example.com');
```

---

## Prevention: Cascade Delete Trigger

Set up automatic cleanup when auth user is deleted:

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS trigger AS $$
BEGIN
  -- Delete from public.users (cascade will handle related tables)
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_deleted();

-- Test the trigger
-- Now deleting from auth.users will automatically clean up public.users
DELETE FROM auth.users WHERE email = 'test@example.com';
```

**⚠️ Note**: This trigger requires proper CASCADE rules on foreign keys in `public` schema tables.

---

## Alternative: Supabase Dashboard Method

### Manual Deletion via UI

1. **Open Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Find user by email
4. Click **three dots (⋮)** next to user
5. Select **Delete User**
6. Confirm deletion

**Limitation**: This only deletes from `auth.users`. You still need to clean up `public.users` and related data manually.

---

## Common Scenarios

### Scenario 1: Testing - Create and Delete User Repeatedly

```sql
-- Quick cleanup for testing
DO $$
BEGIN
  -- Delete test user
  PERFORM public.delete_user_completely('testuser@example.com');

  -- Wait a moment
  PERFORM pg_sleep(0.5);

  RAISE NOTICE 'Test user cleaned up. Ready for new signup.';
END $$;
```

### Scenario 2: Production - User Requests Account Deletion

```sql
-- Complete user data deletion (GDPR compliance)
DO $$
DECLARE
  user_email TEXT := 'user@example.com'; -- User requesting deletion
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;

  IF user_uuid IS NOT NULL THEN
    -- Anonymize or delete bookings (depending on business requirements)
    UPDATE public.bookings
    SET customer_id = NULL
    WHERE customer_id = user_uuid;

    -- Delete personal data
    DELETE FROM public.talent_applications WHERE user_id = user_uuid;
    DELETE FROM public.talent_profiles WHERE user_id = user_uuid;
    DELETE FROM public.favorites WHERE user_id = user_uuid;
    DELETE FROM public.notifications WHERE user_id = user_uuid;
    DELETE FROM public.users WHERE id = user_uuid;
    DELETE FROM auth.users WHERE id = user_uuid;

    RAISE NOTICE 'User account deleted: %', user_email;
  END IF;
END $$;
```

### Scenario 3: Cleanup All Test Data Before Production

```sql
-- Remove all test/development data
DO $$
BEGIN
  -- Delete test applications
  DELETE FROM public.talent_applications
  WHERE email LIKE '%test%' OR email LIKE '%example.com';

  -- Delete test profiles
  DELETE FROM public.talent_profiles
  WHERE user_id IN (
    SELECT id FROM public.users
    WHERE email LIKE '%test%' OR email LIKE '%example.com'
  );

  -- Delete test users
  DELETE FROM public.users
  WHERE email LIKE '%test%' OR email LIKE '%example.com';

  DELETE FROM auth.users
  WHERE email LIKE '%test%' OR email LIKE '%example.com';

  RAISE NOTICE 'All test data cleaned up';
END $$;
```

---

## Troubleshooting

### Error: "User not found in auth.users but exists in public.users"

**Solution**: Orphaned record. Delete from public.users:
```sql
DELETE FROM public.users WHERE email = 'user@example.com';
```

### Error: "Foreign key constraint violation"

**Solution**: Delete in correct order (child tables before parent):
```sql
-- Always delete in this order:
DELETE FROM public.talent_applications WHERE user_id = 'uuid';
DELETE FROM public.talent_profiles WHERE user_id = 'uuid';
DELETE FROM public.favorites WHERE user_id = 'uuid';
DELETE FROM public.bookings WHERE customer_id = 'uuid';
DELETE FROM public.notifications WHERE user_id = 'uuid';
DELETE FROM public.users WHERE id = 'uuid';
DELETE FROM auth.users WHERE id = 'uuid';
```

### Error: "Permission denied on auth.users"

**Cause**: Service role key not configured or insufficient permissions.

**Solution**:
- Use **Supabase SQL Editor** (has admin access)
- Or set `SUPABASE_SERVICE_ROLE_KEY` in environment
- Or use Dashboard UI to delete auth users

---

## Best Practices

1. **Always Delete Test Users Completely** - Don't leave orphaned auth records
2. **Use Email Patterns for Test Data** - Makes batch cleanup easier (`%test%`, `%@example.com`)
3. **Document Test User Emails** - Keep track of test accounts
4. **Set Up Cascade Rules** - Automate cleanup with database triggers
5. **Regular Cleanup** - Schedule periodic cleanup of test data
6. **Backup Before Mass Deletion** - Always backup production data first

---

## Quick Reference

| Task | Command |
|------|---------|
| Delete single user | `SELECT * FROM delete_user_completely('email@example.com');` |
| Delete all test users | Run batch cleanup script (see above) |
| Check if user exists | `SELECT * FROM auth.users WHERE email = 'email';` |
| View all user data | Run comprehensive query (see above) |
| Prevent orphaned records | Set up cascade delete trigger |

---

## Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

---

**Created**: 2026-01-23
**Purpose**: Complete user cleanup for Supabase projects
**Status**: Production ready ✅
