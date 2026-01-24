-- Create talent_applications table
CREATE TABLE IF NOT EXISTS talent_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  
  -- Professional Information
  category TEXT NOT NULL CHECK (category IN ('musician', 'comedian', 'gospel', 'business', 'sports', 'influencer', 'other')),
  bio TEXT NOT NULL,
  years_active INTEGER NOT NULL CHECK (years_active > 0),
  notable_work TEXT NOT NULL,
  
  -- Social Media
  instagram_handle TEXT,
  instagram_followers INTEGER,
  facebook_page TEXT,
  facebook_followers INTEGER,
  youtube_channel TEXT,
  youtube_subscribers INTEGER,
  twitter_handle TEXT,
  tiktok_handle TEXT,
  
  -- Platform Details
  proposed_price_usd DECIMAL(10,2) NOT NULL CHECK (proposed_price_usd >= 25),
  response_time_hours INTEGER NOT NULL CHECK (response_time_hours IN (24, 48, 72, 168)),
  
  -- Additional Information
  hear_about_us TEXT,
  additional_info TEXT,
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'onboarding')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_talent_applications_email ON talent_applications(email);
CREATE INDEX idx_talent_applications_status ON talent_applications(status);
CREATE INDEX idx_talent_applications_created_at ON talent_applications(created_at);

-- Enable RLS
ALTER TABLE talent_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to insert applications (public form)
CREATE POLICY "Anyone can submit talent applications" ON talent_applications
  FOR INSERT WITH CHECK (true);

-- Only admins can read applications
CREATE POLICY "Only admins can view talent applications" ON talent_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Only admins can update applications (for review process)
CREATE POLICY "Only admins can update talent applications" ON talent_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_talent_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_talent_applications_updated_at
  BEFORE UPDATE ON talent_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_talent_applications_updated_at();

-- Add comments for documentation
COMMENT ON TABLE talent_applications IS 'Stores talent applications for review by admin team';
COMMENT ON COLUMN talent_applications.status IS 'Application status: pending, under_review, approved, rejected, onboarding';
COMMENT ON COLUMN talent_applications.proposed_price_usd IS 'Minimum price is $25 USD';
COMMENT ON COLUMN talent_applications.response_time_hours IS 'Response time in hours: 24, 48, 72, 168';
