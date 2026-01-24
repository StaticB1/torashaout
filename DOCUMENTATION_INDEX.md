# 📚 Project Documentation Index

This document provides quick access to all documentation created for the Torashout project.

---

## 🎯 Talent Application System

### Core Documentation

1. **[BACKEND_CHANGES_SUMMARY.md](BACKEND_CHANGES_SUMMARY.md)**
   - Complete overview of backend changes
   - File modifications and their purposes
   - API endpoint details
   - Database schema information
   - Testing checklist

2. **[VERIFICATION_REPORT.md](VERIFICATION_REPORT.md)**
   - Backend verification status
   - Integration summary
   - Issues found and fixed
   - Testing checklist
   - Server status

3. **[Plan Mode Output](/.claude/plans/)** (if exists)
   - Initial implementation plan
   - Step-by-step implementation strategy
   - Architectural decisions

---

## 🧪 Testing & Setup

### Quick Setup Guides

4. **[QUICK_TEST_SETUP.md](QUICK_TEST_SETUP.md)**
   - Fast SQL-based test data creation
   - Admin dashboard testing steps
   - Verification queries
   - Cleanup instructions

5. **[TEST_APPLICATION_GUIDE.md](TEST_APPLICATION_GUIDE.md)**
   - UI-based testing walkthrough
   - Step-by-step user signup and application
   - Form data templates
   - Debugging tips

6. **[test_data_queries.sql](test_data_queries.sql)**
   - SQL scripts for creating test users
   - Sample application data
   - Verification queries
   - Cleanup queries

7. **[create_test_application_only.sql](create_test_application_only.sql)**
   - Create test applications for existing users
   - Automated test data generation
   - Quick verification scripts

---

## 🔧 Maintenance & Utilities

### Recent Features & Fixes

10. **[REAL_DATA_INTEGRATION.md](REAL_DATA_INTEGRATION.md)** ⭐ **NEW!** (2026-01-24)
   - **Feature**: Replace mock data with real database integration
   - Browse page now fetches talents from database
   - Talent detail page loads real profiles
   - Image fallbacks with gradient backgrounds
   - Fixed RLS policy for user data joins
   - Fixed useMemo dependency bug causing talents not to load
   - Testing results and query patterns

11. **[REDIRECT_FIX.md](REDIRECT_FIX.md)** ⭐
   - **Fixed**: No redirect after application submission
   - User now automatically redirected to home page after 2 seconds
   - Shows success message before redirect
   - Alternative redirect options documented

### Database Migrations

12. **[supabase/migrations/20260123_allow_public_user_reads.sql](supabase/migrations/20260123_allow_public_user_reads.sql)** ⭐ **NEW!**
   - **Required**: RLS policy for talent browsing to work
   - Allows public read access to basic user info (id, email, full_name, avatar_url)
   - Needed for talent profiles to display user data
   - **Must be applied** in production Supabase dashboard

### Database Management

13. **[SUPABASE_USER_CLEANUP.md](SUPABASE_USER_CLEANUP.md)** ⭐
   - **Problem**: Deleting users from database
   - Complete user deletion script
   - Batch cleanup operations
   - Cascade delete triggers
   - Prevention strategies
   - Troubleshooting guide
   - **USE THIS** when you need to delete test users

14. **[scripts/cleanup-user.sql](scripts/cleanup-user.sql)**
   - Quick copy-paste cleanup script
   - Single user deletion
   - Batch test user deletion
   - Verification queries

---

## 🏗️ Architecture

### System Components

**Admin Dashboard Integration**
- Location: `/app/admin/page.tsx`
- Data source: `talent_applications` table
- API endpoints: `/api/talent-applications/*`
- Related hook: `/lib/hooks/useAdminDashboard.ts`

**Talent Application Flow**
```
User Signup → Apply at /join → Pending → Admin Review → Approve/Reject
                                             ↓
                                        Approved → User becomes 'talent' + Profile created
                                        Rejected → User can resubmit
```

**Key Tables**
- `auth.users` - Supabase authentication
- `public.users` - App user data
- `talent_applications` - Application submissions
- `talent_profiles` - Approved talent profiles

---

## 📊 Data Flow Diagrams

### Application Submission Flow
```
┌─────────────┐
│   User      │
│  (/join)    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ POST /api/talent-       │
│ applications            │
└──────┬──────────────────┘
       │
       ├─ New User ────────► INSERT → status: 'pending'
       │
       └─ Rejected User ──► UPDATE → status: 'pending' (resubmission)
```

### Approval Flow
```
┌─────────────┐
│   Admin     │
│  (/admin)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ PATCH /api/talent-      │
│ applications/[id]/status│
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Update application      │
│ status → 'approved'     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Update user             │
│ role → 'talent'         │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Create talent_profile   │
│ admin_verified: true    │
└─────────────────────────┘
```

---

## 🔑 Key Files Modified

### Backend API
- `/app/api/talent-applications/route.ts` - Main application endpoint
- `/app/api/talent-applications/[id]/status/route.ts` - Status update endpoint
- `/lib/api/admin.client.ts` - Admin data fetching functions
- `/lib/api/talent-applications.ts` - Client-side helpers

