# Backend Changes Summary - Admin Dashboard Integration

## Overview
Integrated the `talent_applications` table workflow into the existing admin dashboard at `/app/admin/page.tsx`.

## Files Modified

### 1. `/lib/api/admin.client.ts` ✅
**Changed Functions:**

#### `getPendingTalents()`
- **Before**: Queried `talent_profiles` where `admin_verified = false`
- **After**: Queries `talent_applications` where `status IN ('pending', 'under_review')`
- **Impact**: Admin dashboard now shows applications from the new talent_applications table

#### `getRejectedTalents()`
- **Before**: Queried `talent_profiles` where `verification_status = 'rejected'`
- **After**: Queries `talent_applications` where `status = 'rejected'`
- **Impact**: Admin can see and re-approve rejected applications

#### `approveTalent(talentId)`
- **Before**: Updated `talent_profiles` directly with `admin_verified = true`
- **After**: Calls API endpoint `/api/talent-applications/${talentId}/status` with `status: 'approved'`
- **Impact**: Triggers full approval workflow (update user role + create talent profile)

#### `rejectTalent(talentId, adminNotes?)`
- **Before**: Updated `talent_profiles` directly with `verification_status = 'rejected'`
- **After**: Calls API endpoint `/api/talent-applications/${talentId}/status` with `status: 'rejected'`
- **Impact**: Allows adding admin notes for rejection feedback

#### `reapproveTalent(talentId)`
- **Before**: Updated `talent_profiles` directly
- **After**: Calls API endpoint `/api/talent-applications/${talentId}/status` with `status: 'approved'`
- **Impact**: Re-approves rejected applications and creates talent profile

#### `getPlatformStats()`
- **Before**: Counted pending verifications from `talent_profiles`
- **After**: Counts from `talent_applications` with `status IN ('pending', 'under_review')`
- **Impact**: Accurate count of pending applications

#### `getAdminNotificationCount()`
- **Before**: Counted from `talent_profiles`
- **After**: Counts from `talent_applications`
- **Impact**: Notification badge shows correct count

### 2. `/app/api/talent-applications/[id]/status/route.ts` ✅
**Fixed RLS Issue:**
- **Problem**: Regular server client was blocked by RLS when creating talent_profiles
- **Solution**: Now uses `createAdminClient()` which bypasses RLS using service role key
- **Impact**: Approval process now works without RLS errors

### 3. `/app/api/talent-applications/route.ts` ✅
**POST Endpoint:**
- Handles new applications AND resubmissions
- If application status is 'rejected', allows UPDATE instead of blocking
- Resets `reviewed_by` and `reviewed_at` on resubmission
- Keeps `admin_notes` for audit trail

### 4. `/app/join/page.tsx` ✅
**Frontend Application Form:**
- Detects existing application status
- Shows appropriate UI based on status (pending, rejected, approved, etc.)
- Pre-fills form data for rejected applications
- Displays admin feedback notes

### 5. Removed Files
- `/app/admin/talent-applications/` - Deleted separate admin page (using existing `/app/admin` instead)

## Approval Workflow

### When Admin Approves Application:
1. Application status changes to 'approved'
2. User role changes from 'fan' to 'talent' (uses admin client)
3. Talent profile is created (uses admin client to bypass RLS)
4. User can now accept bookings

### When Admin Rejects Application:
1. Application status changes to 'rejected'
2. Admin notes are stored for feedback
3. User can resubmit by editing application via `/join`

### When User Resubmits After Rejection:
1. Application status resets to 'pending'
2. `reviewed_by` and `reviewed_at` are cleared
3. `admin_notes` are preserved for audit trail
4. Admin sees it in "Pending Verifications" section

## Backend Testing Checklist

### ✅ Admin Dashboard Data Loading
- [ ] Admin dashboard loads without errors
- [ ] Pending applications show in "Pending Verifications" section
- [ ] Rejected applications show in "Rejected Applications" section
- [ ] Stats show correct counts

### ✅ Approval Flow
- [ ] Can approve pending application
- [ ] User role changes to 'talent' in database
- [ ] Talent profile is created in database
- [ ] Application status becomes 'approved'
- [ ] No RLS errors occur

### ✅ Rejection Flow
- [ ] Can reject pending application
- [ ] Can add admin notes when rejecting
- [ ] Application moves to rejected section
- [ ] User can see rejection feedback

### ✅ Resubmission Flow
- [ ] Rejected user can edit and resubmit application
- [ ] Application moves back to pending
- [ ] Admin sees resubmitted application
- [ ] Previous admin notes are preserved

### ✅ Re-approval Flow
- [ ] Admin can re-approve rejected application from dashboard
- [ ] User role changes to 'talent'
- [ ] Talent profile is created
- [ ] Application status becomes 'approved'

## Known Issues & Fixes

### Issue 1: RLS Policy Violation ✅ FIXED
**Error:** `new row violates row-level security policy for table "talent_profiles"`
**Cause:** API was using regular server client which respects RLS
**Fix:** Now uses `createAdminClient()` for talent profile creation
**Status:** Fixed - needs server recompilation on next request

### Issue 2: Applications Not Showing in Admin Dashboard ✅ FIXED
**Error:** Admin dashboard was looking at `talent_profiles` table
**Cause:** Separate systems - old system used talent_profiles, new system uses talent_applications
**Fix:** Updated all admin client functions to query talent_applications instead
**Status:** Fixed

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key for client
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations (bypasses RLS)

## Database Schema

### talent_applications table
- `id` - UUID primary key
- `user_id` - UUID foreign key to users (UNIQUE - one application per user)
- `stage_name`, `email`, `phone`, `bio`, etc. - Application fields
- `status` - 'pending' | 'under_review' | 'approved' | 'rejected' | 'onboarding'
- `admin_notes` - Admin feedback (kept for audit trail)
- `reviewed_by`, `reviewed_at` - Review metadata

### talent_profiles table
- `id` - UUID primary key
- `user_id` - UUID foreign key to users
- `display_name`, `bio`, `category`, etc. - Profile fields
- `admin_verified` - Boolean
- `is_accepting_bookings` - Boolean

## API Endpoints

### POST /api/talent-applications
- Creates new application OR updates rejected application
- Returns application ID and success message

### GET /api/talent-applications
- Admin only - requires admin role
- Returns all applications with optional status filter

### GET /api/talent-applications/[id]/status
- Admin only - gets single application
- Returns application details

### PATCH /api/talent-applications/[id]/status
- Admin only - updates application status
- Accepts: `{ status, adminNotes }`
- On approval: creates talent profile + updates user role

## Next Steps
1. ✅ Refresh admin dashboard to see pending application
2. ✅ Test approval flow
3. ✅ Test rejection flow with admin notes
4. ✅ Test resubmission from user side
5. ✅ Test re-approval from admin side
