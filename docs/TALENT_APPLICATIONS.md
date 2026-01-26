# Talent Applications System

Complete documentation for the talent application and onboarding workflow.

---

## Overview

The Talent Applications system allows celebrities and public figures to apply to join ToraShaout as talent. Admins can review applications, approve/reject them, and manage the onboarding process.

**Key Features:**
- Public application form on `/join` page
- Admin review interface at `/admin/talent-applications`
- Status workflow: pending → under_review → approved/rejected → onboarding
- Email uniqueness constraint (prevents duplicate applications)
- Role-based access control (only admins can view/manage applications)
- Real-time Toast notifications for better UX

---

## Database Schema

### Table: `talent_applications`

```sql
CREATE TABLE talent_applications (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,  -- UNIQUE constraint prevents duplicates
  phone TEXT NOT NULL,

  -- Professional Information
  category TEXT NOT NULL CHECK (category IN ('musician', 'comedian', 'gospel', 'business', 'sports', 'influencer', 'other')),
  bio TEXT NOT NULL,
  years_active INTEGER NOT NULL CHECK (years_active > 0),
  notable_work TEXT NOT NULL,

  -- Social Media
  instagram_handle TEXT,
  instagram_followers INTEGER,
  facebook_page TEXT,
  facebook_followers INTEGER,
  youtube_channel TEXT,
  youtube_subscribers INTEGER,
  twitter_handle TEXT,
  tiktok_handle TEXT,

  -- Platform Details
  proposed_price_usd DECIMAL(10,2) NOT NULL CHECK (proposed_price_usd >= 25),
  response_time_hours INTEGER NOT NULL CHECK (response_time_hours IN (24, 48, 72, 168)),

  -- Additional Information
  hear_about_us TEXT,
  additional_info TEXT,

  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'onboarding')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_talent_applications_user_id ON talent_applications(user_id);
CREATE INDEX idx_talent_applications_email ON talent_applications(email);
CREATE INDEX idx_talent_applications_status ON talent_applications(status);
CREATE INDEX idx_talent_applications_created_at ON talent_applications(created_at);
```

### Row Level Security (RLS) Policies

```sql
-- Authenticated users can submit applications (must be logged in)
CREATE POLICY "Authenticated users can submit talent application"
  ON talent_applications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    user_id = auth.uid()
  );

-- Users can view their own application
CREATE POLICY "Users can view own application"
  ON talent_applications
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all applications
CREATE POLICY "Admins can view all talent applications"
  ON talent_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only admins can update applications
CREATE POLICY "Only admins can update talent applications"
  ON talent_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

### Triggers

```sql
-- Auto-update updated_at timestamp
CREATE TRIGGER update_talent_applications_updated_at
  BEFORE UPDATE ON talent_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_applications_updated_at();
```

---

## Application Workflow

### 1. User Account Creation

**Prerequisites**: Before applying to become talent, users must:
1. Create an account on ToraShaout
2. Verify their email address
3. Log in to their account

**Default Role**: New users are assigned the role `fan` by default.

### 2. Authenticated Application Submission

**Route**: `/join`
**Access**: Authenticated users only (protected by AuthGuard)
**Component**: `app/join/page.tsx`

```typescript
// User fills out application form with:
- Personal info (name, email [auto-filled from account], phone)
- Professional info (category, bio, years active, notable work)
- Social media profiles (Instagram, Facebook, YouTube, etc.)
- Platform details (proposed price, response time)
- Additional info (optional)
```

**Key Features**:
- Email is automatically filled from the authenticated user's account (read-only)
- Each user can only submit ONE application (enforced by unique `user_id` constraint)
- Application is linked to the user account via `user_id`
- If user already has an application, they cannot submit another one

**Validation**:
- User must be authenticated (401 if not logged in)
- All required fields must be filled
- Email is validated from authenticated session
- User cannot have existing application (one per user)
- Proposed price minimum: $25 USD
- Response time options: 24, 48, 72, or 168 hours
- Must agree to terms and conditions

### 3. Application Storage

**API Endpoint**: `POST /api/talent-applications`
**Access**: Authenticated users only
**File**: `app/api/talent-applications/route.ts`

**Authentication Check**:
- User must be authenticated (verified via Supabase session)
- Returns `401 Unauthorized` if not authenticated
- Automatically extracts `user_id` from authenticated session

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "stageName": "JD the Musician",
  "email": "john@example.com",
  "phone": "+263123456789",
  "category": "Musician",
  "bio": "Professional musician with 10 years experience...",
  "yearsActive": "10",
  "notableWork": "Album XYZ, Show ABC...",
  "instagramHandle": "@johnmusic",
  "instagramFollowers": "50000",
  "proposedPrice": "75",
  "responseTime": "48",
  "agreeToTerms": true
}
```