### Frontend
- `/app/admin/page.tsx` - Admin dashboard (existing, integrated)
- `/app/join/page.tsx` - Talent application form
- `/components/admin/TalentReviewModal.tsx` - Application review modal

### Database
- `/supabase/migrations/20260121_create_talent_applications.sql`
- `/supabase/migrations/20260122_add_user_id_to_talent_applications.sql`

---

## 🚨 Common Issues & Solutions

### Issue 1: User Already Exists Error
**Problem**: Deleted user from `public.users` but can't re-register
**Solution**: See [SUPABASE_USER_CLEANUP.md](SUPABASE_USER_CLEANUP.md)
```sql
DELETE FROM auth.users WHERE email = 'user@example.com';
```

### Issue 2: RLS Policy Violation on Approval
**Problem**: "Row level security policy violation" when creating talent profile
**Solution**: Already fixed - uses `createAdminClient()` in status endpoint
**Status**: ✅ Resolved

### Issue 3: Applications Not Showing in Admin Dashboard
**Problem**: Admin dashboard empty despite applications in database
**Solution**: Already fixed - updated admin client to query `talent_applications`
**Status**: ✅ Resolved

---

## 📝 Quick Commands

### Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3004
```

### Monitor Server Logs
```bash
tail -f /tmp/claude/-home-b-torashout/tasks/be22854.output
```

### Watch for Errors
```bash
tail -f /tmp/claude/-home-b-torashout/tasks/be22854.output | grep -E "(Error|500|failed)"
```

### Create Test Application (SQL)
```sql
-- See: create_test_application_only.sql
-- Or: QUICK_TEST_SETUP.md
```

### Delete Test User (SQL)
```sql
-- See: scripts/cleanup-user.sql
-- Or: SUPABASE_USER_CLEANUP.md
```

---

## 🎓 Learning Resources

### Understanding the Codebase
1. Read [BACKEND_CHANGES_SUMMARY.md](BACKEND_CHANGES_SUMMARY.md) first
2. Review the API endpoints in `app/api/talent-applications/`
3. Check the admin integration in `lib/api/admin.client.ts`
4. See the frontend form in `app/join/page.tsx`

### Testing the System
1. Follow [QUICK_TEST_SETUP.md](QUICK_TEST_SETUP.md)
2. Use SQL scripts from `test_data_queries.sql`
3. Test approval flow in admin dashboard
4. Clean up with `scripts/cleanup-user.sql`

---

## 📞 Support

### Debugging Steps
1. Check server logs: `tail -f /tmp/claude/-home-b-torashout/tasks/be22854.output`
2. Check browser console (F12) for client-side errors
3. Review [VERIFICATION_REPORT.md](VERIFICATION_REPORT.md) for known issues
4. Check database state with verification queries

### Common Debugging Queries
```sql
-- Check application status
SELECT * FROM talent_applications
WHERE email = 'user@example.com';

-- Check user role
SELECT id, email, role FROM users
WHERE email = 'user@example.com';

-- Check talent profile
SELECT tp.*, u.email
FROM talent_profiles tp
JOIN users u ON tp.user_id = u.id
WHERE u.email = 'user@example.com';
```

---

## ✅ System Status

**Last Updated**: 2026-01-23

### Working Features
- ✅ User signup and authentication
- ✅ Talent application submission
- ✅ Admin dashboard integration
- ✅ Application approval workflow
- ✅ Application rejection with feedback
- ✅ Resubmission after rejection
- ✅ Re-approval of rejected applications
- ✅ Automatic talent profile creation
- ✅ User role management

### Known Issues
- ⚠️ Auth user deletion requires manual cleanup (see SUPABASE_USER_CLEANUP.md)
- ℹ️ Email verification (if enabled) may require additional setup

### Recently Fixed
- ✅ **Real Data Integration** - Browse and detail pages now use database instead of mock data (2026-01-24)
- ✅ **RLS User Reads** - Public read access enabled for user profiles in talent display (2026-01-24)
- ✅ **Talent Loading Bug** - Fixed useMemo dependency causing delayed talent display (2026-01-24)
- ✅ **Image Fallbacks** - Gradient backgrounds with initials for talents without photos (2026-01-24)
- ✅ **Application Redirect** - Users now redirected to home after submission (2026-01-23)
- ✅ **RLS Policy Violation** - Admin client now used for profile creation (2026-01-23)
- ✅ **Applications Not Showing** - Admin dashboard now queries correct table (2026-01-23)

---

## 📌 Important Notes

1. **Always delete from both `auth.users` AND `public.users`** when removing test users
2. **Use admin client** (`createAdminClient()`) for operations that bypass RLS
3. **Test applications** should have recognizable patterns (`%test%`, `%@example.com`)
4. **Server logs** are essential for debugging - keep them visible during testing
5. **Database state** should be verified after each approval/rejection

---

**Project**: Torashout - Talent Booking Platform
**Feature**: Talent Application & Resubmission Workflow
**Status**: ✅ Production Ready
**Documentation Version**: 1.0
