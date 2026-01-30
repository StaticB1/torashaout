# ToraShaout - Complete Development Setup Guide

**Last Updated:** January 30, 2026
**Purpose:** Complete guide for setting up and understanding the ToraShaout development environment

---

## Table of Contents

1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Environment Setup](#environment-setup)
4. [Database Migration (Production → Dev)](#database-migration-production--dev)
5. [User Authentication Flow](#user-authentication-flow)
6. [Talent Application Workflow](#talent-application-workflow)
7. [Role-Based Redirects](#role-based-redirects)
8. [Row Level Security (RLS)](#row-level-security-rls)
9. [Production Checklist](#production-checklist)
10. [Troubleshooting](#troubleshooting)

---

## Overview

ToraShaout is a platform connecting fans with celebrities for personalized video messages (shoutouts).

### Key Features:
- Multi-role system (fans, talents, admins)
- Talent application and approval workflow
- Booking and payment processing
- Admin dashboard for platform management

### Technology Stack:
- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe, PayNow, InnBucks
- **Video:** Cloudflare Stream

---

## Database Architecture

### Table Structure

```
auth.users (Supabase Auth)
    ↓ (trigger: on_auth_user_created)
public.users (Application data)
    ↓
public.talent_applications (Application workflow)
    ↓ (when approved)
public.talent_profiles (Public profiles)
    ↓
public.bookings → public.payments
    ↓
public.notifications
```

### Core Tables

#### 1. `auth.users` (Supabase Managed)
- **Purpose:** Authentication (passwords, sessions)
- **Managed by:** Supabase Auth
- **Contains:** email, encrypted_password, email_confirmed_at
- **Note:** Cannot add custom columns here

#### 2. `public.users` (Application Data)
- **Purpose:** User profiles and application data
- **Key columns:**
  - `id` → References `auth.users(id)`
  - `email`, `full_name`, `phone`
  - `role` → 'fan' | 'talent' | 'admin'
  - `region`, `preferred_currency`
- **Created by:** Trigger when user signs up

#### 3. `public.talent_applications` (Admin Workflow)
- **Purpose:** Talent application and review process
- **Key columns:**
  - `stage_name`, `bio`, `category`
  - `proposed_price_usd`
  - `status` → 'pending' | 'under_review' | 'approved' | 'rejected'
  - `user_id` → References `public.users(id)`
- **Lifecycle:** Created when fan applies, updated by admin

#### 4. `public.talent_profiles` (Public Profiles)
- **Purpose:** Public-facing talent profiles (what customers see)
- **Key columns:**
  - `user_id` → References `public.users(id)`
  - `display_name`, `bio`, `category`
  - `price_usd`, `price_zig`
  - `admin_verified` → true/false (controls visibility)
  - `is_accepting_bookings`
- **Created by:** Admin approval of talent_applications
- **Visibility:** Only shown when `admin_verified = true`

#### 5. `public.bookings`
- **Purpose:** Video booking requests
- **Key columns:**
  - `customer_id` → References `public.users(id)`
  - `talent_id` → References `public.talent_profiles(id)`
  - `status`, `amount_paid`, `video_url`

#### 6. `public.payments`
- **Purpose:** Payment transactions
- **Key columns:**
  - `booking_id` → References `public.bookings(id)`
  - `user_id` → References `public.users(id)`
  - `gateway`, `status`, `amount`

#### 7. Other Tables
- `public.categories` - Talent categories
- `public.favorites` - User favorites
- `public.notifications` - User notifications
- `public.flagged_content` - Content moderation

---

## Environment Setup

### Production vs Dev

| Aspect | Production | Development |
|--------|-----------|-------------|
| **Database** | `fyvqvqzdtuugqcxglwew` | `qhhocguovfbbtyjxjfmc` |
| **Branch** | `main` | `feature/*` |
| **Email Confirmation** | ✅ ON | ❌ OFF (easier testing) |
| **SMTP** | ✅ Configured | ❌ Not needed |
| **Payment Keys** | 🔴 LIVE | 🟢 TEST |
| **URL** | Vercel | localhost:3000 |

### Environment Variables

**.env.local (Dev):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://qhhocguovfbbtyjxjfmc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**.env.local.backup (Production Credentials):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://fyvqvqzdtuugqcxglwew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Database Migration (Production → Dev)

### Issues Encountered & Solutions

#### Issue 1: Foreign Key References to auth.users ❌

**Problem:**
```sql
-- Original migration had:
customer_id UUID NOT NULL REFERENCES auth.users(id)
```

When migrating from prod → dev, `auth.users` in dev doesn't have the same user IDs, causing foreign key violations.

**Solution:**
```sql
-- Fixed to reference public.users instead:
customer_id UUID NOT NULL REFERENCES public.users(id)
```

**Affected Tables:**
- `bookings.customer_id`
- `payments.user_id`
- `notifications.user_id`

#### Issue 2: RLS Policy Infinite Recursion ❌

**Problem:**
```sql
-- Checking if user is admin caused recursion:
CREATE POLICY "Admins can view all" ON users
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    -- ↑ This queries users table, which triggers RLS again → infinite loop
  );
```

**Solution:**
```sql
-- Use SECURITY DEFINER function to bypass RLS:
CREATE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use the function in policies:
CREATE POLICY "Admins can view all" ON users
  USING (public.is_admin());
```

#### Issue 3: Schema Inconsistencies ❌

**Problem:**
Production database had different column names than dev migrations:
- `bookings` missing: `from_name`, `from_email`, `delivery_date`, `is_public`, `video_duration_seconds`
- `payments` missing: `gateway_transaction_id`, `gateway_response`, `metadata`

**Solution:**
- Generated INSERT statements based on actual production schema
- Updated dev schema to match (or handled missing columns as NULL)

### Migration Process (Step-by-Step)

#### Step 1: Copy Table Data

Run these in **Production SQL Editor** (one at a time), then paste results into **Dev SQL Editor**:

**Order matters! Follow this sequence:**

1. **users** (no dependencies)
2. **categories** (no dependencies)
3. **talent_profiles** (depends on users)
4. **favorites** (depends on users, talent_profiles)
5. **bookings** (depends on users, talent_profiles)
6. **payments** (depends on bookings, users)
7. **notifications** (depends on users, bookings)

#### Step 2: Create auth.users Records

```sql
-- Create placeholder auth.users for public.users
INSERT INTO auth.users (
    id, instance_id, aud, role, email,
    encrypted_password, email_confirmed_at,
    created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin
)
SELECT
    u.id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated', 'authenticated', u.email,
    '', NOW(), u.created_at, u.updated_at,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb, false
FROM public.users u
WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id)
ON CONFLICT (id) DO NOTHING;
```

**Note:** These users won't have passwords. You'll need to set passwords manually or create new test accounts.

#### Step 3: Verify Migration

```sql
-- Check row counts
SELECT 'users' as table, COUNT(*) FROM public.users
UNION ALL SELECT 'talent_profiles', COUNT(*) FROM public.talent_profiles
UNION ALL SELECT 'bookings', COUNT(*) FROM public.bookings
UNION ALL SELECT 'payments', COUNT(*) FROM public.payments;

-- Check foreign key integrity
SELECT COUNT(*) as orphaned_profiles
FROM public.talent_profiles tp
WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = tp.user_id);
-- Should return 0
```

---

## User Authentication Flow

### Signup Process

```
1. User fills signup form
      ↓
2. Supabase Auth creates auth.users record
      ↓
3. Database trigger (on_auth_user_created) fires
      ↓
4. Trigger creates public.users record
      - role: 'fan' (default)
      - full_name: from form or email
      ↓
5. User is redirected based on role:
      - fan → / (homepage)
      - talent → /dashboard
      - admin → /admin
```

### Required Trigger (MUST HAVE)

```sql
-- Auto-create public.users when user signs up
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

**⚠️ IMPORTANT:** This trigger MUST exist in both production and dev!

### Login Redirect Logic

Defined in 2 places:

**1. Middleware** (`lib/supabase/middleware.ts:86-91`)
```typescript
let redirectPath = '/' // Default for fans
if (userData?.role === 'admin') {
  redirectPath = '/admin'
} else if (userData?.role === 'talent') {
  redirectPath = '/dashboard'
}
```

**2. Login Page** (`app/login/page.tsx:64-71`)
```typescript
if (userData?.role === 'admin') {
  router.push('/admin');
} else if (userData?.role === 'talent') {
  router.push('/dashboard');
} else {
  router.push('/'); // Fans to homepage
}
```

---

## Talent Application Workflow

### Complete Lifecycle

```
┌─────────────────────────────────────────────────────┐
│ 1. FAN STAGE                                        │
│    - User signs up                                  │
│    - role = 'fan'                                   │
│    - No talent_profile                              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ 2. APPLICATION STAGE                                │
│    - Fan clicks "Become a Talent"                   │
│    - Fills application form                         │
│    - talent_applications record created:            │
│      * status = 'pending'                           │
│      * user_id links to their public.users record   │
│    - User still a 'fan'                             │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ 3. ADMIN REVIEW                                     │
│    - Admin sees application in dashboard            │
│    - Reviews bio, pricing, social media             │
│    - Clicks "Approve" or "Reject"                   │
└─────────────────────────────────────────────────────┘
                    ↓
      ┌─────────────┴─────────────┐
      ↓                           ↓
┌──────────────┐          ┌──────────────┐
│ 4a. APPROVED │          │ 4b. REJECTED │
└──────────────┘          └──────────────┘
      ↓                           ↓
  3 things happen:          2 things happen:
  ① talent_applications     ① talent_applications
     status = 'approved'        status = 'rejected'
  ② public.users            ② talent_profile
     role = 'talent'            admin_verified = false
  ③ talent_profiles            (if exists)
     record CREATED
     admin_verified = true
                                ↓
                        User role stays 'fan'
                        (or changes back to 'fan')
                                ↓
                        Can re-apply or
                        admin can re-approve
```

### Code Flow: Approve Talent

**API Route:** `app/api/talent-applications/[id]/status/route.ts`

When admin clicks "Approve":

```typescript
if (status === 'approved' && application.user_id) {
  // Step 1: Update user role to 'talent'
  await adminClient
    .from('users')
    .update({ role: 'talent' })
    .eq('id', application.user_id);

  // Step 2: Check if profile already exists
  const { data: existingProfile } = await adminClient
    .from('talent_profiles')
    .select('id')
    .eq('user_id', application.user_id)
    .single();

  // Step 3: Create profile OR re-enable existing one
  if (!existingProfile) {
    // Create new profile
    await adminClient.from('talent_profiles').insert({
      user_id: application.user_id,
      display_name: application.stage_name,
      bio: application.bio,
      category: application.category,
      price_usd: application.proposed_price_usd,
      price_zig: application.proposed_price_usd * 50,
      admin_verified: true,
      is_accepting_bookings: true,
    });
  } else {
    // Re-enable existing profile (if was previously rejected)
    await adminClient
      .from('talent_profiles')
      .update({
        admin_verified: true,
        is_accepting_bookings: true
      })
      .eq('user_id', application.user_id);
  }
}
```

### Code Flow: Reject Talent

```typescript
if (status === 'rejected' && application.user_id) {
  // Deactivate talent profile (but keep the record)
  await adminClient
    .from('talent_profiles')
    .update({
      admin_verified: false,
      is_accepting_bookings: false
    })
    .eq('user_id', application.user_id);

  // Optionally: Change role back to 'fan'
  // (Currently commented out - role stays 'talent')
}
```

### What Customers See (Browse Page)

**Query:** `app/browse/page.tsx:42`

```typescript
await supabase
  .from('talent_profiles')  // Queries talent_profiles table
  .select('*')
  .eq('admin_verified', true)  // Only verified talents
  .order('total_bookings', { ascending: false })
```

**Key Point:**
- ✅ Shows only `talent_profiles` where `admin_verified = true`
- ❌ Rejected talents (admin_verified = false) are hidden
- ❌ Pending applications (no profile yet) don't appear

---

## Role-Based Redirects

### After Login/Signup

| User Role | Redirects To | Dashboard Access |
|-----------|--------------|------------------|
| **fan** | `/` (Homepage) | None |
| **talent** | `/dashboard` | Talent Dashboard (manage bookings, videos) |
| **admin** | `/admin` | Admin Panel (approve talents, moderate content) |

### Implementation

**Middleware:** `lib/supabase/middleware.ts`
- Runs on every request
- Checks user authentication
- Redirects based on role

**Login Page:** `app/login/page.tsx`
- Queries user role after successful login
- Redirects accordingly

**Signup Page:** `app/signup/page.tsx`
- Redirects after account creation
- Fans → `/` (homepage)
- Talents → `/join` (onboarding)

---

## Row Level Security (RLS)

### Why RLS?

Row Level Security ensures users can only access data they're authorized to see:
- Fans can't see other fans' bookings
- Talents can only see their own bookings
- Admins can see everything

### Key RLS Policies

#### Public Access (Everyone)

```sql
-- Categories (anyone can view)
CREATE POLICY "Enable read access for all users"
  ON public.categories FOR SELECT
  USING (true);

-- Talent Profiles (public can view verified)
CREATE POLICY "Enable read access for verified talents"
  ON public.talent_profiles FOR SELECT
  USING (admin_verified = true OR auth.uid() = user_id);

-- Users (public can read basic info)
CREATE POLICY "Enable read access for all users"
  ON public.users FOR SELECT
  USING (true);
```

#### Admin Access

```sql
-- Helper function (prevents infinite recursion)
CREATE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (public.is_admin());
```

#### User-Specific Access

```sql
-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- Talents can view bookings for themselves
CREATE POLICY "Talents can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    talent_id IN (
      SELECT id FROM public.talent_profiles
      WHERE user_id = auth.uid()
    )
  );
```

### Granting Permissions

```sql
-- Grant permissions to roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Service role bypasses RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
```

---

## Production Checklist

Before deploying to production or when setting up production database:

### Database Setup

- [ ] All migration files applied in correct order
- [ ] Foreign keys reference `public.users` (not `auth.users`)
- [ ] RLS policies created for all tables
- [ ] `is_admin()` function exists (SECURITY DEFINER)
- [ ] All indexes created for performance
- [ ] **Trigger `on_auth_user_created` exists** ⚠️ CRITICAL

### Verify Trigger Exists in Production

```sql
-- Check if trigger exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If missing, create it!
-- (Use the same trigger creation SQL from "User Authentication Flow" section)
```

### Authentication Settings

**Production:**
- [ ] Email confirmation: **ON** ✅ (security)
- [ ] SMTP configured for email delivery
- [ ] Password requirements enforced
- [ ] Rate limiting enabled

**Dev:**
- [ ] Email confirmation: **OFF** ❌ (easier testing)
- [ ] SMTP: Not required
- [ ] Auto-create trigger: **ON** ✅

### Environment Variables

**Production (Vercel):**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Production Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Production anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Production service role key
- [ ] Payment keys: **LIVE** keys 🔴
- [ ] All secrets encrypted and not in code

**Dev (Local):**
- [ ] `.env.local` pointing to dev database
- [ ] `.env.local.backup` has production credentials (backup)
- [ ] Payment keys: **TEST** keys 🟢

### Data Integrity

```sql
-- Check for orphaned records
SELECT
  (SELECT COUNT(*) FROM talent_profiles WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE id = user_id
  )) as orphaned_profiles,
  (SELECT COUNT(*) FROM bookings WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE id = customer_id
  )) as orphaned_bookings,
  (SELECT COUNT(*) FROM users WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = users.id
  )) as users_without_auth;
-- All should return 0
```

---

## Common Operations

### Create Admin User

```sql
-- Method 1: Via Dashboard
-- 1. Go to Auth → Users → Add user
-- 2. Create account
-- 3. Then run:
UPDATE public.users
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'admin@example.com';

-- Method 2: All-in-one SQL
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated', 'authenticated',
  'admin@example.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb
) RETURNING id;

-- Use the returned ID:
INSERT INTO public.users (id, email, full_name, role, region, preferred_currency)
VALUES ('[RETURNED_ID]', 'admin@example.com', 'Admin User', 'admin', 'zimbabwe', 'USD');
```

### Manually Approve Talent

```sql
-- If approval API fails, manually create profile:
WITH app AS (
  SELECT * FROM talent_applications WHERE id = 'APPLICATION_ID'
)
INSERT INTO talent_profiles (
  user_id, display_name, bio, category,
  price_usd, price_zig, response_time_hours,
  admin_verified, is_accepting_bookings
)
SELECT
  user_id, stage_name, bio, category,
  proposed_price_usd, proposed_price_usd * 50, response_time_hours,
  true, true
FROM app;

-- Update application status
UPDATE talent_applications SET status = 'approved' WHERE id = 'APPLICATION_ID';

-- Update user role
UPDATE users SET role = 'talent' WHERE id = (
  SELECT user_id FROM talent_applications WHERE id = 'APPLICATION_ID'
);
```

### Clear Dev Database (Fresh Start)

```sql
-- Delete all data, keep structure
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.favorites CASCADE;
TRUNCATE TABLE public.talent_profiles CASCADE;
TRUNCATE TABLE public.talent_applications CASCADE;
TRUNCATE TABLE public.categories CASCADE;
TRUNCATE TABLE public.users CASCADE;
DELETE FROM auth.users;
```

### Delete Only Non-Talent Users

```sql
-- Keep only talent users
DELETE FROM public.notifications WHERE user_id IN (
  SELECT id FROM public.users WHERE role != 'talent'
);
DELETE FROM public.payments WHERE user_id IN (
  SELECT id FROM public.users WHERE role != 'talent'
);
DELETE FROM public.bookings WHERE customer_id IN (
  SELECT id FROM public.users WHERE role != 'talent'
);
DELETE FROM public.favorites WHERE user_id IN (
  SELECT id FROM public.users WHERE role != 'talent'
);
DELETE FROM auth.users WHERE id IN (
  SELECT id FROM public.users WHERE role != 'talent'
);
DELETE FROM public.users WHERE role != 'talent';
```

---

## Troubleshooting

### Issue: "Email not confirmed" error

**Cause:** `auth.users.email_confirmed_at` is NULL

**Solution:**
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'user@example.com';
```

**Or:** Turn off email confirmation in Supabase Dashboard → Auth → Email → Confirm email = OFF

### Issue: User not in public.users table

**Cause:** Trigger `on_auth_user_created` missing or not working

**Solution:**
```sql
-- Manually create public.users record
INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, split_part(email, '@', 1), 'fan'
FROM auth.users
WHERE email = 'user@example.com'
ON CONFLICT (id) DO NOTHING;

-- Then create the trigger for future users (see trigger SQL above)
```

### Issue: "Permission denied for table X"

**Cause:** RLS policies blocking access

**Solution:**
```sql
-- Grant permissions
GRANT SELECT ON public.TABLE_NAME TO anon, authenticated;

-- Or create permissive policy
CREATE POLICY "Allow read for authenticated"
  ON public.TABLE_NAME FOR SELECT
  TO authenticated
  USING (true);
```

### Issue: Admin redirected to wrong dashboard

**Cause:**
1. Role not set correctly in database
2. Middleware role query failing
3. Browser cache

**Solutions:**
```sql
-- 1. Verify role in database
SELECT id, email, role FROM public.users WHERE email = 'admin@example.com';

-- 2. If role is wrong, fix it
UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';

-- 3. Test if middleware can read role
-- (Should work if RLS policies are correct)
```

Then:
- Clear browser cache (Ctrl+Shift+R)
- Log out and log back in
- Try incognito window

### Issue: Approved talent not showing on browse page

**Cause:**
1. talent_profile not created
2. admin_verified = false
3. Profile creation failed during approval

**Check:**
```sql
-- Find approved applications without profiles
SELECT
  ta.stage_name,
  ta.status,
  ta.user_id,
  tp.id as profile_id,
  tp.admin_verified
FROM talent_applications ta
LEFT JOIN talent_profiles tp ON tp.user_id = ta.user_id
WHERE ta.status = 'approved' AND tp.id IS NULL;
```

**Solution:**
Manually create the missing profile (see "Manually Approve Talent" section above)

### Issue: Foreign key constraint violation

**Cause:** Trying to insert record that references non-existent parent

**Solution:**
Ensure data is imported in correct order:
1. users (first)
2. talent_profiles
3. bookings
4. payments (last)

### Issue: Infinite recursion in RLS policy

**Cause:** RLS policy queries the same table it's protecting

**Solution:**
Use SECURITY DEFINER function (see `is_admin()` function above)

---

## Development Workflow

### Starting New Feature

```bash
# 1. Make sure you're on dev database
cat .env.local | grep SUPABASE_URL
# Should show: qhhocguovfbbtyjxjfmc

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Start dev server
npm run dev

# 4. Make changes and test
```

### Making Schema Changes

```bash
# 1. Create migration file
touch supabase/migrations/$(date +%Y%m%d)_my_change.sql

# 2. Write your SQL changes

# 3. Test in dev database first
# (Run in Dev SQL Editor)

# 4. If it works, apply to production later
# (Run in Production SQL Editor)
```

### Before Deploying

- [ ] Test all features locally
- [ ] Check no console errors
- [ ] Verify database migrations work
- [ ] Test with different user roles (fan, talent, admin)
- [ ] Clear `.next` cache: `rm -rf .next`
- [ ] Build succeeds: `npm run build`
- [ ] Check environment variables in Vercel

---

## Key Learnings from Migration

### 1. Foreign Keys Must Reference Correct Tables
❌ `REFERENCES auth.users(id)` - Don't do this
✅ `REFERENCES public.users(id)` - Do this

### 2. RLS Policies Need SECURITY DEFINER
Use functions with SECURITY DEFINER to prevent recursion when checking roles.

### 3. Triggers Are Not Optional
The `on_auth_user_created` trigger is REQUIRED for the app to work. Without it, `public.users` won't be populated.

### 4. Production ≠ Dev Schema
Production schema may differ from migrations. Always check actual column names when migrating data.

### 5. Email Confirmation Settings
- Production: Keep ON for security
- Dev: Turn OFF for easier testing

---

## Quick Reference

### Supabase Dashboard Links

**Production:**
- Project: https://supabase.com/dashboard/project/fyvqvqzdtuugqcxglwew
- SQL Editor: https://supabase.com/dashboard/project/fyvqvqzdtuugqcxglwew/sql-editor
- Auth Users: https://supabase.com/dashboard/project/fyvqvqzdtuugqcxglwew/auth/users

**Dev:**
- Project: https://supabase.com/dashboard/project/qhhocguovfbbtyjxjfmc
- SQL Editor: https://supabase.com/dashboard/project/qhhocguovfbbtyjxjfmc/sql-editor
- Auth Users: https://supabase.com/dashboard/project/qhhocguovfbbtyjxjfmc/auth/users

### Common SQL Queries

```sql
-- Show all users with roles
SELECT email, role, full_name FROM public.users ORDER BY role;

-- Show active talents
SELECT display_name, category, admin_verified
FROM talent_profiles WHERE admin_verified = true;

-- Show pending applications
SELECT stage_name, email, status, created_at
FROM talent_applications WHERE status = 'pending'
ORDER BY created_at;

-- Show recent bookings
SELECT booking_code, status, amount_paid, created_at
FROM bookings ORDER BY created_at DESC LIMIT 10;

-- Check database health
SELECT
  schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Support & Resources

### Documentation
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Docs](https://nextjs.org/docs)

### Project Documentation
- [DEV-DATABASE-SETUP.md](./DEV-DATABASE-SETUP.md) - Initial setup guide
- [MIGRATION-TROUBLESHOOTING.md](./MIGRATION-TROUBLESHOOTING.md) - Migration issues
- [DATA-SEEDING-GUIDE.md](./DATA-SEEDING-GUIDE.md) - Data copying guide
- [SQL-EDITOR-MIGRATION.md](./SQL-EDITOR-MIGRATION.md) - SQL-only migration
- [IMPORT-DATA-STEP-BY-STEP.md](./IMPORT-DATA-STEP-BY-STEP.md) - Detailed import guide

---

## Conclusion

Your ToraShaout development environment is now fully configured with:

✅ Separate dev database (safe testing)
✅ Production data migrated
✅ All RLS policies working
✅ Authentication flow complete
✅ Talent approval workflow functional
✅ Role-based redirects working
✅ Admin dashboard operational

**You can now develop features safely without affecting production!** 🚀

---

**Last Updated:** January 30, 2026
**Maintained by:** Development Team
**Questions?** Check the troubleshooting section or review related docs.
