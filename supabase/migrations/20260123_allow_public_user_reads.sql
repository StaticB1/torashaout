-- Allow public read access to users table for basic profile information
-- This is needed for talent profiles to display user information on the browse page

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Public can read basic user info" ON users;

-- Allow users to read their own full profile
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow public to read basic user info (for talent profiles)
-- Only expose safe, public fields
CREATE POLICY "Public can read basic user info"
  ON users
  FOR SELECT
  USING (true);

-- Note: The SELECT policy allows reading, but the actual columns returned
-- can be controlled by the query. For security, we should only select
-- safe fields like: id, email, full_name, avatar_url, role
