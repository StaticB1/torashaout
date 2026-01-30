# Supabase Setup Guide for ToraShaout

This guide will walk you through setting up Supabase as the backend database for ToraShaout.

---

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js installed locally
- ToraShaout project cloned and dependencies installed

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name**: `torashaout-production` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to Zimbabwe (e.g., South Africa or Europe)
   - **Pricing Plan**: Start with Free tier
4. Click "Create new project"
5. Wait 2-3 minutes for project provisioning

---

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (safe to use in browser)
   - **service_role** key (keep secret, server-side only)

---

## Step 3: Configure Environment Variables

1. Open `/workspaces/torashaout/.env.local` file
2. Add your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Save the file

---

## Step 4: Run Database Migrations

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL migrations below (one at a time or all together)
5. Click **Run** to execute

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

---

## SQL Migrations

### Migration 1: Create Enums

```sql
-- Create enum types for type safety
CREATE TYPE user_role AS ENUM ('fan', 'talent', 'admin');
CREATE TYPE user_region AS ENUM ('zimbabwe', 'diaspora');
CREATE TYPE currency AS ENUM ('USD', 'ZIG');
CREATE TYPE talent_category AS ENUM ('musician', 'comedian', 'gospel', 'business', 'sports', 'influencer', 'other');
CREATE TYPE booking_status AS ENUM ('pending_payment', 'payment_confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE payment_gateway AS ENUM ('paynow', 'stripe', 'innbucks');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
```

### Migration 2: Create Users Table

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'fan',
  region user_region NOT NULL DEFAULT 'zimbabwe',
  preferred_currency currency NOT NULL DEFAULT 'USD',
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Migration 3: Create Talent Profiles Table

