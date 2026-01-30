# ToraShaout Scripts & Commands

Quick reference for all available scripts and commands in the ToraShaout project.

---

## Development

### Start Development Server

```bash
npm run dev
```

Opens at http://localhost:3000

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## Authentication & User Management

### Create Admin Account

**Quick Method:**
```bash
node create-admin-simple.js <email> <password> <full-name>
```

**Example:**
```bash
node create-admin-simple.js admin@example.com your-secure-password "Admin User"
```

**Interactive Method:**
```bash
node create-admin.js
```

Choose from:
1. Create new admin account (guided prompts)
2. Promote existing user to admin

**Security Note:** Never commit admin credentials to version control. Store them securely.

---

## Database

### Seed Initial Data

```bash
node seed-data.js
```

Seeds:
- 7 talent categories (Musicians, Comedians, Gospel, etc.)

### Test Database Connection

```bash
node test-connection.js
```

Tests:
- Database connectivity
- All 7 tables accessibility
- Authentication status

---

## Testing & Verification

### Check All Tables

```bash
node test-connection.js
```

Verifies:
- ✅ users
- ✅ talent_profiles
- ✅ bookings
- ✅ payments
- ✅ favorites
- ✅ categories
- ✅ notifications

---

## Supabase Setup

### Run Database Migrations

See [BACKEND_CHECKLIST.md](./BACKEND_CHECKLIST.md) for:
1. Creating Supabase project
2. Running 10 SQL migrations
3. Seeding categories
4. Setting up storage

### Fix RLS Policies (if needed)

If you encounter "infinite recursion" errors, run:

```sql
-- In Supabase SQL Editor
-- Copy contents from: fix-rls-policies.sql
```

---

## Environment Setup

### Copy Environment Template

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials:
- Supabase URL
- Supabase Anon Key
- Supabase Service Role Key

---

## Git Commands

### Initial Setup

```bash
git init
git add .
git commit -m "Initial commit"
```

### Push to GitHub

```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

---

## Useful File Locations

### Configuration Files
- `.env.local` - Environment variables (Supabase credentials)
- `.env.example` - Environment template
- `middleware.ts` - Route protection configuration
- `next.config.ts` - Next.js configuration

### Database Scripts
- `seed-data.js` - Seed categories
- `test-connection.js` - Test database
- `create-admin-simple.js` - Create admin user
- `create-admin.js` - Interactive admin creation
- `fix-rls-policies.sql` - Fix database policies

### Documentation
- `README.md` - Main project documentation
- `BACKEND_CHECKLIST.md` - Backend setup guide
- `docs/AUTHENTICATION_GUIDE.md` - Auth implementation guide
- `docs/SUPABASE_SETUP.md` - Detailed Supabase setup
- `docs/BACKEND_README.md` - Backend API reference

### Key Code Files
- `lib/supabase/client.ts` - Supabase client
- `lib/supabase/server.ts` - Server-side Supabase
- `lib/supabase/middleware.ts` - Auth middleware
- `lib/hooks/useAuth.ts` - Auth React hook
- `lib/api/` - API functions (talents, bookings, users, etc.)
- `components/AuthNavbar.tsx` - Navbar with auth
- `components/Navbar.tsx` - Simple navbar

---

## Common Tasks

### Create a New Admin User

```bash
node create-admin-simple.js newadmin@example.com password123 "New Admin"
```

### Promote Existing User to Admin

Option 1: Use script
```bash
node create-admin.js
# Choose option 2
```

Option 2: SQL query
```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'user@example.com';
```

### Test If Backend Is Working

```bash
# 1. Test database connection
node test-connection.js

# 2. Start dev server
npm run dev

# 3. Try to login at http://localhost:3000/login
```

### Reseed Categories

If categories are missing:
```bash
node seed-data.js
```

---

## Troubleshooting Commands

### Check if Supabase is connected

```bash
node test-connection.js
```

### Check environment variables

```bash
cat .env.local | grep SUPABASE
```

### Verify admin user exists

In Supabase SQL Editor:
```sql
SELECT id, email, role FROM public.users WHERE role = 'admin';
```

### Check Node version

```bash
node --version  # Should be 18+
```

### Clear node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Create admin | `node create-admin-simple.js email pass name` |
| Seed database | `node seed-data.js` |
| Test database | `node test-connection.js` |
| Build production | `npm run build` |
| Copy env template | `cp .env.example .env.local` |

---

## Need Help?

- 📖 [Authentication Guide](./docs/AUTHENTICATION_GUIDE.md)
- 📖 [Backend Setup](./BACKEND_CHECKLIST.md)
- 📖 [Main README](./README.md)

---

Last Updated: January 2026