**Response**:
```json
{
  "success": true,
  "applicationId": "uuid",
  "message": "Application submitted successfully!"
}
```

**Error Responses**:

Authentication Error (401):
```json
{
  "success": false,
  "error": "You must be logged in to submit an application."
}
```

Duplicate Application Error (400):
```json
{
  "success": false,
  "error": "You already have an application with status: pending. Please wait for review."
}
```

Validation Error (400):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["First name is required", "Bio must be at least 10 characters"]
}
```

### 4. Admin Review

**Route**: `/admin/talent-applications`
**Access**: Admin only (protected by AuthGuard)
**Component**: `app/admin/talent-applications/page.tsx`

**Features**:
- View all applications with statistics
- Filter by status (all, pending, under_review, approved, rejected, onboarding)
- Search by name, stage name, or email
- View application details in modal
- Update application status
- Add admin notes

**Status Actions**:
```typescript
// From pending status:
- Mark as "Under Review"
- Approve (immediately)
- Reject (immediately)

// From under_review status:
- Approve
- Reject

// From approved status:
- Start Onboarding
```

### 5. Status Updates & Automatic Talent Onboarding

**API Endpoint**: `PATCH /api/talent-applications/[id]/status`
**Access**: Admin only (requires authentication + admin role)
**File**: `app/api/talent-applications/[id]/status/route.ts`

**Request Body**:
```json
{
  "status": "approved",
  "adminNotes": "Great social media presence. Approved for onboarding."
}
```

**Response**:
```json
{
  "success": true
}
```

**Automatic Actions When Status = "approved"**:

When an admin approves an application, the system automatically:

1. **Updates User Role**:
   - Changes user's role from `fan` to `talent` in the `users` table
   - User gains access to talent-specific features

2. **Creates Talent Profile**:
   - Inserts a new record in `talent_profiles` table
   - Populates profile with data from application:
     - `display_name`: from `stage_name`
     - `bio`: from `bio`
     - `category`: from `category`
     - `price_usd`: from `proposed_price_usd`
     - `response_time_hours`: from `response_time_hours`
     - `admin_verified`: set to `true`
     - `is_accepting_bookings`: set to `true`

3. **Profile Visibility**:
   - Talent profile becomes visible on the platform
   - User can now receive booking requests
   - Profile appears in talent search results

**Audit Trail**:
When status is changed from "pending", the system automatically records:
- `reviewed_by`: UUID of the admin who reviewed
- `reviewed_at`: Timestamp of the review

**Complete Workflow Summary**:
```
User creates account (role: fan)
  ↓
User fills application form (/join)
  ↓
Application submitted (status: pending)
  ↓
Admin reviews application
  ↓
Admin approves → AUTOMATIC:
  • User role → talent
  • Talent profile created
  • Profile verified and visible
  ↓
