# ToraShaout Backend - Supabase Integration

This document provides an overview of the backend architecture and how to get started with Supabase.

---

## Overview

ToraShaout uses **Supabase** as its backend-as-a-service platform, providing:
- PostgreSQL database with real-time subscriptions
- Built-in authentication (email, OAuth, magic links)
- Row Level Security (RLS) for data protection
- File storage for videos and images
- Edge functions for serverless logic

---

## Quick Start

### 1. Install Dependencies ✅

Already done! Supabase packages are installed:
- `@supabase/supabase-js` - Core client library
- `@supabase/ssr` - Server-side rendering support

### 2. Set Up Supabase Project

Follow the detailed guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Quick steps:**
1. Create Supabase account at https://supabase.com
2. Create new project
3. Copy your project URL and API keys
4. Update `.env.local` with credentials
5. Run SQL migrations from setup guide

### 3. Configure Environment Variables

Open [.env.local](../.env.local) and update:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## Architecture

### Database Schema

7 core tables:
- `users` - User accounts (extends Supabase auth)
- `talent_profiles` - Talent information and pricing
- `bookings` - Video booking orders
- `payments` - Payment transactions
- `favorites` - User's favorite talents
- `categories` - Talent categories
- `notifications` - Real-time notifications

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete SQL schema.

### Supabase Client Utilities

Located in [/lib/supabase/](../lib/supabase/)

#### Client-side (`client.ts`)
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase.from('talents').select('*')
```

Use in:
- Client Components
- Browser-side queries
- Real-time subscriptions

#### Server-side (`server.ts`)
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data } = await supabase.from('users').select('*')
```

Use in:
- Server Components
- API Routes
- Server Actions

#### Admin Client (`server.ts`)
```typescript
import { createAdminClient } from '@/lib/supabase/server'

const supabase = createAdminClient() // Bypasses RLS
```

Use for:
- Admin operations
- System-level queries
- Background jobs

---

## API Functions

Pre-built API functions in [/lib/api/](../lib/api/)

### Talents API (`talents.ts`)

```typescript
import { getTalents, getTalentById, createTalentProfile } from '@/lib/api/talents'

// Get all talents with filters
const talents = await getTalents({
  category: 'musician',
  verified: true,
  search: 'winky'
})

// Get single talent
const talent = await getTalentById('talent-id')

// Create talent profile
await createTalentProfile({
  userId: user.id,
  displayName: 'John Doe',
  category: 'musician',
  priceUSD: 50,
  priceZIG: 2500
})
```

### Bookings API (`bookings.ts`)

```typescript
import { getMyBookings, createBooking, updateBooking } from '@/lib/api/bookings'

// Get user's bookings
const bookings = await getMyBookings('completed')

// Create booking
await createBooking({
  customerId: user.id,
  talentId: 'talent-id',
  recipientName: 'Jane',
  occasion: 'Birthday',
  currency: 'USD',
  amountPaid: 50,
  platformFee: 5,
  talentEarnings: 45
})

// Update booking status
await updateBooking('booking-id', {
  status: 'completed',
  videoUrl: 'https://...'
})
```

### Users API (`users.ts`)

```typescript
import { getCurrentUser, updateUserProfile } from '@/lib/api/users'

// Get current user
const user = await getCurrentUser()

// Update profile
await updateUserProfile(user.id, {
  fullName: 'John Doe',
  preferredCurrency: 'ZIG'
})
```

### Favorites API (`favorites.ts`)

```typescript
import { getFavorites, addFavorite, toggleFavorite } from '@/lib/api/favorites'

// Get user favorites
const favorites = await getFavorites()

// Add to favorites
await addFavorite(userId, talentId)

// Toggle favorite
await toggleFavorite(userId, talentId)
```

### Notifications API (`notifications.ts`)

```typescript
import {
  getNotifications,
  getUnreadCount,
  subscribeToNotifications
} from '@/lib/api/notifications'

// Get notifications
const notifications = await getNotifications()

// Get unread count
const unreadCount = await getUnreadCount()

// Real-time subscription
const unsubscribe = subscribeToNotifications(userId, (notification) => {
  console.log('New notification:', notification)
})
```

### Admin API (`admin.ts`)

```typescript
import {
  getPlatformStats,
  getPendingTalents,
  getAllBookings
} from '@/lib/api/admin'

// Get platform statistics
const stats = await getPlatformStats()

// Get pending talent verifications
const pending = await getPendingTalents()

// Get all bookings
const bookings = await getAllBookings({ status: 'completed' })
```

