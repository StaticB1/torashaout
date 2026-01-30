# Backend Setup Checklist

Use this checklist to set up Supabase backend for ToraShaout.

---

## Phase 1: Supabase Project Setup

- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project
  - [ ] Choose project name (e.g., "torashaout-production")
  - [ ] Set database password (save securely!)
  - [ ] Select region (South Africa recommended for Zimbabwe)
- [ ] Wait for project provisioning (~2-3 minutes)

---

## Phase 2: Get API Credentials

- [ ] Go to Project Settings > API
- [ ] Copy **Project URL**
- [ ] Copy **anon public** key
- [ ] Copy **service_role** key (keep secret!)

---

## Phase 3: Configure Environment

- [ ] Open `/workspaces/torashaout/.env.local`
- [ ] Update `NEXT_PUBLIC_SUPABASE_URL` with your project URL
- [ ] Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` with anon key
- [ ] Update `SUPABASE_SERVICE_ROLE_KEY` with service role key
- [ ] Save file

---

## Phase 4: Run Database Migrations

- [ ] Open Supabase dashboard > SQL Editor
- [ ] Run Migration 1: Create Enums (from docs/SUPABASE_SETUP.md)
- [ ] Run Migration 2: Create Users Table + RLS
- [ ] Run Migration 3: Create Talent Profiles Table + RLS
- [ ] Run Migration 4: Create Bookings Table + RLS
- [ ] Run Migration 5: Create Payments Table + RLS
- [ ] Run Migration 6: Create Favorites Table + RLS
- [ ] Run Migration 7: Create Categories Table + RLS
- [ ] Run Migration 8: Create Notifications Table + RLS
- [ ] Run Migration 9: Create Database Functions & Triggers
- [ ] Run Migration 10: Create User Profile Trigger

**Verify tables created:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

Expected: 7 tables (users, talent_profiles, bookings, payments, favorites, categories, notifications)

---

## Phase 5: Seed Initial Data

- [ ] Run seed SQL from docs/SUPABASE_SETUP.md (Step 5)
- [ ] Verify categories created:
```sql
SELECT COUNT(*) FROM public.categories;
```
Expected: 7 categories

---

## Phase 6: Configure Storage (Optional for now)

- [ ] Go to Storage in Supabase dashboard
- [ ] Create `videos` bucket (Private)
- [ ] Create `thumbnails` bucket (Public)
- [ ] Run storage policies from docs/SUPABASE_SETUP.md (Step 7)

---

## Phase 7: Enable Realtime (Optional for now)

- [ ] Go to Database > Replication
- [ ] Enable replication for `notifications` table

---

## Phase 8: Test Your Setup

Run these queries in SQL Editor:

- [ ] Test categories:
```sql
SELECT * FROM public.categories;
```

- [ ] Test auth:
```sql
SELECT auth.uid(); -- Should return NULL (not logged in yet)
```

- [ ] Test RLS:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```
All tables should have `rowsecurity = true`

---

## Phase 9: Verify Code Integration

- [ ] Dependencies installed: `@supabase/supabase-js`, `@supabase/ssr`
- [ ] Client utilities created: `/lib/supabase/client.ts`, `server.ts`, `middleware.ts`
- [ ] API functions created: `/lib/api/*.ts` (6 files)
- [ ] Database types created: `/types/database.ts`
- [ ] Environment variables configured: `.env.local`

---

## Phase 10: Create Admin User

### ✅ Recommended Method: Use Admin Creation Script

Run the admin creation script to create an admin account:

```bash
node create-admin-simple.js <email> <password> <full-name>
```

**Example:**
```bash
node create-admin-simple.js admin@example.com your-secure-password "Admin User"
```

The script will:
- ✅ Create the auth user with auto-confirmed email
- ✅ Create or update the user profile with `admin` role
- ✅ Display the account details including User ID

**Note:** Keep admin credentials secure and never commit them to version control.

### Alternative Method: Manual Creation

- [ ] Use Supabase dashboard to create test user:
  - Go to Authentication > Users
  - Click "Add user"
  - Enter email and password
  - User is created
- [ ] Make test user an admin:
```sql
UPDATE public.users SET role = 'admin'
WHERE email = 'your-test-email@example.com';
```

---

## Phase 11: Test API Functions

Create a test page or API route:

```typescript
// app/test/page.tsx
import { getTalents } from '@/lib/api/talents'

export default async function TestPage() {
  const talents = await getTalents()
  return <pre>{JSON.stringify(talents, null, 2)}</pre>
}
```

- [ ] Test fetching data
- [ ] Test creating data
- [ ] Test RLS policies work

---

## Phase 12: Next Steps

After backend is ready:

- [ ] Create authentication pages (`/login`, `/signup`)
- [ ] Connect dashboards to real data
- [ ] Replace mock data with Supabase queries
- [ ] Set up payment webhooks
- [ ] Configure video storage
- [ ] Test booking flow end-to-end
- [ ] Deploy to Vercel

---

## Quick Reference

### Supabase Dashboard URLs
- Project: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`
- SQL Editor: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql`
- Auth: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/users`
- Storage: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/storage/buckets`

### Documentation
- Setup Guide: [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)
- Backend Guide: [docs/BACKEND_README.md](./docs/BACKEND_README.md)
- Supabase Docs: https://supabase.com/docs

### Key Files
- Supabase clients: `/lib/supabase/`
- API functions: `/lib/api/`
- Database types: `/types/database.ts`
- Environment vars: `.env.local`

---

## Troubleshooting

### Issue: Can't connect to Supabase
- Check `.env.local` has correct URL and keys
- Verify project is not paused (free tier auto-pauses after 7 days inactivity)
- Check environment variables start with `NEXT_PUBLIC_` for client-side

### Issue: SQL migrations fail
- Run migrations in order (1-10)
- Check for syntax errors
- Each migration should succeed before next

### Issue: RLS blocking access
- Make sure user is authenticated: `SELECT auth.uid();`
- Check RLS policies match your use case
- Use service role key for admin operations

### Issue: Types don't match
- Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts`
- Update database types after schema changes

---

## Success Criteria

✅ Supabase project created and active
✅ Environment variables configured
✅ All 7 database tables created
✅ RLS policies enabled on all tables
✅ Categories seeded (7 entries)
✅ Database functions and triggers working
✅ API utility functions ready
✅ Test user can be created
✅ Data can be queried from dashboard

---

## Estimated Time

- **Supabase Setup**: 10-15 minutes
- **Database Migrations**: 10 minutes
- **Testing**: 10 minutes
- **Total**: ~30-35 minutes

---

**Once complete, you're ready to start building features!** 🚀

See [docs/BACKEND_README.md](./docs/BACKEND_README.md) for usage examples and next steps.
