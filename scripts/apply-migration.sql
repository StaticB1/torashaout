-- Migration: Add UNIQUE constraint to email field
-- This ensures no duplicate email addresses in talent applications

-- Check if table exists and add unique constraint
-- If you get an error about existing constraint, it means it's already applied

ALTER TABLE talent_applications
ADD CONSTRAINT talent_applications_email_key UNIQUE (email);

-- Verify the constraint was added
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'talent_applications'
AND constraint_type = 'UNIQUE';
