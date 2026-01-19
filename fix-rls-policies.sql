-- Fix for infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- Step 1: Drop the problematic admin policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all talent profiles" ON public.talent_profiles;
DROP POLICY IF EXISTS "Admins can update all talent profiles" ON public.talent_profiles;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;

-- Step 2: Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate admin policies using the function

-- Users table admin policies
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (public.is_admin());

-- Talent profiles admin policies
CREATE POLICY "Admins can view all talent profiles"
  ON public.talent_profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all talent profiles"
  ON public.talent_profiles FOR UPDATE
  USING (public.is_admin());

-- Bookings admin policies
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE
  USING (public.is_admin());

-- Payments admin policies
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.is_admin());

-- Categories - make readable by everyone (no admin check needed for categories)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  TO public
  USING (true);
