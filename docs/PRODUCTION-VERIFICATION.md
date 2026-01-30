# Production Database Verification Guide

**CRITICAL:** Run these checks on your production database to ensure everything is set up correctly.

---

## ⚠️ Before You Start

**Production Database:** `fyvqvqzdtuugqcxglwew`
**Access:** https://supabase.com/dashboard/project/fyvqvqzdtuugqcxglwew/sql-editor

**⚠️ DO NOT make changes without backup!**

---

## 🔍 Critical Checks

### ✅ Check 1: Trigger Exists (MOST IMPORTANT!)

**What it does:** Auto-creates `public.users` when someone signs up

**Run this in Production SQL Editor:**

```sql
-- Check if trigger exists
SELECT
  trigger_name,
  event_object_table,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created'
  AND event_object_table = 'users'
  AND trigger_schema = 'auth';
```

**Expected Result:** 1 row showing the trigger

**If MISSING (returns 0 rows):** ⚠️ CRITICAL - CREATE IT NOW!

```sql
-- Create the missing trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, email, full_name, role, region,
    preferred_currency, is_verified, created_at, updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'fan',
    'zimbabwe',
    'USD',
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify it was created
SELECT 'Trigger created successfully!' as status;
```

---

### ✅ Check 2: Foreign Keys Reference Correct Tables

**What to check:** Foreign keys should reference `public.users`, NOT `auth.users`

**Run this:**

```sql
-- Check all foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_schema || '.' || ccu.table_name AS references_table,
  ccu.column_name AS references_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
```

**Check for:**
- ❌ Any reference to `auth.users` (WRONG!)
- ✅ All references to `public.users` (CORRECT!)

**If you see `auth.users`:** You need to recreate those tables with corrected foreign keys.

---

### ✅ Check 3: RLS Policies Exist

**Run this:**

```sql
-- Count RLS policies per table
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Expected minimum policies:**
- users: 2+ policies
- talent_profiles: 2+ policies
- bookings: 3+ policies
- payments: 2+ policies
- talent_applications: 3+ policies
- categories: 1+ policy
- favorites: 3+ policies

**If any table has 0 policies but has RLS enabled:** Data will be inaccessible!

---

### ✅ Check 4: is_admin() Function Exists

**Run this:**

```sql
-- Check if is_admin function exists
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'is_admin';
```

**Expected:** 1 row with `security_type = 'DEFINER'`

**If MISSING:**

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### ✅ Check 5: No Orphaned Records

**Run this:**

```sql
-- Check data integrity
SELECT
  'talent_profiles without users' as check_name,
  COUNT(*) as issues
FROM talent_profiles tp
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = tp.user_id)

UNION ALL

SELECT 'bookings without customers', COUNT(*)
FROM bookings b
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = b.customer_id)

UNION ALL

SELECT 'bookings without talents', COUNT(*)
FROM bookings b
WHERE NOT EXISTS (SELECT 1 FROM talent_profiles tp WHERE tp.id = b.talent_id)

UNION ALL

SELECT 'payments without users', COUNT(*)
FROM payments p
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p.user_id)

UNION ALL

SELECT 'payments without bookings', COUNT(*)
FROM payments p
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.id = p.booking_id)

UNION ALL

SELECT 'users without auth records', COUNT(*)
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id);
```

**Expected:** ALL checks should return `0` issues

**If any return > 0:** You have orphaned data that needs cleanup!

---

### ✅ Check 6: All Required Tables Exist

**Run this:**

```sql
-- List all tables
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected tables:**
- ✅ bookings
- ✅ categories
- ✅ favorites
- ✅ flagged_content
- ✅ notifications
- ✅ payments
- ✅ talent_applications
- ✅ talent_profiles
- ✅ users

**If any missing:** Run the corresponding migration file.

---

### ✅ Check 7: Users Have Matching auth.users

**Run this:**

```sql
-- Check sync between auth.users and public.users
SELECT
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM public.users) as total_public_users,
  (SELECT COUNT(*) FROM auth.users au WHERE EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
  )) as matched_users,
  CASE
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users)
    THEN '✅ All users synced'
    ELSE '⚠️ Mismatch detected'
  END as sync_status;
```

