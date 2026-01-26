# Database Migrations Guide

Complete guide for managing database migrations in ToraShaout.

---

## Overview

ToraShaout uses **Supabase PostgreSQL** as the database backend. Migrations are SQL files stored in `/supabase/migrations/` that create or modify database schema.

---

## Migration Files

### Available Migrations

| Migration | Description | Status |
|-----------|-------------|--------|
| `20260121_create_talent_applications.sql` | Talent application system | ✅ Ready |
| More migrations coming... | Future schema changes | 🚧 Planned |

---

## Applying Migrations

### Option 1: Supabase Dashboard (Recommended)

**Best for**: First-time setup, one-time migrations

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**: https://app.supabase.com/project/YOUR_PROJECT_ID/sql
3. Click **New Query**
4. Copy the contents of the migration file
5. Paste into the editor
6. Click **Run** to execute
7. Verify success message

**Advantages**:
- No CLI installation required
- Visual feedback
- Can review changes before applying
- Easy to troubleshoot errors

### Option 2: Supabase CLI

**Best for**: Development workflow, multiple migrations

```bash
# Install Supabase CLI (one-time)
npm install -g supabase

# Login to your Supabase account
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Apply all pending migrations
supabase db push

# Or apply specific migration
psql $DATABASE_URL < supabase/migrations/20260121_create_talent_applications.sql
```

**Advantages**:
- Automated workflow
- Version control integration
- Can script migrations
- Faster for multiple migrations

### Option 3: Node.js Script

**Best for**: Checking migration status programmatically

```bash
# Check if migration is needed
node scripts/check-migration.js

# Shows:
# ✅ Table exists
# ✅ UNIQUE constraint exists
# OR
# ❌ Table does not exist - needs migration
```

---

## Migration: Talent Applications

### File Location

`supabase/migrations/20260121_create_talent_applications.sql`

### What It Creates

1. **Table**: `talent_applications`
   - Stores talent signup applications
   - 25 columns including personal info, social media, platform details
   - UNIQUE constraint on email (prevents duplicates)

2. **Indexes** (3):
   - `idx_talent_applications_email` - Fast email lookups
   - `idx_talent_applications_status` - Filter by status
   - `idx_talent_applications_created_at` - Sort by date

3. **RLS Policies** (3):
   - Public can INSERT (submit applications)
   - Only admins can SELECT (view applications)
   - Only admins can UPDATE (review/approve)

4. **Triggers** (1):
   - Auto-update `updated_at` timestamp on changes

5. **Functions** (1):
   - `update_talent_applications_updated_at()` - Timestamp updater

### Apply This Migration

**Step 1**: Copy the migration SQL

```bash
cat supabase/migrations/20260121_create_talent_applications.sql
```

**Step 2**: Run in Supabase dashboard

Go to: https://app.supabase.com/project/YOUR_PROJECT_ID/sql

Paste and click **Run**.

**Step 3**: Verify it worked

```sql
-- Check table exists
SELECT COUNT(*) FROM talent_applications;
-- Should return 0 (empty table)

-- Check unique constraint
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'talent_applications'
AND constraint_type = 'UNIQUE';
-- Should return: talent_applications_email_key
```

### Rollback (If Needed)

```sql
-- Drop table and all dependencies
DROP TABLE IF EXISTS talent_applications CASCADE;
DROP FUNCTION IF EXISTS update_talent_applications_updated_at CASCADE;
```

**Warning**: This will delete all application data. Only use in development.

---

## Verification Steps

### After Migration

Run these queries to verify everything worked:

```sql
-- 1. Check table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'talent_applications';

-- 2. Check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'talent_applications'
ORDER BY ordinal_position;

-- 3. Check indexes
SELECT indexname
FROM pg_indexes
WHERE tablename = 'talent_applications';

-- 4. Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'talent_applications';

-- 5. Check constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'talent_applications';
```

### Expected Results

- ✅ Table created: `talent_applications`
- ✅ 25 columns defined
- ✅ 3 indexes created
- ✅ RLS enabled: `true`
- ✅ 5 constraints (PRIMARY KEY, UNIQUE, 3 CHECK constraints)
- ✅ 3 RLS policies active
- ✅ 1 trigger active

---

## Testing

### Test Application Submission

```bash
# Test via browser
# 1. Go to http://localhost:3000/join
# 2. Fill out form
# 3. Submit
# 4. Should see success message

# Test via API
curl -X POST http://localhost:3000/api/talent-applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "stageName": "Test Talent",
    "email": "test@example.com",
    "phone": "+263123456789",
    "category": "musician",
    "bio": "Test bio",
    "yearsActive": "5",
    "notableWork": "Test work",
    "proposedPrice": "50",
    "responseTime": "48",
    "agreeToTerms": true
  }'
```