User can now accept bookings
```

---

## API Reference

### Submit Application

**Endpoint**: `POST /api/talent-applications`
**Access**: Authenticated users only
**Authentication**: Required (Supabase session)
**Rate Limit**: Consider adding rate limiting to prevent spam

**Request**:
```typescript
interface TalentApplicationRequest {
  firstName: string;
  lastName: string;
  stageName: string;
  email: string;
  phone: string;
  category: string;
  bio: string;
  yearsActive: string;
  notableWork: string;
  instagramHandle?: string;
  instagramFollowers?: string;
  facebookPage?: string;
  facebookFollowers?: string;
  youtubeChannel?: string;
  youtubeSubscribers?: string;
  twitterHandle?: string;
  tiktokHandle?: string;
  proposedPrice: string;
  responseTime: string;
  hearAboutUs?: string;
  additionalInfo?: string;
  agreeToTerms: boolean;
}
```

**Response**:
```typescript
{
  success: boolean;
  applicationId?: string;
  error?: string;
  details?: string[];
}
```

### Get All Applications

**Endpoint**: `GET /api/talent-applications?status=pending`
**Access**: Admin only
**Authentication**: Required (401 if not authenticated, 403 if not admin)

**Query Parameters**:
- `status` (optional): Filter by status (all, pending, under_review, approved, rejected, onboarding)

**Response**:
```typescript
{
  success: boolean;
  data?: TalentApplication[];
  error?: string;
}
```

### Get Single Application

**Endpoint**: `GET /api/talent-applications/[id]/status`
**Access**: Admin only
**Authentication**: Required

**Response**:
```typescript
{
  success: boolean;
  data?: TalentApplication;
  error?: string;
}
```

### Update Application Status

**Endpoint**: `PATCH /api/talent-applications/[id]/status`
**Access**: Admin only
**Authentication**: Required

**Request**:
```typescript
{
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'onboarding';
  adminNotes?: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

---

## Client-Side Functions

### Submit Application

**File**: `lib/api/talent-applications.ts`

```typescript
import { submitTalentApplication } from '@/lib/api/talent-applications';

const result = await submitTalentApplication({
  firstName: 'John',
  lastName: 'Doe',
  stageName: 'JD the Musician',
  email: 'john@example.com',
  // ... other fields
});

if (result.success) {
  console.log('Application submitted:', result.applicationId);
} else {
  console.error('Error:', result.error);
}
```

### Get Applications (Admin)

```typescript
import { getTalentApplications } from '@/lib/api/talent-applications';

// Get all applications
const result = await getTalentApplications();

// Get applications by status
const pending = await getTalentApplications('pending');

if (result.success) {
  console.log('Applications:', result.data);
}
```

### Update Application Status (Admin)

```typescript
import { updateTalentApplicationStatus } from '@/lib/api/talent-applications';

const result = await updateTalentApplicationStatus(
  'application-id',
  'approved',
  'Great candidate!'
);

if (result.success) {
  console.log('Status updated successfully');
}
```

### Check Duplicate Email

```typescript
import { checkApplicationExists } from '@/lib/api/talent-applications';

const result = await checkApplicationExists('john@example.com');

if (result.exists) {
  console.log('Application already exists for this email');
}
```

### Get Statistics (Admin)

```typescript
import { getTalentApplicationStats } from '@/lib/api/talent-applications';

const result = await getTalentApplicationStats();

if (result.success) {
  console.log('Stats:', result.data);
  // { total: 50, pending: 10, under_review: 5, approved: 30, rejected: 3, onboarding: 2 }
}
```

---

## Security Features

### 1. Email Uniqueness

The database enforces email uniqueness at the table level:
```sql
email TEXT NOT NULL UNIQUE
```

This prevents:
- Duplicate applications from the same person
- Application spam
- Email conflicts during onboarding

### 2. Admin Authentication

All admin endpoints verify:
1. **Authentication**: User must be logged in
2. **Authorization**: User must have admin role

```typescript
// Check authentication
const { data: { user } } = await supabase.auth.getUser();
if (!user) return 401 Unauthorized;

// Check admin role
const { data: userData } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single();

if (userData.role !== 'admin') return 403 Forbidden;
```

### 3. Row Level Security (RLS)

Database-level security ensures:
- **Public**: Can only INSERT applications (can't read/update)
- **Admins**: Can SELECT and UPDATE applications
- **Non-admins**: Completely blocked from viewing applications

### 4. Input Validation

**Server-side validation** (API layer):
- Email format validation with regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Required field validation
- Data type validation (numbers for followers, price, etc.)
- Terms agreement validation

**Database validation** (constraint layer):
- Price minimum: $25 USD
- Years active: Must be positive integer
- Response time: Must be 24, 48, 72, or 168 hours
- Category: Must be one of allowed values
- Status: Must be one of allowed values

### 5. Audit Trail

System automatically tracks:
- `created_at`: When application was submitted
- `updated_at`: Last modification timestamp (auto-updated)
- `reviewed_by`: Admin who reviewed the application
- `reviewed_at`: When the review happened
- `admin_notes`: Reviewer comments

---

## User Experience (UX)

### Toast Notifications

The system uses Toast notifications instead of browser alerts for better UX:

**Success Messages**:
```typescript
toast.success('Application submitted successfully! We will review it and get back to you within 5-7 business days.');
toast.success('Application status updated successfully');
```

**Error Messages**:
```typescript
toast.error('Please fill in all required fields.');
toast.error('Please agree to the terms and conditions.');
toast.error('An application with this email already exists.');
toast.error('Failed to submit application. Please try again.');
```

**Benefits**:
- Non-blocking (doesn't interrupt user flow)
- Automatically dismisses after 5 seconds
- Beautiful gradient styling
- Icon indicators (✓ for success, ✗ for error)
- Positioned at bottom-right of screen

### Loading States

```typescript
// Button shows loading state during submission
<button disabled>Submitting...</button>

// After completion
<button>Submit Application</button>
```

### Form Reset

After successful submission, the form automatically resets all fields to allow another application (if user accidentally used wrong email, etc.).

---

## Migration Guide

### Step 1: Apply Database Migration

Run the migration SQL in your Supabase dashboard:

**File**: `supabase/migrations/20260121_create_talent_applications.sql`

```bash
# Option 1: Via Supabase Dashboard
1. Go to: https://app.supabase.com/project/YOUR_PROJECT_ID/sql
2. Copy the entire migration file
3. Paste and click "Run"

# Option 2: Via Supabase CLI
supabase db push
```

### Step 2: Verify Migration

```sql
-- Check table exists
SELECT * FROM talent_applications LIMIT 1;

-- Check unique constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'talent_applications'
AND constraint_type = 'UNIQUE';

-- Expected result: talent_applications_email_key
```

### Step 3: Test Application Flow

1. **Submit Test Application**:
   - Go to `http://localhost:3000/join`
   - Fill out and submit form
   - Should see success toast

2. **Test Email Uniqueness**:
   - Try submitting with same email
   - Should see error: "An application with this email already exists"

3. **View in Admin Panel** (requires admin user):
   - Go to `http://localhost:3000/admin/talent-applications`
   - Should see your test application
   - Try updating status

### Step 4: Create Admin User

```sql
-- First, sign up a user through your app, then:
UPDATE users
SET role = 'admin'
WHERE email = 'your-admin@example.com';
```

---

## Troubleshooting

### Issue: "talent_applications table does not exist"

**Solution**: Run the migration SQL in Supabase dashboard.

### Issue: "Forbidden: Admin access required"

**Solution**:
1. Check user is logged in
2. Verify user has admin role:
```sql
SELECT role FROM users WHERE id = auth.uid();
```
3. Update role if needed:
```sql
UPDATE users SET role = 'admin' WHERE id = auth.uid();
```

### Issue: Application not appearing in admin panel

**Solution**:
1. Check RLS policies are enabled
2. Verify admin user has correct role
3. Check browser console for API errors

### Issue: Duplicate email error not showing

**Solution**:
1. Verify UNIQUE constraint exists:
```sql
\d talent_applications
-- Should show: "talent_applications_email_key" UNIQUE (email)
```
2. If missing, add it:
```sql
ALTER TABLE talent_applications
ADD CONSTRAINT talent_applications_email_key UNIQUE (email);
```

### Issue: Toast notifications not showing

**Solution**:
1. Check ToastProvider is wrapping the app:
```typescript
// app/layout.tsx
<ToastProvider>
  {children}
</ToastProvider>
```
2. Verify useToast is called correctly:
```typescript
const toast = useToast();
```

---

## Future Enhancements

### Planned Features

1. **Email Notifications**:
   - Send confirmation email on application submission
   - Notify applicant when status changes
   - Reminder emails for incomplete applications

2. **Advanced Filtering**:
   - Filter by category
   - Filter by date range
   - Filter by follower count

3. **Bulk Actions**:
   - Approve multiple applications at once
   - Export applications to CSV
   - Bulk rejection with reason

4. **Application Analytics**:
   - Applications per day/week/month
   - Approval rate by category
   - Average processing time
   - Top referral sources

5. **Document Uploads**:
   - ID verification
   - Professional certificates
   - Press kit/media pack

6. **Video Introduction**:
   - Allow applicants to upload intro video
   - Show in admin review modal

---

## API Testing

### Using cURL

```bash
# Submit application
curl -X POST http://localhost:3000/api/talent-applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "stageName": "JD",
    "email": "john@test.com",
    "phone": "+263123456789",
    "category": "Musician",
    "bio": "Professional musician...",
    "yearsActive": "10",
    "notableWork": "Album XYZ",
    "proposedPrice": "50",
    "responseTime": "48",
    "agreeToTerms": true
  }'

# Get all applications (requires auth cookie)
curl http://localhost:3000/api/talent-applications \
  -H "Cookie: sb-access-token=YOUR_TOKEN"

# Update status (requires auth + admin)
curl -X PATCH http://localhost:3000/api/talent-applications/UUID/status \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{
    "status": "approved",
    "adminNotes": "Approved!"
  }'
```

---

## Resources

- **Migration File**: `supabase/migrations/20260121_create_talent_applications.sql`
- **Frontend Page**: `app/join/page.tsx`
- **Admin Page**: `app/admin/talent-applications/page.tsx`
- **API Routes**: `app/api/talent-applications/`
- **Client Functions**: `lib/api/talent-applications.ts`
- **Types**: `types/database.ts`

---

## Support

For issues or questions:
1. Check this documentation
2. Review Supabase dashboard logs
3. Check browser console for errors
4. Verify RLS policies are correct

---

**Talent Applications System Complete!** 🎉

Your platform now has a secure, scalable talent onboarding workflow with proper authentication, validation, and admin controls.