**Expected:** All counts should match, status should be "✅ All users synced"

**If mismatch:**
```sql
-- Find orphaned auth.users (no public.users record)
SELECT au.email, au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- Create missing public.users records
INSERT INTO public.users (id, email, full_name, role, region, preferred_currency, created_at, updated_at)
SELECT
  au.id, au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  'fan', 'zimbabwe', 'USD', au.created_at, NOW()
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

---

### ✅ Check 8: Email Confirmation Settings

**Manual Check:**
1. Go to: https://supabase.com/dashboard/project/fyvqvqzdtuugqcxglwew/auth/providers
2. Click "Email"
3. Verify:
   - ✅ "Confirm email" is **ON**
   - ✅ Email templates are configured
   - ✅ SMTP settings are configured (if custom email)

---

### ✅ Check 9: Admin Users Exist

**Run this:**

```sql
-- Check for admin users
SELECT
  email,
  full_name,
  role,
  created_at
FROM public.users
WHERE role = 'admin'
ORDER BY created_at;
```

**Expected:** At least 1 admin user

**If no admins:** Create one immediately!
```sql
UPDATE public.users
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'your-email@torashaout.com';
```

---

### ✅ Check 10: Sample Queries Work

**Test that app queries will work:**

```sql
-- Test 1: Browse page query
SELECT
  id, display_name, category, price_usd, admin_verified
FROM talent_profiles
WHERE admin_verified = true
LIMIT 5;

-- Test 2: Admin dashboard query
SELECT COUNT(*) as pending_apps
FROM talent_applications
WHERE status IN ('pending', 'under_review');

-- Test 3: Recent bookings
SELECT
  booking_code,
  status,
  amount_paid,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 5;
```

**All queries should return results without errors.**

---

## 🚨 Critical Production Issues to Fix

### Issue 1: Trigger Missing

**Symptom:** New users can sign up but can't use the app (stuck on "loading" or errors)

**Cause:** `on_auth_user_created` trigger doesn't exist

**Impact:** 🔴 CRITICAL - App completely broken for new users

**Fix:** Create trigger (see Check 1 above)

---

### Issue 2: Foreign Keys Reference auth.users

**Symptom:** Database errors when creating bookings or payments

**Cause:** Foreign keys point to `auth.users` instead of `public.users`

**Impact:** 🔴 CRITICAL - Bookings and payments fail

**Fix:** Recreate tables with correct foreign keys (complex - requires migration)

---

### Issue 3: RLS Policies Missing

**Symptom:** Users can't see any data, "permission denied" errors

**Cause:** RLS enabled but no policies created

**Impact:** 🟡 HIGH - App unusable

**Fix:** Create RLS policies for all tables

---

### Issue 4: No Admin Users

**Symptom:** Can't access admin dashboard, can't approve talents

**Cause:** No users with role='admin'

**Impact:** 🟡 HIGH - Can't manage platform

**Fix:** Manually set a user's role to 'admin'

---

## 📋 Complete Production Verification Script

**Run this single comprehensive check:**

```sql
-- ============================================
-- PRODUCTION DATABASE HEALTH CHECK
-- ============================================

-- Part 1: Trigger Check
SELECT
  '1. TRIGGER CHECK' as check_section,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Trigger exists'
    ELSE '❌ MISSING - CREATE IMMEDIATELY!'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Part 2: Foreign Key Check
WITH fk_check AS (
  SELECT
    tc.table_name,
    ccu.table_name AS references
  FROM information_schema.table_constraints tc
  JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND ccu.table_name = 'users'  -- Should reference 'users' in auth schema means error
    AND ccu.table_schema = 'auth'
)
SELECT
  '2. FOREIGN KEY CHECK' as check_section,
  CASE
    WHEN COUNT(*) > 0 THEN '❌ BAD - References auth.users!'
    ELSE '✅ Good - References public.users'
  END as status
FROM fk_check;

