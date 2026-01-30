# Quick Reference Guide

Essential commands and SQL queries for daily development.

---

## 🚀 Getting Started

### Start Dev Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### Check Current Database
```bash
cat .env.local | grep SUPABASE_URL
# Dev: qhhocguovfbbtyjxjfmc
# Prod: fyvqvqzdtuugqcxglwew (in .env.local.backup)
```

---

## 👥 User Management

### Create Admin User
```sql
-- Update existing user to admin
UPDATE public.users SET role = 'admin' WHERE email = 'user@example.com';
```

### Confirm User Email
```sql
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'user@example.com';
```

### Create public.users from auth.users
```sql
INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, 'Name', 'fan'
FROM auth.users WHERE email = 'user@example.com'
ON CONFLICT (id) DO NOTHING;
```

### View All Users
```sql
SELECT u.email, u.role, u.full_name, au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON au.id = u.id
ORDER BY u.created_at DESC;
```

---

## 🎭 Talent Management

### View Active Talents
```sql
SELECT display_name, category, price_usd, admin_verified
FROM talent_profiles
WHERE admin_verified = true
ORDER BY total_bookings DESC;
```

### View Pending Applications
```sql
SELECT stage_name, email, category, status, created_at
FROM talent_applications
WHERE status = 'pending'
ORDER BY created_at;
```

### Manually Create Talent Profile
```sql
-- After approving application
INSERT INTO talent_profiles (
  user_id, display_name, bio, category,
  price_usd, price_zig, admin_verified
) VALUES (
  'USER_ID', 'Display Name', 'Bio text', 'musician',
  50.00, 2500.00, true
);

-- Update user role
UPDATE users SET role = 'talent' WHERE id = 'USER_ID';
```

### Check Application → Profile Mapping
```sql
SELECT
  ta.stage_name, ta.status,
  tp.display_name, tp.admin_verified,
  u.role
FROM talent_applications ta
LEFT JOIN talent_profiles tp ON tp.user_id = ta.user_id
LEFT JOIN users u ON u.id = ta.user_id
ORDER BY ta.created_at DESC;
```

---

## 📊 Bookings & Payments

### Recent Bookings
```sql
SELECT
  booking_code,
  (SELECT email FROM users WHERE id = customer_id) as customer,
  (SELECT display_name FROM talent_profiles WHERE id = talent_id) as talent,
  amount_paid,
  status,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;
```

### Payment Status
```sql
SELECT
  p.reference,
  p.amount,
  p.status,
  b.booking_code
FROM payments p
JOIN bookings b ON b.id = p.booking_id
ORDER BY p.created_at DESC;
```

---

## 🔧 Database Maintenance

### Check Row Counts
```sql
SELECT
  'users' as table, COUNT(*) as rows FROM users
UNION ALL SELECT 'talent_profiles', COUNT(*) FROM talent_profiles
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'talent_applications', COUNT(*) FROM talent_applications;
```

### Check Foreign Key Integrity
```sql
-- Should all return 0
SELECT 'Orphaned profiles' as check, COUNT(*)
FROM talent_profiles WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE id = user_id
)
UNION ALL
SELECT 'Orphaned bookings', COUNT(*)
FROM bookings WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE id = customer_id
)
UNION ALL
SELECT 'Users without auth', COUNT(*)
FROM users WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = users.id
);
```

### Check RLS Policies
```sql
SELECT
  schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Check Triggers
```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

---

## 🎯 Testing

### Create Test Data

```sql
-- Insert test categories (if missing)
INSERT INTO categories (name, slug, icon) VALUES
  ('Musicians', 'musician', '🎵'),
  ('Comedians', 'comedian', '😂'),
  ('Gospel Artists', 'gospel', '🙏')
ON CONFLICT (slug) DO NOTHING;

-- Create test admin
-- (Use SQL from "Create Admin User" section)

-- Create test talent
-- (Approve a talent application or manually create profile)
```

### Verify Everything Works

1. **Signup**: Create new fan account
2. **Login**: Log in as different roles (fan, talent, admin)
3. **Apply**: Submit talent application
4. **Approve**: Approve as admin
5. **Browse**: Check talent appears on browse page
6. **Book**: Create a test booking
7. **Dashboard**: Check all dashboards load

---

## 🔐 Security Checklist

### Dev Environment
- [ ] Email confirmation: OFF
- [ ] Using TEST payment keys
- [ ] Not exposing production credentials
- [ ] .env.local in .gitignore

### Production
- [ ] Email confirmation: ON
- [ ] Using LIVE payment keys
- [ ] All secrets in Vercel environment variables
- [ ] SMTP configured for emails
- [ ] Rate limiting enabled
- [ ] SSL/HTTPS enabled

---

## 📦 Git Workflow

### Branch Strategy
```bash
main → production (auto-deploys to Vercel)
feature/* → development (local testing)
```

### Typical Flow
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# (Use dev database in .env.local)

# 3. Test locally
npm run dev

# 4. Commit and push
git add .
git commit -m "Description"
git push origin feature/my-feature

# 5. Create PR and merge to main
# (Production auto-deploys)
```

---

## 🆘 Emergency Commands

### Reset Dev Database
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Then re-run migrations
```

### Kill All Dev Servers
```bash
ps aux | grep "next dev" | grep -v grep | awk '{print $2}' | xargs kill -9
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Switch to Production DB (Careful!)
```bash
cp .env.local.backup .env.local
# ⚠️ Only do this if you know what you're doing!
```

### Switch Back to Dev DB
```bash
# Restore dev credentials
# (Manually update .env.local or keep a .env.dev backup)
```

---

## 📞 Quick Help

### Can't Login?
1. Check email is confirmed: `SELECT email_confirmed_at FROM auth.users WHERE email = '...'`
2. Check user exists in public.users: `SELECT * FROM users WHERE email = '...'`
3. Try password reset in Supabase Dashboard

### Can't See Data?
1. Check RLS policies allow access
2. Verify data exists: `SELECT COUNT(*) FROM table_name`
3. Check role has permission

### Admin Dashboard Not Loading?
1. Check all required tables exist
2. Verify RLS policies allow admin access
3. Check browser console for errors

### Talent Not Showing on Browse?
1. Check `admin_verified = true`
2. Verify profile exists: `SELECT * FROM talent_profiles WHERE user_id = '...'`
3. Check browse page query in browser console

---

**For detailed explanations, see:** [COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md)
