-- Migration: Add user_id to talent_applications table
-- This links applications to user accounts for proper workflow:
-- 1. User creates account (role: 'fan')
-- 2. User applies to become talent (stores user_id)
-- 3. Admin approves → user role changes to 'talent' + profile created

-- Add user_id column
ALTER TABLE talent_applications
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_talent_applications_user_id ON talent_applications(user_id);

-- Add constraint: one application per user
ALTER TABLE talent_applications
ADD CONSTRAINT talent_applications_user_id_key UNIQUE (user_id);

-- Update RLS policy: users can view their own application
CREATE POLICY "Users can view own application" ON talent_applications
  FOR SELECT USING (user_id = auth.uid());

-- Update RLS policy: authenticated users can insert their own application
DROP POLICY IF EXISTS "Anyone can submit talent applications" ON talent_applications;

CREATE POLICY "Authenticated users can submit talent application" ON talent_applications
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    user_id = auth.uid()
  );

-- Add comment
COMMENT ON COLUMN talent_applications.user_id IS 'Links application to user account - one application per user';