-- Part 3: Data Integrity
WITH integrity AS (
  SELECT
    COUNT(*) as orphaned
  FROM talent_profiles tp
  WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = tp.user_id)
)
SELECT
  '3. DATA INTEGRITY' as check_section,
  CASE
    WHEN orphaned = 0 THEN '✅ No orphaned records'
    ELSE '❌ ' || orphaned || ' orphaned records found'
  END as status
FROM integrity;

-- Part 4: Admin Users
WITH admins AS (
  SELECT COUNT(*) as admin_count
  FROM users WHERE role = 'admin'
)
SELECT
  '4. ADMIN USERS' as check_section,
  CASE
    WHEN admin_count > 0 THEN '✅ ' || admin_count || ' admin(s) exist'
    ELSE '❌ NO ADMINS - Create one immediately!'
  END as status
FROM admins;

-- Part 5: User Sync Check
WITH sync_check AS (
  SELECT
    (SELECT COUNT(*) FROM auth.users) as auth_count,
    (SELECT COUNT(*) FROM public.users) as public_count
)
SELECT
  '5. USER SYNC' as check_section,
  CASE
    WHEN auth_count = public_count THEN '✅ Synced (' || auth_count || ' users)'
    ELSE '⚠️ Mismatch - auth: ' || auth_count || ', public: ' || public_count
  END as status
FROM sync_check;

-- Part 6: is_admin() Function
SELECT
  '6. IS_ADMIN FUNCTION' as check_section,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Function exists'
    ELSE '❌ MISSING - Create function'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'is_admin'
  AND security_type = 'DEFINER';

-- Part 7: Tables Exist
WITH required_tables AS (
  SELECT unnest(ARRAY[
    'users', 'talent_profiles', 'talent_applications',
    'bookings', 'payments', 'categories', 'favorites',
    'notifications', 'flagged_content'
  ]) as required_table
),
existing_tables AS (
  SELECT tablename FROM pg_tables WHERE schemaname = 'public'
),
check_tables AS (
  SELECT
    COUNT(*) as missing_count
  FROM required_tables rt
  LEFT JOIN existing_tables et ON et.tablename = rt.required_table
  WHERE et.tablename IS NULL
)
SELECT
  '7. REQUIRED TABLES' as check_section,
  CASE
    WHEN missing_count = 0 THEN '✅ All 9 tables exist'
    ELSE '❌ ' || missing_count || ' tables missing!'
  END as status
FROM check_tables;

-- Part 8: RLS Enabled
SELECT
  '8. RLS ENABLED' as check_section,
  COUNT(*)::text || ' tables with RLS' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;

-- Expected: 9 tables with RLS

-- Summary
SELECT
  '═══════════════════════════════════' as separator,
  '🔍 PRODUCTION HEALTH CHECK COMPLETE' as summary;
```

**Review all results. Every check should show ✅ or ⚠️ with explanation.**

---

## 🔧 Fixes for Common Issues

### If Trigger is Missing

```sql
-- CRITICAL: Create the trigger immediately
-- (Use SQL from Check 1 above)
-- Then verify existing users have public.users records:

INSERT INTO public.users (id, email, full_name, role, region, preferred_currency, created_at, updated_at)
SELECT
  au.id, au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  'fan', 'zimbabwe', 'USD', au.created_at, NOW()
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

### If Foreign Keys Reference auth.users

⚠️ **This is complex** - requires recreating tables. Contact dev team or:

1. Backup production database
2. Export all data
3. Drop and recreate affected tables with correct foreign keys
4. Re-import data
5. Verify everything works

**DO NOT attempt without backup!**

### If No Admin Users

```sql
-- Make yourself an admin
UPDATE public.users
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'your-email@torashaout.com';

-- Verify
SELECT email, role FROM users WHERE role = 'admin';
```

### If RLS Policies Missing