### Test Email Uniqueness

```sql
-- Try to insert duplicate email
INSERT INTO talent_applications (
  first_name, last_name, stage_name, email, phone,
  category, bio, years_active, notable_work,
  proposed_price_usd, response_time_hours
) VALUES (
  'Test', 'User', 'Test', 'test@example.com', '+263123456789',
  'musician', 'Bio', 5, 'Work', 50, 48
);

-- Should get error:
-- ERROR: duplicate key value violates unique constraint "talent_applications_email_key"
```

### Test Admin Access

```sql
-- As non-admin user
SELECT * FROM talent_applications;
-- Should return: 0 rows (RLS policy blocks access)

-- As admin user
SELECT * FROM talent_applications;
-- Should return: All applications
```

---

## Troubleshooting

### Error: "relation does not exist"

**Problem**: Table `talent_applications` was not created.

**Solution**:
1. Check migration ran successfully
2. Look for error messages in Supabase dashboard
3. Try running migration again
4. Verify you're connected to correct project

### Error: "duplicate key value violates unique constraint"

**Problem**: Trying to insert application with existing email.

**Solution**: This is expected behavior! Email must be unique.
- Use different email, OR
- Delete existing application first (development only)

### Error: "permission denied"

**Problem**: RLS policy blocking access.

**Solution**:
1. Check user is authenticated
2. Verify user has admin role:
```sql
SELECT role FROM users WHERE id = auth.uid();
```
3. Update role if needed:
```sql
UPDATE users SET role = 'admin' WHERE id = auth.uid();
```

### Error: "column does not exist"

**Problem**: Migration didn't create all columns.

**Solution**:
1. Check migration file is complete
2. Re-run migration
3. Verify column names match API expectations

---

## Migration Best Practices

### 1. Always Backup First

```bash
# Create backup before migration
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Test in Development First

- Never run untested migrations in production
- Use separate Supabase project for testing
- Verify all constraints and policies work

### 3. Use Transactions

Migrations should be atomic (all-or-nothing):

```sql
BEGIN;

-- Your migration SQL here

COMMIT;
-- Or ROLLBACK; if something failed
```

### 4. Add Comments

```sql
COMMENT ON TABLE talent_applications IS 'Stores talent applications for admin review';
COMMENT ON COLUMN talent_applications.email IS 'Unique email address - prevents duplicate applications';
```

### 5. Version Control

- Commit migration files to git
- Use clear naming: `YYYYMMDD_description.sql`
- Never modify existing migrations (create new ones)

### 6. Document Breaking Changes

If migration changes existing behavior:
- Update API documentation
- Notify team members
- Add migration notes in commit message
- Update client code if needed

---

## Migration Checklist

Before running a migration:

- [ ] Reviewed SQL for syntax errors
- [ ] Tested in development environment
- [ ] Backed up production database (if applicable)
- [ ] Verified RLS policies are correct
- [ ] Checked constraints won't break existing data
- [ ] Updated API code to handle new schema
- [ ] Updated TypeScript types if needed
- [ ] Documented breaking changes
- [ ] Prepared rollback plan

After running a migration:

- [ ] Verified table/columns created correctly
- [ ] Checked indexes exist
- [ ] Tested RLS policies work as expected
- [ ] Verified constraints enforce validation
- [ ] Tested application functionality end-to-end
- [ ] Checked for performance issues
- [ ] Updated documentation
- [ ] Committed migration file to git

---

## Useful Commands

### Check Migration Status

```sql
-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check specific table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'talent_applications'
);

-- Get table row count
SELECT COUNT(*) FROM talent_applications;
```

### View Table Schema

```sql
-- Get table definition
\d talent_applications

-- Or with SQL
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'talent_applications'
ORDER BY ordinal_position;
```

### Check RLS Policies

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'talent_applications';
```

### View Indexes

```sql
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'talent_applications';
```

---

## Resources

- **Supabase Migrations Docs**: https://supabase.com/docs/guides/cli/local-development#database-migrations
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/current/ddl.html
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Talent Applications Docs**: [TALENT_APPLICATIONS.md](./TALENT_APPLICATIONS.md)

---

## Support

For migration issues:
1. Check error message in Supabase dashboard
2. Review this documentation
3. Test SQL in Supabase SQL Editor
4. Check Supabase logs for detailed errors

---

**Migrations Made Simple!** 🚀

Follow this guide to safely manage database schema changes in ToraShaout.