```sql
-- Talent profiles table
CREATE TABLE public.talent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  category talent_category NOT NULL,
  profile_video_url TEXT,
  thumbnail_url TEXT,
  price_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_zig DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_accepting_bookings BOOLEAN DEFAULT TRUE,
  response_time_hours INTEGER DEFAULT 24,
  admin_verified BOOLEAN DEFAULT FALSE,
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view verified talent profiles
CREATE POLICY "Anyone can view verified talent profiles"
  ON public.talent_profiles FOR SELECT
  USING (admin_verified = TRUE);

-- Talents can view their own profile (even if not verified)
CREATE POLICY "Talents can view own profile"
  ON public.talent_profiles FOR SELECT
  USING (user_id = auth.uid());

-- Talents can update their own profile
CREATE POLICY "Talents can update own profile"
  ON public.talent_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Users can insert their own talent profile
CREATE POLICY "Users can create talent profile"
  ON public.talent_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can view all talent profiles
CREATE POLICY "Admins can view all talent profiles"
  ON public.talent_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all talent profiles
CREATE POLICY "Admins can update all talent profiles"
  ON public.talent_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Migration 4: Create Bookings Table

```sql
-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  instructions TEXT,
  currency currency NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  talent_earnings DECIMAL(10, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending_payment',
  video_url TEXT,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings"
  ON public.bookings FOR SELECT
  USING (customer_id = auth.uid());

-- Talents can view their bookings
CREATE POLICY "Talents can view their bookings"
  ON public.bookings FOR SELECT
  USING (
    talent_id IN (
      SELECT id FROM public.talent_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Customers can create bookings
CREATE POLICY "Customers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Customers can update their bookings (rating/review)
CREATE POLICY "Customers can update own bookings"
  ON public.bookings FOR UPDATE
  USING (customer_id = auth.uid());

-- Talents can update their bookings (status/video)
CREATE POLICY "Talents can update their bookings"
  ON public.bookings FOR UPDATE
  USING (
    talent_id IN (
      SELECT id FROM public.talent_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all bookings
CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Migration 5: Create Payments Table

```sql
-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  gateway payment_gateway NOT NULL,
  gateway_transaction_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency currency NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view payments for their bookings
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM public.bookings
      WHERE customer_id = auth.uid()
    )
  );

-- Talents can view payments for their bookings
CREATE POLICY "Talents can view their payments"
  ON public.payments FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM public.bookings b
      INNER JOIN public.talent_profiles tp ON b.talent_id = tp.id
      WHERE tp.user_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Migration 6: Create Favorites Table

```sql
-- Favorites table (many-to-many: users <-> talent_profiles)
CREATE TABLE public.favorites (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, talent_id)
);

-- Enable Row Level Security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (user_id = auth.uid());

-- Users can add favorites
CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can remove favorites
CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE
  USING (user_id = auth.uid());
```

### Migration 7: Create Categories Table

```sql
-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  TO public
  USING (TRUE);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Migration 8: Create Notifications Table

```sql
-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX notifications_is_read_idx ON public.notifications(is_read);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid());
```

### Migration 9: Create Database Functions

```sql
-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_talent_profiles_updated_at
  BEFORE UPDATE ON public.talent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code like TRS-2024-001234
    new_code := 'TRS-' ||
                TO_CHAR(NOW(), 'YYYY') || '-' ||
                LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');

    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM public.bookings WHERE booking_code = new_code
    ) INTO code_exists;

    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to update talent booking stats
CREATE OR REPLACE FUNCTION update_talent_booking_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Increment total bookings
    UPDATE public.talent_profiles
    SET total_bookings = total_bookings + 1
    WHERE id = NEW.talent_id;
  ELSIF (TG_OP = 'UPDATE' AND NEW.customer_rating IS NOT NULL AND OLD.customer_rating IS NULL) THEN
    -- Update average rating when new rating is added
    UPDATE public.talent_profiles tp
    SET average_rating = (
      SELECT AVG(customer_rating)
      FROM public.bookings
      WHERE talent_id = tp.id AND customer_rating IS NOT NULL
    )
    WHERE id = NEW.talent_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_talent_stats_on_booking
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_booking_stats();
```

### Migration 10: Create User Profile Trigger

```sql
-- Function to create user profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Step 5: Seed Initial Data

Run this SQL to populate categories and create a test admin user:

```sql
-- Insert categories
INSERT INTO public.categories (name, slug, icon, booking_count) VALUES
  ('Musicians', 'musician', '🎵', 0),
  ('Comedians', 'comedian', '😂', 0),
  ('Gospel Artists', 'gospel', '🙏', 0),
  ('Business Leaders', 'business', '💼', 0),
  ('Sports Stars', 'sports', '⚽', 0),
  ('Influencers', 'influencer', '📱', 0),
  ('Other Celebrities', 'other', '⭐', 0);

-- Note: To create an admin user, you need to:
-- 1. Sign up through your app
-- 2. Then run this SQL with your user ID:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

---

## Step 6: Enable Realtime (Optional)

For real-time notifications:

1. Go to **Database** > **Replication** in Supabase dashboard
2. Enable replication for `notifications` table
3. This allows real-time subscriptions in your app

---

## Step 7: Configure Storage (For Video Uploads)

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `videos`
3. Set bucket to **Private** (requires authentication)
4. Create another bucket called `thumbnails`
5. Set bucket to **Public** (for profile images)

### Storage Policies:

```sql
-- Allow authenticated users to upload their own videos
CREATE POLICY "Users can upload own videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view videos they have access to
CREATE POLICY "Users can view accessible videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'videos' AND (
      -- User is the uploader
      auth.uid()::text = (storage.foldername(name))[1]
      OR
      -- User is customer of a booking with this video
      EXISTS (
        SELECT 1 FROM public.bookings
        WHERE customer_id = auth.uid()
        AND video_url LIKE '%' || name || '%'
      )
    )
  );

-- Allow anyone to view public thumbnails
CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'thumbnails');

-- Allow authenticated users to upload thumbnails
CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');
```

---

## Step 8: Test Your Setup

Run these test queries in Supabase SQL Editor:

```sql
-- Check tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Count categories
SELECT COUNT(*) FROM public.categories;
```

Expected results:
- 7 tables created
- All tables have RLS enabled
- 7 categories exist

---

## Step 9: Update Your App

Your app is now ready to use Supabase! The following files are already configured:

- `/lib/supabase/client.ts` - Client-side queries
- `/lib/supabase/server.ts` - Server-side queries
- `/lib/supabase/middleware.ts` - Auth middleware
- `/types/database.ts` - TypeScript types

---

## Troubleshooting

### Issue: RLS policies blocking access

**Solution**: Check if user is authenticated:
```sql
SELECT auth.uid(); -- Should return your user ID
```

### Issue: "relation does not exist" error

**Solution**: Make sure all migrations ran successfully. Check:
```sql
SELECT * FROM public.users LIMIT 1;
```

### Issue: Can't create talent profile

**Solution**: Ensure user exists in `users` table first:
```sql
SELECT * FROM public.users WHERE id = auth.uid();
```

---

## Next Steps

1. **Test Authentication**: Create test accounts (fan, talent, admin)
2. **Create Sample Data**: Add a few talent profiles
3. **Test Bookings**: Create a test booking
4. **Configure Payments**: Set up payment gateway webhooks
5. **Deploy**: Deploy to Vercel and connect Supabase

---

## Useful Supabase Commands

```sql
-- View all users
SELECT id, email, role, created_at FROM public.users;

-- View all talents
SELECT display_name, category, admin_verified FROM public.talent_profiles;

-- View all bookings with details
SELECT
  b.booking_code,
  u.email as customer_email,
  tp.display_name as talent_name,
  b.status,
  b.amount_paid
FROM public.bookings b
JOIN public.users u ON b.customer_id = u.id
JOIN public.talent_profiles tp ON b.talent_id = tp.id;

-- Make user an admin
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';

-- Verify a talent
UPDATE public.talent_profiles SET admin_verified = TRUE WHERE id = 'talent-uuid';
```

---

## Security Best Practices

1. **Never expose service_role key** in client-side code
2. **Always use RLS policies** for data access control
3. **Validate input data** before inserting to database
4. **Use prepared statements** to prevent SQL injection
5. **Audit admin actions** by logging changes
6. **Rotate API keys** periodically
7. **Monitor unusual activity** in Supabase dashboard

---

## Support

- Supabase Docs: https://supabase.com/docs
- ToraShaout Docs: `/docs/` folder
- Supabase Discord: https://discord.supabase.com

---

**Setup Complete!** 🎉

Your Supabase backend is now ready for ToraShaout. Start building amazing features!