---

## Usage Examples

### Fetching Data in Server Component

```typescript
// app/browse/page.tsx
import { getTalents } from '@/lib/api/talents'

export default async function BrowsePage() {
  const talents = await getTalents({ verified: true })

  return (
    <div>
      {talents.map(talent => (
        <TalentCard key={talent.id} talent={talent} />
      ))}
    </div>
  )
}
```

### Client Component with Real-time

```typescript
'use client'
import { useEffect, useState } from 'react'
import { getNotifications, subscribeToNotifications } from '@/lib/api/notifications'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Load initial notifications
    getNotifications().then(setNotifications)

    // Subscribe to new notifications
    const unsubscribe = subscribeToNotifications(userId, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev])
    })

    return unsubscribe
  }, [])

  return (
    <div>
      {notifications.map(n => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  )
}
```

### Server Action for Form Submission

```typescript
// app/actions.ts
'use server'
import { createBooking } from '@/lib/api/bookings'
import { createClient } from '@/lib/supabase/server'

export async function submitBooking(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Create booking
  const booking = await createBooking({
    customerId: user.id,
    talentId: formData.get('talentId') as string,
    recipientName: formData.get('recipientName') as string,
    occasion: formData.get('occasion') as string,
    currency: 'USD',
    amountPaid: 50,
    platformFee: 5,
    talentEarnings: 45
  })

  return booking
}
```

---

## Authentication Flow

### Sign Up

```typescript
const supabase = createClient()

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'fan'
    }
  }
})

// User profile automatically created via trigger
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign Out

```typescript
await supabase.auth.signOut()
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

---

## Security

### Row Level Security (RLS)

All tables have RLS policies:
- Users can only see their own data
- Talents can manage their bookings
- Customers can view their orders
- Admins can access all data
- Public can view verified talent profiles

### API Keys

- **Anon Key**: Safe for client-side use (respects RLS)
- **Service Role Key**: Server-side only (bypasses RLS)

**Never expose service role key in client code!**

---

## Real-time Subscriptions

```typescript
const supabase = createClient()

// Subscribe to table changes
const channel = supabase
  .channel('bookings')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'bookings',
      filter: `customer_id=eq.${userId}`
    },
    (payload) => {
      console.log('Booking updated:', payload.new)
    }
  )
  .subscribe()

// Unsubscribe
supabase.removeChannel(channel)
```

---

## File Storage

### Upload Video

```typescript
const supabase = createClient()

const { data, error } = await supabase.storage
  .from('videos')
  .upload(`${userId}/${bookingId}.mp4`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('videos')
  .getPublicUrl(data.path)
```

### Upload Thumbnail

```typescript
await supabase.storage
  .from('thumbnails')
  .upload(`${talentId}/profile.jpg`, file)
```

---

## Testing

### Test Database Connection

```typescript
// pages/api/test-db.ts
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*')

  return Response.json({ data, error })
}
```

### Test Authentication

```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

---

## Troubleshooting

### "relation does not exist" error
- Run all SQL migrations from setup guide
- Check table names match schema

### "JWT expired" error
- Session expired, sign in again
- Check middleware is refreshing sessions

### "permission denied" error
- Check RLS policies
- Verify user is authenticated
- Check user has correct role

### Can't insert data
- Verify required fields
- Check foreign key constraints
- Review RLS INSERT policies

---

## Next Steps

1. ✅ **Backend Setup Complete** - Database and API ready
2. 📝 **Create Authentication Pages** - Login, Signup, Password Reset
3. 🔗 **Connect Dashboards** - Replace mock data with real queries
4. 💳 **Payment Integration** - Connect Paynow, Stripe webhooks
5. 📹 **Video Storage** - Set up Cloudflare Stream integration
6. 📧 **Notifications** - Email and SMS integration
7. 🚀 **Deploy** - Deploy to Vercel with Supabase

---

## Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Complete database setup
- [Supabase Docs](https://supabase.com/docs) - Official documentation
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) - Integration guide
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security) - Security policies
- [Real-time Guide](https://supabase.com/docs/guides/realtime) - Subscriptions

---

## Support

For issues or questions:
1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) troubleshooting section
2. Review Supabase dashboard logs
3. Test with SQL queries in Supabase SQL Editor

---

**Backend Setup Complete!** 🎉

Your ToraShaout backend is ready for development. Follow the next steps to connect your frontend to Supabase.
