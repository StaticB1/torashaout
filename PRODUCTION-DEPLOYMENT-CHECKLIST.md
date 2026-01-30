# Production Deployment Checklist

**Date:** January 30, 2026
**Deploying From:** feature/my-feature → main
**Impact:** Live production environment

---

## ⚠️ CRITICAL PRE-DEPLOYMENT TASKS

### 🗄️ Database Changes Required

Before pushing code, you MUST run these in **PRODUCTION database**:

#### 1. Create Auto-Signup Trigger (CRITICAL!)

Go to: https://supabase.com/dashboard/project/fyvqvqzdtuugqcxglwew/sql-editor

```sql
-- Check if trigger exists first
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If it doesn't exist, CREATE IT:
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
```

#### 2. Verify Foreign Keys (Check Only - Don't Change!)

```sql
-- Check foreign keys reference correct tables
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_schema || '.' || ccu.table_name AS references
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND ccu.table_name IN ('users')
ORDER BY tc.table_name;
```

**Check:** All should reference `public.users`, NOT `auth.users`
**If wrong:** Contact dev team - complex fix required

#### 3. Verify is_admin() Function Exists

```sql
-- Check if function exists
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'is_admin';

-- If missing, create it:
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

#### 4. Create Missing Tables (If Needed)

**Check if these tables exist:**

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'talent_applications',
    'flagged_content',
    'notifications'
  );
```

**If missing:**
- Run migration files from `supabase/migrations/`
- In order: 20260120, 20260121, 20260122, 20260126, NOTIFICATIONS_MIGRATION

#### 5. Fix Any Orphaned Users

```sql
-- Find users in auth but not in public
SELECT COUNT(*)
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- If any found, create them:
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT
  au.id, au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  'fan', au.created_at, NOW()
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

---

## 💻 Code Changes Being Deployed

### 1. Talent Approval Fix
**File:** `app/api/talent-applications/[id]/status/route.ts`

**What changed:**
- ✅ Rejecting talent now sets `admin_verified = false`
- ✅ Re-approving talent re-enables profile
- ✅ Fixed duplicate adminClient declaration

**Impact:** Fixes talent reject/reapprove workflow

**Risk:** 🟢 LOW - Improvement only, no breaking changes

---

### 2. Login Redirect Fix
**File:** `app/login/page.tsx`

**What changed:**
- ✅ Admins → `/admin`
- ✅ Talents → `/dashboard`
- ✅ Fans → `/` (homepage)

**Impact:** Users redirected to correct dashboard after login

**Risk:** 🟢 LOW - Better UX, no functionality broken

---

### 3. Signup Redirect Fix
**File:** `app/signup/page.tsx`

**What changed:**
- ✅ Fans → `/` (was `/browse`)

**Impact:** New fans go to homepage after signup

**Risk:** 🟢 LOW - UX improvement

---

### 4. Middleware Redirect Fix
**File:** `lib/supabase/middleware.ts`

**What changed:**
- ✅ Default redirect: `/customer-dashboard` → `/`

**Impact:** Automatic redirects work correctly

**Risk:** 🟢 LOW - Aligns with login behavior

---

## ✅ Pre-Deployment Testing Checklist

### Tested in Dev ✅
- [ ] Fan signup → redirects to homepage
- [ ] Talent signup → redirects to /join
- [ ] Admin login → redirects to /admin
- [ ] Talent approval creates profile
- [ ] Talent rejection sets admin_verified=false
- [ ] Re-approval re-enables profile
- [ ] Browse page shows only verified talents
- [ ] Admin dashboard loads

### Production Database Verified
- [ ] Trigger `on_auth_user_created` exists
- [ ] All required tables exist
- [ ] is_admin() function exists
- [ ] No orphaned users
- [ ] Foreign keys correct
- [ ] At least 1 admin user exists

### Environment Variables (Vercel)
- [ ] NEXT_PUBLIC_SUPABASE_URL = production URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY = production key
- [ ] SUPABASE_SERVICE_ROLE_KEY = production key
- [ ] Payment keys = LIVE keys (not test!)

---

## 🚀 Deployment Steps

### Step 1: Commit Changes

```bash
# Review changes
git diff