Check **[COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md#row-level-security-rls)** for complete RLS policy creation scripts.

### If is_admin() Function Missing

```sql
-- Create it (see Check 4 above)
```

---

## 📊 Production Metrics

### User Statistics

```sql
SELECT
  role,
  COUNT(*) as count,
  COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users) as percentage
FROM users
GROUP BY role
ORDER BY count DESC;
```

### Talent Statistics

```sql
SELECT
  'Total talents' as metric, COUNT(*) as value FROM talent_profiles
UNION ALL
SELECT 'Active talents', COUNT(*) FROM talent_profiles WHERE admin_verified = true
UNION ALL
SELECT 'Pending applications', COUNT(*) FROM talent_applications WHERE status = 'pending'
UNION ALL
SELECT 'Approved applications', COUNT(*) FROM talent_applications WHERE status = 'approved'
UNION ALL
SELECT 'Rejected applications', COUNT(*) FROM talent_applications WHERE status = 'rejected';
```

### Revenue Statistics

```sql
SELECT
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  SUM(amount_paid) FILTER (WHERE status = 'completed') as total_revenue,
  AVG(amount_paid) FILTER (WHERE status = 'completed') as avg_booking_value
FROM bookings;
```

---

## 🔐 Security Checks

### Check Email Confirmation Status

```sql
-- Users who signed up but never confirmed email
SELECT
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;
```

### Check for Unverified Talents

```sql
-- Talents accepting bookings but not verified
SELECT
  display_name,
  category,
  admin_verified,
  is_accepting_bookings
FROM talent_profiles
WHERE is_accepting_bookings = true
  AND admin_verified = false;
```

**Expected:** 0 results (unverified talents shouldn't accept bookings)

### Check Payment Status Distribution

```sql
SELECT
  status,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM payments
GROUP BY status
ORDER BY count DESC;
```

---

## ⚡ Performance Checks

### Check Missing Indexes

```sql
-- Important indexes that should exist
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND (
    indexname LIKE '%_email%' OR
    indexname LIKE '%_status%' OR
    indexname LIKE '%_created%' OR
    indexname LIKE '%_user%'
  )
ORDER BY tablename, indexname;
```

**Expected indexes on:**
- users(email)
- users(role)
- talent_applications(status)
- talent_applications(user_id)
- talent_profiles(user_id)
- bookings(customer_id)
- bookings(talent_id)
- bookings(status)
- payments(booking_id)

### Table Sizes

```sql
SELECT
  schemaname || '.' || tablename as table_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as data_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as external_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🎯 Production Deployment Checklist

Before deploying new features to production:

### Code Changes
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Tested with all user roles (fan, talent, admin)
- [ ] Tested booking flow end-to-end
- [ ] Checked mobile responsiveness

### Database Changes
- [ ] Schema changes tested in dev first
- [ ] Migration file created if needed
- [ ] Migration tested in dev successfully
- [ ] Backup created before running migration
- [ ] Migration SQL ready to run in production

### Environment
- [ ] All new env variables added to Vercel
- [ ] No hardcoded secrets in code
- [ ] Production API keys are LIVE (not test)
- [ ] All endpoints use HTTPS

### Post-Deployment
- [ ] Verify health check passes
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test core features (browse, book, pay)
- [ ] Check admin dashboard loads
- [ ] Monitor error logs for 24 hours

---

## 🆘 Emergency Contacts

### If Production is Down

1. **Check Vercel deployment logs**
   - https://vercel.com/your-project/deployments

2. **Check Supabase status**
   - https://status.supabase.com

3. **Rollback if needed**
   - Vercel: Rollback to previous deployment
   - Database: Restore from backup

4. **Check database connectivity**
   ```sql
   SELECT NOW(); -- Should return current timestamp
   ```

---

## 📅 Regular Maintenance

### Weekly
- [ ] Review Supabase logs for errors
- [ ] Check pending talent applications
- [ ] Review flagged content

### Monthly
- [ ] Run full health check (this document)
- [ ] Review user growth metrics
- [ ] Check database size and performance
- [ ] Update dependencies (`npm update`)

### Before Major Releases
- [ ] Full health check
- [ ] Backup production database
- [ ] Test migration in dev
- [ ] Prepare rollback plan

---

## 📖 Related Documentation

- [COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md) - Full system documentation
- [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Quick commands
- [MIGRATION-TROUBLESHOOTING.md](./MIGRATION-TROUBLESHOOTING.md) - Migration issues

---

**Last Updated:** January 30, 2026

**⚠️ IMPORTANT:** Always backup production before making any changes!
