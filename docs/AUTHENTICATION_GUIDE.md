# ToraShaout Authentication Guide

This guide explains the authentication system implemented in ToraShaout and how to use it when creating new pages.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Using AuthNavbar in Pages](#using-authnavbar-in-pages)
4. [Protected Routes](#protected-routes)
5. [Using the useAuth Hook](#using-the-useauth-hook)
6. [Creating New Pages](#creating-new-pages)
7. [API Reference](#api-reference)

---

## Overview

ToraShaout uses **Supabase** for authentication with the following features:

- Email/password authentication
- Session management with automatic refresh
- Role-based access control (Fan, Talent, Admin)
- Protected routes with automatic redirects
- Real-time auth state updates

### Key Components

- **AuthNavbar** - Navigation bar with login/logout functionality
- **useAuth Hook** - React hook for accessing auth state
- **Middleware** - Route protection and session refresh
- **Auth Pages** - Login, Signup, Forgot Password, Reset Password

---

## Authentication Flow

### For Unauthenticated Users

1. User visits the site
2. `AuthNavbar` shows "Sign In" and "Sign Up" buttons
3. User clicks "Sign Up" → Creates account with role (Fan or Talent)
4. User profile is automatically created in database via trigger
5. User is redirected to appropriate dashboard based on role

### For Authenticated Users

1. Middleware checks session on every request
2. `AuthNavbar` shows user name and logout button
3. User can access protected routes
4. User sees personalized content based on role

### Logout Flow

1. User clicks "Sign Out" in `AuthNavbar` dropdown
2. Session is cleared from Supabase
3. User is redirected to homepage

---

## Using AuthNavbar in Pages

### Basic Usage

**For all PUBLIC pages** (home, browse, about, etc.), use `AuthNavbar`:

```typescript
'use client';

import { useState } from 'react';
import { Currency } from '@/types';
import { AuthNavbar } from '@/components/AuthNavbar';
import { Footer } from '@/components/Footer';

export default function MyPage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      {/* Your page content */}

      <Footer />
    </div>
  );
}
```

### For Auth Pages (Login/Signup)

**For authentication pages** (login, signup, forgot-password), use simple `Navbar`:

```typescript
import { Navbar } from '@/components/Navbar';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Login form */}
    </div>
  );
}
```

**Why?** Auth pages don't need login buttons since they ARE the login/signup pages.

### What AuthNavbar Does

- **When logged OUT**: Shows "Sign In" and "Sign Up" buttons
- **When logged IN**: Shows user menu with:
  - User's name
  - Dashboard link (role-specific)
  - Logout button
  - Notification center

---

## Protected Routes

Routes are automatically protected by middleware. No additional code needed in your pages!

### Protected Routes List

These routes require authentication:
- `/dashboard` - Talent dashboard
- `/customer-dashboard` - Customer/Fan dashboard
- `/admin` - Admin panel

### How It Works

1. User tries to access `/dashboard` without logging in
2. Middleware intercepts the request
3. User is redirected to `/login?redirect=/dashboard`
4. After login, user is redirected back to `/dashboard`

### Middleware Configuration

Located in: `/middleware.ts` and `/lib/supabase/middleware.ts`

```typescript
// Protected routes (requires auth)
const protectedRoutes = ['/dashboard', '/customer-dashboard', '/admin']

// Auth routes (redirect if already logged in)
const authRoutes = ['/login', '/signup']
```

**To add a new protected route**, add it to the `protectedRoutes` array in `/lib/supabase/middleware.ts`:

```typescript
const protectedRoutes = [
  '/dashboard',
  '/customer-dashboard',
  '/admin',
  '/my-new-protected-page'  // Add your new route here
]
```

---

## Using the useAuth Hook

For components that need to check authentication state or user info.

### Import and Use

```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export default function MyComponent() {
  const { user, profile, loading, signOut, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {profile?.role}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### Hook Return Values

```typescript
{
  user: User | null;              // Supabase user object
  profile: UserProfile | null;    // User profile from database
  loading: boolean;               // Loading state
  signOut: () => Promise<void>;   // Logout function
  isAuthenticated: boolean;       // True if user is logged in
}
```

### UserProfile Type

```typescript
interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'fan' | 'talent' | 'admin';
  avatar_url: string | null;
}
```

---

## Creating New Pages

### Checklist for New Pages

When creating a new page, follow this checklist:

#### ✅ For Public Pages

- [ ] Use `AuthNavbar` component
- [ ] Add `currency` state if needed
- [ ] Include `Footer` component
- [ ] Test both logged-in and logged-out states

```typescript
'use client';

import { useState } from 'react';
import { Currency } from '@/types';
import { AuthNavbar } from '@/components/AuthNavbar';
import { Footer } from '@/components/Footer';

export default function NewPublicPage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      {/* Your content */}

      <Footer />
    </div>
  );
}
```

#### ✅ For Protected Pages

- [ ] Add route to `protectedRoutes` in middleware
- [ ] Use `useAuth` hook to get user data
- [ ] Use `AuthNavbar` component
- [ ] Handle loading state
- [ ] Show role-specific content if needed

```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { AuthNavbar } from '@/components/AuthNavbar';

export default function NewProtectedPage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar />

      <div className="container mx-auto px-4 py-24">
        <h1>Welcome, {profile?.full_name}!</h1>
        {/* Your protected content */}
      </div>
    </div>
  );
}
```

#### ✅ For Auth Pages (Login, Signup, etc.)

- [ ] Use simple `Navbar` (not `AuthNavbar`)
- [ ] Use Supabase auth methods
- [ ] Handle errors with clear messages
- [ ] Redirect after successful auth

```typescript
'use client';

