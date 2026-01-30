# Test Talent Application Guide

## Step-by-Step Testing Process

### Step 1: Create Test User Account
1. **Navigate to signup**: http://localhost:3004/signup
2. **Fill in details**:
   - Email: `testtalent@example.com`
   - Password: `TestPassword123!`
   - Full Name: `Test Talent User`
   - Phone: `+263771234567`
   - Region: Zimbabwe or Diaspora
3. **Click "Sign Up"**

### Step 2: Verify Email (if required)
- Check if the app requires email verification
- If yes, check your email for verification link
- If no, proceed to login

### Step 3: Login with Test User
1. **Navigate to login**: http://localhost:3004/login
2. **Enter credentials**:
   - Email: `testtalent@example.com`
   - Password: `TestPassword123!`
3. **Click "Login"**

### Step 4: Submit Talent Application
1. **Navigate to**: http://localhost:3004/join
2. **Fill in application form**:

   **Personal Information:**
   - First Name: `Test`
   - Last Name: `Talent`
   - Stage Name: `T-Talent` (or any creative name)
   - Email: (should be pre-filled with `testtalent@example.com`)
   - Phone: (should be pre-filled)

   **Professional Information:**
   - Category: `Musician` (or any category)
   - Bio: `I am a talented musician with over 5 years of experience in the industry. I specialize in Afrobeat and contemporary music.`
   - Years Active: `5`
   - Notable Work: `Featured on several albums and performed at major festivals including Harare International Festival and Vic Falls Carnival.`

   **Social Media (Optional):**
   - Instagram Handle: `@ttalent`
   - Instagram Followers: `50000`
   - Facebook Page: `facebook.com/ttalent`
   - Facebook Followers: `30000`

   **Pricing & Availability:**
   - Proposed Price (USD): `100`
   - Response Time: `24` (hours)

   **Additional Information:**
   - How did you hear about us: `Social Media`
   - Additional Info: `Looking forward to connecting with fans through personalized video messages.`

   **Terms:**
   - ✅ Check "I agree to the terms and conditions"

3. **Click "Submit Application"**

### Step 5: Verify Application in Database
After submission, the application should:
- Appear in the `talent_applications` table
- Have status: `pending`
- Be linked to the test user via `user_id`

### Step 6: View in Admin Dashboard
1. **Logout from test user account**
2. **Login as admin**:
   - Email: Your admin email
   - Password: Your admin password
3. **Navigate to**: http://localhost:3004/admin
4. **Check "Pending Verifications" section**
   - Should see "T-Talent" application
   - Should show badge count: 1 (or more if other applications exist)

### Step 7: Test Approval Flow
1. **In admin dashboard**, find the test application
2. **Click "Review Details"** to see full application
3. **Click "Approve"**
4. **Verify**:
   - Success message appears
   - Application moves out of pending section
   - Check database: `users` table → user role should be `talent`
   - Check database: `talent_profiles` table → new profile created

### Step 8: Test Rejection Flow (Optional - Use Another Test User)
1. **Create another test user**: `testtalent2@example.com`
2. **Submit another application**
3. **In admin dashboard**, click "Reject"
4. **Add admin notes**: `Please provide more details about your experience`
5. **Verify**:
   - Application moves to "Rejected Applications" section
   - Admin notes are saved

### Step 9: Test Resubmission Flow
1. **Logout from admin**
2. **Login as rejected user**: `testtalent2@example.com`
3. **Navigate to**: http://localhost:3004/join
4. **Verify**:
   - Sees rejection message with admin feedback
   - Form is pre-filled with previous data
   - Can edit and resubmit

## Quick Test Data Template

Copy/paste this for quick testing:

```
First Name: Test
Last Name: Talent
Stage Name: T-Talent
Category: Musician
Bio: I am a talented musician with over 5 years of experience in the industry. I specialize in Afrobeat and contemporary music.
Years Active: 5
Notable Work: Featured on several albums and performed at major festivals including Harare International Festival and Vic Falls Carnival.
Proposed Price: 100
Response Time: 24
Instagram: @ttalent
Instagram Followers: 50000
```

## Expected Results

### ✅ Success Indicators
- [ ] User account created successfully
- [ ] Application submitted without errors
- [ ] Application appears in admin dashboard "Pending Verifications"
- [ ] Can approve application without errors
- [ ] User role changes to 'talent'
- [ ] Talent profile is created
- [ ] Can reject application with admin notes
- [ ] Rejected user can see feedback and resubmit
- [ ] Resubmitted application appears in pending again

### ❌ Failure Indicators
- Form validation errors
- API errors during submission
- Application not showing in admin dashboard
- RLS errors during approval
- User role not changing
- Talent profile not created

## Debugging

### If Application Doesn't Submit
1. Check browser console for errors
2. Check Network tab for failed requests
3. Check server logs: `tail -f /tmp/claude/-home-b-torashout/tasks/be22854.output`

### If Application Doesn't Appear in Admin Dashboard
1. Verify application is in database:
   ```sql
   SELECT * FROM talent_applications WHERE email = 'testtalent@example.com';
   ```
2. Check if admin dashboard is using correct data source
3. Check server logs for errors

### If Approval Fails
1. Check server logs for RLS errors
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
3. Check if admin client is being used correctly

## Database Queries for Verification

### Check Application
```sql
SELECT id, stage_name, email, status, created_at
FROM talent_applications
WHERE email = 'testtalent@example.com';
```

### Check User Role
```sql
SELECT id, email, role
FROM users
WHERE email = 'testtalent@example.com';
```

### Check Talent Profile
```sql
SELECT tp.*, u.email
FROM talent_profiles tp
JOIN users u ON tp.user_id = u.id
WHERE u.email = 'testtalent@example.com';
```