# Add files
git add app/api/talent-applications/[id]/status/route.ts
git add app/login/page.tsx
git add app/signup/page.tsx
git add lib/supabase/middleware.ts

# Optional: Add documentation
git add docs/COMPLETE-SETUP-GUIDE.md
git add docs/QUICK-REFERENCE.md
git add docs/PRODUCTION-VERIFICATION.md
git add docs/INDEX.md

# Commit
git commit -m "fix: Update talent approval workflow and role-based redirects

- Fix talent rejection to properly deactivate profiles
- Update login/signup redirects for all user roles
- Fix middleware default redirect path
- Add comprehensive documentation

Fixes:
- Admins now correctly redirect to /admin
- Fans redirect to homepage after signup/login
- Rejected talents properly hidden from browse page
- Re-approval workflow working correctly"
```

### Step 2: Push to Feature Branch

```bash
git push origin feature/my-feature
```

### Step 3: Create Pull Request

1. Go to GitHub
2. Create PR: `feature/my-feature` → `main`
3. Review changes
4. Get approval if needed

### Step 4: Merge to Main

Once PR is approved:
```bash
git checkout main
git pull origin main
git merge feature/my-feature
git push origin main
```

**⚠️ Vercel will auto-deploy to production!**

---

## 📋 Post-Deployment Verification

### Immediately After Deploy:

1. **Check deployment succeeded:**
   - https://vercel.com/your-project/deployments
   - Should show "Ready" status

2. **Test production site:**
   - Visit: https://your-production-url.com
   - Should load without errors

3. **Test critical flows:**
   - [ ] Homepage loads
   - [ ] Browse page shows talents
   - [ ] Can sign up as fan
   - [ ] Can log in
   - [ ] Admin can access /admin
   - [ ] Talent can access /dashboard

4. **Monitor logs:**
   - Vercel: Check function logs
   - Supabase: Check Auth and Database logs
   - Browser console: Check for errors

### Within 1 Hour:

- [ ] Test talent application submission
- [ ] Test admin approval workflow
- [ ] Verify email confirmations send (if enabled)
- [ ] Check payment integration works

### Within 24 Hours:

- [ ] Monitor error rates
- [ ] Check user signups working
- [ ] Verify no database errors
- [ ] Check performance metrics

---

## 🆘 Rollback Plan

If something goes wrong:

### Quick Rollback (Vercel)

1. Go to Vercel deployments
2. Find previous working deployment
3. Click "Promote to Production"
4. Done!

### Database Rollback (If Needed)

⚠️ **Only if you made database changes**

1. Go to Supabase Dashboard → Database → Backups
2. Restore from latest backup before deployment
3. Verify data integrity

---

## 📞 Emergency Contacts

If production breaks:

1. **Check Vercel logs** - See what's failing
2. **Rollback immediately** - Don't wait
3. **Check Supabase logs** - Database errors?
4. **Disable auth** (if auth is broken) - Temporarily in Supabase settings

---

## ✅ Summary

**Changes:** 4 code files + documentation
**Database Changes:** Trigger creation (if missing)
**Risk Level:** 🟡 MEDIUM - Database checks required
**Rollback:** ✅ Easy via Vercel
**Est. Downtime:** None (rolling deployment)

---

## 🎯 Final Checklist Before Push

- [ ] All dev testing passed
- [ ] Production database trigger verified/created
- [ ] Environment variables in Vercel are correct
- [ ] Team notified of deployment
- [ ] Monitoring tools ready
- [ ] Rollback plan understood
- [ ] Changes committed with clear message
- [ ] PR created and reviewed (if using PR workflow)

**Ready to deploy? Let's do this! 🚀**

---

**STOP! Before proceeding:**

1. ✅ Have you verified the trigger exists in production?
2. ✅ Have you tested all changes in dev?
3. ✅ Do you have a rollback plan?

If YES to all three → Proceed with deployment
If NO to any → DO NOT DEPLOY YET