import { Navbar } from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

export default function NewAuthPage() {
  const supabase = createClient();

  // Your auth logic here

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Your auth form */}
    </div>
  );
}
```

---

## API Reference

### Supabase Client

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
```

### Common Auth Operations

#### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'fan', // or 'talent'
    },
  },
});
```

#### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

#### Sign Out

```typescript
await supabase.auth.signOut();
```

#### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

#### Reset Password

```typescript
// Request reset email
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});

// Update password (on reset page)
await supabase.auth.updateUser({
  password: newPassword,
});
```

### Accessing User Profile Data

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Get current user's profile
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  console.log(profile.role); // 'fan', 'talent', or 'admin'
}
```

---

## Examples

### Example 1: Showing Content Based on Auth State

```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const { isAuthenticated, profile } = useAuth();

  return (
    <section>
      <h1>Welcome to ToraShaout</h1>
      {isAuthenticated ? (
        <div>
          <p>Hello, {profile?.full_name}!</p>
          <Link href={profile?.role === 'talent' ? '/dashboard' : '/browse'}>
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      ) : (
        <div>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
```

### Example 2: Role-Based Content

```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export function RoleBasedContent() {
  const { profile } = useAuth();

  if (profile?.role === 'admin') {
    return <AdminPanel />;
  }

  if (profile?.role === 'talent') {
    return <TalentContent />;
  }

  return <FanContent />;
}
```

### Example 3: Protected Action

```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function BookingButton({ talentId }: { talentId: string }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleBook = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking/${talentId}`);
      return;
    }

    // Proceed with booking
    router.push(`/booking/${talentId}`);
  };

  return (
    <button onClick={handleBook}>
      Book Now
    </button>
  );
}
```

---

## Creating Admin Accounts

### Using the Admin Creation Script

ToraShaout includes a script to easily create admin accounts:

```bash
node create-admin-simple.js <email> <password> <full-name>
```

**Example:**
```bash
node create-admin-simple.js admin@torashaout.com admin123 "Admin User"
```

**What the script does:**
1. Creates a new auth user with auto-confirmed email
2. Creates or updates the user profile with `admin` role
3. Displays the account details including User ID

**Current Admin Account:**
- **Email**: `bsiwonde@torashaout.com`
- **Password**: `admin123`
- **Role**: `admin`

### Manual Method (Alternative)

You can also create admin accounts manually through the Supabase dashboard:

1. Go to **Authentication > Users** in Supabase dashboard
2. Click "Add user"
3. Enter email and password
4. After user is created, run this SQL in SQL Editor:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

### Promoting Existing Users to Admin

If you want to promote an existing user to admin:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'existing-user@example.com';
```

Or use the interactive script:
```bash
node create-admin.js
# Choose option 2: "Promote existing user to admin"
```

---

## Troubleshooting

### Issue: "Infinite redirect loop"

**Cause**: Middleware is redirecting authenticated users from auth pages, but the redirect target is also an auth page.

**Solution**: Check that your redirect URLs are not in the `authRoutes` array.

### Issue: "Can't access protected page"

**Cause**: Route not added to middleware or session expired.

**Solution**:
1. Add route to `protectedRoutes` in `/lib/supabase/middleware.ts`
2. Clear cookies and login again

### Issue: "User data not loading"

**Cause**: Race condition or user profile not created.

**Solution**:
1. Check that the `handle_new_user()` trigger is set up in Supabase
2. Use the `loading` state from `useAuth()` hook

---

## Summary

### Quick Reference

| Task | Use This |
|------|----------|
| Create public page | `AuthNavbar` |
| Create auth page (login/signup) | `Navbar` |
| Create protected page | `AuthNavbar` + add to middleware |
| Check if user is logged in | `useAuth().isAuthenticated` |
| Get user info | `useAuth().profile` |
| Sign out user | `useAuth().signOut()` |
| Protect a route | Add to `protectedRoutes` array |

---

**Remember**: When creating a new page, always use `AuthNavbar` for public pages to ensure users can log in and out properly!

---

Last Updated: January 2026
