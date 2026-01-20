-- Add verification_status column to talent_profiles table
-- This allows us to track: pending, approved, rejected

-- Create enum type for verification status (only if it doesn't exist)
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add the new column (only if it doesn't exist)
DO $$ BEGIN
  ALTER TABLE public.talent_profiles
  ADD COLUMN verification_status verification_status DEFAULT 'pending';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Migrate existing data based on admin_verified
UPDATE public.talent_profiles
SET verification_status = CASE
  WHEN admin_verified = true THEN 'approved'::verification_status
  ELSE 'pending'::verification_status
END;

-- Create index for better query performance (only if it doesn't exist)
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_talent_verification_status ON public.talent_profiles(verification_status);
END $$;

-- Add comment
COMMENT ON COLUMN public.talent_profiles.verification_status IS 'Tracks the verification status: pending (awaiting review), approved (verified by admin), rejected (denied by admin)';
