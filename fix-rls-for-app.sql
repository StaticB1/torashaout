-- ============================================
-- FIX RLS POLICIES FOR APP ACCESS
-- ============================================
-- This fixes RLS to allow your app (anon key) to work
-- Run this in DEV SQL Editor
-- ============================================

-- Grant basic permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Make sure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view verified talents" ON public.talent_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Public can read basic user info" ON public.users;

-- ============================================
-- CATEGORIES - Public read access
-- ============================================
CREATE POLICY "Enable read access for all users"
  ON public.categories FOR SELECT
  USING (true);

-- ============================================
-- TALENT PROFILES - Public can view verified
-- ============================================
CREATE POLICY "Enable read access for verified talents"
  ON public.talent_profiles FOR SELECT
  USING (admin_verified = true OR auth.uid() = user_id);

-- ============================================
-- USERS - Public can read, users can update own
-- ============================================
CREATE POLICY "Enable read access for all users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Enable update for users based on user_id"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- FAVORITES - Users can manage their own
-- ============================================
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove favorites" ON public.favorites;

CREATE POLICY "Enable read for authenticated users"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- BOOKINGS - Users and talents can view their own
-- ============================================
DROP POLICY IF EXISTS "Users can view own bookings as customer" ON public.bookings;
DROP POLICY IF EXISTS "Talents can view own bookings" ON public.bookings;

CREATE POLICY "Enable read for booking participants"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = customer_id OR
    talent_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Enable insert for authenticated users"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- ============================================
-- PAYMENTS - Users can view their own
-- ============================================
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;

CREATE POLICY "Enable read for payment owner"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS - Users can view/manage their own
-- ============================================
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;

CREATE POLICY "Enable read for notification owner"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for notification owner"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- SUCCESS
-- ============================================
SELECT 'RLS policies updated for app access!' as status;
